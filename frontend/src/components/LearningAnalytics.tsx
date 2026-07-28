import React from 'react';
import { BarChart3, Award } from 'lucide-react';

export const LearningAnalytics: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 min-h-[calc(100vh-4rem)]">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Learning Analytics & Productivity Score</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive telemetry generated across Master AI interactions and agent sessions.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">Productivity Index</p>
          <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">94.2</h3>
          <span className="text-[11px] text-emerald-500 font-medium">Top 2% student cohort</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">Mastered Concepts</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">42 / 56</h3>
          <span className="text-[11px] text-indigo-400 font-medium">75% total syllabus</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">SM-2 Flashcard Recall</p>
          <h3 className="text-3xl font-extrabold text-emerald-500 mt-1">91.8%</h3>
          <span className="text-[11px] text-slate-400">High retention score</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase">AI Study Hours</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">28.5 hrs</h3>
          <span className="text-[11px] text-slate-400">This month</span>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Achievement Badges & Streaks
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
              🔥
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Consistency King</h4>
            <p className="text-[10px] text-slate-400">10+ day study streak</p>
          </div>

          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-lg">
              🧠
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">DSA Master</h4>
            <p className="text-[10px] text-slate-400">90%+ score in Data Structures</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Quiz Whiz</h4>
            <p className="text-[10px] text-slate-400">Completed 15 adaptive quizzes</p>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center space-y-1">
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-lg">
              📚
            </div>
            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">PDF Scholar</h4>
            <p className="text-[10px] text-slate-400">Parsed 50+ textbook pages</p>
          </div>
        </div>
      </div>
    </div>
  );
};
