import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AgentGrid } from '../components/landing/AgentGrid';
import { Features } from '../components/landing/Features';
import { Footer } from '../components/landing/Footer';
import { BrainCircuit, Sun, Moon, ArrowRight } from 'lucide-react';
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
      
      {/* Navigation Header */}
      <header className="h-16 border-b border-slate-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-md shadow-purple-600/20 text-white">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">EduVerse AI</h1>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-neutral-400">
          <a href="#how-it-works" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">How it works</a>
          <a href="#agents" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">9 AI Agents</a>
          <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Features</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-purple-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors hidden sm:inline-block"
              >
                Sign In
              </Link>

              <button
                onClick={handleStartLearning}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Hero onStartLearning={handleStartLearning} />
        <HowItWorks />
        <AgentGrid />
        <Features />

        {/* Final High-Conversion CTA Banner */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center font-sans">
          <div className="rounded-3xl bg-slate-900 dark:bg-neutral-900 border border-slate-800 dark:border-neutral-800 p-10 sm:p-14 text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 blur-[100px] pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Transform the way you learn with EduVerse AI
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-normal leading-relaxed">
              Join thousands of students utilizing 9 autonomous AI agents for accelerated learning, doubt resolution, and adaptive study schedules.
            </p>
            <button
              onClick={handleStartLearning}
              className="px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

