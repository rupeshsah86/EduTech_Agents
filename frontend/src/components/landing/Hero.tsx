import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning }) => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-float">
        <Sparkles className="w-4 h-4" />
        <span>Enterprise AI-Powered Smart Learning Ecosystem</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-5xl mx-auto">
        One Intelligent Learning Platform Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Multiple AI Agents</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
        Converse with a single <strong className="text-indigo-600 dark:text-indigo-400">Master AI Assistant</strong> that dynamically orchestrates nine specialized neural agents behind the scenes — from PYQ exam roadmaps and DSA debugging to multi-PDF reasoning and ATS resume optimization.
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStartLearning}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl agent-gradient-master text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
        >
          <span>Start Learning Free</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <a
          href="#how-it-works"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all text-center"
        >
          See How It Works
        </a>
      </div>

      {/* Social Proof Stats */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">9 Specialized</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Neural AI Agents</p>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">1 Master</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unified Assistant Interface</p>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">SM-2 Spaced</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Repetition Memory</p>
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-500">100% Personal</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Knowledge Graph Topology</p>
        </div>
      </div>
    </section>
  );
};
