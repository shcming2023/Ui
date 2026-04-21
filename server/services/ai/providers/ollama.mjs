/**
 * ollama.mjs - Ollama AI Provider 实现
 * 
 * 使用 Ollama /api/chat 接口发送系统与用户消息，获取解析后的 JSON 元数据。
 */

import { BaseProvider } from './base.mjs';

export class OllamaProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\/$/, '');
    this.model = config.model || 'qwen3.5:9b';
    this.temperature = config.temperature ?? 0.1;
  }

  get id() {
    return 'ollama';
  }

  async healthCheck() {
    try {
      const resp = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000)
      });
      return resp.ok;
    } catch {
      return false;
    }
  }

  async extractMetadata(markdownContent, options = {}) {
    const systemPrompt = options.systemPrompt || 'You are an education resource metadata extractor. Return only valid JSON.';
    
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: markdownContent }
      ],
      stream: false,
      options: {
        temperature: this.temperature
      }
    };

    const startTime = Date.now();
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(this.timeoutMs)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: HTTP ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.message?.content || '';
    const duration = Date.now() - startTime;

    const result = this.parseJsonRobust(rawContent);
    if (!result) {
      throw new Error('Failed to parse JSON from Ollama response');
    }

    return {
      result,
      rawResponse: rawContent,
      usage: {
        total_duration_ms: duration,
        prompt_tokens: data.prompt_eval_count || 0,
        completion_tokens: data.eval_count || 0
      },
      provider: this.id,
      model: this.model
    };
  }
}
