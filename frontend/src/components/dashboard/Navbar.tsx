import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Command, 
  Mic, 
  MicOff,
  Sun, 
  Moon, 
  ChevronDown, 
  LogOut,
  Send 
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { UserProfileModal } from './UserProfileModal';
import { userActivityService, type UserActivity } from '../../services/userActivity';
import { Flame } from 'lucide-react';


interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onVoiceSearch?: (transcript: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, onVoiceSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activity, setActivity] = useState<UserActivity>(() => userActivityService.getActivity());
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) setActivity(e.detail);
    };
    window.addEventListener('user-activity-updated', handleUpdate);
    return () => window.removeEventListener('user-activity-updated', handleUpdate);
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K to focus search input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Web Speech API initialization
  const handleToggleVoice = () => {
    const windowObj = window as any;
    const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Google Chrome, Brave, or MS Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setSearchQuery(transcript);
        if (onVoiceSearch) {
          onVoiceSearch(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Error launching speech recognition:", e);
      setIsListening(false);
    }
  };

  const handleSearchSubmit = () => {
    const queryToSend = searchQuery.trim();
    if (!queryToSend || isSubmitting) return;

    setIsSubmitting(true);
    setSearchQuery('');

    if (onVoiceSearch) {
      onVoiceSearch(queryToSend);
    } else {
      window.dispatchEvent(new CustomEvent('send-master-ai-prompt', { detail: queryToSend }));
    }

    setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <UserProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />

      <header className="h-16 border-b border-slate-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between gap-4 transition-colors duration-200">
        
        {/* Search Input Bar with Cmd+K and Send Button */}
        <div className="flex-1 max-w-xl relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className={`relative flex items-center bg-slate-100/80 dark:bg-neutral-900 border ${
              isListening ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/80 dark:border-neutral-800 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20'
            } rounded-2xl px-3.5 py-1.5 transition-all`}
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              placeholder={isListening ? "Listening... Speak now..." : "Search anything or ask Master AI (press Enter to submit)..."}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-neutral-100 placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none font-medium"
            />
            
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-1 rounded-lg transition-colors cursor-pointer mr-1.5 ${
                isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:text-purple-600'
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => searchInputRef.current?.focus()}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] font-bold text-slate-400 dark:text-neutral-400 shrink-0 mr-1.5 cursor-pointer hover:text-purple-600"
              title="Press Cmd+K to focus search input"
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </button>

            {/* Purple Send Button */}
            <button
              type="submit"
              disabled={!searchQuery.trim() || isSubmitting}
              className={`w-7 h-7 rounded-full text-white flex items-center justify-center shadow-xs shrink-0 disabled:opacity-40 transition-all cursor-pointer ${
                isSubmitting ? 'bg-purple-400 animate-spin' : 'bg-purple-600 hover:bg-purple-500'
              }`}
              title="Send Search Prompt to Master AI (or press Enter)"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">


          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800 transition-colors cursor-pointer"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Working Notification Dropdown */}
          <NotificationDropdown />

          {/* Active Streak Pill Badge */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs"
            title="View Active Study Streak in Profile"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{activity.activeStreak}d Streak</span>
          </button>

          {/* User Profile Button (Clickable) */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-neutral-800 hover:opacity-80 transition-opacity cursor-pointer group"
            title="Edit Profile Settings & View History"
          >
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              {user?.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'NA'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1">
                <p className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 leading-tight">
                  {user?.fullName?.toLowerCase() || 'student'}
                </p>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Edit Profile</p>
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
    </>
  );
};
