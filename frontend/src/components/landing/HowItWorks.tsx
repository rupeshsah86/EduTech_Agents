import React from 'react';
import { MessageSquare, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Ask or Upload',
      description: 'Type any question, paste an assignment, or upload textbook PDFs and lecture slides directly.',
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800'
    },
    {
      step: '02',
      title: 'AI Agent Orchestration',
      description: 'Master AI dispatches domain-specialized agents (ExamAce, ConceptClear, NoteCraft, PDFTutor) in parallel.',
      icon: Cpu,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800'
    },
    {
      step: '03',
      title: 'Mastery & Retention',
      description: 'Receive instant step-by-step solutions, structured notes, adaptive MCQs, and personalized study schedules.',
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-neutral-800/80 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How EduVerse AI Works
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-400">
          No complex prompt engineering or switching tools. One input orchestrates nine specialized AI tutors.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-7 rounded-2xl bg-white dark:bg-neutral-900/60 border border-slate-200/80 dark:border-neutral-800 space-y-4 relative hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-sm hover:shadow-md text-left"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-slate-200 dark:text-neutral-800 font-mono">
                  {item.step}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

