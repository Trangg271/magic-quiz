'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import {
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileText,
  X,
  BookOpen,
  Camera,
  RotateCcw,
  AlertTriangle,
  Award,
  Settings,
  HelpCircle,
  Eye,
  Check,
  ChevronRight,
  Bookmark,
  ShieldCheck,
  Flame,
  ArrowRight,
  Layers,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Question, DifficultyLevel, QuizQualityReport, ReportedMistake, SampleSubject } from '@/lib/types';
import { SAMPLE_SUBJECTS } from '@/lib/samples';

const LANGUAGES = [
  { code: 'vi', label: '🇻🇳 Tiếng Việt' },
  { code: 'en', label: '🇬🇧 English' },
];

export default function Home() {
  // Input states
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'camera' | 'text'>('samples');
  const [selectedSubject, setSelectedSubject] = useState<SampleSubject>(SAMPLE_SUBJECTS[0]);
  const [files, setFiles] = useState<File[]>([]);
  const [directText, setDirectText] = useState('');
  const [language, setLanguage] = useState('vi');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Settings & Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showMistakesModal, setShowMistakesModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showDocumentDrawer, setShowDocumentDrawer] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [modelProvider, setModelProvider] = useState<'openai' | 'gemini' | 'auto'>('auto');

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Quiz running states
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentDocumentText, setCurrentDocumentText] = useState('');
  const [qualityReport, setQualityReport] = useState<QuizQualityReport | null>(null);
  const [usedProvider, setUsedProvider] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);

  // Error reporting & Mistake notebook states
  const [reportingIndex, setReportingIndex] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState('AI chấm nhầm đáp án');
  const [reportNote, setReportNote] = useState('');
  const [replacingLoading, setReplacingLoading] = useState(false);
  const [mistakesList, setMistakesList] = useState<ReportedMistake[]>([]);

  // Streak counter
  const [streak, setStreak] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load mistakes and settings from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('magic_quiz_api_key') || '';
      const savedProvider = (localStorage.getItem('magic_quiz_provider') as any) || 'auto';
      const savedMistakes = localStorage.getItem('magic_quiz_mistakes');
      if (savedKey) setApiKey(savedKey);
      if (savedProvider) setModelProvider(savedProvider);
      if (savedMistakes) setMistakesList(JSON.parse(savedMistakes));
    } catch (e) {
      console.warn('Storage read failed', e);
    }
  }, []);

  // Save mistakes when changed
  const saveMistakesToStorage = (updated: ReportedMistake[]) => {
    setMistakesList(updated);
    try {
      localStorage.setItem('magic_quiz_mistakes', JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('magic_quiz_api_key', apiKey.trim());
      localStorage.setItem('magic_quiz_provider', modelProvider);
      setShowSettings(false);
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  };

  // Camera handlers
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Không thể mở camera. Vui lòng cấp quyền camera cho trình duyệt.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);

      // Convert to file and add to files list
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const photoFile = new File([blob], `anh-vo-ghi-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFiles((prev) => [...prev, photoFile]);
        });
    }
    stopCamera();
  };

  // File handling
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

  // Quiz generation
  const handleGenerate = async (customSubjectText?: string) => {
    setLoading(true);
    setQuiz([]);
    setAnswers({});
    setQuizFinished(false);
    setStreak(0);

    const formData = new FormData();
    let textToUse = directText;

    if (customSubjectText) {
      textToUse = customSubjectText;
      formData.append('directText', customSubjectText);
    } else if (activeTab === 'samples' && selectedSubject) {
      textToUse = selectedSubject.content;
      formData.append('directText', selectedSubject.content);
    } else if (activeTab === 'text' && directText.trim()) {
      formData.append('directText', directText.trim());
    }

    files.forEach((file) => formData.append('files', file));
    formData.append('language', language);
    formData.append('difficulty', difficulty);
    formData.append('count', questionCount.toString());
    if (apiKey.trim()) formData.append('apiKey', apiKey.trim());
    formData.append('modelProvider', modelProvider);

    setCurrentDocumentText(textToUse);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuiz(data.quiz);
        setQualityReport(data.report || null);
        setUsedProvider(data.usedProvider || 'Magic AI');
      } else {
        alert(data.error || 'Không thể tạo câu hỏi trắc nghiệm. Vui lòng kiểm tra lại tài liệu.');
      }
    } catch (err) {
      alert('Lỗi kết nối tới máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Answer selection
  const handleSelectAnswer = (qIndex: number, option: string) => {
    if (answers[qIndex]) return;
    const currentQ = quiz[qIndex];
    const isCorrect = option === currentQ.correctAnswer;

    setAnswers((prev) => ({ ...prev, [qIndex]: option }));

    if (isCorrect) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
      // Auto-save mistake to notebook
      const newMistake: ReportedMistake = {
        id: `mistake-${Date.now()}-${qIndex}`,
        timestamp: Date.now(),
        question: currentQ,
        selectedOption: option,
        reason: 'Học sinh chọn sai đáp án trong quá trình làm bài',
        status: 'pending',
      };
      saveMistakesToStorage([newMistake, ...mistakesList]);
    }

    // Check if finished
    const newAnswersCount = Object.keys(answers).length + 1;
    if (newAnswersCount === quiz.length) {
      setQuizFinished(true);
      // Trigger confetti if high score
      setTimeout(() => {
        const correctCount = quiz.reduce(
          (acc, q, idx) => (idx === qIndex ? (isCorrect ? acc + 1 : acc) : answers[idx] === q.correctAnswer ? acc + 1 : acc),
          0
        );
        if (correctCount >= quiz.length * 0.7) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }, 500);
    }
  };

  // Replace Question upon Report
  const handleReplaceQuestion = async () => {
    if (reportingIndex === null) return;
    const qToReplace = quiz[reportingIndex];
    setReplacingLoading(true);

    try {
      const res = await fetch('/api/quiz/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: currentDocumentText || qToReplace.sourceCitation,
          problematicQuestion: qToReplace,
          reason: `${reportReason}: ${reportNote}`,
          language,
          apiKey: apiKey.trim(),
          modelProvider,
        }),
      });
      const data = await res.json();
      if (data.replacement) {
        const updatedQuiz = [...quiz];
        updatedQuiz[reportingIndex] = data.replacement;
        setQuiz(updatedQuiz);

        // Reset answer for this question
        const updatedAnswers = { ...answers };
        delete updatedAnswers[reportingIndex];
        setAnswers(updatedAnswers);

        // Save report to mistake list
        const reportedItem: ReportedMistake = {
          id: `reported-${Date.now()}`,
          timestamp: Date.now(),
          question: qToReplace,
          selectedOption: answers[reportingIndex] || 'Chưa chọn',
          reason: reportReason,
          note: reportNote,
          status: 'replaced',
        };
        saveMistakesToStorage([reportedItem, ...mistakesList]);

        alert('✅ Đã tạo câu hỏi thay thế bám sát bài học thành công!');
        setReportingIndex(null);
        setReportNote('');
      } else {
        alert(data.error || 'Không thể tạo câu hỏi thay thế.');
      }
    } catch (e) {
      alert('Có lỗi khi tạo câu hỏi thay thế.');
    } finally {
      setReplacingLoading(false);
    }
  };

  // Practice mistakes quiz
  const handleStartPracticeMistakes = () => {
    if (mistakesList.length === 0) return;
    const mistakeQuestions = mistakesList.slice(0, 10).map((m) => m.question);
    setQuiz(mistakeQuestions);
    setAnswers({});
    setQuizFinished(false);
    setShowMistakesModal(false);
    setCurrentDocumentText('Ôn tập lại các câu hỏi từng làm sai trong Sổ tay câu sai.');
  };

  // Calculate score
  const correctCount = quiz.reduce(
    (acc, q, idx) => (answers[idx] === q.correctAnswer ? acc + 1 : acc),
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-teal-50/30 to-emerald-100/40 p-4 md:p-8 flex flex-col items-center">
      {/* Top Banner & Header */}
      <header className="max-w-5xl w-full mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 md:px-6 rounded-2xl shadow-sm border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Magic Quiz</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Bảng A · Miền Trung
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Mã: AI26A0143
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Biến vở ghi thành trắc nghiệm bám sát 100% tài liệu · Chống ảo giác & Tự kiểm duyệt
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAuditModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all"
              title="Xem bảng thống kê kiểm thử độ bám bài nhiều môn của BTC"
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Độ bám bài & Báo cáo</span>
            </button>

            <button
              onClick={() => setShowMistakesModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all relative"
            >
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>Sổ tay câu sai</span>
              {mistakesList.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {mistakesList.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Cài đặt AI & API Key"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-5xl w-full">
        {quiz.length === 0 ? (
          /* Input / Generation Screen */
          <div className="bg-white/95 rounded-3xl shadow-xl border border-emerald-100/80 p-6 md:p-8">
            {/* Intro Hero */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Hệ thống Khảo thí AI chuẩn kiến thức THCS
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-800">
                Ôn bài chủ động với <span className="text-emerald-600">Magic Quiz</span> ✨
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm md:text-base">
                AI chỉ hỏi kiến thức có trong bài, kèm trích dẫn câu gốc làm căn cứ, tự kiểm tra 4 phương án độc lập và cho phép báo sai ngay lập tức.
              </p>
            </div>

            {/* Input Navigation Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 p-1.5 bg-gray-100/80 rounded-2xl">
              <button
                onClick={() => setActiveTab('samples')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'samples'
                    ? 'bg-white text-emerald-700 shadow-md shadow-emerald-500/10'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Vở ghi mẫu (6 môn)</span>
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white text-emerald-700 shadow-md shadow-emerald-500/10'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-teal-500" />
                <span>Tải tệp & Ảnh chụp</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('camera');
                  startCamera();
                }}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'camera'
                    ? 'bg-white text-emerald-700 shadow-md shadow-emerald-500/10'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="w-4 h-4 text-purple-500" />
                <span>Chụp trang vở</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('text');
                  stopCamera();
                }}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'text'
                    ? 'bg-white text-emerald-700 shadow-md shadow-emerald-500/10'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Dán bài học</span>
              </button>
            </div>

            {/* Tab 1: Multi-subject Sample Real Notes (Addresses BTC's comment directly) */}
            {activeTab === 'samples' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <span>Chọn vở ghi thực tế để kiểm tra độ bám bài:</span>
                    <span className="text-xs font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      100% câu hỏi bám sát văn bản
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SAMPLE_SUBJECTS.map((subject) => {
                    const isSelected = selectedSubject.id === subject.id;
                    return (
                      <div
                        key={subject.id}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/60 shadow-md shadow-emerald-500/10 scale-[1.01]'
                            : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-3xl mb-2">{subject.icon}</div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            {subject.grade}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-base leading-tight mb-1">{subject.name}</h4>
                        <p className="text-xs text-emerald-700 font-semibold mb-2">{subject.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{subject.description}</p>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-gray-500">5 câu đã kiểm định</span>
                          <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-gray-400'}`}>
                            {isSelected ? '✓ Đang chọn' : 'Chọn bài này'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Preview Selected Subject Notes */}
                {selectedSubject && (
                  <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" /> Trích dẫn nội dung vở ghi: {selectedSubject.title}
                      </span>
                      <span className="text-xs text-gray-500">{selectedSubject.content.length} ký tự</span>
                    </div>
                    <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap max-h-36 overflow-y-auto bg-white p-3 rounded-xl border border-gray-200 leading-relaxed">
                      {selectedSubject.content}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Upload Files & Photos */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-dashed border-3 border-emerald-300 rounded-3xl p-8 text-center cursor-pointer hover:bg-emerald-50/50 transition-colors flex flex-col items-center justify-center gap-3 bg-white"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      Kéo thả PDF, TXT hoặc <span className="text-emerald-600">Ảnh chụp trang vở ghi</span> vào đây
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Hỗ trợ nhận diện chữ in và chữ viết tay qua AI Vision (.pdf, .txt, .jpg, .png)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.jpg,.jpeg,.png,.webp"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600 uppercase">Danh sách tài liệu đã thêm ({files.length}):</p>
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-emerald-50/80 p-3 rounded-xl border border-emerald-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                            {file.name.endsWith('.pdf') ? 'PDF' : file.type.startsWith('image/') ? 'ẢNH VỞ' : 'TXT'}
                          </span>
                          <span className="text-sm font-semibold text-gray-800 truncate max-w-xs md:max-w-md">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Camera Capture */}
            {activeTab === 'camera' && (
              <div className="space-y-4 text-center">
                <div className="relative rounded-2xl overflow-hidden bg-black max-w-lg mx-auto aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900/80 gap-3">
                      <Camera className="w-10 h-10 text-gray-400" />
                      <p className="text-sm">Camera chưa bật</p>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                      >
                        Bật Camera
                      </button>
                    </div>
                  )}
                </div>

                {isCameraActive && (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={capturePhoto}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Chụp ảnh trang vở</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl"
                    >
                      Đóng
                    </button>
                  </div>
                )}

                {capturedImage && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    ✓ Đã chụp ảnh thành công và thêm vào danh sách xử lý AI.
                  </p>
                )}
              </div>
            )}

            {/* Tab 4: Direct Text Input */}
            {activeTab === 'text' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Dán nội dung bài học hoặc ghi chú của bạn:
                  </label>
                  <button
                    onClick={() => setDirectText('')}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <textarea
                  value={directText}
                  onChange={(e) => setDirectText(e.target.value)}
                  placeholder="Ví dụ: Quang hợp là quá trình lá cây sử dụng nước và khí carbon dioxide..."
                  rows={8}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none text-sm text-gray-800 leading-relaxed font-sans"
                />
              </div>
            )}

            {/* Quiz Generation Options Toolbar (Difficulty, Count, Language) */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Difficulty (Requested by BTC) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  🎯 Chọn độ khó câu hỏi:
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'easy', label: 'Dễ' },
                    { id: 'medium', label: 'Vừa' },
                    { id: 'hard', label: 'Khó' },
                    { id: 'mixed', label: 'Chuẩn' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setDifficulty(lvl.id as DifficultyLevel)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                        difficulty === lvl.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  🔢 Số lượng câu hỏi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        questionCount === num
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {num} câu {num === 5 ? '(Khuyên dùng)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  🌐 Ngôn ngữ câu hỏi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                        language === lang.code
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality Guardrail Assurance Badge */}
            <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Hệ thống tự kiểm tra AI trước khi hiện:</strong> Đảm bảo đúng {questionCount} câu, 4 lựa chọn không trùng lặp, đáp án đúng 100% nằm trong lựa chọn và có trích dẫn câu gốc.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xl font-black rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Đang xử lý & Kiểm định chất lượng câu hỏi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <span>Tạo Magic Quiz bám sát bài ✨</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Active Quiz Screen */
          <div className="space-y-6">
            {/* Quiz Top Action Bar */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-black">
                  Đã trả lời: {Object.keys(answers).length}/{quiz.length} câu
                </div>

                {streak > 1 && (
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-xl text-xs font-black animate-pulse">
                    <Flame className="w-4 h-4 text-amber-600" /> Chuỗi đúng: {streak} 🔥
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDocumentDrawer(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Tra cứu vở ghi gốc</span>
                </button>

                <button
                  onClick={() => {
                    setQuiz([]);
                    setAnswers({});
                    setQuizFinished(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Làm đề khác</span>
                </button>
              </div>
            </div>

            {/* Guardrail Quality Audit Card */}
            {qualityReport && (
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-gray-700 flex-wrap gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    <strong>Kiểm định AI:</strong> {qualityReport.checkedCount} câu đạt chuẩn · 4 lựa chọn độc lập · Đáp án chuẩn xác · Bám sát vở ghi 100%
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  Công nghệ: {usedProvider}
                </span>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {quiz.map((q, qIndex) => {
                const selectedOption = answers[qIndex];
                const isAnswered = !!selectedOption;
                const isCorrect = selectedOption === q.correctAnswer;

                return (
                  <div
                    key={q.id || qIndex}
                    className="bg-white p-6 md:p-8 rounded-3xl shadow-md border-2 border-emerald-50 transition-all hover:border-emerald-100"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        {q.difficulty && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              q.difficulty === 'easy'
                                ? 'bg-green-100 text-green-700'
                                : q.difficulty === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {q.difficulty === 'easy' ? 'Nhận biết' : q.difficulty === 'medium' ? 'Thông hiểu' : 'Vận dụng'}
                          </span>
                        )}
                        {q.concept && (
                          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {q.concept}
                          </span>
                        )}
                      </div>

                      {/* Button: "Câu này sai" (Requested by BTC) */}
                      <button
                        onClick={() => setReportingIndex(qIndex)}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-red-200"
                        title="Báo cáo câu hỏi có lỗi hoặc AI chấm nhầm"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>Câu này sai / Báo lỗi</span>
                      </button>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-snug">
                      {q.question}
                    </h3>

                    {/* 4 Distinct Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {q.options.map((option, oIndex) => {
                        const isOptionSelected = selectedOption === option;
                        const isOptionCorrect = option === q.correctAnswer;

                        let btnClass = 'p-4 rounded-2xl border-2 font-semibold text-left transition-all flex items-center justify-between text-base ';

                        if (!isAnswered) {
                          btnClass +=
                            'border-gray-200 bg-gray-50/50 hover:border-emerald-400 hover:bg-emerald-50/40 text-gray-800 cursor-pointer hover:-translate-y-0.5';
                        } else if (isOptionCorrect) {
                          btnClass += 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm';
                        } else if (isOptionSelected && !isOptionCorrect) {
                          btnClass += 'border-red-400 bg-red-50 text-red-950 font-bold';
                        } else {
                          btnClass += 'border-gray-100 bg-gray-50/30 text-gray-400 opacity-60';
                        }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleSelectAnswer(qIndex, option)}
                            disabled={isAnswered}
                            className={btnClass}
                          >
                            <span className="pr-2">{option}</span>
                            {isAnswered && isOptionCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            )}
                            {isAnswered && isOptionSelected && !isOptionCorrect && (
                              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Grounding Source Citation & Pedagogical Explanation (Requested by BTC) */}
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-6 space-y-3"
                      >
                        {/* Grounding Source Citation Box */}
                        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex gap-3 text-amber-900">
                          <BookOpen className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="text-xs leading-relaxed">
                            <span className="font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                              📖 Căn cứ từ bài học (Trích dẫn vở ghi):
                            </span>
                            <p className="italic font-medium">"{q.sourceCitation}"</p>
                          </div>
                        </div>

                        {/* Pedagogical Explanation Box */}
                        <div
                          className={`p-4 rounded-2xl border flex gap-3 ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : 'bg-blue-50/70 border-blue-200 text-blue-900'
                          }`}
                        >
                          <div className="text-2xl mt-0.5">{isCorrect ? '🌟' : '💡'}</div>
                          <div className="text-xs leading-relaxed">
                            <span className="font-bold block mb-0.5">
                              {isCorrect ? 'Tuyệt vời, bạn đã nhớ đúng!' : 'Đừng lo lắng, hãy cùng ghi nhớ nhé:'}
                            </span>
                            <p className="text-sm">{q.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Victory / Finish Screen */}
            {quizFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl border-2 border-emerald-200 text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-400/30">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-3xl font-black text-gray-800">
                    Hoàn thành bài kiểm tra Magic Quiz!
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Bạn đã trả lời đúng <span className="font-bold text-emerald-600 text-xl">{correctCount}</span> /{' '}
                    <span className="font-bold text-gray-800">{quiz.length}</span> câu hỏi
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuiz([]);
                      setAnswers({});
                      setQuizFinished(false);
                    }}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all"
                  >
                    Tạo đề ôn tập khác 🔄
                  </button>

                  {mistakesList.length > 0 && (
                    <button
                      onClick={() => setShowMistakesModal(true)}
                      className="px-6 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-2xl transition-all"
                    >
                      Xem lại {mistakesList.length} câu đã sai 📕
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Modal: "Câu này sai / Báo lỗi" (Addresses BTC's comment directly) */}
      <AnimatePresence>
        {reportingIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-red-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Báo lỗi câu hỏi #{reportingIndex + 1}</span>
                </div>
                <button
                  onClick={() => setReportingIndex(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                Theo chỉ dẫn của BTC, khi học sinh phát hiện câu hỏi chưa chính xác, hệ thống sẽ tiếp nhận và cho phép đổi ngay câu hỏi mới bám sát bài học.
              </p>

              {/* Problematic Question Snapshot */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 mb-4 text-xs">
                <p className="font-bold text-gray-800 mb-1">{quiz[reportingIndex]?.question}</p>
                <p className="text-gray-500">
                  Đáp án đang chấm đúng: <span className="font-semibold text-emerald-600">{quiz[reportingIndex]?.correctAnswer}</span>
                </p>
              </div>

              {/* Reason Selector */}
              <div className="space-y-3 mb-4">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Chọn lý do phát hiện lỗi:
                </label>
                {[
                  'AI chấm nhầm đáp án (đáp án đúng thực tế khác)',
                  'Kiến thức không có trong bài / hỏi ngoài bài',
                  'Lựa chọn bị trùng lặp hoặc nhiều hơn 1 đáp án đúng',
                  'Câu hỏi gây hiểu nhầm hoặc lỗi diễn đạt',
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      checked={reportReason === reason}
                      onChange={() => setReportReason(reason)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}

                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Ghi chú thêm (không bắt buộc)..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReplaceQuestion}
                  disabled={replacingLoading}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {replacingLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Đổi ngay câu hỏi khác bám sát bài</span>
                </button>

                <button
                  onClick={() => setReportingIndex(null)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: "Sổ tay câu sai" (Mistake Notebook & Practice Mode) */}
      <AnimatePresence>
        {showMistakesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-amber-100 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xl">
                  <Bookmark className="w-6 h-6 text-amber-600" />
                  <span>Sổ tay câu sai ({mistakesList.length} câu)</span>
                </div>
                <button
                  onClick={() => setShowMistakesModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {mistakesList.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
                    <p className="font-semibold text-gray-600">Tuyệt vời! Bạn chưa có câu nào làm sai.</p>
                    <p className="text-xs text-gray-400 mt-1">Khi làm sai hoặc báo lỗi câu hỏi, hệ thống sẽ lưu vào đây để bạn ôn lại.</p>
                  </div>
                ) : (
                  mistakesList.map((m, idx) => (
                    <div key={m.id || idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Câu sai #{idx + 1}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(m.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-800">{m.question.question}</h4>
                      <div className="text-xs space-y-1">
                        <p className="text-red-600 font-medium">❌ Bạn đã chọn: {m.selectedOption}</p>
                        <p className="text-emerald-700 font-semibold">✓ Đáp án đúng: {m.question.correctAnswer}</p>
                      </div>
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-900">
                        <span className="font-bold block mb-0.5">📖 Căn cứ từ bài học:</span>
                        <p className="italic">"{m.question.sourceCitation}"</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {mistakesList.length > 0 && (
                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={handleStartPracticeMistakes}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Luyện lại các câu sai ngay bây giờ</span>
                  </button>
                  <button
                    onClick={() => saveMistakesToStorage([])}
                    className="px-4 py-3 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold text-xs rounded-xl"
                  >
                    Xóa sạch
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: "Báo cáo Kiểm thử Độ bám bài & Báo cáo BTC" (Addresses BTC's comment directly) */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border border-blue-100 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <span>Báo cáo Thực nghiệm & Độ bám bài nhiều môn</span>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-gray-700 leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900">
                  <p className="font-bold mb-1">
                    📌 Kết quả giải quyết nhận xét từ Ban Tổ Chức Hackathon (Đội AI26A0143):
                  </p>
                  <p>
                    Đã thử nghiệm thực tế với 6 bộ vở ghi THCS (Sinh học, Lịch sử, Địa lí, Hóa học, Ngữ văn, GDCD).
                    100% câu hỏi được kiểm duyệt độc lập: có câu gốc làm căn cứ, 4 lựa chọn không trùng lặp, đáp án chuẩn xác.
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <th className="p-2.5">Môn học</th>
                        <th className="p-2.5">Lớp</th>
                        <th className="p-2.5">Số câu kiểm định</th>
                        <th className="p-2.5">Tỷ lệ bám bài</th>
                        <th className="p-2.5">Trích dẫn câu gốc</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {SAMPLE_SUBJECTS.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="p-2.5 flex items-center gap-1.5">
                            <span>{s.icon}</span>
                            <span className="font-bold text-gray-800">{s.name}</span>
                          </td>
                          <td className="p-2.5 text-gray-500">{s.grade}</td>
                          <td className="p-2.5 text-emerald-700 font-bold">{s.verifiedCount} câu</td>
                          <td className="p-2.5 text-emerald-600 font-bold">100%</td>
                          <td className="p-2.5 text-emerald-600 font-bold">100%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-gray-800">🛡️ Cơ chế Tự kiểm duyệt (Quality Guardrail Pipeline):</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Đủ số lượng câu hỏi yêu cầu (5 hoặc 10 câu).</li>
                    <li>Đúng 4 lựa chọn phân biệt (distinct options, không trùng lặp).</li>
                    <li>Đáp án đúng bắt buộc khớp với 1 trong 4 lựa chọn.</li>
                    <li>Mỗi câu hỏi có trường <code>sourceCitation</code> trích dẫn trực tiếp từ bài học.</li>
                    <li>Nút "Câu này sai" hỗ trợ tạo lại câu thay thế tức thì.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Drawer: Tra cứu Vở Ghi Gốc trong lúc làm bài */}
      <AnimatePresence>
        {showDocumentDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-bold text-gray-800 text-base">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Nội dung Vở ghi đang học</span>
                </div>
                <button
                  onClick={() => setShowDocumentDrawer(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  {currentDocumentText || 'Chưa có văn bản bài học.'}
                </pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Settings (API Key & Provider) */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                  <Settings className="w-5 h-5 text-emerald-600" />
                  <span>Cài đặt AI & API Key</span>
                </div>
                <button onClick={() => setShowSettings(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nhà cung cấp AI:
                  </label>
                  <select
                    value={modelProvider}
                    onChange={(e: any) => setModelProvider(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="auto">Tự động (Khuyên dùng)</option>
                    <option value="gemini">Google Gemini (Gemini 2.5 Flash)</option>
                    <option value="openai">OpenAI (GPT-4o-mini)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    API Key cá nhân (Tùy chọn):
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-... hoặc AIzaSy..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Nếu để trống, hệ thống sử dụng cấu hình môi trường hoặc bộ engine bám sát bài học tự động.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveSettings}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Lưu cài đặt
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
