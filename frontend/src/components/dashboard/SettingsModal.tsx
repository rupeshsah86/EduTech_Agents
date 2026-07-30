import React, { useState, useEffect } from 'react';
import { Key, X, Check, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingKey = localStorage.getItem('eduverse_api_key') || localStorage.getItem('eduverse_groq_api_key') || '';
    const existingProvider = localStorage.getItem('eduverse_api_provider') || (existingKey.startsWith('AIza') ? 'gemini' : existingKey.startsWith('sk-') ? 'openai' : 'groq');
    setApiKey(existingKey);
    setProvider(existingProvider);
  }, [isOpen]);

  const handleKeyChange = (val: string) => {
    setApiKey(val);
    const trimmed = val.trim();
    if (trimmed.startsWith('AIza')) {
      setProvider('gemini');
    } else if (trimmed.startsWith('gsk_')) {
      setProvider('groq');
    } else if (trimmed.startsWith('sk-')) {
      setProvider('openai');
    }
  };

  const handleSave = () => {
    const cleanKey = apiKey.trim();
    let detectedProv = provider;
    if (cleanKey.startsWith('AIza')) detectedProv = 'gemini';
    else if (cleanKey.startsWith('gsk_')) detectedProv = 'groq';
    else if (cleanKey.startsWith('sk-')) detectedProv = 'openai';

    localStorage.setItem('eduverse_api_key', cleanKey);
    localStorage.setItem('eduverse_api_provider', detectedProv);
    localStorage.setItem('eduverse_groq_api_key', cleanKey);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-900 dark:text-neutral-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2.5 font-extrabold text-sm">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Key className="w-4 h-4" />
            </div>
            <span>LLM API Key Settings</span>
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
            <label className="block text-xs font-bold text-slate-800 dark:text-neutral-200 uppercase tracking-wider">
              LLM Provider & API Key
            </label>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Connect <span className="font-bold text-purple-600 dark:text-purple-400">Google Gemini Flash</span> or <span className="font-bold text-purple-600 dark:text-purple-400">Groq LLaMA 3.3</span> for real-time live AI responses across Master AI & 9 Neural Agents.
            </p>
          </div>

          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 dark:text-neutral-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              Select LLM Provider:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  provider === 'gemini' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                    : 'bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400'
                }`}
              >
                Google Gemini
              </button>
              <button
                type="button"
                onClick={() => setProvider('groq')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  provider === 'groq' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                    : 'bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400'
                }`}
              >
                Groq LLaMA 3
              </button>
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  provider === 'openai' 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                    : 'bg-slate-100 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400'
                }`}
              >
                OpenAI GPT-4
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-neutral-400 block">
              {provider === 'gemini' ? 'Google Gemini API Key (starts with AIza...)' : provider === 'groq' ? 'Groq API Key (starts with gsk_...)' : 'OpenAI API Key (starts with sk-...)'}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={provider === 'gemini' ? "AIzaSy..." : provider === 'groq' ? "gsk_..." : "sk-..."}
              className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs font-mono text-slate-900 dark:text-neutral-100 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
            />
            <p className="text-[10px] text-slate-400 dark:text-neutral-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Your API key is stored securely in local browser session storage.
            </p>
          </div>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{provider.toUpperCase()} API Key Saved & Active!</span>
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
