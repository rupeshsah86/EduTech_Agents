import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sun, 
  Moon, 
  BrainCircuit, 
  LogOut, 
  MessageSquare, 
  Network, 
  Flame, 
  Bot, 
  BarChart3 
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigateToLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: 'chat', label: 'Master AI Assistant', icon: MessageSquare },
    { id: 'knowledge', label: 'Knowledge Graph', icon: Network },
    { id: 'heatmap', label: 'Skill Heatmap', icon: Flame },
    { id: 'agents', label: 'Specialized Agents', icon: Bot, badge: '9' },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40 transition-colors duration-200 shadow-xs">
      {/* Top Main Bar */}
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            to="/" 
            className="w-10 h-10 rounded-xl agent-gradient-master flex items-center justify-center shadow-md shadow-indigo-500/25 hover:scale-105 transition-transform"
            title="Back to Landing Page"
          >
            <BrainCircuit className="w-6 h-6 text-white" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">EduVerse AI</h1>
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                ENTERPRISE AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              One Master AI Assistant • 9 Neural Agents
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs (Moved Upward into Header) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-indigo-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notifications Dropdown (WORKING) */}
          <NotificationDropdown />

          {/* Dark/Light Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer"
            title="Toggle Dark/Light Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/60 dark:border-slate-700/60 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'ST'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {user?.fullName || 'Student User'}
              </p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Pro Student Tier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header Navigation for Mobile/Tablet Screens */}
      <div className="lg:hidden px-4 py-2 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
