'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Loader2, CheckCircle2, XCircle, Sparkles, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const LANGUAGES = [
  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'zh', label: '🇨🇳 中文' },
];

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [language, setLanguage] = useState('vi');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setQuiz([]);
    setAnswers({});

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('language', language);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.quiz) {
        setQuiz(data.quiz);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      alert('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, option: string) => {
    if (answers[qIndex]) return; // Prevent changing answer once selected
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  return (
    <main className="min-h-screen p-8 md:p-16 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-bounce-slow">
          <h1 className="text-5xl font-bold text-emerald-600 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            Magic Quiz Maker
            <Sparkles className="w-10 h-10 text-yellow-400" />
          </h1>
          <p className="text-xl text-emerald-800">Upload your notes and watch them turn into a fun quiz!</p>
        </div>

        {/* Upload Zone */}
        {!quiz.length && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-emerald-100 transition-transform hover:scale-[1.02]">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-dashed border-4 border-emerald-200 rounded-2xl p-12 text-center cursor-pointer hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center gap-4"
            >
              <UploadCloud className="w-16 h-16 text-emerald-400" />
              <div>
                <p className="text-xl font-semibold text-emerald-700">Drag & Drop multiple PDF or Text files here</p>
                <p className="text-emerald-500 mt-2">or click to browse</p>
              </div>
              <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.txt" />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border-2 border-emerald-100">
                    <div className="flex items-center gap-3 text-emerald-700">
                      <FileText className="w-6 h-6" />
                      <span className="font-semibold truncate max-w-sm">{file.name}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }} 
                      className="text-red-400 hover:text-red-600 transition-colors bg-white p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Language Selector */}
            <div className="mt-6">
              <label className="block text-emerald-700 font-semibold mb-2 text-sm">🌐 Ngôn ngữ câu hỏi / Quiz Language</label>
              <div className="grid grid-cols-5 gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`py-2 px-1 rounded-xl border-2 text-sm font-semibold transition-all ${
                      language === lang.code
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-md scale-105'
                        : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={files.length === 0 || loading}
              className="mt-6 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold rounded-2xl shadow-[0_6px_0_0_#047857] hover:shadow-[0_2px_0_0_#047857] hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" /> Crafting Magic...
                </span>
              ) : (
                'Generate Magic Quiz ✨'
              )}
            </button>
          </div>
        )}

        {/* Quiz Area */}
        <AnimatePresence>
          {quiz.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {quiz.map((q, qIndex) => (
                <div key={qIndex} className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-emerald-50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{qIndex + 1}. {q.question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((option, oIndex) => {
                      const isSelected = answers[qIndex] === option;
                      const isCorrect = option === q.correctAnswer;
                      const showResult = !!answers[qIndex];

                      let btnClass = "p-4 text-lg font-semibold rounded-2xl border-4 transition-all ";
                      
                      if (!showResult) {
                        btnClass += "border-emerald-100 bg-emerald-50 hover:bg-emerald-100 hover:-translate-y-1 cursor-pointer text-emerald-900";
                      } else if (isCorrect) {
                        btnClass += "border-green-400 bg-green-100 text-green-900";
                      } else if (isSelected && !isCorrect) {
                        btnClass += "border-red-400 bg-red-100 text-red-900";
                      } else {
                        btnClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                      }

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleSelectAnswer(qIndex, option)}
                          disabled={showResult}
                          className={btnClass + " flex justify-between items-center text-left"}
                        >
                          <span>{option}</span>
                          {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                        </button>
                      );
                    })}
                  </div>

                  {answers[qIndex] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 rounded-2xl bg-blue-50 border-2 border-blue-100 flex gap-4">
                      <div className="text-4xl">💡</div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">
                          {answers[qIndex] === q.correctAnswer ? "Awesome job!" : "Not quite!"}
                        </h4>
                        <p className="text-blue-800">{q.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
              
              <button
                onClick={() => { setQuiz([]); setFiles([]); }}
                className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-2xl transition-colors"
              >
                Create Another Quiz 🔄
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
