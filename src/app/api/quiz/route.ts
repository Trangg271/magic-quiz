import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// const pdfParse = require('pdf-parse');
import PDFParser from 'pdf2json';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const language = (formData.get('language') as string) || 'vi';

    const languageNames: Record<string, string> = {
      vi: 'Vietnamese',
      en: 'English',
      fr: 'French',
      ja: 'Japanese',
      zh: 'Chinese',
    };
    const languageName = languageNames[language] || 'Vietnamese';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let combinedText = '';

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let text = '';
      if (file.type === 'application/pdf') {
        const pdfParser = new PDFParser(null, true);
        text = await new Promise((resolve, reject) => {
          pdfParser.on("pdfParser_dataError", errData => reject((errData as any).parserError || errData));
          pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
          pdfParser.parseBuffer(buffer);
        });
      } else {
        text = buffer.toString('utf-8');
      }

      combinedText += `\n\n--- Document: ${file.name} ---\n\n${text}`;
    }

    if (!combinedText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from the documents.' }, { status: 400 });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Generate the quiz using JSON mode
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert educator. When given document texts, you generate a multiple-choice quiz with exactly 5 questions suitable for middle school students (11-15 years old). 
Return a JSON object with a "quiz" array containing exactly 5 objects. Each object must have:
- "question": string (the question text)
- "options": array of exactly 4 distinct strings
- "correctAnswer": string (must exactly match one of the options)
- "explanation": string (a short, fun, and engaging explanation)
IMPORTANT: Generate ALL content entirely in ${languageName}. Do not mix languages.`,
        },
        {
          role: 'user',
          content: `Based on the following combined texts from multiple documents, generate the quiz.\n\nCombined Texts:\n${combinedText}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || '{"quiz":[]}';
    const parsed = JSON.parse(raw);
    const quizData = parsed.quiz ?? parsed;
    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: 'Failed to generate quiz. Please try again.' }, { status: 500 });
  }
}
