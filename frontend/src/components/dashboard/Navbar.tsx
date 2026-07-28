import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Bell, BrainCircuit, LogOut } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeAgentCount: number;
  onNavigateToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, activeAgentCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-200">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <Link 
          to="/" 
          className="w-10 h-10 rounded-xl agent-gradient-master flex items-center justify-center shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
          title="Back to Landing Page"
        >
          <BrainCircuit className="w-6 h-6 text-white" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">EduVerse AI</h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Enterprise AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            One Master AI • 9 Specialized Neural Agents
          </p>
        </div>
      </div>

      {/* Middle Status Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Master Orchestrator Active ({activeAgentCount} Agents Standby)
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        <button className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          title="Log Out"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Log Out</span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 border border-slate-300 dark:border-slate-600">
            {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {user?.fullName || 'Student User'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Pro Student Tier</p>
          </div>
        </div>
      </div>
    </header>
  );
};
