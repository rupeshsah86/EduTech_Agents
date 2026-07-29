import React, { useState, useEffect } from 'react';
import { Timer, RotateCcw, ArrowRight, Sliders, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  topic: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const ExamSimulator: React.FC = () => {
  const [subject, setSubject] = useState<string>('GATE CS & IT 2026');
  const [difficulty, setDifficulty] = useState<string>('Hard / GATE Level');
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const questions: Question[] = [
    {
      id: 1,
      topic: 'Algorithms (Graph Theory)',
      text: "Which data structure is primarily used to implement Dijkstra's Shortest Path algorithm efficiently in O((V + E) log V) time?",
      options: ["Min-Heap / Priority Queue", "Stack", "FIFO Queue", "Hash Set"],
      correctAnswer: 0,
      explanation: "Min-Heap allows dynamic extraction of the minimum distance vertex in O(log V) time."
    },
    {
      id: 2,
      topic: 'Operating Systems (Concurrency)',
      text: "What is the primary condition required for a System Deadlock to occur according to Coffman invariants?",
      options: ["Single-threaded execution", "Mutual Exclusion + Hold & Wait + No Preemption + Circular Wait", "Asynchronous I/O processing", "High CPU Utilization"],
      correctAnswer: 1,
      explanation: "Deadlock occurs strictly when all 4 Coffman conditions hold simultaneously."
    },
    {
      id: 3,
      topic: 'DBMS (Vector Indexing)',
      text: "In PostgreSQL, which extension enables high-dimensional vector similarity search for AI embeddings?",
      options: ["pgvector", "postgis", "uuid-ossp", "pg_trgm"],
      correctAnswer: 0,
      explanation: "pgvector adds vector domain types and HNSW / IVFFlat distance index structures."
    },
    {
      id: 4,
      topic: 'DSA (Sorting Algorithms)',
      text: "What is the worst-case time complexity of QuickSort when bad pivot selection occurs on a sorted array?",
      options: ["O(N log N)", "O(N^2)", "O(N)", "O(1)"],
      correctAnswer: 1,
      explanation: "When pivot is consistently the maximum or minimum element, recurrence degenerates to O(N^2)."
    }
  ];

  useEffect(() => {
    let interval: any = null;
    if (examStarted && !examFinished && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && examStarted && !examFinished) {
      setExamFinished(true);
    }
    return () => clearInterval(interval);
  }, [examStarted, examFinished, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
    setExamFinished(false);
    setTimeLeft(600);
    setCurrentQuestion(0);
    setSelectedAnswers({});
  };

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateResults = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    questions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected === q.correctAnswer) {
        score += 4; // +4 for correct
        correct += 1;
      } else if (selected !== undefined) {
        score -= 1; // -1 negative marking
        incorrect += 1;
      }
    });

    const accuracy = Math.round((correct / questions.length) * 100);
    const avgTimePerQuestion = Math.round((600 - timeLeft) / questions.length);

    return {
      score,
      correct,
      incorrect,
      unattempted: questions.length - (correct + incorrect),
      accuracy,
      avgTimePerQuestion,
    };
  };

  const results = calculateResults();

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              Real Exam Simulation & Deep Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Timed mock exam environment featuring negative marking rules (+4 / -1), real pressure, and topic-level analytics.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #9: Full Exam Simulator
        </span>
      </div>

      {/* 🛠️ Subject & Difficulty Selection Bar */}
      {!examStarted && !examFinished && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" /> Configure Exam Parameters
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">Select Exam Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-xs font-bold text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
              >
                <option value="GATE CS & IT 2026">GATE CS & IT 2026 (Full Syllabus)</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms (DSA Focus)</option>
                <option value="Operating Systems & Concurrency">Operating Systems & Concurrency</option>
                <option value="DBMS & System Design">DBMS & System Design</option>
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-neutral-300">Select Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Hard / GATE Level'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 px-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border ${
                      difficulty === d
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:border-purple-300'
                    }`}
                  >
                    {d.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleStartExam}
              className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Begin Timed Mock Exam</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ⏱️ Active Exam Environment */}
      {examStarted && !examFinished && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Bar: Timer & Progress */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between shadow-xs">
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 font-mono">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold font-mono animate-pulse">
              <Timer className="w-3.5 h-3.5" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Active Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {questions[currentQuestion].topic}
              </span>
              <span className="text-[10px] font-bold text-emerald-500">+4 / -1 Mark</span>
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
              {questions[currentQuestion].text}
            </h3>

            <div className="space-y-2.5 pt-2">
              {questions[currentQuestion].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestion] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQuestion, oIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                        : 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:border-purple-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className="font-mono text-xs font-bold opacity-60">Option {String.fromCharCode(65 + oIdx)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 text-xs font-extrabold disabled:opacity-40 cursor-pointer border border-slate-200 dark:border-neutral-800"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => setExamFinished(true)}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold cursor-pointer shadow-md"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      )}

      {/* 📊 Deep Analytics Dashboard after Exam Completion */}
      {examFinished && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-purple-500/30 space-y-6 shadow-xl">
            {/* Header Score & Grade */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
                  Assessment Completed • {subject}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Performance Analytics Report
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-purple-600 text-white font-black text-lg shadow-md font-mono">
                  {results.score} Marks
                </div>
                <button
                  onClick={handleStartExam}
                  className="px-4 py-2 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer hover:border-purple-500"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-purple-500" />
                  <span>Retake Exam</span>
                </button>
              </div>
            </div>

            {/* Top 4 Analytics Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Accuracy Score</span>
                <p className="text-xl font-black text-emerald-500 font-mono">{results.accuracy}%</p>
                <p className="text-[10px] text-slate-400">Overall Precision</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Correct Answers</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{results.correct} / {questions.length}</p>
                <p className="text-[10px] text-emerald-500 font-bold">+16 Marks</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Incorrect Answers</span>
                <p className="text-xl font-black text-rose-500 font-mono">{results.incorrect}</p>
                <p className="text-[10px] text-rose-500 font-bold">-{results.incorrect} Negative Marks</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Avg Time / Question</span>
                <p className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">{results.avgTimePerQuestion}s</p>
                <p className="text-[10px] text-purple-500 font-bold">Optimal Speed</p>
              </div>
            </div>

            {/* Question by Question Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-purple-500" /> Deep Question Breakdown & Explanations
              </h4>

              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  const isAttempted = userAns !== undefined;

                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-purple-600 dark:text-purple-400">{q.topic}</span>
                        {isAttempted ? (
                          isCorrect ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Correct (+4)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Incorrect (-1)
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 font-bold">Unattempted</span>
                        )}
                      </div>

                      <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{q.text}</p>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-100 dark:border-neutral-800/80 space-y-1">
                        <p className="text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
                          <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                        </p>
                        <p className="text-slate-500 dark:text-neutral-400 text-[11px]">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
