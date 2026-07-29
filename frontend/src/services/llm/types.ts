// Domain Types for Multi-LLM Provider Switcher Architecture (SOLID Compliant)

export type LLMProviderId = 'gemini' | 'groq' | 'openai' | 'deepseek' | 'ollama';

export interface LLMModel {
  id: string;
  name: string;
  provider: LLMProviderId;
  description: string;
  contextWindow: string;
  isRecommended?: boolean;
}

export interface LLMConfig {
  activeProvider: LLMProviderId;
  activeModel: string;
  apiKeys: Record<LLMProviderId, string>;
  customBaseUrls: Partial<Record<LLMProviderId, string>>;
  temperature: number;
  maxTokens: number;
}

export interface LLMResponse {
  text: string;
  provider: LLMProviderId;
  model: string;
  latencyMs: number;
  tokensUsed?: number;
}

/**
 * Dependency Inversion Principle (DIP): High-level modules depend on abstractions.
 * Strategy Pattern for pluggable LLM Providers.
 */
export interface ILLMProviderStrategy {
  readonly providerId: LLMProviderId;
  readonly providerName: string;
  readonly defaultModel: string;
  readonly models: LLMModel[];

  generate(prompt: string, systemPrompt?: string, config?: LLMConfig): Promise<LLMResponse>;
  testConnection(apiKey: string, baseUrl?: string): Promise<{ success: boolean; message: string }>;
}
