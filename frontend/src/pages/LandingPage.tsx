import React from 'react';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AgentGrid } from '../components/landing/AgentGrid';
import { Features } from '../components/landing/Features';
import { Footer } from '../components/landing/Footer';
import { BrainCircuit, ArrowRight, Sun, Moon } from 'lucide-react';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToDashboard, darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md fixed top-0 left-0 right-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl agent-gradient-master flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">EduVerse AI</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Multi-Agent EdTech Ecosystem</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
          <a href="#agents" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">9 AI Agents</a>
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Unique Features</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button
            onClick={onNavigateToDashboard}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Log In
          </button>

          <button
            onClick={onNavigateToDashboard}
            className="px-6 py-2.5 rounded-xl agent-gradient-master text-white font-semibold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Hero onStartLearning={onNavigateToDashboard} />
        <HowItWorks />
        <AgentGrid />
        <Features />

        {/* Final CTA Banner */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="glass-panel p-10 sm:p-16 rounded-3xl agent-gradient-master text-white space-y-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Master Any Subject with 9 AI Agents?
            </h2>
            <p className="text-sm sm:text-lg opacity-90 max-w-2xl mx-auto font-medium">
              Join thousands of students leveraging Master AI orchestration for accelerated learning and skill mastery.
            </p>
            <button
              onClick={onNavigateToDashboard}
              className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-base shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <span>Launch EduVerse AI Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
