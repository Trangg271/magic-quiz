import { Question, QuizQualityReport } from './types';

/**
 * Kiểm tra chất lượng bộ câu hỏi theo đúng yêu cầu khắt khe của BTC Hackathon:
 * 1. Đủ số lượng câu hỏi yêu cầu.
 * 2. Mỗi câu có đúng 4 lựa chọn.
 * 3. 4 lựa chọn phải hoàn toàn khác biệt (không trùng lặp).
 * 4. Đáp án đúng phải khớp chính xác với 1 trong 4 lựa chọn.
 * 5. Có câu gốc làm căn cứ (sourceCitation) để học sinh đối chiếu, tránh ảo giác.
 */
export function validateQuizQuestions(
  rawQuestions: any[],
  expectedCount: number,
  sourceDocumentText?: string
): {
  isValid: boolean;
  cleanQuestions: Question[];
  report: QuizQualityReport;
} {
  const issues: string[] = [];
  const cleanQuestions: Question[] = [];

  if (!Array.isArray(rawQuestions)) {
    return {
      isValid: false,
      cleanQuestions: [],
      report: {
        isValid: false,
        totalQuestions: 0,
        optionsUnique: false,
        answersMatch: false,
        citationsGrounded: false,
        attempts: 1,
        checkedCount: 0,
        issuesDetected: ['Đầu ra của AI không phải là một danh sách câu hỏi hợp lệ.'],
      },
    };
  }

  // 1. Kiểm tra số lượng câu hỏi
  if (rawQuestions.length < expectedCount) {
    issues.push(`Số lượng câu hỏi chưa đủ: Nhận được ${rawQuestions.length}/${expectedCount} câu.`);
  }

  let allOptionsUnique = true;
  let allAnswersMatch = true;
  let allCitationsPresent = true;

  const docTextNormalized = (sourceDocumentText || '').toLowerCase().replace(/\s+/g, ' ');

  rawQuestions.forEach((q, idx) => {
    const qNum = idx + 1;
    const questionText = (q.question || '').toString().trim();

    if (!questionText) {
      issues.push(`Câu ${qNum}: Nội dung câu hỏi đang để trống.`);
    }

    // 2. Kiểm tra options
    let rawOptions: string[] = [];
    if (Array.isArray(q.options)) {
      rawOptions = q.options.map((opt: any) => (opt || '').toString().trim()).filter(Boolean);
    }

    if (rawOptions.length !== 4) {
      issues.push(`Câu ${qNum}: Phải có đúng 4 phương án lựa chọn, hiện có ${rawOptions.length}.`);
      allOptionsUnique = false;
    }

    // 3. Kiểm tra 4 phương án có khác nhau không
    const uniqueOptions = new Set(rawOptions.map((o) => o.toLowerCase()));
    if (uniqueOptions.size !== rawOptions.length) {
      issues.push(`Câu ${qNum}: Xuất hiện các phương án lựa chọn bị trùng lặp nội dung.`);
      allOptionsUnique = false;
    }

    // 4. Kiểm tra correctAnswer có nằm trong options không
    const rawAnswer = (q.correctAnswer || '').toString().trim();
    if (!rawAnswer) {
      issues.push(`Câu ${qNum}: Thiếu đáp án đúng.`);
      allAnswersMatch = false;
    } else {
      const match = rawOptions.find(
        (opt) =>
          opt.toLowerCase() === rawAnswer.toLowerCase() ||
          opt.replace(/^[A-D][.:\)]\s*/i, '').toLowerCase() === rawAnswer.replace(/^[A-D][.:\)]\s*/i, '').toLowerCase()
      );

      if (!match) {
        issues.push(`Câu ${qNum}: Đáp án đúng "${rawAnswer}" không khớp với bất kỳ phương án nào trong 4 lựa chọn.`);
        allAnswersMatch = false;
      }
    }

    // 5. Kiểm tra sourceCitation (căn cứ từ bài học)
    const citation = (q.sourceCitation || q.quote || q.citation || '').toString().trim();
    if (!citation || citation.length < 5) {
      issues.push(`Câu ${qNum}: Thiếu câu gốc làm căn cứ từ bài học (sourceCitation).`);
      allCitationsPresent = false;
    } else if (docTextNormalized) {
      // Kiểm tra xem căn cứ có bám sát văn bản không
      const citWords = citation.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
      if (citWords.length > 3) {
        const matchesCount = citWords.filter((w: string) => docTextNormalized.includes(w)).length;
        const ratio = matchesCount / citWords.length;
        if (ratio < 0.4) {
          issues.push(`Câu ${qNum}: Câu gốc căn cứ nghi ngờ không có trong bài ghi (độ trùng khớp từ khóa < 40%).`);
        }
      }
    }

    // Tạo object sạch
    const cleanQ: Question = {
      id: q.id || `q-${idx}-${Date.now()}`,
      question: questionText || `Câu hỏi ${qNum}`,
      options: rawOptions.length === 4 ? rawOptions : padOrTrimOptions(rawOptions),
      correctAnswer: rawAnswer || rawOptions[0] || 'Đáp án A',
      explanation: (q.explanation || 'Hãy đối chiếu câu gốc trong bài để nhớ kiến thức nhé!').toString().trim(),
      sourceCitation: citation || 'Trích từ tài liệu bài học được tải lên.',
      difficulty: q.difficulty || 'medium',
      concept: q.concept || '',
    };

    cleanQuestions.push(cleanQ);
  });

  const isValid = issues.length === 0 && cleanQuestions.length >= expectedCount;

  const report: QuizQualityReport = {
    isValid,
    totalQuestions: cleanQuestions.length,
    optionsUnique: allOptionsUnique,
    answersMatch: allAnswersMatch,
    citationsGrounded: allCitationsPresent,
    attempts: 1,
    checkedCount: cleanQuestions.length,
    issuesDetected: issues,
  };

  return { isValid, cleanQuestions: cleanQuestions.slice(0, expectedCount), report };
}

function padOrTrimOptions(opts: string[]): string[] {
  const result = [...opts];
  while (result.length < 4) {
    result.push(`Lựa chọn bổ sung ${String.fromCharCode(65 + result.length)}`);
  }
  return result.slice(0, 4);
}
