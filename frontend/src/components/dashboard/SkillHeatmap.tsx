import React from 'react';
import { Flame, TrendingUp, Target, Award, Zap } from 'lucide-react';

export const SkillHeatmap: React.FC = () => {
  const subjects = [
    { name: 'Data Structures', level: 88, status: 'Strong', color: 'bg-emerald-500' },
    { name: 'Algorithms', level: 62, status: 'Moderate', color: 'bg-blue-500' },
    { name: 'Operating Systems', level: 75, status: 'Strong', color: 'bg-emerald-500' },
    { name: 'Database Systems', level: 91, status: 'Expert', color: 'bg-indigo-500' },
    { name: 'Computer Networks', level: 48, status: 'Needs Focus', color: 'bg-amber-500' },
    { name: 'System Design', level: 56, status: 'Needs Focus', color: 'bg-amber-500' },
  ];

  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    intensity: (i % 5 === 0 ? 0 : (i % 3 === 0 ? 3 : (i % 2 === 0 ? 2 : 1)))
  }));

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Skill Heatmap & Learning Velocity</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time skill proficiency tracking and practice consistency heatmap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Current Streak</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">12 Days</h3>
            <p className="text-[11px] text-emerald-500 font-medium">Top 5% consistency</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Learning Velocity</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">3.4 Concepts/Day</h3>
            <p className="text-[11px] text-indigo-400 font-medium">+18% vs last week</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Overall Mastery</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">74%</h3>
            <p className="text-[11px] text-slate-400">Targeting 85% by finals</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" /> 28-Day Learning Activity Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Shadings represent depth of agent interactions, quiz attempts, and code sandbox executions.
          </p>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {days.map((d) => (
              <div
                key={d.day}
                className={`h-10 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition-transform hover:scale-105 ${
                  d.intensity === 3
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : d.intensity === 2
                    ? 'bg-indigo-500/60 text-white'
                    : d.intensity === 1
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
                title={`Day ${d.day}: Level ${d.intensity}`}
              >
                Day {d.day}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Less Active</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-800" />
              <span className="w-3 h-3 rounded bg-indigo-500/20" />
              <span className="w-3 h-3 rounded bg-indigo-500/60" />
              <span className="w-3 h-3 rounded bg-indigo-600" />
            </div>
            <span>Highly Active</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" /> Subject Proficiency Matrix
          </h3>

          <div className="space-y-4 pt-1">
            {subjects.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{sub.status}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{sub.level}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${sub.color}`}
                    style={{ width: `${sub.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
