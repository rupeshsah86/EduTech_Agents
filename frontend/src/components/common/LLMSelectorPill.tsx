import React, { useState, useEffect } from 'react';
import { llmService } from '../../services/llm/llmService';
import type { LLMConfig } from '../../services/llm/types';
import { Cpu, ChevronDown, Zap, Sparkles, Server, Key } from 'lucide-react';
import { LLMProviderModal } from './LLMProviderModal';

export const LLMSelectorPill: React.FC = () => {
  const [config, setConfig] = useState<LLMConfig>(llmService.getConfig());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleConfigChange = (e: any) => {
      setConfig(e.detail);
    };
    window.addEventListener('llm-config-changed', handleConfigChange);
    return () => window.removeEventListener('llm-config-changed', handleConfigChange);
  }, []);

  const providerIcons: Record<string, React.ReactNode> = {
    gemini: <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />,
    groq: <Zap className="w-3.5 h-3.5 text-purple-500" />,
    openai: <Cpu className="w-3.5 h-3.5 text-emerald-500" />,
    deepseek: <Key className="w-3.5 h-3.5 text-indigo-500" />,
    ollama: <Server className="w-3.5 h-3.5 text-sky-500" />,
  };

  const activeModelObj = llmService.getAllModels().find((m) => m.id === config.activeModel);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 shadow-xs transition-all cursor-pointer group"
        title="Multi-LLM Switcher: Click to switch AI provider or enter API keys"
      >
        <div className="flex items-center gap-1.5">
          {providerIcons[config.activeProvider] || <Cpu className="w-3.5 h-3.5 text-purple-500" />}
          <span className="text-xs font-black text-slate-800 dark:text-neutral-200 capitalize">
            {config.activeProvider}
          </span>
        </div>

        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-bold text-[10px] truncate max-w-[110px]">
          {activeModelObj?.name || config.activeModel}
        </span>

        <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-purple-600 transition-colors" />
      </button>

      <LLMProviderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
