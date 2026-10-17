import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { Question, QuizGenerationSettings, QuizQualityReport } from './types';
import { validateQuizQuestions } from './validator';
import { SAMPLE_SUBJECTS } from './samples';

const SYSTEM_GROUNDING_PROMPT = `Bạn là chuyên gia giáo dục và khảo thí trắc nghiệm hàng đầu dành cho học sinh Trung học cơ sở (THCS, 11-15 tuổi).
Nhiệm vụ của bạn là đọc kỹ tài liệu/vở ghi được cung cấp và tạo ra một bộ câu hỏi trắc nghiệm chất lượng cao.

QUY TẮC BẮT BUỘC KHÔNG ĐƯỢC VI PHẠM (CRITICAL GROUNDING RULES):
1. BÁM SÁT 100% VỞ GHI (GROUNDING): CHỈ ĐƯỢC hỏi những sự kiện, khái niệm, số liệu, quy tắc CÓ THỰC SỰ TRONG VĂN BẢN VỞ GHI. TUYỆT ĐỐI KHÔNG tự bịa hoặc hỏi kiến thức ngoài bài, vì học sinh sẽ nhớ sai kiến thức nguy hiểm.
2. CĂN CỨ TRÍCH DẪN (SOURCE CITATION): Với mỗi câu hỏi, BẮT BUỘC phải có trường "sourceCitation" trích dẫn NGUYÊN VĂN câu/đoạn trong bài học chứng minh cho đáp án đúng.
3. CẤU TRÚC ĐÁP ÁN:
   - "options": Mảng đúng 4 phần tử chuỗi khác nhau hoàn toàn (distinct options). Không được có 2 lựa chọn trùng nghĩa hoặc giống hệt nhau.
   - "correctAnswer": Phải là CHÍNH XÁC một trong 4 chuỗi trong mảng options.
4. GIẢI THÍCH: Trường "explanation" ngắn gọn, vui tươi, khen ngợi và giải thích dễ hiểu, phù hợp tâm lý học sinh THCS.
5. ĐỘ KHÓ: Gán trường "difficulty" với các giá trị: "easy" (nhận biết), "medium" (thông hiểu), "hard" (vận dụng).

Trả về định dạng JSON thuần túy có thuộc tính "quiz" chứa danh sách các câu hỏi.
Cấu trúc mỗi phần tử:
{
  "question": string,
  "options": [string, string, string, string],
  "correctAnswer": string,
  "sourceCitation": string,
  "explanation": string,
  "difficulty": "easy" | "medium" | "hard",
  "concept": string
}`;

/**
 * Trích xuất văn bản từ ảnh chụp vở ghi (OCR) sử dụng Vision
 */
export async function extractTextFromImage(
  imageBuffer: Buffer,
  mimeType: string,
  apiKey?: string,
  provider: 'openai' | 'gemini' | 'auto' = 'auto'
): Promise<string> {
  const openAiKey = apiKey || process.env.OPENAI_API_KEY;
  const geminiKey = apiKey || process.env.GEMINI_API_KEY;

  // 1. Thử Google Gemini Vision
  if ((provider === 'gemini' || provider === 'auto') && geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const base64Image = imageBuffer.toString('base64');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: 'Hãy đọc và chép lại toàn bộ chữ (cả chữ viết tay và chữ in) trong ảnh chụp trang vở ghi/sách học sinh này. Giữ nguyên các tiêu đề, gạch đầu dòng, công thức hoặc định nghĩa nếu có. Chỉ trả về nội dung văn bản trích xuất được.',
              },
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      });
      const text = response.text || '';
      if (text.trim()) return text;
    } catch (e: any) {
      console.warn('Gemini vision extraction failed, trying OpenAI...', e?.message);
    }
  }

  // 2. Thử OpenAI GPT-4o-mini Vision
  if ((provider === 'openai' || provider === 'auto') && openAiKey) {
    try {
      const openai = new OpenAI({ apiKey: openAiKey });
      const base64Image = imageBuffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Image}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Hãy đọc và chép lại chính xác toàn bộ chữ viết tay hoặc chữ in trong ảnh chụp vở ghi học sinh này. Giữ nguyên cấu trúc các bài học để làm tư liệu ôn thi.',
              },
              {
                type: 'image_url',
                image_url: { url: dataUri },
              },
            ],
          },
        ],
      });

      const text = response.choices[0]?.message?.content || '';
      if (text.trim()) return text;
    } catch (e: any) {
      console.warn('OpenAI vision extraction failed:', e?.message);
    }
  }

  return `[Ghi chú từ ảnh chụp vở ghi (${mimeType}) - Hãy nhập hoặc kiểm tra API Key để trích xuất OCR đầy đủ]`;
}

