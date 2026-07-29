import React, { useState } from 'react';
import { 
  Network, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Brain, 
  Target,
  BookOpen,
  Compass
} from 'lucide-react';

interface ConceptNode {
  id: string;
  name: string;
  subject: 'DSA' | 'Algorithms' | 'Operating Systems' | 'DBMS' | 'System Design';
  masteryScore: number; // 0 to 100
  status: 'Mastered' | 'Learning' | 'Needs Review';
  lastPracticed: string;
  nextRevision: string;
  relatedConcepts: string[];
  description: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export const KnowledgeGraphVisualizer: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
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
  const filteredNodes = selectedSubject === 'All' 
    ? allConceptNodes 
    : allConceptNodes.filter((node) => node.subject === selectedSubject);

  const totalCount = allConceptNodes.length;
  const masteredCount = allConceptNodes.filter(n => n.status === 'Mastered').length;
  const learningCount = allConceptNodes.filter(n => n.status === 'Learning').length;
  const reviewCount = allConceptNodes.filter(n => n.status === 'Needs Review').length;
  const overallMasteryAvg = Math.round(
    allConceptNodes.reduce((acc, curr) => acc + curr.masteryScore, 0) / totalCount
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

      {/* 🌟 Weekly Insight + Suggested Focus Topics Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/10 via-purple-600/10 to-indigo-600/10 border border-purple-500/20 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Weekly Insight */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Weekly Learning Insight</span>
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            High Retention in DSA (92%), Memory Decay in OS Deadlocks & Dijkstra
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
            Your SM-2 memory curve shows strong long-term consolidation for <strong>Arrays, Hash Tables, and SQL Optimization</strong>. However, <strong>Process Synchronization</strong> and <strong>Dijkstra Priority Queue Relaxation</strong> show early memory decay due to missing active recall sessions over the last 5 days.
          </p>
        </div>

        {/* Right Column: Suggested Focus Topics */}
        <div className="md:col-span-5 bg-white/80 dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-600" /> Suggested Focus Topics
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              SM-2 Priority
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              { name: 'Dijkstra Algorithm', subject: 'Algorithms', score: 45, status: 'Overdue!' },
              { name: 'Deadlocks & Coffman Conditions', subject: 'Operating Systems', score: 48, status: 'Overdue!' },
              { name: 'Process Synchronization', subject: 'Operating Systems', score: 55, status: 'Due Today' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-neutral-950 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-slate-800 dark:text-neutral-200 font-bold">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-slate-400">{item.score}%</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Summary Stats Bar (5 Cards) */}
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

      {/* Grid of Concept Cards displaying Last Practiced, Next Revision, Related Concepts & Strength */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            onClick={() => setActiveModalConcept(node)}
            className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-xs hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  {node.subject}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  node.status === 'Mastered'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : node.status === 'Learning'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}>
                  {node.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-neutral-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {node.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
              </div>

              {/* Related Concepts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider block">
                  Related Concepts
                </span>
                <div className="flex flex-wrap gap-1">
                  {node.relatedConcepts.map((rel, idx) => (
                    <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300">
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Parameters: Strength %, Last Practiced, Next Revision */}
            <div className="border-t border-slate-100 dark:border-neutral-800 pt-3 space-y-2">
              {/* Strength Mastery Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Concept Strength</span>
                  <span className="font-mono text-purple-600 dark:text-purple-400">{node.masteryScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      node.masteryScore >= 80 ? 'bg-emerald-500' : node.masteryScore >= 60 ? 'bg-purple-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${node.masteryScore}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-neutral-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Practiced: <strong>{node.lastPracticed}</strong></span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                  <Calendar className="w-3 h-3" />
                  <span>Revision: <strong>{node.nextRevision}</strong></span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Concept Deep-Dive Detail Modal */}
      {activeModalConcept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {activeModalConcept.subject}
              </span>
              <button
                onClick={() => setActiveModalConcept(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeModalConcept.name}</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">{activeModalConcept.description}</p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800">
                <span className="text-slate-400">Mastery Strength</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">{activeModalConcept.masteryScore}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-neutral-800">
                <span className="text-slate-400">Last Practiced</span>
                <span className="font-semibold text-slate-800 dark:text-neutral-200">{activeModalConcept.lastPracticed}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Next Revision Due</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{activeModalConcept.nextRevision}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveModalConcept(null);
                window.dispatchEvent(new CustomEvent('send-master-ai-prompt', { 
                  detail: `Explain ${activeModalConcept.name} in detail with code examples and active recall questions.` 
                }));
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2"
            >
              Ask Master AI for Deep Dive Explanation
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
