import React from 'react';
import { UserCheck, AlertTriangle, TrendingUp, Cpu, CheckCircle2 } from 'lucide-react';

export const AIStudyTwin: React.FC = () => {
  const learningStyle = {
    pace: 'Optimal Fast (3.4 concepts/day)',
    preferredFormat: 'Socratic Code + Visual Analogies',
    retentionRate: '88% Active Memory',
    weakestArea: 'Graph Algorithms & Process Deadlocks',
    strongestArea: 'SQL Optimization & Array Manipulation'
  };

  const autoDetectedGaps = [
    { title: 'Dijkstra Priority Queue Relaxation', risk: 'High Risk for Exams', subject: 'Algorithms', gapReason: 'Selected array scan instead of min-heap implementation in 2 quiz attempts.' },
    { title: 'Deadlock Circular Wait Conditions', risk: 'Medium Risk', subject: 'Operating Systems', gapReason: 'Mistook Hold & Wait for Circular Wait invariant.' },
    { title: 'PostgreSQL Indexing (B-Tree vs Hash)', risk: 'Low Risk', subject: 'DBMS', gapReason: 'Unclear when Hash index is preferred over B-Tree index.' },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              AI Digital Study Twin & Gap Detection
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Predictive AI model of your learning patterns, memory retention curves, and auto-detected knowledge gaps.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #6 & #12: AI Study Twin
        </span>
      </div>

      {/* Digital Twin Profile Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">Learning Velocity</h3>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">{learningStyle.pace}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
            Your Digital Twin predicts you will achieve <strong className="text-emerald-500">86% mastery</strong> in Computer Science before final exams based on your current 12-day streak.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">Explanation Style</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">{learningStyle.preferredFormat}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
            Master AI automatically formats answers into step-by-step code blocks and visual tree diagrams because your Digital Twin learns fastest with code examples.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-neutral-100">Active Retention</h3>
              <p className="text-[11px] text-amber-500 font-bold">{learningStyle.retentionRate}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
            SM-2 Memory Engine schedules flashcard reviews every 3 days to keep your active recall curve above the 85% memory threshold.
          </p>
        </div>
      </div>

      {/* Auto-Detected Knowledge Gaps Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-neutral-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Auto-Detected Knowledge Gaps</span>
          </h3>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            3 Gaps Discovered Automatically
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-neutral-400">
          Master AI continuously scans your quiz responses and chat conversations to discover missing concepts even if you didn't explicitly ask about them:
        </p>

        <div className="space-y-3 pt-2">
          {autoDetectedGaps.map((gap, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-neutral-100">{gap.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {gap.subject}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400">{gap.gapReason}</p>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 w-fit ${
                gap.risk.includes('High') ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}>
                {gap.risk}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
