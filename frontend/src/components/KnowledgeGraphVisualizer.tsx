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
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal Knowledge Graph</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic AI-maintained topology of your mastered concepts, partial knowledge, and weak spots.
          </p>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'DSA', 'Algorithms', 'Operating Systems', 'DBMS', 'System Design'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas + Legend Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Visual Graph Box */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl relative min-h-[400px] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Node Connection Topography
            </span>
            <span className="text-[11px] text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Live Synchronized
            </span>
          </div>

          {/* Node Canvas Representation */}
          <div className="my-8 grid grid-cols-2 sm:grid-cols-3 gap-4 relative z-10">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="glass-panel p-4 rounded-xl glass-card-hover border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    node.status === 'Mastered'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : node.status === 'Learning'
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {node.status}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {node.masteryScore}%
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                  {node.name}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Subject: {node.subject}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      node.masteryScore > 80 ? 'bg-emerald-500' : node.masteryScore > 50 ? 'bg-blue-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${node.masteryScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-3">
            <span>Graph Nodes: {filteredNodes.length}</span>
            <span>Mastery Velocity: +14% this week</span>
          </div>
        </div>

        {/* Stats & Weak Topic Action Box */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Mastery Gap Recommendations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ExamAce AI & QuizMaster AI identified 2 critical weak topics requiring immediate spaced revision:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400">
                  <span>Dijkstra Algorithm</span>
                  <span>45% Score</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Priority Queue implementation & edge relaxation steps failed in recent quiz.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400">
                  <span>Process Synchronization</span>
                  <span>55% Score</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Deadlock condition handling needs revision.
                </p>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl agent-gradient-master text-white font-semibold text-xs shadow-md hover:opacity-90 transition-opacity">
              Launch AI Practice Session for Weak Topics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
