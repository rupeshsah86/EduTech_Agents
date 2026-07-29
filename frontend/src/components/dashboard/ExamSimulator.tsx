import React, { useState, useEffect } from 'react';
import { Timer, Award, RotateCcw, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const ExamSimulator: React.FC = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const questions: Question[] = [
    {
      id: 1,
      text: "Which data structure is primarily used to implement Dijkstra's Shortest Path algorithm efficiently?",
      options: ["Min-Heap / Priority Queue", "Stack", "FIFO Queue", "Hash Set"],
      correctAnswer: 0,
      explanation: "Min-Heap allows dynamic extraction of the minimum distance vertex in O(log V) time."
    },
    {
      id: 2,
      text: "What is the primary condition required for a System Deadlock to occur according to Coffman invariants?",
      options: ["Single-threaded execution", "Mutual Exclusion + Hold & Wait + No Preemption + Circular Wait", "Asynchronous I/O processing", "High CPU Utilization"],
      correctAnswer: 1,
      explanation: "Deadlock occurs strictly when all 4 Coffman conditions hold simultaneously."
    },
    {
      id: 3,
      text: "In PostgreSQL, which extension enables vector similarity search for AI embeddings?",
      options: ["pgvector", "postgis", "uuid-ossp", "pg_trgm"],
      correctAnswer: 0,
      explanation: "pgvector adds vector domain types and HNSW / IVFFlat distance index structures."
    },
    {
      id: 4,
      text: "What is the worst-case time complexity of QuickSort when bad pivot selection occurs?",
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

    return { score, correct, incorrect, unattempted: questions.length - (correct + incorrect) };
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
              Real Exam Simulation Mode
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Timed mock exam environment with negative marking (-1), real pressure, and instant deep performance analytics.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #9: Full Exam Simulator
        </span>
      </div>

      {/* Start Exam Screen */}
      {!examStarted && !examFinished && (
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xl max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-neutral-100">
              GATE & Competitive CS Mock Assessment 2026
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-md mx-auto">
              Test your recall across DSA, Operating Systems, DBMS & Cloud Architectures under strict exam conditions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
              <p className="text-slate-400 text-[10px]">DURATION</p>
              <p className="text-slate-900 dark:text-neutral-100">10 Minutes</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
              <p className="text-slate-400 text-[10px]">GRADING</p>
              <p className="text-emerald-500">+4 / -1 Mark</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
              <p className="text-slate-400 text-[10px]">QUESTIONS</p>
              <p className="text-purple-500">4 High Yield</p>
            </div>
          </div>

          <button
            onClick={() => setExamStarted(true)}
            className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Begin Timed Mock Exam</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Exam Interface */}
      {examStarted && !examFinished && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Timer Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <div className="flex items-center gap-2 text-rose-500 font-mono font-extrabold text-sm bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={() => setExamFinished(true)}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-extrabold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Submit Exam
            </button>
          </div>

          {/* Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-neutral-100 leading-snug">
              {questions[currentQuestion].text}
            </h3>

            <div className="space-y-3">
              {questions[currentQuestion].options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQuestion] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQuestion, oIdx)}
                    className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:border-slate-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                      isSelected ? 'border-purple-500 bg-purple-500 text-white font-bold' : 'border-slate-300 dark:border-neutral-700'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-800">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>

              <button
                disabled={currentQuestion === questions.length - 1}
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 shadow-xs disabled:opacity-40 cursor-pointer"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Score Summary Screen */}
      {examFinished && (
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xl max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 dark:text-neutral-100">
              Exam Submission Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              ExamAce AI evaluated your accuracy under negative marking rules.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs font-bold">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
              <p className="text-slate-400 text-[10px]">TOTAL SCORE</p>
              <p className="text-purple-600 dark:text-purple-400 text-lg font-black">{results.score} Pts</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <p className="text-[10px]">CORRECT (+4)</p>
              <p className="text-lg font-black">{results.correct}</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <p className="text-[10px]">WRONG (-1)</p>
              <p className="text-lg font-black">{results.incorrect}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
              <p className="text-slate-400 text-[10px]">UNATTEMPTED</p>
              <p className="text-lg font-black text-slate-500">{results.unattempted}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setExamStarted(false);
              setExamFinished(false);
              setTimeLeft(600);
              setCurrentQuestion(0);
              setSelectedAnswers({});
            }}
            className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam Simulation</span>
          </button>
        </div>
      )}

    </div>
  );
};
