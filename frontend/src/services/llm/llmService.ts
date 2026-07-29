import type { ILLMProviderStrategy, LLMConfig, LLMModel, LLMProviderId, LLMResponse } from './types';
import { GeminiStrategy } from './strategies/GeminiStrategy';
import { GroqStrategy } from './strategies/GroqStrategy';
import { OpenAIStrategy } from './strategies/OpenAIStrategy';
import { DeepSeekStrategy } from './strategies/DeepSeekStrategy';
import { OllamaStrategy } from './strategies/OllamaStrategy';

const STORAGE_KEY = 'eduverse_llm_config_v1';

class LLMService {
  private strategies: Map<LLMProviderId, ILLMProviderStrategy> = new Map();
  private config: LLMConfig;

  constructor() {
    // Register strategies following Open/Closed Principle
    this.registerStrategy(new GeminiStrategy());
    this.registerStrategy(new GroqStrategy());
    this.registerStrategy(new OpenAIStrategy());
    this.registerStrategy(new DeepSeekStrategy());
    this.registerStrategy(new OllamaStrategy());

    // Load initial config from localStorage
    this.config = this.loadConfig();
  }

  private registerStrategy(strategy: ILLMProviderStrategy) {
    this.strategies.set(strategy.providerId, strategy);
  }

  private loadConfig(): LLMConfig {
    const defaultConfig: LLMConfig = {
      activeProvider: 'gemini',
      activeModel: 'gemini-1.5-flash',
      apiKeys: {
        gemini: '',
        groq: '',
        openai: '',
        deepseek: '',
        ollama: '',
      },
      customBaseUrls: {
        ollama: 'http://localhost:11434',
      },
      temperature: 0.7,
      maxTokens: 2048,
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load LLM config from storage:', e);
    }
    return defaultConfig;
  }

  public saveConfig(newConfig: Partial<LLMConfig>): LLMConfig {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
      window.dispatchEvent(new CustomEvent('llm-config-changed', { detail: this.config }));
    } catch (e) {
      console.warn('Failed to save LLM config:', e);
    }
    return this.config;
  }

  public getConfig(): LLMConfig {
    return { ...this.config };
  }

  public getAvailableProviders(): { id: LLMProviderId; name: string; strategy: ILLMProviderStrategy }[] {
    return Array.from(this.strategies.values()).map((strat) => ({
      id: strat.providerId,
      name: strat.providerName,
      strategy: strat,
    }));
  }

  public getModelsForProvider(providerId: LLMProviderId): LLMModel[] {
    const strat = this.strategies.get(providerId);
    return strat ? strat.models : [];
  }

  public getAllModels(): LLMModel[] {
    const all: LLMModel[] = [];
    this.strategies.forEach((strat) => {
      all.push(...strat.models);
    });
    return all;
  }

  /**
   * Primary entry point for AI text generation
   */
  public async generate(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const activeProvider = this.config.activeProvider || 'gemini';
    const strategy = this.strategies.get(activeProvider) || this.strategies.get('gemini')!;

    return await strategy.generate(prompt, systemPrompt, this.config);
  }

  /**
   * Test API key / server connection
   */
  public async testProviderConnection(providerId: LLMProviderId, apiKey?: string, baseUrl?: string): Promise<{ success: boolean; message: string }> {
    const strategy = this.strategies.get(providerId);
    if (!strategy) {
      return { success: false, message: `Unknown provider: ${providerId}` };
    }
    const keyToTest = apiKey !== undefined ? apiKey : this.config.apiKeys[providerId] || '';
    const urlToTest = baseUrl || this.config.customBaseUrls[providerId];
    return await strategy.testConnection(keyToTest, urlToTest);
  }
}

export const llmService = new LLMService();
