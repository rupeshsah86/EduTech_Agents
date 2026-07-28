import React from 'react';
import { ArrowUpRight, Sparkles, Trophy, CheckCircle2, Play } from 'lucide-react';
import robotAvatar from '../../assets/robot_avatar.png';

interface HeroProps {
  onStartLearning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning }) => {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 max-w-7xl mx-auto font-sans">
      {/* Asymmetrical 2-Column Split Layout (LearnWise Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Editorial Headline & Dual CTAs */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen EdTech AI Ecosystem 2026</span>
          </div>

          {/* Bold Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] font-serif">
            Power your entire student journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 font-sans">one AI platform</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-300 font-medium leading-relaxed max-w-xl">
            The single AI layer built for higher education and competitive learning that works across every student touchpoint — orchestrating nine specialized AI agents behind one Master AI Assistant.
          </p>

          {/* Dual Pill CTA Buttons (LearnWise Style) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartLearning}
              className="px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-400/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Try it now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="px-7 py-3.5 rounded-full border border-slate-900 dark:border-white/30 text-slate-900 dark:text-white font-extrabold text-sm hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all flex items-center gap-2 text-center"
            >
              <span>Product tour</span>
            </a>
          </div>

          {/* Trust & Award Badges (LearnWise Style) */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-neutral-800 flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400 font-medium">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span>EdTech AI Excellence 2026 • QS Reimagine Education Partner • HolonIQ Top 200</span>
          </div>

        </div>

        {/* Right Column: Dynamic Interactive AI Product Showcase Video/Card */}
        <div className="lg:col-span-6 relative">
          
          {/* Outer Glowing Surface Box */}
          <div className="relative rounded-3xl bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 shadow-2xl p-4 sm:p-6 overflow-hidden group">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />

            {/* Video Mockup Header Bar */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2.5 py-1 rounded-md">
                EduVerse Master AI Orchestrator v2.6
              </span>
            </div>

            {/* Floating Annotation Overlay (LearnWise Style) */}
            <div className="space-y-4 relative z-10">
              
              {/* Card Annotation 1 */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-left space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>Annotation: Citations & Multi-PDF RAG</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-[10px]">PDFTutor AI</span>
                </div>
                <p className="text-xs text-neutral-200 font-mono">
                  "Turn <span className="text-amber-400 font-bold">quick notes</span> & raw PDFs into structured exam roadmaps."
                </p>
              </div>

              {/* Dynamic Robot Avatar & Code Execution Simulation */}
              <div className="rounded-2xl bg-neutral-950 p-4 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-extrabold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Multi-Agent DAG Executed</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    Master AI dispatched: CodeMentor + QuizMaster + NoteCraft
                  </p>
                </div>
                <img 
                  src={robotAvatar} 
                  alt="EduVerse Robot" 
                  className="w-16 h-16 object-contain drop-shadow-md animate-float shrink-0" 
                />
              </div>

              {/* Media Controls Bar */}
              <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                    <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                  </button>
                  <span className="font-mono text-[11px]">0:42 / 1:45 • Product Preview</span>
                </div>
                <span className="text-[10px] text-purple-400 font-bold">Live AI Active</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Social Proof Partner Logos */}
      <div className="mt-20 pt-10 border-t border-slate-200 dark:border-neutral-800 text-center space-y-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500">
          Trusted by top students & built with world-class technologies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-sm text-slate-600 dark:text-neutral-300">
          <span>React 19</span>
          <span>•</span>
          <span>Django REST</span>
          <span>•</span>
          <span>Groq Llama-3.3</span>
          <span>•</span>
          <span>LangChain</span>
          <span>•</span>
          <span>PostgreSQL pgvector</span>
          <span>•</span>
          <span>Redis & Celery</span>
        </div>
      </div>
    </section>
  );
};
