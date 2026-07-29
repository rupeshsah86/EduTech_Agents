import React, { useState } from 'react';
import { llmService } from '../../services/llm/llmService';
import type { LLMConfig, LLMProviderId } from '../../services/llm/types';
import { X, Cpu, Zap, Sparkles, Server, Check, Key, ShieldCheck, Activity, Sliders } from 'lucide-react';

interface LLMProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LLMProviderModal: React.FC<LLMProviderModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<LLMConfig>(llmService.getConfig());
  const [activeTab, setActiveTab] = useState<LLMProviderId>(config.activeProvider);
  const [testingStatus, setTestingStatus] = useState<Record<string, { status: 'idle' | 'testing' | 'success' | 'error'; message?: string }>>({});

  if (!isOpen) return null;

  const providers = llmService.getAvailableProviders();
  const activeModels = llmService.getModelsForProvider(activeTab);

  const handleProviderSelect = (providerId: LLMProviderId) => {
    setActiveTab(providerId);
    const models = llmService.getModelsForProvider(providerId);
    const defaultModel = models[0]?.id || '';
    const updated = llmService.saveConfig({
      activeProvider: providerId,
      activeModel: defaultModel,
    });
    setConfig(updated);
  };

  const handleModelSelect = (modelId: string) => {
    const updated = llmService.saveConfig({ activeModel: modelId });
    setConfig(updated);
  };

  const handleApiKeyChange = (providerId: LLMProviderId, key: string) => {
    const updatedKeys = { ...config.apiKeys, [providerId]: key };
    const updated = llmService.saveConfig({ apiKeys: updatedKeys });
    setConfig(updated);
  };

  const handleBaseUrlChange = (providerId: LLMProviderId, url: string) => {
    const updatedUrls = { ...config.customBaseUrls, [providerId]: url };
    const updated = llmService.saveConfig({ customBaseUrls: updatedUrls });
    setConfig(updated);
  };

  const handleTestConnection = async (providerId: LLMProviderId) => {
    setTestingStatus((prev) => ({ ...prev, [providerId]: { status: 'testing' } }));
    const result = await llmService.testProviderConnection(providerId);
    setTestingStatus((prev) => ({
      ...prev,
      [providerId]: {
        status: result.success ? 'success' : 'error',
        message: result.message,
      },
    }));
  };

  const providerIcons: Record<string, React.ReactNode> = {
    gemini: <Sparkles className="w-5 h-5 text-amber-500" />,
    groq: <Zap className="w-5 h-5 text-purple-500" />,
    openai: <Cpu className="w-5 h-5 text-emerald-500" />,
    deepseek: <Key className="w-5 h-5 text-indigo-500" />,
    ollama: <Server className="w-5 h-5 text-sky-500" />,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-600/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Multi-LLM Provider Switcher</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Switch between Gemini, Groq, OpenAI, DeepSeek & Local Ollama models</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Provider Selection Tabs */}
          <div>
            <label className="text-xs font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-widest block mb-3">
              Select AI Engine Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {providers.map((p) => {
                const isActive = config.activeProvider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleProviderSelect(p.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                        : 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:border-purple-300'
                    }`}
                  >
                    {providerIcons[p.id]}
                    <span className="text-xs font-bold capitalize">{p.name.split(' ')[0]}</span>
                    {isActive && <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.2 rounded-full">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection Cards */}
          <div>
            <label className="text-xs font-extrabold text-slate-400 dark:text-neutral-500 uppercase tracking-widest block mb-3">
              Select Model for {providers.find((p) => p.id === activeTab)?.name}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeModels.map((m) => {
                const isSelected = config.activeModel === m.id && config.activeProvider === activeTab;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleModelSelect(m.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{m.name}</h4>
                          {m.isRecommended && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 leading-relaxed">{m.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-slate-400 dark:text-neutral-500">
                      <span>Context: {m.contextWindow}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Key / Configuration Panel */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-600" />
                <span>{providers.find((p) => p.id === activeTab)?.name} Credentials & Endpoint</span>
              </span>
              <button
                type="button"
                onClick={() => handleTestConnection(activeTab)}
                disabled={testingStatus[activeTab]?.status === 'testing'}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{testingStatus[activeTab]?.status === 'testing' ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {activeTab !== 'ollama' ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">API Key</label>
                <input
                  type="password"
                  value={config.apiKeys[activeTab] || ''}
                  onChange={(e) => handleApiKeyChange(activeTab, e.target.value)}
                  placeholder={`Enter your ${activeTab.toUpperCase()} API Key...`}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-mono text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-neutral-400">Ollama Server Base URL</label>
                <input
                  type="text"
                  value={config.customBaseUrls.ollama || 'http://localhost:11434'}
                  onChange={(e) => handleBaseUrlChange('ollama', e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-mono text-slate-900 dark:text-neutral-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Test Result Message */}
            {testingStatus[activeTab] && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  testingStatus[activeTab].status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : testingStatus[activeTab].status === 'error'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-purple-500/10 text-purple-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{testingStatus[activeTab].message || 'Verifying credentials...'}</span>
              </div>
            )}
          </div>

          {/* Model Generation Parameters */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 dark:text-neutral-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>Hyperparameter Tuning</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600 dark:text-neutral-400">Temperature (Creativity)</span>
                  <span className="font-mono text-purple-600">{config.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => setConfig(llmService.saveConfig({ temperature: parseFloat(e.target.value) }))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600 dark:text-neutral-400">Max Response Tokens</span>
                  <span className="font-mono text-purple-600">{config.maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={config.maxTokens}
                  onChange={(e) => setConfig(llmService.saveConfig({ maxTokens: parseInt(e.target.value, 10) }))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-950/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
            Active: <strong className="text-purple-600 capitalize">{config.activeProvider} ({config.activeModel})</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer"
          >
            Save & Apply Model
          </button>
        </div>
      </div>
    </div>
  );
};
