import { NextRequest, NextResponse } from 'next/server';
import { generateReplacementQuestion } from '@/lib/ai';
import { Question } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentText, problematicQuestion, reason, language, apiKey, modelProvider } = body;

    if (!problematicQuestion) {
      return NextResponse.json({ error: 'Thiếu thông tin câu hỏi cần thay thế' }, { status: 400 });
    }

    const replacement = await generateReplacementQuestion(
      documentText || problematicQuestion.sourceCitation || '',
      problematicQuestion as Question,
      reason || 'Học sinh báo lỗi câu hỏi',
      {
        language: language || 'vi',
        difficulty: problematicQuestion.difficulty || 'medium',
        questionCount: 1,
        apiKey,
        modelProvider,
      }
    );

    return NextResponse.json({
      success: true,
      replacement,
    });
  } catch (error: any) {
    console.error('Error replacing question:', error);
    return NextResponse.json(
      { error: error?.message || 'Không thể tạo câu hỏi thay thế' },
      { status: 500 }
    );
  }
}
