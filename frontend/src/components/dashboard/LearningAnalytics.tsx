import React from 'react';
import { BarChart3, Award, Sparkles, Brain, Target, BookOpen, Clock } from 'lucide-react';
import { SM2FlashcardViewer } from './SM2FlashcardViewer';

export const LearningAnalytics: React.FC = () => {
  return (
    <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto bg-slate-50/50 dark:bg-[#0A0A0A] min-h-screen text-left font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-neutral-100 tracking-tight">
              AI Learning Analytics & Productivity Score
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Real-time telemetry tracking your study velocity, memory retention, and topic mastery across all 9 AI agents.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold w-fit">
          Unique Feature #4: Real-time Telemetry
        </span>
      </div>

      {/* 💡 Purpose Explanatory Hero Guide Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-transparent border border-purple-500/20 text-xs space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-black text-sm">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>What is the purpose of this page?</span>
        </div>
        <p className="text-slate-700 dark:text-neutral-300 leading-relaxed font-medium">
          This dashboard calculates your **Productivity Index** and **SuperMemo-2 (SM-2) Spaced Repetition Memory Score** automatically as you interact with Master AI, solve doubts, take adaptive quizzes, and practice coding. It ensures you review difficult concepts right before your brain forgets them!
        </p>
      </div>

      {/* 📊 4 Key Metrics Bar with Explicit Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Metric 1: Productivity Index */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-2 shadow-xs relative group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Productivity Index
            </span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            94.2
          </h3>
          <p className="text-[11px] text-emerald-500 font-bold">Top 2% student cohort</p>
          <div className="pt-1 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 font-medium">
            Combined score from quiz accuracy & study consistency.
          </div>
        </div>

        {/* Metric 2: Mastered Concepts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Mastered Concepts
            </span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            42 / 56
          </h3>
          <p className="text-[11px] text-purple-500 font-bold">75% total syllabus completed</p>
          <div className="pt-1 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 font-medium">
            Topics where you scored 85%+ in AI reviews.
          </div>
        </div>

        {/* Metric 3: SM-2 Recall */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              SM-2 Flashcard Recall
            </span>
            <Brain className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="text-3xl font-black text-emerald-500 font-mono">
            91.8%
          </h3>
          <p className="text-[11px] text-slate-400 font-bold">High memory retention score</p>
          <div className="pt-1 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 font-medium">
            Long-term retention via spaced repetition spacing.
          </div>
        </div>

        {/* Metric 4: AI Study Hours */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              AI Study Hours
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            28.5 hrs
          </h3>
          <p className="text-[11px] text-slate-400 font-bold">This month</p>
          <div className="pt-1 border-t border-slate-100 dark:border-neutral-800 text-[10px] text-slate-400 font-medium">
            Active time spent solving doubts with AI agents.
          </div>
        </div>

      </div>

      {/* 🧠 SM-2 Spaced Repetition Flashcard Engine */}
      <SM2FlashcardViewer />

      {/* 🏆 Achievement Badges & Streaks */}
      <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Achievement Badges & Unlocked Mastery Badges
          </h3>
          <span className="text-xs text-purple-600 dark:text-purple-400 font-extrabold">
            4 Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center space-y-1.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg shadow-xs">
              🔥
            </div>
            <h4 className="font-black text-xs text-slate-900 dark:text-neutral-100">Consistency King</h4>
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">7+ day active study streak</p>
          </div>

          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 text-center space-y-1.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-lg shadow-xs">
              🧠
            </div>
            <h4 className="font-black text-xs text-slate-900 dark:text-neutral-100">DSA Master</h4>
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">90%+ score in Data Structures</p>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-1.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-lg shadow-xs">
              ⚡
            </div>
            <h4 className="font-black text-xs text-slate-900 dark:text-neutral-100">Quiz Whiz</h4>
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">Completed 15 adaptive quizzes</p>
          </div>

          <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 text-center space-y-1.5 hover:scale-[1.02] transition-transform">
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-lg shadow-xs">
              📚
            </div>
            <h4 className="font-black text-xs text-slate-900 dark:text-neutral-100">PDF Scholar</h4>
            <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">Parsed 50+ textbook pages</p>
          </div>

        </div>
      </div>

    </div>
  );
};
