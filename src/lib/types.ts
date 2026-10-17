export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  sourceCitation: string; // Câu gốc làm căn cứ từ vở ghi/tài liệu
  difficulty?: 'easy' | 'medium' | 'hard';
  concept?: string;
}

export interface QuizQualityReport {
  isValid: boolean;
  totalQuestions: number;
  optionsUnique: boolean;
  answersMatch: boolean;
  citationsGrounded: boolean;
  attempts: number;
  checkedCount: number;
  issuesDetected: string[];
}

export interface ReportedMistake {
  id: string;
  timestamp: number;
  question: Question;
  selectedOption: string;
  reason: string;
  note?: string;
  status: 'pending' | 'replaced' | 'acknowledged';
}

export interface SampleSubject {
  id: string;
  name: string;
  grade: string;
  subjectCode: string;
  icon: string;
  title: string;
  description: string;
  content: string;
  verifiedCount: number;
  sampleQuestions: Question[];
}

export interface QuizGenerationSettings {
  language: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  apiKey?: string;
  modelProvider?: 'openai' | 'gemini' | 'auto';
}
