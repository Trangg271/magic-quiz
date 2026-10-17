import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import { extractTextFromImage, generateQuizWithGuardrails } from '@/lib/ai';
import { DifficultyLevel } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const directText = (formData.get('directText') as string) || '';
    const language = (formData.get('language') as string) || 'vi';
    const difficulty = (formData.get('difficulty') as DifficultyLevel) || 'mixed';
    const countRaw = formData.get('count');
    const questionCount = countRaw ? parseInt(countRaw as string, 10) : 5;
    const apiKey = (formData.get('apiKey') as string) || '';
    const modelProvider = (formData.get('modelProvider') as 'openai' | 'gemini' | 'auto') || 'auto';

    let combinedText = directText.trim();

    if (files && files.length > 0) {
      for (const file of files) {
        if (!file.name) continue;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let text = '';
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);

        if (isPdf) {
          try {
            const pdfParser = new PDFParser(null, true);
            text = await new Promise((resolve, reject) => {
              pdfParser.on('pdfParser_dataError', (errData: any) =>
                reject(errData?.parserError || errData)
              );
              pdfParser.on('pdfParser_dataReady', () => {
                resolve(pdfParser.getRawTextContent());
              });
              pdfParser.parseBuffer(buffer);
            });
          } catch (pdfErr) {
            console.error('PDF parse error:', pdfErr);
            text = buffer.toString('utf-8');
          }
        } else if (isImage) {
          // Trích xuất chữ viết tay và chữ in từ ảnh chụp vở ghi bằng Vision OCR
          try {
            text = await extractTextFromImage(
              buffer,
              file.type || 'image/jpeg',
              apiKey,
              modelProvider
            );
          } catch (imgErr) {
            console.error('Image OCR error:', imgErr);
            text = `[Ảnh chụp vở ghi: ${file.name}]`;
          }
        } else {
          // File văn bản txt/markdown
          text = buffer.toString('utf-8');
        }

        if (text.trim()) {
          combinedText += `\n\n--- Tài liệu: ${file.name} ---\n\n${text}`;
        }
      }
    }

    if (!combinedText.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng tải lên tài liệu (PDF, TXT, Ảnh chụp vở ghi) hoặc nhập nội dung bài học.' },
        { status: 400 }
      );
    }

    // Tiến hành sinh trắc nghiệm với cơ chế tự kiểm duyệt và tự sửa lỗi (Guardrail Loop)
    const result = await generateQuizWithGuardrails(combinedText, {
      language,
      difficulty,
      questionCount,
      apiKey,
      modelProvider,
    });

    return NextResponse.json({
      quiz: result.quiz,
      report: result.report,
      usedProvider: result.usedProvider,
      extractedLength: combinedText.length,
      sampleSnippet: combinedText.slice(0, 300) + '...',
    });
  } catch (error: any) {
    console.error('Error in /api/quiz:', error);
    return NextResponse.json(
      { error: error?.message || 'Có lỗi xảy ra trong quá trình xử lý câu hỏi. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
