import React, { useState } from 'react';
import { Network, AlertTriangle, Layers } from 'lucide-react';

interface ConceptNode {
  id: string;
  name: string;
  subject: string;
  masteryScore: number; // 0 to 100
  status: 'Mastered' | 'Learning' | 'Needs Review';
  connectedNodes: string[];
}

export const KnowledgeGraphVisualizer: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const nodes: ConceptNode[] = [
    { id: '1', name: 'Binary Search Trees', subject: 'DSA', masteryScore: 92, status: 'Mastered', connectedNodes: ['AVL Trees', 'Heaps'] },
    { id: '2', name: 'AVL Trees', subject: 'DSA', masteryScore: 78, status: 'Learning', connectedNodes: ['Binary Search Trees', 'Red-Black Trees'] },
    { id: '3', name: 'Dijkstra Algorithm', subject: 'Algorithms', masteryScore: 45, status: 'Needs Review', connectedNodes: ['Graph Representation', 'Priority Queues'] },
    { id: '4', name: 'Virtual Memory', subject: 'Operating Systems', masteryScore: 88, status: 'Mastered', connectedNodes: ['Paging', 'TLB Cache'] },
    { id: '5', name: 'Process Synchronization', subject: 'Operating Systems', masteryScore: 55, status: 'Needs Review', connectedNodes: ['Semaphores', 'Mutex Locks'] },
    { id: '6', name: 'B-Trees & Indexing', subject: 'DBMS', masteryScore: 85, status: 'Mastered', connectedNodes: ['SQL Optimization'] },
    { id: '7', name: 'System Design Scaling', subject: 'System Design', masteryScore: 68, status: 'Learning', connectedNodes: ['Load Balancing', 'Caching'] },
  ];

  const filteredNodes = selectedSubject === 'All' 
    ? nodes 
    : nodes.filter(n => n.subject === selectedSubject);

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">Personal Knowledge Graph</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Dynamic AI-maintained topology of your mastered concepts, partial knowledge, and weak spots.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'DSA', 'Algorithms', 'Operating Systems', 'DBMS', 'System Design'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-slate-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-slate-900 dark:border-neutral-100 shadow-xs'
                  : 'bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative min-h-[400px] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Node Connection Topography
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Live Synchronized
            </span>
          </div>

          <div className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="glass-panel p-4 rounded-xl glass-card-hover border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    node.status === 'Mastered'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : node.status === 'Learning'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {node.status}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                    {node.masteryScore}%
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-neutral-100 leading-tight">
                  {node.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1">
                  Subject: {node.subject}
                </p>

                <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      node.masteryScore > 80 ? 'bg-emerald-500' : node.masteryScore > 50 ? 'bg-purple-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${node.masteryScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 border-t border-slate-200 dark:border-neutral-800 pt-3 font-medium">
            <span>Graph Nodes: {filteredNodes.length}</span>
            <span>Mastery Velocity: +14% this week</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-neutral-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Mastery Gap Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              ExamAce AI & QuizMaster AI identified 2 critical weak topics requiring immediate spaced revision:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
                  <span>Dijkstra Algorithm</span>
                  <span>45% Score</span>
                </div>
                <p className="text-slate-600 dark:text-neutral-400 text-[11px]">
                  Priority Queue implementation & edge relaxation steps failed in recent quiz.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
                  <span>Process Synchronization</span>
                  <span>55% Score</span>
                </div>
                <p className="text-slate-600 dark:text-neutral-400 text-[11px]">
                  Deadlock condition handling needs revision.
                </p>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer">
              Launch AI Practice Session for Weak Topics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
