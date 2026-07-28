import React from 'react';
import { 
  X, 
  Cpu, 
  BrainCircuit, 
  Network, 
  Clock 
} from 'lucide-react';

interface OrchestrationPanelProps {
  onClose: () => void;
}

export const OrchestrationPanel: React.FC<OrchestrationPanelProps> = ({ onClose }) => {
  const agentStatuses = [
    { name: 'Master AI Router', status: 'Active', latency: '42ms', load: '12%' },
    { name: 'ExamAce AI', status: 'Idle', latency: '65ms', load: '4%' },
    { name: 'AssignMate AI', status: 'Idle', latency: '58ms', load: '2%' },
    { name: 'ConceptClear AI', status: 'Active', latency: '38ms', load: '18%' },
    { name: 'NoteCraft AI', status: 'Idle', latency: '44ms', load: '5%' },
    { name: 'QuizMaster AI', status: 'Active', latency: '51ms', load: '15%' },
    { name: 'StudyFlow AI', status: 'Idle', latency: '32ms', load: '3%' },
    { name: 'PDFTutor AI', status: 'Ready', latency: '82ms', load: '8%' },
    { name: 'CodeMentor AI', status: 'Active', latency: '49ms', load: '22%' },
    { name: 'CareerPath AI', status: 'Idle', latency: '61ms', load: '1%' },
  ];

  const flashcardsDue = [
    { topic: 'Dijkstra Priority Queue Relaxation', subject: 'DSA', interval: 'Review 3' },
    { topic: 'Process Synchronization Semaphores', subject: 'OS', interval: 'Review 2' },
    { topic: 'B-Tree Node Splitting Invariant', subject: 'DBMS', interval: 'Review 5' },
  ];

  return (
    <aside className="w-80 sm:w-96 border-l border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col h-full z-40 shadow-xl overflow-hidden font-sans select-none animate-in slide-in-from-right duration-200">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50 dark:bg-neutral-900">
        <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-neutral-100">
          <BrainCircuit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>AI Orchestration & Live Context</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 cursor-pointer"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        
        {/* Section 1: Live Neural Agent Telemetry */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-neutral-200">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Agent Network Telemetry</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              9/9 Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {agentStatuses.map((ag, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-neutral-900/80 border border-slate-200/80 dark:border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="truncate text-slate-900 dark:text-neutral-100">{ag.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${ag.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-neutral-600'}`} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-neutral-400">
                  <span>⚡ {ag.latency}</span>
                  <span>Load: {ag.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Knowledge Graph Live Context */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-neutral-900">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-neutral-200">
            <span className="flex items-center gap-1.5">
              <Network className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Knowledge Topology Context</span>
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
              +14% velocity
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-neutral-100">
              <span>Overall Concept Mastery</span>
              <span className="text-purple-600 dark:text-purple-400">74%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-1.5 rounded-full bg-purple-600" style={{ width: '74%' }} />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 pt-1">
              Top mastered: Binary Trees, Virtual Memory, B-Trees.
            </p>
          </div>
        </div>

        {/* Section 3: SM-2 Spaced Repetition Queue */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-neutral-900">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-neutral-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>SM-2 Flashcard Queue</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              3 Due Tonight
            </span>
          </div>

          <div className="space-y-2">
            {flashcardsDue.map((card, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-100/70 dark:bg-neutral-900/80 border border-slate-200/80 dark:border-neutral-800 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-neutral-100">
                  <span className="truncate">{card.topic}</span>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{card.subject}</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                  Schedule: {card.interval}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </aside>
  );
};
