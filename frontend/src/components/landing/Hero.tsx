import React, { useState } from 'react';
import { ArrowRight, Play, Sparkles, X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import robotAvatar from '../../assets/robot_avatar.png';

interface HeroProps {
  onStartLearning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto font-sans relative">
      {/* Background Soft Purple Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Headlines & 2 Primary Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 space-y-8 text-left"
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Autonomous Multi-Agent AI Platform</span>
          </div>

          {/* Strong, Clear Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Master Any Subject with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600">
              Autonomous AI Tutors
            </span>
          </h1>

          {/* Short & Powerful Subheadline */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 font-normal leading-relaxed max-w-xl">
            EduVerse AI orchestrates 9 specialized intelligence agents under one Master AI Assistant to simplify study sessions, answer complex doubts, and build adaptive learning paths.
          </p>

          {/* EXACTLY TWO Main Buttons: "Start Learning Free" & "Watch Demo" */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartLearning}
              className="px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:shadow-purple-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowDemoModal(true)}
              className="px-7 py-3.5 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-800 bg-white/80 dark:bg-neutral-900/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-slate-800 dark:text-neutral-200 font-semibold text-sm transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-neutral-800/80 flex items-center gap-6 text-xs text-slate-500 dark:text-neutral-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Instant AI Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Zero Setup Required</span>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Clean Interactive AI Preview Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 shadow-xl space-y-5 relative overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-neutral-700" />
              </div>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-md font-semibold">
                Master AI Assistant • Online
              </span>
            </div>

            {/* Simulated Prompt & Agent Orchestration Response */}
            <div className="space-y-3.5 text-left">
              {/* User Prompt Bubble */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-neutral-800/80 text-xs text-slate-800 dark:text-neutral-200">
                <p className="font-medium">"I have an exam on Neural Networks tomorrow. Can you generate notes and a quick quiz?"</p>
              </div>

              {/* Master AI Dispatch Box */}
              <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Orchestrating 3 Agents</span>
                  </div>
                  <span className="text-[10px] bg-purple-200/60 dark:bg-purple-900/80 px-2 py-0.5 rounded text-purple-800 dark:text-purple-200 font-mono">
                    0.2s response
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-purple-100 dark:border-purple-900/50 text-center font-medium text-slate-700 dark:text-neutral-300">
                    NoteCraft AI
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-purple-100 dark:border-purple-900/50 text-center font-medium text-slate-700 dark:text-neutral-300">
                    QuizMaster AI
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-purple-100 dark:border-purple-900/50 text-center font-medium text-slate-700 dark:text-neutral-300">
                    ConceptClear AI
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed pt-1">
                  "Generated 4-page Markdown summary and an adaptive 5-question MCQ test with step-by-step explanations."
                </p>
              </div>

              {/* Bot Avatar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
                  <img src={robotAvatar} alt="EduVerse Avatar" className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 p-1" />
                  <span className="font-medium">Master AI Engine v2.6</span>
                </div>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold cursor-pointer hover:underline" onClick={onStartLearning}>
                  Try it now →
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Video Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">EduVerse AI — Platform Demo Walkthrough</h3>
                </div>
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500 dark:text-neutral-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Demo Video Mock / Interactive Canvas */}
              <div className="aspect-video bg-neutral-950 rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-600/80 flex items-center justify-center text-white shadow-lg shadow-purple-600/50 animate-pulse">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg">Watch how 9 AI Agents solve student tasks in seconds</h4>
                  <p className="text-xs text-neutral-400 max-w-md">
                    From uploading 100-page lecture PDFs to generating adaptive flashcards and step-by-step doubt resolution.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    onStartLearning();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Launch App Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

