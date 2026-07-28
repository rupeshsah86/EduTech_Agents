import React from 'react';
import { Flame, TrendingUp, Target, Zap, Award } from 'lucide-react';
import { PomodoroTimer } from './PomodoroTimer';
import { CodeMentorSandbox } from './CodeMentorSandbox';

export const SkillHeatmap: React.FC = () => {
  const subjects = [
    { name: 'Data Structures', level: 88, status: 'Strong', color: 'bg-emerald-500' },
    { name: 'Algorithms', level: 62, status: 'Moderate', color: 'bg-purple-600' },
    { name: 'Operating Systems', level: 75, status: 'Strong', color: 'bg-emerald-500' },
    { name: 'Database Systems', level: 91, status: 'Expert', color: 'bg-purple-600' },
    { name: 'Computer Networks', level: 48, status: 'Needs Focus', color: 'bg-amber-500' },
    { name: 'System Design', level: 56, status: 'Needs Focus', color: 'bg-amber-500' },
  ];

  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    intensity: (i % 5 === 0 ? 0 : (i % 3 === 0 ? 3 : (i % 2 === 0 ? 2 : 1)))
  }));

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-neutral-100 min-h-screen p-6 sm:p-8 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">Skill Heatmap & Learning Velocity</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Real-time skill proficiency tracking and practice consistency heatmap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-neutral-400 font-semibold uppercase">Current Streak</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-neutral-100">12 Days</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Top 5% consistency</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-neutral-400 font-semibold uppercase">Learning Velocity</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-neutral-100">3.4 Concepts/Day</h3>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">+18% vs last week</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-neutral-400 font-semibold uppercase">Overall Mastery</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-neutral-100">74%</h3>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400">Targeting 85% by finals</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-neutral-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 28-Day Learning Activity Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Shadings represent depth of agent interactions, quiz attempts, and code sandbox executions.
          </p>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {days.map((d) => (
              <div
                key={d.day}
                className={`h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-transform hover:scale-105 ${
                  d.intensity === 3
                    ? 'bg-purple-600 text-white shadow-xs'
                    : d.intensity === 2
                    ? 'bg-purple-500/60 text-white'
                    : d.intensity === 1
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500'
                }`}
                title={`Day ${d.day}: Level ${d.intensity}`}
              >
                Day {d.day}
              </div>
            ))}
          </div>
        </div>

        <PomodoroTimer />
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
        <h3 className="font-bold text-sm text-slate-900 dark:text-neutral-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" /> Subject Proficiency Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((sub, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-100/70 dark:bg-neutral-800/50 border border-slate-200/80 dark:border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-neutral-200">{sub.name}</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{sub.level}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${sub.color}`}
                  style={{ width: `${sub.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeMentorSandbox />
    </div>
  );
};
