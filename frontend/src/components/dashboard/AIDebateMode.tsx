import React, { useState } from 'react';
import { Swords, Bot, Sparkles, Play, Award, CheckSquare, BookmarkCheck, ShieldCheck } from 'lucide-react';

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
  const [hasCompletedDebate, setHasCompletedDebate] = useState(true);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

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
    setHasCompletedDebate(false);
    setSavedStatus(false);

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
      setHasCompletedDebate(true);
    }, 1500);
  };

  const handleSaveToKnowledgeGraph = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleGenerateQuizFromDebate = () => {
    window.dispatchEvent(new CustomEvent('send-master-ai-prompt', { 
      detail: `Generate a 5-question MCQ Quiz based on the debate: ${topic}` 
    }));
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
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Watch two specialized AI agents debate opposing viewpoints (Pro vs Con) to build deep multi-perspective understanding.
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
        
        <div className="flex flex-col sm:flex-row gap-2">
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
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isDebating ? 'Debating Arguments...' : 'Trigger AI Debate'}</span>
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

      {/* 🏆 Post-Debate Analysis & Action Controls (AI Judgment, Key Takeaways, Action Buttons) */}
      {hasCompletedDebate && (
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-purple-500/30 space-y-6 shadow-md animate-in fade-in duration-300">
          
          {/* AI Judgment Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0 shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                  AI Master Verdict & Judgment
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Balanced Architecture: Modular Monolith ➔ Microservices Strategy
                </h4>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/20 shrink-0">
              PRO & CON Synthesized
            </span>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 dark:text-neutral-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500" /> Key Takeaways for Student Learning
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <strong className="text-purple-600 dark:text-purple-400 font-bold block mb-1">1. Pro Takeaway</strong>
                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
                  Microservices grant velocity to large engineering organizations by decoupling deployment pipelines and database schemas.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-1">
                <strong className="text-amber-600 dark:text-amber-400 font-bold block mb-1">2. Con Takeaway</strong>
                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
                  Microservices add high distributed operational overhead, network latency, and Saga transaction complexity for early startups.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Generate Quiz + Save to Knowledge Graph */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              onClick={handleSaveToKnowledgeGraph}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 hover:border-purple-500 text-slate-800 dark:text-neutral-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookmarkCheck className={`w-4 h-4 ${savedStatus ? 'text-emerald-500' : 'text-purple-500'}`} />
              <span>{savedStatus ? 'Saved to Knowledge Graph! ✓' : 'Save to Knowledge Graph'}</span>
            </button>

            <button
              onClick={handleGenerateQuizFromDebate}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Generate Quiz from Debate</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
