import React, { useState } from 'react';
import { Swords, Bot, Sparkles, Play } from 'lucide-react';

interface DebateTurn {
  id: string;
  agentName: string;
  agentRole: 'PRO' | 'CON';
  text: string;
  avatarColor: string;
}

export const AIDebateMode: React.FC = () => {
  const [topic, setTopic] = useState('Monolithic Architecture vs Microservices Architecture in Modern Cloud Systems');
  const [isDebating, setIsDebating] = useState(false);
  const [debateLog, setDebateLog] = useState<DebateTurn[]>([
    {
      id: '1',
      agentName: 'ConceptClear AI (Pro Architecture)',
      agentRole: 'PRO',
      text: 'Microservices provide high scalability, independent deployments, and fault isolation. Each domain service can be updated without risking the entire ecosystem.',
      avatarColor: 'bg-purple-600 text-white'
    },
    {
      id: '2',
      agentName: 'ExamAce AI (Con & Real-World Constraints)',
      agentRole: 'CON',
      text: 'However, microservices introduce severe network latency overhead, complex distributed transaction handling (Saga pattern required), and operational complexity for small engineering teams.',
      avatarColor: 'bg-amber-600 text-white'
    }
  ]);

  const handleStartDebate = () => {
    if (!topic.trim()) return;
    setIsDebating(true);

    setTimeout(() => {
      const turn1: DebateTurn = {
        id: Date.now().toString(),
        agentName: 'ConceptClear AI (Pro stance)',
        agentRole: 'PRO',
        text: `Regarding "${topic}": From a modular design perspective, isolating state and functionality allows teams to innovate faster and utilize different technology stacks per microservice.`,
        avatarColor: 'bg-purple-600 text-white'
      };

      const turn2: DebateTurn = {
        id: (Date.now() + 1).toString(),
        agentName: 'ExamAce AI (Critique & Counter)',
        agentRole: 'CON',
        text: `Counter-argument: For initial product phase, premature microservice decomposition causes distributed debugging nightmares and high AWS/GCP infrastructure costs compared to a well-structured modular monolith.`,
        avatarColor: 'bg-amber-600 text-white'
      };

      setDebateLog((prev) => [...prev, turn1, turn2]);
      setIsDebating(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              AI Multi-Agent Debate Arena
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Watch two specialized AI agents debate two opposing viewpoints (Pro vs Con) to build deep multi-perspective understanding.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #8: AI Debate Mode
        </span>
      </div>

      {/* Debate Topic Form */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
        <label className="text-xs font-extrabold text-slate-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Enter Debate Topic or Dilemma</span>
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. SQL vs NoSQL, Synchronous vs Asynchronous APIs..."
            className="flex-1 bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
          <button
            onClick={handleStartDebate}
            disabled={isDebating || !topic.trim()}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isDebating ? 'Debating...' : 'Trigger AI Debate'}</span>
          </button>
        </div>
      </div>

      {/* Debate Stream Feed */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {debateLog.map((turn) => (
          <div
            key={turn.id}
            className={`p-5 rounded-3xl border ${
              turn.agentRole === 'PRO'
                ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60 ml-0 sm:mr-12'
                : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 sm:ml-12 mr-0'
            } space-y-2 shadow-xs transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${turn.avatarColor}`}>
                  <Bot className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-neutral-100">
                  {turn.agentName}
                </span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                turn.agentRole === 'PRO' ? 'bg-purple-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {turn.agentRole} Stance
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-300 font-medium leading-relaxed">
              {turn.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
