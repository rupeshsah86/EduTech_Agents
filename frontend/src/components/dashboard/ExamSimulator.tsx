import React, { useState, useEffect } from 'react';
import { Timer, RotateCcw, ArrowRight, Sliders, CheckCircle2, XCircle, BarChart3, Sparkles, Cpu } from 'lucide-react';
import { llmService } from '../../services/llm/llmService';

interface Question {
  id: number;
  text: string;
  topic: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Multi-subject Question Bank covering all filters
const QUESTION_BANK: Record<string, Question[]> = {
  'GATE CS & IT 2026': [
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
      topic: 'DBMS (Indexing)',
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
  ],

  'Data Structures & Algorithms': [
    {
      id: 1,
      topic: 'DSA (Graph Theory)',
      text: "Which algorithm is optimal for finding all-pairs shortest paths in a weighted graph with negative edge weights (and no negative cycles)?",
      options: ["Floyd-Warshall Algorithm", "Dijkstra Algorithm", "Kruskal Algorithm", "BFS Traversal"],
      correctAnswer: 0,
      explanation: "Floyd-Warshall runs in O(V^3) time and handles negative edge weights correctly using dynamic programming."
    },
    {
      id: 2,
      topic: 'DSA (Trees)',
      text: "What is the maximum height of a Self-Balancing Red-Black Tree with N keys?",
      options: ["2 * log2(N + 1)", "N", "log2(N)", "N / 2"],
      correctAnswer: 0,
      explanation: "Red-Black Tree balance properties guarantee height is strictly bounded by 2 * log2(N + 1)."
    },
    {
      id: 3,
      topic: 'DSA (Dynamic Programming)',
      text: "What is the time complexity of solving the 0/1 Knapsack problem using Dynamic Programming with N items and Capacity W?",
      options: ["O(N * W)", "O(2^N)", "O(N log N)", "O(W^2)"],
      correctAnswer: 0,
      explanation: "0/1 Knapsack DP table has dimensions N x W, yielding pseudo-polynomial O(N * W) time complexity."
    },
    {
      id: 4,
      topic: 'DSA (Sorting)',
      text: "Which sorting algorithm maintains stability and guarantees worst-case O(N log N) time performance?",
      options: ["Merge Sort", "QuickSort", "Heap Sort", "Selection Sort"],
      correctAnswer: 0,
      explanation: "Merge Sort guarantees O(N log N) worst-case performance while preserving relative order of equal elements (Stable)."
    }
  ],

  'Operating Systems & Concurrency': [
    {
      id: 1,
      topic: 'Operating Systems (Memory Management)',
      text: "What is the phenomenon called when frequent page replacement causes high I/O overhead and near-zero CPU progress?",
      options: ["Thrashing", "Paging Fault", "Fragmentation", "Segmentation Fault"],
      correctAnswer: 0,
      explanation: "Thrashing occurs when the system spends more time swapping pages in/out of memory than executing actual processes."
    },
    {
      id: 2,
      topic: 'Operating Systems (Deadlocks)',
      text: "Which algorithm is used by Operating Systems for Deadlock Avoidance during resource allocation?",
      options: ["Banker's Algorithm", "Round Robin Scheduling", "LRU Page Replacement", "Elevator Disk Scheduling"],
      correctAnswer: 0,
      explanation: "Banker's algorithm evaluates safe state transitions before allocating requested resources to prevent deadlocks."
    },
    {
      id: 3,
      topic: 'Operating Systems (Process Sync)',
      text: "What is the value change of a Counting Semaphore S when a signal() / V() operation is executed?",
      options: ["S is incremented by 1", "S is decremented by 1", "S is set to 0", "S is doubled"],
      correctAnswer: 0,
      explanation: "Signal / V operation releases a resource and increments the counting semaphore value (S = S + 1)."
    },
    {
      id: 4,
      topic: 'Operating Systems (Scheduling)',
      text: "Which CPU scheduling algorithm minimizes the average waiting time for a given set of processes?",
      options: ["Shortest Job First (SJF / SRTF)", "First Come First Served (FCFS)", "Round Robin (RR)", "Priority Scheduling"],
      correctAnswer: 0,
      explanation: "Shortest Job First (SJF) is mathematically optimal for minimizing average waiting time."
    }
  ],

  'DBMS & System Design': [
    {
      id: 1,
      topic: 'DBMS (Transactions)',
      text: "Which ACID property ensures that all operations in a database transaction complete successfully or none are applied?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correctAnswer: 0,
      explanation: "Atomicity guarantees the 'all-or-nothing' execution guarantee for transaction blocks."
    },
    {
      id: 2,
      topic: 'DBMS (Normalization)',
      text: "A relational schema is in Boyce-Codd Normal Form (BCNF) if for every non-trivial functional dependency X -> Y:",
      options: ["X is a Super Key", "Y is a Prime Attribute", "X is a Candidate Key", "Both A and C are valid"],
      correctAnswer: 3,
      explanation: "BCNF strictly requires the determinant X of every non-trivial functional dependency X -> Y to be a Super Key."
    },
    {
      id: 3,
      topic: 'DBMS (Indexing)',
      text: "Why are B+ Trees preferred over standard Binary Search Trees for disk-based database indexes?",
      options: ["High fan-out reduces disk I/O operations & sequential leaf traversal is optimal", "B+ Trees require O(1) memory", "Leaves do not store pointers", "Binary trees have faster lookup"],
      correctAnswer: 0,
      explanation: "High fan-out lowers tree height (fewer disk reads) and linked leaf nodes allow fast range scans."
    },
    {
      id: 4,
      topic: 'System Design (CAP Theorem)',
      text: "According to the CAP Theorem, a distributed data store can simultaneously guarantee at most two of which three properties?",
      options: ["Consistency, Availability, Partition Tolerance", "Concurrency, Atomicity, Performance", "Caching, Availability, Persistence", "Cluster, Auth, Privacy"],
      correctAnswer: 0,
      explanation: "The CAP Theorem states that in the presence of a network partition (P), a distributed system must trade off Consistency (C) vs Availability (A)."
    }
  ],

  'Computer Networks & Security': [
    {
      id: 1,
      topic: 'Computer Networks (Transport Layer)',
      text: "Which flags are set in the TCP packet sequence to initiate a standard 3-Way Handshake connection?",
      options: ["SYN -> SYN-ACK -> ACK", "FIN -> ACK -> FIN", "RST -> SYN -> ACK", "PUSH -> URG -> ACK"],
      correctAnswer: 0,
      explanation: "TCP connection setup follows SYN (client) -> SYN-ACK (server) -> ACK (client)."
    },
    {
      id: 2,
      topic: 'Computer Networks (Subnetting)',
      text: "How many usable host IP addresses are available in an IPv4 subnet configured with a /28 CIDR prefix mask?",
      options: ["14 hosts", "16 hosts", "30 hosts", "64 hosts"],
      correctAnswer: 0,
      explanation: "A /28 subnet has 32 - 28 = 4 host bits. 2^4 = 16 IPs, minus 2 (Network ID & Broadcast ID) = 14 usable hosts."
    },
    {
      id: 3,
      topic: 'Cryptography (Public Key)',
      text: "In RSA Asymmetric Encryption, which key is used by the receiver to decrypt a secret message encrypted with their Public Key?",
      options: ["Receiver's Private Key", "Sender's Public Key", "Shared Symmetric Key", "Digital Signature Key"],
      correctAnswer: 0,
      explanation: "Messages encrypted with a user's Public Key can only be decrypted using that user's matching Private Key."
    }
  ],

  'Python & Software Engineering': [
    {
      id: 1,
      topic: 'Python (Concurrency)',
      text: "What mechanism in CPython prevents multiple native threads from executing Python bytecodes in parallel on multiple CPU cores?",
      options: ["GIL (Global Interpreter Lock)", "Asyncio Event Loop", "JIT Compiler", "Garbage Collector"],
      correctAnswer: 0,
      explanation: "The Global Interpreter Lock (GIL) synchronizes thread execution so only one thread runs Python bytecode at a time."
    },
    {
      id: 2,
      topic: 'Software Architecture (SOLID)',
      text: "Which SOLID design principle dictates that software entities should be open for extension but closed for modification?",
      options: ["Open/Closed Principle (OCP)", "Single Responsibility Principle (SRP)", "Liskov Substitution Principle (LSP)", "Interface Segregation (ISP)"],
      correctAnswer: 0,
      explanation: "The Open/Closed Principle encourages adding new behavior via inheritance or strategy patterns without altering tested code."
    }
  ]
};

export const ExamSimulator: React.FC = () => {
  const [subject, setSubject] = useState<string>('GATE CS & IT 2026');
  const [difficulty, setDifficulty] = useState<string>('Hard / GATE Level');
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Active question set dynamically calculated based on Subject & Difficulty
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(() => {
    return QUESTION_BANK['GATE CS & IT 2026'] || QUESTION_BANK['Data Structures & Algorithms'];
  });

  // Automatically update questions whenever subject changes
  useEffect(() => {
    const questionsForSubject = QUESTION_BANK[subject] || QUESTION_BANK['GATE CS & IT 2026'];
    setActiveQuestions(questionsForSubject);
  }, [subject, difficulty]);

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

  // Generate dynamic AI questions using Groq / LLM Engine
  const handleGenerateAIQuestions = async () => {
    setIsGeneratingAI(true);
    try {
      const prompt = `Generate 4 high-yield, distinct multiple choice questions for exam subject "${subject}" at difficulty level "${difficulty}".
Format the response strictly as valid JSON array of objects with keys: id (number), topic (string), text (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string).`;
      
      const systemPrompt = `You are ExamAce AI, an expert exam question generator for Computer Science and GATE CS exams. Return ONLY raw JSON array.`;

      const result = await llmService.generate(prompt, systemPrompt);
      if (result && result.text) {
        const jsonMatch = result.text.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActiveQuestions(parsed);
            setIsGeneratingAI(false);
            handleStartExam();
            return;
          }
        }
      }
    } catch (e) {
      console.warn('AI question generation error, using curated question bank:', e);
    }

