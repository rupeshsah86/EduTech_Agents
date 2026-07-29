import React, { useState } from 'react';
import { UserCheck, AlertTriangle, Cpu, Calendar, Clock, Award, Sparkles, Check } from 'lucide-react';

export const AIStudyTwin: React.FC = () => {
  const [showPlan, setShowPlan] = useState<boolean>(false);

  const twinProfile = {
    predictedMastery: 88.5,
    personalityProfile: 'Socratic Visual Learner • Night Owl Focus • High Analytical Speed',
    bestStudyTime: '9:00 PM – 1:00 AM (Peak Retention Rate 94%)',
    learningVelocity: 'Optimal Fast (3.4 concepts/day)',
    preferredFormat: 'Socratic Code + Visual Tree Diagrams',
    retentionRate: '91% Memory Recall (SM-2 Tracked)',
  };

  const autoDetectedGaps = [
    { title: 'Dijkstra Priority Queue Relaxation', risk: 'High Risk for Exams', subject: 'Algorithms', gapReason: 'Selected array scan instead of min-heap implementation in 2 quiz attempts.' },
    { title: 'Deadlock Circular Wait Conditions', risk: 'Medium Risk', subject: 'Operating Systems', gapReason: 'Mistook Hold & Wait for Circular Wait invariant.' },
    { title: 'PostgreSQL Indexing (B-Tree vs Hash)', risk: 'Low Risk', subject: 'DBMS', gapReason: 'Unclear when Hash index is preferred over B-Tree index.' },
  ];

  const sevenDayPlan = [
    { day: 'Day 1 (Mon)', focus: 'Dijkstra & Priority Queues', task: 'Review Min-Heap relaxation and solve 3 LeetCode Medium graph problems.', time: '9:00 PM - 10:30 PM' },
    { day: 'Day 2 (Tue)', focus: 'Process Synchronization & Semaphores', task: 'Master Peterson algorithm proofs and Peterson vs Test-and-Set locks.', time: '9:00 PM - 10:30 PM' },
    { day: 'Day 3 (Wed)', focus: 'Deadlocks & Banker Algorithm', task: 'Solve 4 GATE PYQs on Coffman conditions & resource allocation graphs.', time: '9:00 PM - 10:30 PM' },
    { day: 'Day 4 (Thu)', focus: 'B-Trees & PostgreSQL Indexing', task: 'Compare B-Tree vs HNSW vector search indexing in pgvector.', time: '9:00 PM - 10:30 PM' },
    { day: 'Day 5 (Fri)', focus: 'Dynamic Programming Top-Down', task: 'Practice Memoization vs Tabulation for 0/1 Knapsack & LCS.', time: '9:00 PM - 10:30 PM' },
    { day: 'Day 6 (Sat)', focus: 'System Design Load Balancing', task: 'Study Consistent Hashing & Layer-4 vs Layer-7 load balancing.', time: '9:00 PM - 10:30 PM' },
    { day: 'Day 7 (Sun)', focus: 'Full Mock Assessment & SM-2 Review', task: 'Take 10-min Exam Simulator test & consolidate flashcard memory.', time: '9:00 PM - 10:30 PM' },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              AI Digital Study Twin & Predictive Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Predictive AI model of your learning patterns, memory retention curves, and auto-detected knowledge gaps.
          </p>
        </div>

        <button
          onClick={() => setShowPlan(!showPlan)}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 cursor-pointer w-fit"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{showPlan ? 'Hide 7-Day Plan' : 'Generate 7-Day Personalized Plan'}</span>
        </button>
      </div>

      {/* 🌟 4 Key Metrics Bar: Predicted Mastery %, Personality Profile, Best Study Time, Velocity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Predicted Exam Mastery */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/10 via-purple-600/10 to-indigo-600/10 border border-purple-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-500" /> Predicted Exam Mastery
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300">
              GATE & Placement
            </span>
          </div>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {twinProfile.predictedMastery}%
          </p>
          <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-medium">
            Based on your current 12-day streak and SM-2 memory curve, your Twin predicts an A+ grade in Computer Science core exams.
          </p>
        </div>

        {/* 2. Learning Personality Profile */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-500" /> Learning Personality
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Profile Matched
            </span>
          </div>
          <p className="text-xs font-extrabold text-slate-800 dark:text-neutral-100 leading-relaxed">
            {twinProfile.personalityProfile}
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">
            Master AI auto-formats code blocks & visual tree diagrams because your Twin learns 3x faster with visual analogies.
          </p>
        </div>

        {/* 3. Best Study Time Recommendation */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Best Study Time
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Peak Focus
            </span>
          </div>
          <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 leading-relaxed font-mono">
            {twinProfile.bestStudyTime}
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">
            Historical analytics show your quiz accuracy jumps to 94% when studying during late evening hours.
          </p>
        </div>
      </div>

      {/* 🗓️ 7-Day Personalized Action Plan Modal/Drawer */}
      {showPlan && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 dark:bg-neutral-900 border border-purple-500/30 space-y-5 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Generated 7-Day Personalized Study Plan
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Customized for Your Knowledge Gaps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
            {sevenDayPlan.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-2 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-1.5 mb-2">
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">{item.day}</span>
                    <span className="text-[9px] font-mono text-slate-400">{item.time}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-neutral-100 leading-snug">{item.focus}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">{item.task}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pt-2">
                  <Check className="w-3 h-3" />
                  <span>Scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
