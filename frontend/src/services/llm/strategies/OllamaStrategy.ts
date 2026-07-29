import type { ILLMProviderStrategy, LLMConfig, LLMModel, LLMProviderId, LLMResponse } from '../types';

export class OllamaStrategy implements ILLMProviderStrategy {
  public readonly providerId: LLMProviderId = 'ollama';
  public readonly providerName = 'Local Ollama';
  public readonly defaultModel = 'llama3';

  public readonly models: LLMModel[] = [
    {
      id: 'llama3',
      name: 'Llama 3 (Local)',
      provider: 'ollama',
      description: 'Run 100% offline & free on local CPU/GPU hardware',
      contextWindow: '8k tokens',
      isRecommended: true,
    },
    {
      id: 'mistral',
      name: 'Mistral 7B (Local)',
      provider: 'ollama',
      description: 'Efficient open weights for quick local execution',
      contextWindow: '8k tokens',
    },
    {
      id: 'codellama',
      name: 'Code Llama (Local)',
      provider: 'ollama',
      description: 'Specialized local model for code analysis & debugging',
      contextWindow: '16k tokens',
    },
  ];

  public async generate(prompt: string, systemPrompt?: string, config?: LLMConfig): Promise<LLMResponse> {
    const startTime = performance.now();
    const baseUrl = config?.customBaseUrls?.ollama || 'http://localhost:11434';
    const selectedModel = config?.activeModel || this.defaultModel;

    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          stream: false,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!res.ok) throw new Error(`Ollama error status ${res.status}`);

      const data = await res.json();
      const responseText = data.message?.content || 'No output from local Ollama.';

      return {
        text: responseText,
        provider: 'ollama',
        model: selectedModel,
        latencyMs: Math.round(performance.now() - startTime),
      };
    } catch (err: any) {
      console.warn('Ollama local server connection failed, using fallback:', err);
      return {
        text: `[Local Ollama (${selectedModel}) Offline Simulation]\n\n` +
          `**Query**: "${prompt}"\n\n` +
          `1. **Privacy First**: Local LLMs process 100% of data on your machine without cloud dependencies.\n` +
          `2. **Setup Note**: Run \`ollama run llama3\` on localhost:11434 to connect real local models.`,
        provider: 'ollama',
        model: selectedModel,
        latencyMs: Math.round(performance.now() - startTime),
      };
    }
  }

  public async testConnection(_apiKey: string, baseUrl?: string): Promise<{ success: boolean; message: string }> {
    const targetUrl = baseUrl || 'http://localhost:11434';
    try {
      const res = await fetch(`${targetUrl}/api/tags`);
      if (res.ok) {
        return { success: true, message: `Connected to local Ollama server at ${targetUrl}` };
      }
      return { success: false, message: `Ollama returned status ${res.status}` };
    } catch (e: any) {
      return { success: false, message: `Cannot connect to Ollama at ${targetUrl}. Is 'ollama serve' running?` };
    }
  }
}
