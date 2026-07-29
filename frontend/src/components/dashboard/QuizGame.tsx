import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BrainCircuit, 
  Sparkles,
  BookOpen,
  Award,
  Flame,
  LayoutDashboard
} from 'lucide-react';

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  topic: string;
}

const DEFAULT_QUIZ_BANKS: Record<string, MCQQuestion[]> = {
  dsa: [
    {
      id: 1,
      topic: "Data Structures & Algorithms",
      question: "Which data structure is primarily used to execute Breadth-First Search (BFS) on a graph?",
      options: ["Stack (LIFO)", "Queue (FIFO)", "Priority Queue (Min-Heap)", "Binary Search Tree"],
      correctAnswer: 1,
      explanation: "BFS visits nodes level-by-level, requiring First-In-First-Out (FIFO) ordering provided by a Queue."
    },
    {
      id: 2,
      topic: "Data Structures & Algorithms",
      question: "What is the worst-case time complexity of QuickSort when bad pivot selection occurs?",
      options: ["O(N log N)", "O(N)", "O(N²)", "O(log N)"],
      correctAnswer: 2,
      explanation: "When the pivot chosen is consistently the smallest or largest element, the recursion tree height becomes N, yielding O(N²) time."
    },
    {
      id: 3,
      topic: "Data Structures & Algorithms",
      question: "In Dijkstra's Shortest Path Algorithm, which data structure reduces minimum distance extraction time to O(log V)?",
      options: ["Min-Heap / Priority Queue", "Doubly Linked List", "Hash Map", "Array"],
      correctAnswer: 0,
      explanation: "A Min-Heap allows extracting the vertex with minimum distance in O(log V) time."
    },
    {
      id: 4,
      topic: "Data Structures & Algorithms",
      question: "What is the tightest upper bound time complexity to search an element in a balanced Binary Search Tree (AVL / Red-Black)?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctAnswer: 1,
      explanation: "Self-balancing binary search trees maintain height h = O(log N), guaranteeing O(log N) search."
    },
    {
      id: 5,
      topic: "Data Structures & Algorithms",
      question: "Which algorithm design strategy does Floyd-Warshall All-Pairs Shortest Path use?",
      options: ["Greedy Approach", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
      correctAnswer: 2,
      explanation: "Floyd-Warshall solves subproblems iteratively using dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]), which is Dynamic Programming."
    }
  ],
  os: [
    {
      id: 1,
      topic: "Operating Systems",
      question: "Which of the following is NOT one of the four Coffman conditions necessary for deadlock to occur?",
      options: ["Mutual Exclusion", "Preemption allowed by kernel", "Hold and Wait", "Circular Wait"],
      correctAnswer: 1,
      explanation: "No Preemption is a mandatory deadlock condition. If preemption is allowed, deadlocks cannot persist."
    },
    {
      id: 2,
      topic: "Operating Systems",
      question: "What is Thrashing in Operating System Virtual Memory management?",
      options: ["CPU executing infinite loops", "Excessive page faulting causing OS to spend more time swapping than executing process code", "Corrupted hard disk sectors", "Deadlock among thread pools"],
      correctAnswer: 1,
      explanation: "Thrashing happens when processes do not have enough pages, causing continuous page faults and disk I/O thrashing."
    },
    {
      id: 3,
      topic: "Operating Systems",
      question: "Which CPU scheduling algorithm suffers from the Convoy Effect?",
      options: ["First-Come First-Served (FCFS)", "Round Robin (RR)", "Shortest Job First (SJF)", "Priority Scheduling"],
      correctAnswer: 0,
      explanation: "FCFS causes short processes to wait behind long CPU-bound processes (Convoy Effect)."
    },
    {
      id: 4,
      topic: "Operating Systems",
      question: "What is a Semaphore initialized to 1 commonly called?",
      options: ["Counting Semaphore", "Binary Semaphore / Mutex", "Spinlock", "Condition Variable"],
      correctAnswer: 1,
      explanation: "A binary semaphore has values 0 and 1, functioning as a Mutual Exclusion (Mutex) lock."
    },
    {
      id: 5,
      topic: "Operating Systems",
      question: "In Paging memory management, which table maps virtual page numbers to physical frame numbers?",
      options: ["Translation Lookaside Buffer (TLB)", "Page Table", "Segment Table", "Inverted Heap Table"],
      correctAnswer: 1,
      explanation: "The Page Table stores page-to-frame mappings maintained per process by the MMU."
    }
  ],
  dbms: [
    {
      id: 1,
      topic: "Database Management Systems",
      question: "Which SQL JOIN returns all records from the left table and matching records from the right table, filling unmatched right columns with NULL?",
      options: ["INNER JOIN", "RIGHT OUTER JOIN", "LEFT OUTER JOIN", "FULL OUTER JOIN"],
      correctAnswer: 2,
      explanation: "LEFT OUTER JOIN includes every row from the left table regardless of matches in the right table."
    },
    {
      id: 2,
      topic: "Database Management Systems",
      question: "In ACID properties, what does 'Atomicity' guarantee?",
      options: ["Transactions execute concurrently without interference", "Transactions complete fully ('All') or revert completely ('Nothing')", "Data remains valid after server crashes", "Primary keys are strictly unique"],
      correctAnswer: 1,
      explanation: "Atomicity enforces the 'All or Nothing' rule — if any statement fails, the entire transaction is rolled back."
    },
    {
      id: 3,
      topic: "Database Management Systems",
      question: "Which Normal Form eliminates Transitive Dependencies (X -> Y and Y -> Z)?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 2,
      explanation: "Third Normal Form (3NF) requires a relation to be in 2NF with no non-prime attributes transitively dependent on candidate keys."
    },
    {
      id: 4,
      topic: "Database Management Systems",
      question: "Which index structure is most widely used in relational databases for fast range queries and equality lookups?",
      options: ["Hash Index", "B+ Tree Index", "Binary Search Tree", "LSM Tree"],
      correctAnswer: 1,
      explanation: "B+ Trees keep data ordered in linked leaf nodes, enabling efficient range scans and logarithmic lookups."
    },
    {
      id: 5,
      topic: "Database Management Systems",
      question: "In PostgreSQL, which extension provides native HNSW vector index support for AI semantic embeddings?",
      options: ["pgvector", "postgis", "pg_trgm", "uuid-ossp"],
      correctAnswer: 0,
      explanation: "pgvector adds vector similarity search capabilities (L2, Inner Product, Cosine) using IVFFlat and HNSW indexes."
    }
  ],
  web: [
    {
      id: 1,
      topic: "Full-Stack Web & JS",
      question: "What is the purpose of React `useCallback` hook?",
      options: ["To memoize heavy calculation results", "To memoize callback function instances across component re-renders", "To perform side effects on DOM mount", "To trigger asynchronous state updates"],
      correctAnswer: 1,
      explanation: "useCallback returns a memoized version of the callback function that only changes if dependencies update, preventing unneeded child re-renders."
    },
    {
      id: 2,
      topic: "Full-Stack Web & JS",
      question: "In the JavaScript Event Loop, which queue takes precedence for immediate execution right after current synchronous stack?",
      options: ["Task Queue (Macrotasks)", "Microtask Queue (Promises / process.nextTick)", "Render Queue", "Worker Queue"],
      correctAnswer: 1,
      explanation: "The Microtask queue (Promises, queueMicrotask) is processed completely before picking the next task from the Macrotask queue."
    },
    {
      id: 3,
      topic: "Full-Stack Web & JS",
      question: "What does HTTP status code 429 indicate?",
      options: ["Unauthorized", "Payment Required", "Too Many Requests (Rate Limited)", "Internal Server Error"],
      correctAnswer: 2,
      explanation: "HTTP 429 indicates that the user or client application has sent too many requests in a given amount of time (rate limiting)."
    },
    {
      id: 4,
      topic: "Full-Stack Web & JS",
      question: "Which CSS property is crucial for creating smooth glassmorphism UI overlay effects?",
      options: ["filter: blur()", "backdrop-filter: blur()", "box-shadow: inset", "mix-blend-mode"],
      correctAnswer: 1,
      explanation: "backdrop-filter applies graphical effects like blurring to the area behind an element."
    },
    {
      id: 5,
      topic: "Full-Stack Web & JS",
      question: "What is the key advantage of Server-Side Rendering (SSR) over Client-Side Rendering (CSR)?",
      options: ["No server costs", "Faster Initial Page Load & superior SEO indexing", "Zero JavaScript needed", "Automatic offline caching"],
      correctAnswer: 1,
      explanation: "SSR generates pre-rendered HTML on the server, serving full content immediately for faster first contentful paint and web crawlers."
    }
  ]
};

interface QuizGameProps {
  onBackToDashboard?: () => void;
  onReviewWeakTopics?: (topics: string[]) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ onBackToDashboard, onReviewWeakTopics }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('dsa');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [questions, setQuestions] = useState<MCQQuestion[]>(DEFAULT_QUIZ_BANKS.dsa);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const handleSelectCategory = (catKey: string) => {
    setSelectedCategory(catKey);
    if (DEFAULT_QUIZ_BANKS[catKey]) {
      setQuestions(DEFAULT_QUIZ_BANKS[catKey]);
    }
    resetQuizState();
  };

  const resetQuizState = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setIsFinished(false);
    setShowExplanation(false);
  };

  const handleGenerateCustomQuiz = () => {
    if (!customTopic.trim()) return;
    const topicTitle = customTopic.trim();
    const generatedBank: MCQQuestion[] = [
      {
        id: 1,
        topic: topicTitle,
        question: `What is the core principle behind ${topicTitle}?`,
        options: [
          `Fundamental architecture of ${topicTitle}`,
          "Static procedural execution without state",
          "Legacy protocol replaced by binary trees",
          "Synchronous blocking thread scheduling"
        ],
        correctAnswer: 0,
        explanation: `${topicTitle} operates primarily on core structural principles designed to optimize reliability and efficiency.`
      },
      {
        id: 2,
        topic: topicTitle,
        question: `Which key technique is most effective when working with ${topicTitle}?`,
        options: [
          "Linear scan without indexing",
          `Active recall & structured optimization of ${topicTitle}`,
          "Disabling garbage collection",
          "Using unbounded recursive stacks"
        ],
        correctAnswer: 1,
        explanation: `Structured optimization and active recall ensure peak efficiency when mastering ${topicTitle}.`
      },
      {
        id: 3,
        topic: topicTitle,
        question: `What is a common pitfall to avoid when implementing ${topicTitle}?`,
        options: [
          "Neglecting boundary conditions and space complexity",
          "Writing clear documentation",
          "Using modular functions",
          "Leveraging automated unit testing"
        ],
        correctAnswer: 0,
        explanation: "Failing to evaluate edge cases and memory constraints can lead to unexpected runtime bottlenecks."
      },
      {
        id: 4,
        topic: topicTitle,
        question: `How does ${topicTitle} scale under high computational load?`,
        options: [
          "Degrades exponentially to O(N!)",
          "Scales efficiently when logarithmic / sub-linear indexing is applied",
          "Requires full manual CPU re-allocation",
          "Prevents parallel execution"
        ],
        correctAnswer: 1,
        explanation: "Sub-linear indexing and algorithmic caching allow high-throughput scalability."
      },
      {
        id: 5,
        topic: topicTitle,
        question: `What is the recommended best practice when testing ${topicTitle}?`,
        options: [
          "Relying solely on production logs",
          "Comprehensive unit tests, benchmarking, and active recall drills",
          "Testing only positive happy paths",
          "Ignoring memory profiling"
        ],
        correctAnswer: 1,
        explanation: "Comprehensive testing with edge-case validation guarantees correctness and robustness."
      }
    ];

    setSelectedCategory('custom');
    setQuestions(generatedBank);
    resetQuizState();
  };

  const handleOptionClick = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing after selection
    setSelectedOption(optionIndex);
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    const pct = Math.round((correctCount / questions.length) * 100);
    if (pct >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Calculate final statistics
  const totalQuestions = questions.length;
  let correctAnswersCount = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.correctAnswer) {
      correctAnswersCount += 1;
    }
  });
  const wrongAnswersCount = totalQuestions - correctAnswersCount;
  const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);

  let gradeBadge = {
    title: "Needs Improvement 💡",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    description: "Keep practicing! Review your weak topics to build stronger concept mastery."
  };
  if (scorePercentage >= 80) {
    gradeBadge = {
      title: "Excellent 🌟",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      description: "Outstanding performance! You have mastered these concepts thoroughly."
    };
  } else if (scorePercentage >= 50) {
    gradeBadge = {
      title: "Good 👍",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      description: "Solid effort! A quick revision of wrong questions will make you perfect."
    };
  }

  // Get list of wrong questions
  const wrongQuestions = questions.filter((q, idx) => answers[idx] !== q.correctAnswer);

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-4 sm:p-8 font-sans space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
                QuizMaster AI MCQ Challenge
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                Adaptive MCQ Game
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Interactive 1-question game mode with immediate explanations and analytical result cards.
            </p>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-bold text-slate-700 dark:text-neutral-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600 transition-all cursor-pointer w-fit"
          >
            <LayoutDashboard className="w-4 h-4 text-purple-500" />
            <span>Back to Dashboard</span>
          </button>
        )}
      </div>

      {/* Category / Custom Topic Selector Bar */}
      {!isFinished && (
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
              Select Quiz Topic:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'dsa', name: 'Data Structures & Algorithms', icon: BrainCircuit },
              { id: 'os', name: 'Operating Systems', icon: BookOpen },
              { id: 'dbms', name: 'DBMS & SQL', icon: Sparkles },
              { id: 'web', name: 'Web Dev & JS', icon: Flame },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      : 'bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:border-purple-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Topic Quick Input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Or type any topic (e.g. Machine Learning, Python, Network Protocols)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customTopic.trim()) {
                  e.preventDefault();
                  handleGenerateCustomQuiz();
                }
              }}
              className="flex-1 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleGenerateCustomQuiz}
              disabled={!customTopic.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xs disabled:opacity-40 transition-all cursor-pointer shrink-0"
            >
              Generate Quiz
            </button>
          </div>
        </div>
      )}

      {/* Main MCQ Game Card */}
      {!isFinished && (
        <div className="max-w-3xl mx-auto space-y-6 pt-2">
          
          {/* Progress Bar & Indicators */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs flex items-center justify-center">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-neutral-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="flex-1 max-w-xs bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>

          {/* Animated MCQ Card (Framer Motion) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 shadow-lg space-y-6 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                <span>⚡ {currentQ.topic}</span>
                <span>One Question at a Time</span>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-neutral-100 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrectOption = oIdx === currentQ.correctAnswer;
                  const isAnswered = selectedOption !== null;

                  let styleClasses = "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-200 hover:border-purple-400";
                  let badgeContent = String.fromCharCode(65 + oIdx);
                  let badgeStyle = "border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-400";

                  if (isAnswered) {
                    if (isCorrectOption) {
                      styleClasses = "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20";
                      badgeStyle = "border-emerald-500 bg-emerald-500 text-white font-extrabold";
                    } else if (isSelected && !isCorrectOption) {
                      styleClasses = "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-500/20";
                      badgeStyle = "border-rose-500 bg-rose-500 text-white font-extrabold";
                    } else {
                      styleClasses = "bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswered}
                      onClick={() => handleOptionClick(oIdx)}
                      className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-between gap-3 ${styleClasses}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 ${badgeStyle}`}>
                          {badgeContent}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {/* Icon Indicators after submission */}
                      {isAnswered && (
                        <div>
                          {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                          {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Explanation Card */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4.5 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                    selectedOption === currentQ.correctAnswer
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold">
                    {selectedOption === currentQ.correctAnswer ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Correct Answer! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Incorrect Choice</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed font-medium text-slate-700 dark:text-neutral-300">
                    <strong>Explanation:</strong> {currentQ.explanation}
                  </p>
                </motion.div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-800">
                <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium">
                  {selectedOption === null ? "Select an option to see answer & explanation" : "Click next to continue"}
                </p>

                <button
                  disabled={selectedOption === null}
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish & View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Results Page */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Result Banner Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
            
            <div className="w-20 h-20 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20 shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider inline-block ${gradeBadge.color}`}>
                {gradeBadge.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-neutral-100">
                Quiz Evaluation Completed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed font-medium">
                {gradeBadge.description}
              </p>
            </div>

            {/* Metrics Dashboard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 text-center">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Questions</p>
                <p className="text-slate-900 dark:text-neutral-100 text-2xl font-black mt-1">{totalQuestions}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider">Correct Answers</p>
                <p className="text-2xl font-black mt-1">{correctAnswersCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider">Wrong Answers</p>
                <p className="text-2xl font-black mt-1">{wrongAnswersCount}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-center">
                <p className="text-[10px] uppercase font-bold tracking-wider">Score Percentage</p>
                <p className="text-2xl font-black mt-1">{scorePercentage}%</p>
              </div>
            </div>

            {/* 3 Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <button
                onClick={resetQuizState}
                className="py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={() => {
                  const weakTopicsList = wrongQuestions.map(q => q.topic);
                  const uniqueWeak = Array.from(new Set(weakTopicsList));
                  const queryText = uniqueWeak.length > 0
                    ? `Please explain these weak topics from my quiz in detail: ${uniqueWeak.join(', ')}`
                    : "Please explain advanced concepts and key revision points for my quiz topics.";
                  
                  if (onReviewWeakTopics) {
                    onReviewWeakTopics([queryText]);
                  } else {
                    window.dispatchEvent(new CustomEvent('send-master-ai-prompt', { detail: queryText }));
                    if (onBackToDashboard) onBackToDashboard();
                  }
                }}
                className="py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Review Weak Topics</span>
              </button>

              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="py-3.5 px-4 rounded-2xl bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </button>
              )}
            </div>

          </div>

          {/* List of Wrong Questions with Correct Answers & Explanations */}
          {wrongQuestions.length > 0 ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm border-b border-slate-100 dark:border-neutral-800 pb-3">
                <XCircle className="w-5 h-5" />
                <span>Wrong Questions Analysis ({wrongQuestions.length})</span>
              </div>

              <div className="space-y-4">
                {wrongQuestions.map((q, qIdx) => {
                  const origIdx = questions.findIndex(orig => orig.id === q.id);
                  const userChosenOpt = q.options[answers[origIdx]];
                  const correctOpt = q.options[q.correctAnswer];

                  return (
                    <div 
                      key={qIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2 text-xs"
                    >
                      <p className="font-extrabold text-slate-900 dark:text-neutral-100 text-xs sm:text-sm">
                        {qIdx + 1}. {q.question}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2 font-semibold text-[11px] pt-1">
                        <span className="p-2 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                          ❌ <strong>Your Answer:</strong> {userChosenOpt || 'Unanswered'}
                        </span>
                        <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          ✅ <strong>Correct Answer:</strong> {correctOpt}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-neutral-400 text-[11px] pt-1 leading-relaxed">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              🎉 Perfect Score! You answered all questions correctly!
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
};
