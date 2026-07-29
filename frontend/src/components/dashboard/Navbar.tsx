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
  LogOut 
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

import { UserProfileModal } from './UserProfileModal';

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
  const [profileModalOpen, setProfileModalOpen] = useState(false);

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
        
        {/* Search Input Bar with Cmd+K */}
        <div className="flex-1 max-w-xl relative">
          <div className={`relative flex items-center bg-slate-100/80 dark:bg-neutral-900 border ${
            isListening ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/80 dark:border-neutral-800'
          } rounded-2xl px-3.5 py-2 transition-all`}>
            <Search className="w-4 h-4 text-slate-400 dark:text-neutral-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  e.preventDefault();
                  if (onVoiceSearch) onVoiceSearch(searchQuery);
                }
              }}
              placeholder={isListening ? "Listening... Speak now..." : "Search anything or ask Master AI..."}
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

            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-[10px] font-bold text-slate-400 dark:text-neutral-400 shrink-0">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Working Voice AI Toggle Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-2xs ${
              isListening 
                ? 'bg-rose-500 text-white border border-rose-600 animate-pulse' 
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/50'
            }`}
          >
            {isListening ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Voice AI</span>
              </>
            )}
          </button>

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

          {/* User Profile Button (Clickable) */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-neutral-800 hover:opacity-80 transition-opacity cursor-pointer group"
            title="Edit Profile Settings"
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
