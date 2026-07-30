import React, { useState, useEffect } from 'react';
import { Key, X, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { llmService } from '../../services/llm/llmService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [groqKey, setGroqKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingKey = localStorage.getItem('eduverse_groq_api_key') || localStorage.getItem('eduverse_api_key') || '';
    setGroqKey(existingKey);
  }, [isOpen]);

  const handleSave = () => {
    const cleanKey = groqKey.trim();
    localStorage.setItem('eduverse_groq_api_key', cleanKey);
    localStorage.setItem('eduverse_api_key', cleanKey);
    localStorage.setItem('eduverse_api_provider', 'groq');

    llmService.saveConfig({
      activeProvider: 'groq',
      activeModel: 'llama-3.3-70b-versatile',
      apiKeys: {
        ...llmService.getConfig().apiKeys,
        groq: cleanKey,
      },
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden font-sans space-y-0 text-slate-900 dark:text-neutral-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2.5 font-extrabold text-sm">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Key className="w-4 h-4" />
            </div>
            <span>Groq API Key Configuration</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-neutral-200">
              GROQ API KEY
            </label>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Enter your Groq API key to power Master AI & 9 Neural Agents with real-time <span className="font-bold text-purple-600 dark:text-purple-400">llama-3.3-70b-versatile</span> LLM reasoning.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs font-mono text-slate-900 dark:text-neutral-100 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-[10px] text-slate-400 dark:text-neutral-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Your API key is stored securely in your local browser session and backend `.env`.
            </p>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Groq API Key Saved Successfully! Live LLM Active.</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs font-bold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save & Connect LLM</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
