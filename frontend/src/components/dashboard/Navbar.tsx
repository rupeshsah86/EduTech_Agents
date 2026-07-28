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
    <header className="h-16 border-b border-slate-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left Brand Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <Link 
          to="/" 
          className="w-9 h-9 rounded-xl agent-gradient-master flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
          title="Back to Landing Page"
        >
          <BrainCircuit className="w-5 h-5 text-white" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base text-slate-900 dark:text-neutral-100 tracking-tight">EduVerse AI</h1>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              ENTERPRISE AI
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium hidden sm:block">
            One Master AI • 9 Neural Agents
          </p>
        </div>
      </div>

      {/* Center Main Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 hover:bg-slate-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-neutral-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-neutral-800 text-purple-600 dark:text-purple-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions & Profile Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Working Notifications Dropdown */}
        <NotificationDropdown />

        {/* Theme Toggle Button (Light / Dark only) */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 transition-colors cursor-pointer"
          title="Toggle Light/Dark Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-neutral-300 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-neutral-800 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Log Out</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
            {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'ST'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-neutral-100 leading-tight">
              {user?.fullName || 'Student User'}
            </p>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Pro Student Tier</p>
          </div>
        </div>
      </div>
    </header>
  );
};