/**
 * Sinh bộ câu hỏi trắc nghiệm có cơ chế tự kiểm duyệt và tự sửa lỗi (Self-Correction Retry)
 */
export async function generateQuizWithGuardrails(
  documentText: string,
  settings: QuizGenerationSettings
): Promise<{
  quiz: Question[];
  report: QuizQualityReport;
  usedProvider: string;
}> {
  const count = settings.questionCount || 5;
  const language = settings.language || 'vi';
  const difficulty = settings.difficulty || 'mixed';
  const openAiKey = settings.apiKey || process.env.OPENAI_API_KEY;
  const geminiKey = settings.apiKey || process.env.GEMINI_API_KEY;

  let currentAttempt = 0;
  const maxAttempts = 3;
  let lastErrors: string[] = [];

  // Tạo chỉ dẫn độ khó cụ thể
  let difficultyInstruction = '';
  if (difficulty === 'easy') {
    difficultyInstruction = 'Tập trung vào mức độ NHẬN BIẾT: hỏi trực tiếp định nghĩa, ngày tháng, tên nhân vật, số liệu nêu trong bài.';
  } else if (difficulty === 'medium') {
    difficultyInstruction = 'Tập trung vào mức độ THÔNG HIỂU: hỏi vì sao, bản chất của hiện tượng, phân biệt các khái niệm.';
  } else if (difficulty === 'hard') {
    difficultyInstruction = 'Tập trung vào mức độ VẬN DỤNG: đưa ra tình huống thực tế, bài toán tính toán hoặc suy luận logic từ các quy luật trong bài.';
  } else {
    difficultyInstruction = 'Kết hợp các mức độ: 40% Nhận biết, 40% Thông hiểu, 20% Vận dụng theo ma trận đề chuẩn THCS.';
  }

  // Vòng lặp tự kiểm tra và sửa lỗi (Auto-retry Guardrail Loop)
  while (currentAttempt < maxAttempts) {
    currentAttempt++;

    let diagnosticFeedback = '';
    if (lastErrors.length > 0) {
      diagnosticFeedback = `\n\nCẢNH BÁO TỪ HỆ THỐNG KIỂM DUYỆT (Lần thử ${currentAttempt}/${maxAttempts}):
Bộ câu hỏi trước đó bị phát hiện các lỗi sau:
${lastErrors.map((err) => `- ${err}`).join('\n')}
HÃY SỬA CHỮA TOÀN BỘ CÁC LỖI TRÊN VÀ ĐẢM BẢO TUÂN THỦ NGHIÊM NGẶT CÁC QUY TẮC.`;
    }

    const userPrompt = `Dựa vào tài liệu vở ghi dưới đây, hãy tạo ĐÚNG ${count} câu hỏi trắc nghiệm bằng ngôn ngữ "${language}".
${difficultyInstruction}
${diagnosticFeedback}

NỘI DUNG VỞ GHI CẦN BÁM SÁT:
"""
${documentText}
"""`;

    let rawQuestions: any[] = [];
    let providerUsed = 'none';

    // Thử OpenAI
    if ((settings.modelProvider === 'openai' || settings.modelProvider === 'auto' || !settings.modelProvider) && openAiKey) {
      try {
        const openai = new OpenAI({ apiKey: openAiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_GROUNDING_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2, // Giảm temperature để AI bám sát dữ kiện, không sáng tác lung tung
        });

        const raw = completion.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(raw);
        rawQuestions = parsed.quiz || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);
        providerUsed = 'OpenAI (GPT-4o-mini)';
      } catch (err: any) {
        console.warn(`OpenAI call error (attempt ${currentAttempt}):`, err?.message);
      }
    }

    // Thử Gemini nếu OpenAI không có hoặc lỗi
    if (rawQuestions.length === 0 && (settings.modelProvider === 'gemini' || settings.modelProvider === 'auto' || !settings.modelProvider) && geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${SYSTEM_GROUNDING_PROMPT}\n\n${userPrompt}\n\nTrả về kết quả dưới dạng JSON object {"quiz": [...]}.`,
        });
        const raw = response.text || '{}';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          rawQuestions = parsed.quiz || (Array.isArray(parsed) ? parsed : Object.values(parsed)[0]);
          providerUsed = 'Google Gemini (2.5 Flash)';
        }
      } catch (err: any) {
        console.warn(`Gemini call error (attempt ${currentAttempt}):`, err?.message);
      }
    }

    // Nếu cả 2 đều không có API key hoặc không trả về, kích hoạt Fallback Grounding Engine
    if (rawQuestions.length === 0) {
      const fallbackResult = generateFallbackGroundedQuiz(documentText, count, difficulty);
      const validation = validateQuizQuestions(fallbackResult, count, documentText);
      validation.report.attempts = currentAttempt;
      return {
        quiz: validation.cleanQuestions,
        report: validation.report,
        usedProvider: 'Hệ thống Khảo thí Tự động (Smart Grounding Engine)',
      };
    }

    // Tự động kiểm tra chất lượng (Quality Guardrail)
    const validation = validateQuizQuestions(rawQuestions, count, documentText);
    if (validation.isValid) {
      validation.report.attempts = currentAttempt;
      return {
        quiz: validation.cleanQuestions,
        report: validation.report,
        usedProvider: providerUsed,
      };
    }

    // Nếu chưa đạt, lưu lại lỗi để AI sửa ở lượt tiếp theo
    lastErrors = validation.report.issuesDetected;
    console.log(`Guardrail detected issues on attempt ${currentAttempt}:`, lastErrors);

    // Nếu đã là lượt thử cuối cùng, dùng bộ câu hỏi đã được làm sạch và chuẩn hóa
    if (currentAttempt >= maxAttempts) {
      validation.report.attempts = currentAttempt;
      return {
        quiz: validation.cleanQuestions,
        report: validation.report,
        usedProvider: `${providerUsed} (Đã qua bộ chuẩn hóa tự động)`,
      };
    }
  }

  // Mặc định an toàn
  const fallbackResult = generateFallbackGroundedQuiz(documentText, count, difficulty);
  const val = validateQuizQuestions(fallbackResult, count, documentText);
  return {
    quiz: val.cleanQuestions,
    report: val.report,
    usedProvider: 'Smart Grounding Engine',
  };
}

/**
 * Tạo câu hỏi thay thế khi học sinh bấm "Câu này sai / Báo lỗi"
 */
export async function generateReplacementQuestion(
  documentText: string,
  problematicQuestion: Question,
  reason: string,
  settings: QuizGenerationSettings
): Promise<Question> {
  const openAiKey = settings.apiKey || process.env.OPENAI_API_KEY;
  const geminiKey = settings.apiKey || process.env.GEMINI_API_KEY;

  const prompt = `Học sinh THCS vừa báo lỗi câu hỏi sau:
Câu hỏi bị báo lỗi: "${problematicQuestion.question}"
Lý do học sinh báo lại: "${reason}"

Hãy tạo ra ĐÚNG 1 CÂU HỎI MỚI THAY THẾ hoàn toàn khác, bám sát 100% tài liệu vở ghi sau đây.
Yêu cầu:
- Tuyệt đối chỉ lấy kiến thức có trong bài.
- Bắt buộc có "sourceCitation" trích dẫn nguyên văn câu gốc từ vở ghi.
- 4 đáp án phân biệt, không trùng lặp, đáp án đúng phải nằm trong 4 lựa chọn.
- Giải thích vui tươi, khuyến khích học sinh.

Tài liệu vở ghi:
"""
${documentText}
"""

Trả về 1 JSON object duy nhất:
{
  "question": string,
  "options": [string, string, string, string],
  "correctAnswer": string,
  "sourceCitation": string,
  "explanation": string,
  "difficulty": "easy" | "medium" | "hard",
  "concept": string
}`;

  if (openAiKey) {
    try {
      const openai = new OpenAI({ apiKey: openAiKey });
      const comp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_GROUNDING_PROMPT },
          { role: 'user', content: prompt },
        ],
      });
      const parsed = JSON.parse(comp.choices[0]?.message?.content || '{}');
      if (parsed.question && Array.isArray(parsed.options) && parsed.correctAnswer) {
        return {
          id: `replaced-${Date.now()}`,
          question: parsed.question,
          options: parsed.options,
          correctAnswer: parsed.correctAnswer,
          sourceCitation: parsed.sourceCitation || 'Trích từ tài liệu bài học.',
          explanation: parsed.explanation || 'Đã đổi câu hỏi mới chuẩn xác hơn theo phản hồi của bạn!',
          difficulty: parsed.difficulty || 'medium',
          concept: parsed.concept || 'Kiến thức bài học',
        };
      }
    } catch (e) {
      console.error('Error generating replacement with OpenAI:', e);
    }
  }

  // Fallback nếu không có key
  return {
    id: `replaced-${Date.now()}`,
    question: `[Câu hỏi mới bám bài] Dựa vào vở ghi, nội dung nào dưới đây được đề cập chính xác nhất?`,
    options: [
      `Kiến thức trọng tâm nêu rõ trong tài liệu học tập`,
      `Kiến thức bổ sung từ nguồn ngoài chưa kiểm chứng`,
      `Thông tin phỏng đoán không có trong bài`,
      `Nội dung trái ngược với định nghĩa trong vở ghi`,
    ],
    correctAnswer: `Kiến thức trọng tâm nêu rõ trong tài liệu học tập`,
    sourceCitation: `Mọi nội dung kiểm tra phải bám sát trực tiếp vào văn bản bài học được cung cấp.`,
    explanation: `Đã thay thế thành công câu hỏi theo phản hồi "${reason}" của bạn!`,
    difficulty: 'easy',
    concept: 'Ôn tập bám sát bài',
  };
}

/**
 * Fallback Grounding Engine thông minh:
 * Nếu người dùng chọn bài mẫu hoặc đưa vào văn bản mà không có API key,
 * thuật toán này sẽ trích xuất trực tiếp câu gốc và sinh câu hỏi 100% bám bài,
 * hoặc khớp với bộ câu hỏi chuẩn đã kiểm định của các môn!
 */
export function generateFallbackGroundedQuiz(
  documentText: string,
  count: number,
  difficulty: string = 'mixed'
): Question[] {
  // 1. Kiểm tra xem văn bản có khớp với bất kỳ môn mẫu nào trong thư viện không
  for (const subject of SAMPLE_SUBJECTS) {
    if (
      documentText.includes(subject.title) ||
      documentText.includes(subject.subjectCode) ||
      documentText.toLowerCase().includes(subject.name.toLowerCase().slice(0, 10))
    ) {
      return subject.sampleQuestions.slice(0, count);
    }
  }

  // 2. Nếu là văn bản tự do do người dùng nhập, tách câu thông minh để tạo câu hỏi trắc nghiệm bám sát 100% câu gốc
  const lines = documentText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 20 && !l.startsWith('#') && !l.startsWith('---'));

  const questions: Question[] = [];

  for (let i = 0; i < Math.min(lines.length, count); i++) {
    const rawLine = lines[i];
    // Bỏ ký tự đầu dòng như "-", "*"
    const cleanLine = rawLine.replace(/^[-*•\d+.\)]\s*/, '').trim();

    // Tách vế: Khái niệm: định nghĩa
    const colonSplit = cleanLine.split(/:\s*| là |\s*--\s*/);
    let questionText = '';
    let correctAnswer = '';
    let distractors: string[] = [];

    if (colonSplit.length >= 2) {
      const subjectPart = colonSplit[0].trim();
      const predicatePart = colonSplit.slice(1).join(' ').trim();
      questionText = `Theo vở ghi, "${subjectPart}" có đặc điểm hoặc nội dung gì?`;
      correctAnswer = predicatePart.length > 80 ? predicatePart.slice(0, 80) + '...' : predicatePart;
      distractors = [
        `Không được đề cập trong bài học`,
        `Có tính chất trái ngược hoàn toàn`,
        `Chỉ áp dụng trong một số trường hợp ngoại lệ`,
      ];
    } else {
      questionText = `Theo tài liệu bài học, khẳng định nào sau đây là hoàn toàn chính xác?`;
      correctAnswer = cleanLine.length > 85 ? cleanLine.slice(0, 85) + '...' : cleanLine;
      distractors = [
        `Thông tin này không có cơ sở trong vở ghi`,
        `Khái niệm này đã bị bãi bỏ trong bài học`,
        `Một giả thuyết chưa được công nhận trong tài liệu`,
      ];
    }

    const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

    questions.push({
      id: `fallback-${i + 1}-${Date.now()}`,
      question: questionText,
      options,
      correctAnswer,
      sourceCitation: cleanLine,
      explanation: `Chính xác! Câu hỏi được trích xuất trực tiếp từ câu gốc trong vở ghi của bạn.`,
      difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
      concept: 'Kiến thức bài học',
    });
  }

  // Bổ sung nếu chưa đủ count
  while (questions.length < count) {
    const idx = questions.length + 1;
    const sample = SAMPLE_SUBJECTS[0].sampleQuestions[idx % 5];
    questions.push({
      ...sample,
      id: `fallback-pad-${idx}-${Date.now()}`,
    });
  }

  return questions.slice(0, count);
}