    setIsGeneratingAI(false);
    handleStartExam();
  };

  const calculateResults = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;

    activeQuestions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected === q.correctAnswer) {
        score += 4; // +4 for correct
        correct += 1;
      } else if (selected !== undefined) {
        score -= 1; // -1 negative marking
        incorrect += 1;
      }
    });

    const accuracy = activeQuestions.length > 0 ? Math.round((correct / activeQuestions.length) * 100) : 0;
    const avgTimePerQuestion = activeQuestions.length > 0 ? Math.round((600 - timeLeft) / activeQuestions.length) : 0;

    return {
      score,
      correct,
      incorrect,
      unattempted: activeQuestions.length - (correct + incorrect),
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
            <Sliders className="w-4 h-4 text-purple-500" /> Configure Exam Parameters ({activeQuestions.length} Questions Filtered)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Dropdown */}
            <div className="space-y-1.5 text-left">
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
                <option value="Computer Networks & Security">Computer Networks & Security</option>
                <option value="Python & Software Engineering">Python & Software Engineering</option>
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-1.5 text-left">
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

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Begin Timed Mock Exam ({activeQuestions.length} Qs)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleGenerateAIQuestions}
              disabled={isGeneratingAI}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Groq AI Generating Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New AI Questions</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ⏱️ Active Exam Environment */}
      {examStarted && !examFinished && activeQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Bar: Timer & Progress */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex items-center justify-between shadow-xs">
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 font-mono">
              Question {currentQuestion + 1} of {activeQuestions.length} ({subject})
            </span>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold font-mono animate-pulse">
              <Timer className="w-3.5 h-3.5" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Active Question Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-5 shadow-sm text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                {activeQuestions[currentQuestion].topic}
              </span>
              <span className="text-[10px] font-bold text-emerald-500">+4 / -1 Mark</span>
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
              {activeQuestions[currentQuestion].text}
            </h3>

            <div className="space-y-2.5 pt-2">
              {activeQuestions[currentQuestion].options.map((opt, oIdx) => {
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

            {currentQuestion === activeQuestions.length - 1 ? (
              <button
                onClick={() => setExamFinished(true)}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
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
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 text-left">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-purple-500/30 space-y-6 shadow-xl">
            {/* Header Score & Grade */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
                  Assessment Completed • {subject} ({difficulty})
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
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{results.correct} / {activeQuestions.length}</p>
                <p className="text-[10px] text-emerald-500 font-bold">+{results.correct * 4} Marks</p>
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
                {activeQuestions.map((q, idx) => {
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
