import React from 'react';
import { BrainCircuit, Network, Repeat, Code2, FileText, Briefcase } from 'lucide-react';

export const Features: React.FC = () => {
  const uniqueFeatures = [
    { title: "AI Learning Memory", desc: "Long-term persistent recall of your learning style, velocity, and past mistakes.", icon: BrainCircuit },
    { title: "Personal Knowledge Graph", desc: "Interactive queryable map of your mastered, learning, and weak concepts.", icon: Network },
    { title: "Smart Revision Engine", desc: "Automated SM-2 spaced-repetition scheduling for flashcards and quizzes.", icon: Repeat },
    { title: "AI Coding Sandbox", desc: "Integrated multi-language coding tutor with Time & Space complexity analysis.", icon: Code2 },
    { title: "Multi-Document Reasoning", desc: "Upload multiple textbooks or PDF papers for cross-document query RAG.", icon: FileText },
    { title: "AI Resume ATS Scanner", desc: "Actionable ATS optimization and mock technical interview simulator.", icon: Briefcase }
  ];

  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Unrivaled EdTech Capabilities
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Unique Features That Set Us Apart
        </h3>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueFeatures.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-800/80 glass-card-hover">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm mb-3">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">{f.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
