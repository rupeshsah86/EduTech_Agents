import React, { useState } from 'react';
import { 
  Network, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Brain, 
  ArrowRight, 
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  Filter,
  X,
  Code,
  CheckSquare
} from 'lucide-react';

interface ConceptNode {
  id: string;
  name: string;
  subject: string;
  masteryScore: number; // 0 to 100
  status: 'Mastered' | 'Learning' | 'Needs Review';
  lastPracticed: string;
  nextRevision: string;
  relatedConcepts: string[];
  description: string;
  subtopics?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export const KnowledgeGraphVisualizer: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalConcept, setActiveModalConcept] = useState<ConceptNode | null>(null);

  const allConceptNodes: ConceptNode[] = [
    // DSA Topics
    { id: 'dsa_1', name: 'Arrays & Hashing', subject: 'DSA', masteryScore: 95, status: 'Mastered', lastPracticed: 'Today', nextRevision: 'In 7 days', relatedConcepts: ['Hash Table', 'Prefix Sum', 'Two Pointers'], description: 'Constant time lookup and amortized dynamic resizing.' },
    { id: 'dsa_2', name: 'Linked Lists', subject: 'DSA', masteryScore: 88, status: 'Mastered', lastPracticed: 'Yesterday', nextRevision: 'In 5 days', relatedConcepts: ['Pointer Manipulation', 'Floyd Cycle Detection'], description: 'Sequential linear structures with node reference pointers.' },
    { id: 'dsa_3', name: 'Stacks & Queues', subject: 'DSA', masteryScore: 90, status: 'Mastered', lastPracticed: '3 days ago', nextRevision: 'In 6 days', relatedConcepts: ['LIFO & FIFO', 'Monotonic Stack'], description: 'Abstract linear data types for call stacks and scheduling buffers.' },
    { id: 'dsa_4', name: 'Binary Search Trees', subject: 'DSA', masteryScore: 92, status: 'Mastered', lastPracticed: '2 days ago', nextRevision: 'In 4 days', relatedConcepts: ['Inorder Traversal', 'BST Property'], description: 'Hierarchical node structure maintaining sorted keys.' },
    { id: 'dsa_5', name: 'AVL Trees', subject: 'DSA', masteryScore: 78, status: 'Learning', lastPracticed: '4 days ago', nextRevision: 'In 2 days', relatedConcepts: ['Rotations', 'Balance Factor'], description: 'Self-balancing binary search trees ensuring O(log N) operations.' },
    { id: 'dsa_6', name: 'Heaps & Priority Queues', subject: 'DSA', masteryScore: 84, status: 'Mastered', lastPracticed: 'Yesterday', nextRevision: 'In 5 days', relatedConcepts: ['Heapify', 'Max-Heap / Min-Heap'], description: 'Complete binary tree representation for efficient priority extraction.' },
    { id: 'dsa_7', name: 'Graph Representations', subject: 'DSA', masteryScore: 70, status: 'Learning', lastPracticed: '3 days ago', nextRevision: 'Tomorrow', relatedConcepts: ['Adjacency List', 'BFS / DFS'], description: 'Adjacency matrix and adjacency list topological modeling.' },
    { id: 'dsa_8', name: 'Dynamic Programming', subject: 'DSA', masteryScore: 62, status: 'Learning', lastPracticed: '5 days ago', nextRevision: 'Tomorrow', relatedConcepts: ['Memoization', 'Tabulation'], description: 'Optimization of recursive subproblems through overlapping states.' },

    // Algorithms Topics
    { id: 'alg_1', name: 'Sorting & Binary Search', subject: 'Algorithms', masteryScore: 94, status: 'Mastered', lastPracticed: 'Yesterday', nextRevision: 'In 7 days', relatedConcepts: ['QuickSort', 'Divide & Conquer'], description: 'O(N log N) comparison sorts and logarithmic array searching.' },
    { id: 'alg_2', name: 'Dijkstra Algorithm', subject: 'Algorithms', masteryScore: 45, status: 'Needs Review', lastPracticed: '6 days ago', nextRevision: 'Overdue!', relatedConcepts: ['Priority Queue', 'Edge Relaxation'], description: 'Single-source shortest path algorithm for non-negative weighted graphs.' },
    { id: 'alg_3', name: 'Bellman-Ford Algorithm', subject: 'Algorithms', masteryScore: 52, status: 'Needs Review', lastPracticed: '7 days ago', nextRevision: 'Today', relatedConcepts: ['Negative Weight Cycles', 'Dynamic Programming'], description: 'Computes single-source shortest path with negative edge weights.' },
    { id: 'alg_4', name: 'Kruskal & Prim MST', subject: 'Algorithms', masteryScore: 81, status: 'Mastered', lastPracticed: '3 days ago', nextRevision: 'In 4 days', relatedConcepts: ['Disjoint Set (Union-Find)', 'Greedy Choice'], description: 'Minimum Spanning Tree construction algorithms.' },
    { id: 'alg_5', name: 'Backtracking & N-Queens', subject: 'Algorithms', masteryScore: 68, status: 'Learning', lastPracticed: '4 days ago', nextRevision: 'In 2 days', relatedConcepts: ['State Space Tree', 'Pruning'], description: 'Depth-first search over candidate configurations with domain pruning.' },

    // Operating Systems Topics
    { id: 'os_1', name: 'Process Management & Threads', subject: 'Operating Systems', masteryScore: 89, status: 'Mastered', lastPracticed: 'Yesterday', nextRevision: 'In 6 days', relatedConcepts: ['PCB', 'Context Switch'], description: 'Execution context isolation and lightweight thread scheduling.' },
    { id: 'os_2', name: 'Process Synchronization', subject: 'Operating Systems', masteryScore: 55, status: 'Needs Review', lastPracticed: '5 days ago', nextRevision: 'Today', relatedConcepts: ['Semaphores', 'Mutex Locks', 'Peterson Algorithm'], description: 'Critical section access control preventing race conditions.' },
    { id: 'os_3', name: 'Deadlocks & Coffman Conditions', subject: 'Operating Systems', masteryScore: 48, status: 'Needs Review', lastPracticed: '8 days ago', nextRevision: 'Overdue!', relatedConcepts: ['Banker Algorithm', 'Resource Allocation Graph'], description: 'Deadlock avoidance, detection, and circular wait prevention.' },
    { id: 'os_4', name: 'Virtual Memory & Paging', subject: 'Operating Systems', masteryScore: 88, status: 'Mastered', lastPracticed: '2 days ago', nextRevision: 'In 5 days', relatedConcepts: ['TLB Cache', 'Page Faults', 'Demand Paging'], description: 'Hardware address translation and memory paging management.' },

    // DBMS Topics
    { id: 'db_1', name: 'SQL Optimization & Joins', subject: 'DBMS', masteryScore: 91, status: 'Mastered', lastPracticed: 'Today', nextRevision: 'In 7 days', relatedConcepts: ['Index Scan', 'Nested Loop Join'], description: 'Relational query execution plans and index-assisted filtering.' },
    { id: 'db_2', name: 'Normalization (1NF - 5NF)', subject: 'DBMS', masteryScore: 86, status: 'Mastered', lastPracticed: '3 days ago', nextRevision: 'In 4 days', relatedConcepts: ['Functional Dependency', 'BCNF'], description: 'Schema decomposition rules to eliminate data redundancy.' },
    { id: 'db_3', name: 'Transactions & ACID Guarantees', subject: 'DBMS', masteryScore: 79, status: 'Learning', lastPracticed: '4 days ago', nextRevision: 'Tomorrow', relatedConcepts: ['WAL Log', 'Two-Phase Locking (2PL)'], description: 'Atomicity, Consistency, Isolation, and Durability enforcement.' },
    { id: 'db_4', name: 'B-Trees & pgvector Indexing', subject: 'DBMS', masteryScore: 85, status: 'Mastered', lastPracticed: 'Yesterday', nextRevision: 'In 5 days', relatedConcepts: ['Multi-Level Indexing', 'HNSW Vector Search'], description: 'Balanced search tree indexes and high-dimensional vector embeddings.' },

    // System Design Topics
    { id: 'sd_1', name: 'Scalability & Load Balancing', subject: 'System Design', masteryScore: 82, status: 'Mastered', lastPracticed: 'Yesterday', nextRevision: 'In 5 days', relatedConcepts: ['Horizontal Scaling', 'Consistent Hashing'], description: 'Distributing web traffic across redundant cluster instances.' },
    { id: 'sd_2', name: 'Distributed Caching', subject: 'System Design', masteryScore: 76, status: 'Learning', lastPracticed: '3 days ago', nextRevision: 'Tomorrow', relatedConcepts: ['Redis', 'Cache Eviction (LRU)'], description: 'In-memory caching strategies to reduce database read latency.' },
    { id: 'sd_3', name: 'Microservices & Message Queues', subject: 'System Design', masteryScore: 68, status: 'Learning', lastPracticed: '4 days ago', nextRevision: 'In 2 days', relatedConcepts: ['Kafka / RabbitMQ', 'Event-Driven Architecture'], description: 'Asynchronous decoupled messaging and domain microservices.' }
  ];

  // Filtering Logic
  const filteredNodes = allConceptNodes.filter((node) => {
    const matchesSubject = selectedSubject === 'All' || node.subject === selectedSubject;
    const matchesStatus = selectedStatusFilter === 'All' || node.status === selectedStatusFilter;
    const matchesQuery = searchQuery === '' || 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      node.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesStatus && matchesQuery;
  });

  // Calculate Top Summary Stats
  const totalCount = allConceptNodes.length;
  const masteredCount = allConceptNodes.filter(n => n.status === 'Mastered').length;
  const learningCount = allConceptNodes.filter(n => n.status === 'Learning').length;
  const reviewCount = allConceptNodes.filter(n => n.status === 'Needs Review').length;
  const overallMasteryAvg = Math.round(
    allConceptNodes.reduce((acc, curr) => acc + curr.masteryScore, 0) / totalCount
  );

  // Calculate Subject Completion %
  const currentSubjectNodes = selectedSubject === 'All' 
    ? allConceptNodes 
    : allConceptNodes.filter(n => n.subject === selectedSubject);
  const currentSubjectAvg = Math.round(
    currentSubjectNodes.reduce((acc, curr) => acc + curr.masteryScore, 0) / (currentSubjectNodes.length || 1)
  );

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-8 font-sans">
      
      {/* 1. Header Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
                Personal Knowledge Graph & Topic Topology
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 font-medium">
                Live AI-managed map of your mastered concepts, partial knowledge, and automatic gap recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'DSA', 'Algorithms', 'Operating Systems', 'DBMS', 'System Design'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-100/80 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Summary Stats Bar (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Total Topics</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-neutral-100">{totalCount}</p>
          <p className="text-[10px] text-slate-500 dark:text-neutral-400">Across 5 CS Domains</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{masteredCount}</p>
          <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-bold">&gt; 80% Mastery Score</p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span>In Progress</span>
            <Brain className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{learningCount}</p>
          <p className="text-[10px] text-purple-600/80 dark:text-purple-400/80 font-bold">Active Practice Needed</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Needs Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{reviewCount}</p>
          <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-bold">SM-2 Spaced Recall Due</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 dark:text-neutral-500 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Overall Mastery</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-neutral-100">{overallMasteryAvg}%</p>
          <p className="text-[10px] text-emerald-500 font-bold">+14% vs last week</p>
        </div>
      </div>

      {/* 3. Learning Path Progress Bar */}
      <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 uppercase tracking-wider">
              {selectedSubject === 'All' ? 'Computer Science Core Path Progress' : `${selectedSubject} Domain Learning Progress`}
            </span>
          </div>
          <span className="text-xs font-black text-purple-600 dark:text-purple-400">
            {currentSubjectAvg}% Complete
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700 shadow-xs" 
            style={{ width: `${currentSubjectAvg}%` }} 
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
          <span>Foundational Concepts</span>
          <span>Intermediate Algorithms</span>
          <span>Advanced Systems</span>
        </div>
      </div>

      {/* 4. Main Grid View (Left: Concept Cards Grid, Right: Mastery Gap Recommendations & Weekly Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Concept Cards Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls Bar: Search & Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-neutral-900 p-3.5 rounded-2xl border border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Dijkstra, B-Trees, Cache...)"
                className="w-full bg-transparent text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {['All', 'Mastered', 'Learning', 'Needs Review'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    selectedStatusFilter === status
                      ? 'bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setActiveModalConcept(node)}
                className="glass-panel p-5 rounded-2xl glass-card-hover border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between space-y-3.5 shadow-2xs cursor-pointer hover:border-purple-400 transition-all"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    node.status === 'Mastered'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : node.status === 'Learning'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {node.status}
                  </span>

                  <span className="text-xs font-black text-slate-900 dark:text-neutral-100 bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-neutral-700">
                    {node.masteryScore}%
                  </span>
                </div>

                {/* Concept Info */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100 leading-snug">
                    {node.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      node.masteryScore > 80 ? 'bg-emerald-500' : node.masteryScore > 60 ? 'bg-purple-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${node.masteryScore}%` }}
                  />
                </div>

                {/* Timestamps */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-neutral-500 pt-1 border-t border-slate-100 dark:border-neutral-800/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Last: {node.lastPracticed}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-purple-600 dark:text-purple-400">
                    <Calendar className="w-3 h-3" /> Next: {node.nextRevision}
                  </span>
                </div>

                {/* Related Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {node.relatedConcepts.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 dark:text-neutral-500 text-center font-medium">
            Showing {filteredNodes.length} of {allConceptNodes.length} concept nodes in topology
          </p>
        </div>

        {/* Right Column: Mastery Gap Recommendations & Weekly Insights */}
        <div className="space-y-6">
          
          {/* Actionable Mastery Gap Recommendations */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Mastery Gap Recommendations
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Action Required
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
              ExamAce AI & QuizMaster AI identified 2 critical weak topics requiring immediate spaced revision:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs text-amber-600 dark:text-amber-400">
                  <span>Dijkstra Algorithm</span>
                  <span className="text-rose-500 font-extrabold">45% Score (Critical)</span>
                </div>
                <p className="text-slate-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                  Priority Queue implementation & edge relaxation steps failed in recent quiz attempt.
                </p>
                <button className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] shadow-xs cursor-pointer">
                  Practice Dijkstra Code Sandbox
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between font-bold text-xs text-purple-600 dark:text-purple-400">
                  <span>Process Synchronization</span>
                  <span className="text-amber-500 font-extrabold">55% Score (High Risk)</span>
                </div>
                <p className="text-slate-600 dark:text-neutral-300 text-[11px] leading-relaxed">
                  Deadlock condition handling (Coffman invariants) needs active recall flashcards.
                </p>
                <button className="w-full py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] shadow-xs cursor-pointer">
                  Generate Flashcard Quiz
                </button>
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Zap className="w-4 h-4 fill-white" />
              <span>Launch AI Practice Session for Weak Topics</span>
            </button>
          </div>

          {/* Weekly Insights & Suggested Next Actions */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> Weekly AI Insights & Next Steps
            </h3>

            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" /> Memory Velocity Insight
              </p>
              <p className="text-[11px] text-slate-600 dark:text-neutral-300 leading-relaxed">
                Your retention on Graph Algorithms increased by <strong>+22%</strong> this week after using ConceptClear AI's Socratic explanations!
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-xs font-extrabold text-slate-800 dark:text-neutral-200 uppercase tracking-wider">
                Suggested Next Actions
              </p>
              <button className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-800 dark:text-neutral-200 flex items-center justify-between cursor-pointer">
                <span>Revise 4 Overdue Flashcards</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
              </button>
              <button className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-neutral-950 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800 text-xs font-semibold text-slate-800 dark:text-neutral-200 flex items-center justify-between cursor-pointer">
                <span>Start Timed Exam Simulation</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-500" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Concept Detail Modal */}
      {activeModalConcept && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {activeModalConcept.subject}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    activeModalConcept.status === 'Mastered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-purple-500/10 text-purple-600'
                  }`}>
                    {activeModalConcept.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-neutral-100">
                  {activeModalConcept.name}
                </h3>
              </div>

              <button
                onClick={() => setActiveModalConcept(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 text-slate-600 dark:text-neutral-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Subtopics */}
            <div className="space-y-4">
              <p className="text-sm text-slate-700 dark:text-neutral-300 leading-relaxed font-medium">
                {activeModalConcept.description}
              </p>

              {/* Sub-topics List */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 uppercase tracking-wider">
                  Core Sub-Topics & Milestones
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700 dark:text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Foundational Data Layout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Time Complexity Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Memory Allocation & Pointers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    <span>Edge Cases & Boundary Conditions</span>
                  </div>
                </div>
              </div>

              {/* Related Tags */}
              <div className="space-y-1 pt-1">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-neutral-500">Related Concepts:</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalConcept.relatedConcepts.map((tag, idx) => (
                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-neutral-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button 
                  onClick={() => setActiveModalConcept(null)}
                  className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Master AI</span>
                </button>
                
                <button 
                  onClick={() => setActiveModalConcept(null)}
                  className="py-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                  <span>Practice Code</span>
                </button>

                <button 
                  onClick={() => setActiveModalConcept(null)}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Take Quiz</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
