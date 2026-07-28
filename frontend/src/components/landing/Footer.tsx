import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg agent-gradient-master flex items-center justify-center text-white">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">EduVerse AI</h4>
            <p className="text-[11px] text-slate-500">One Intelligent Learning Platform Powered by Multiple AI Agents</p>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          © 2026 EduVerse AI. All rights reserved. Built for EdTech Excellence.
        </p>
      </div>
    </footer>
  );
};
