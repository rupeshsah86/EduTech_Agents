import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AgentGrid } from '../components/landing/AgentGrid';
import { Features } from '../components/landing/Features';
import { Footer } from '../components/landing/Footer';
import { BrainCircuit, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigateToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Fixed Top Group: Announcement Banner + Clean Navigation Header (LearnWise Style) */}
      <div className="fixed top-0 left-0 right-0 z-50">
        
        {/* Top Announcement Bar */}
        <div className="bg-slate-900 dark:bg-neutral-900 text-white text-[11px] font-semibold py-2 px-4 text-center border-b border-neutral-800 flex items-center justify-center gap-1.5">
          <span>New report: Find out what 191,283 AI Tutor conversations say about teaching & learning in 2026</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
        </div>

        {/* Navigation Header */}
        <header className="h-16 border-b border-slate-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">EduVerse AI</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Multi-Agent EdTech Platform</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-neutral-300">
            <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Platform</a>
            <a href="#agents" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">9 AI Agents</a>
            <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-full border border-slate-900 dark:border-neutral-700 font-extrabold text-xs hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors hidden sm:inline-block"
                >
                  Product tour
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Try it now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </header>

      </div>

      {/* Main Content */}
      <main className="flex-1 pt-12">
        <Hero onStartLearning={handleStartLearning} />
        <HowItWorks />
        <AgentGrid />
        <Features />

        {/* Final CTA Banner (LearnWise Style) */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-10 sm:p-16 text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/20 blur-[100px] pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-serif">
              Smarter campus learning starts with EduVerse AI
            </h2>
            <p className="text-sm sm:text-base opacity-80 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of students and institutions using Master AI orchestration for accelerated learning, SM-2 memory retention, and Knowledge Graph mapping.
            </p>
            <button
              onClick={handleStartLearning}
              className="px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Try it now</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
