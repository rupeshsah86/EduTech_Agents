import React from 'react';
import { MessageSquare, Cpu, GitMerge, Database } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Prompt Single Master AI',
      description: 'You type your goal — whether preparing for exams, analyzing PDFs, debugging DSA code, or building an ATS resume.',
      icon: MessageSquare,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      step: '02',
      title: 'Dynamic Intent & Agent Routing',
      description: 'Master AI classifies intent and constructs a multi-agent execution plan, selecting the exact agents required.',
      icon: Cpu,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    },
    {
      step: '03',
      title: 'Multi-Agent Collaboration',
      description: 'Selected agents (e.g. PDFTutor + QuizMaster + ConceptClear) execute in parallel and pass intermediate artifacts.',
      icon: GitMerge,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      step: '04',
      title: 'Synthesized Response & Memory Update',
      description: 'Master AI delivers a single unified response while updating your Knowledge Graph and SM-2 flashcard schedule.',
      icon: Database,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Seamless Multi-Agent Orchestration
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          How EduVerse AI Works
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Students never worry about choosing prompt formats or switching chatbots. One Master AI Assistant handles everything.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl space-y-4 relative glass-card-hover border border-slate-200 dark:border-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                  {item.step}
                </span>
              </div>

              <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
