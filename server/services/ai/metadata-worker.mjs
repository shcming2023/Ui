/**
 * metadata-worker.mjs - AI 元数据识别任务执行器
 * 
 * 职责：
 * 1. 扫描 pending 状态的 AI Metadata Jobs
 * 2. 从 MinIO 获取解析产物 Markdown 内容
 * 3. 选取合适的 Provider (Ollama/OpenAI) 进行元数据提取
 * 4. 解析结果并推进状态到 review-pending 或 confirmed
 * 5. 处理 Fallback 与降级 logic
 */

import { getAllJobs, updateJob } from './metadata-job-client.mjs';
import { getTaskById } from '../tasks/task-client.mjs';
import { logTaskEvent } from '../logging/task-events.mjs';
import { getSettings } from '../settings/settings-client.mjs';

import { OllamaProvider } from './providers/ollama.mjs';
import { OpenAiCompatibleProvider } from './providers/openai-compatible.mjs';

const POLL_INTERVAL_MS = 10000;

// 内存队列锁
const processingMap = new Set();

export class AiMetadataWorker {
  constructor(minioContext = null) {
    this.timer = null;
    this.isRunning = false;
    this.minioContext = minioContext;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[ai-worker] AI Metadata Worker started');
    this.tick();
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
    this.isRunning = false;
    console.log('[ai-worker] AI Metadata Worker stopped');
  }

  async tick() {
    try {
      await this.scanAndProcess();
    } catch (error) {
      console.error(`[ai-worker] Error in tick: ${error.message}`);
    } finally {
      if (this.isRunning) {
        this.timer = setTimeout(() => this.tick(), POLL_INTERVAL_MS);
      }
    }
  }

  async scanAndProcess() {
    const jobs = await getAllJobs();
    const pendingJobs = jobs.filter(j => j.state === 'pending');

    for (const job of pendingJobs) {
      if (processingMap.has(job.id)) continue;
      this.processJob(job);
    }
  }

  /**
   * 核心处理逻辑
   */
  async processJob(job) {
    processingMap.add(job.id);
    const startTime = Date.now();
    console.log(`[ai-worker] Picking up job: ${job.id} (parseTask=${job.parseTaskId})`);

    try {
      // 1. 获取全局设置
      const settings = await getSettings();
      // 优先读取 aiConfig，兼容旧的 ai
      const rawAiConfig = settings.aiConfig || settings.ai || {};

      // 降级检查：未启用 AI
      if (rawAiConfig.aiEnabled === false) {
        return await this.degradeToSkeleton(job, 'AI 功能已从控制台关闭，降级为骨架模拟');
      }

      // 2. 确定 Provider 配置 (优先选择 providers 数组中启用且优先级最高的)
      let aiSettings = {};
      let providerId = 'ollama';

      if (Array.isArray(rawAiConfig.providers) && rawAiConfig.providers.length > 0) {
        const sortedEnabled = rawAiConfig.providers
          .filter(p => p.enabled !== false)
          .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
        
        if (sortedEnabled.length > 0) {
          const chosen = sortedEnabled[0];
          providerId = chosen.provider || chosen.id || 'ollama';
          // 规范化字段：将 chosen 的字段映射到 aiSettings 中
          aiSettings = {
            ...rawAiConfig, // 继承全局配置 (如 confidenceThreshold)
            ...chosen,
            baseUrl: chosen.apiEndpoint || chosen.baseUrl,
            timeoutMs: this.normalizeTimeout(chosen.timeout || rawAiConfig.timeout)
          };
        } else {
          aiSettings = { ...rawAiConfig, timeoutMs: this.normalizeTimeout(rawAiConfig.timeout) };
          providerId = aiSettings.aiProviderId || aiSettings.providerId || 'ollama';
        }
      } else {
        aiSettings = { ...rawAiConfig, timeoutMs: this.normalizeTimeout(rawAiConfig.timeout) };
        providerId = aiSettings.aiProviderId || aiSettings.providerId || 'ollama';
      }

      let provider = this.createProvider(providerId, aiSettings);

      // 3. 获取 ParseTask 信息与 Markdown 内容
      const parseTask = await getTaskById(job.parseTaskId);
      const markdownObjectName = parseTask?.metadata?.markdownObjectName || job.inputMarkdownObjectName;
      
      if (!markdownObjectName || !this.minioContext) {
        return await this.degradeToSkeleton(job, '未找到 Markdown 产物或存储上下文不可用，降级为骨架模拟');
      }

      let markdownContent = '';
      try {
        const stream = await this.minioContext.getFileStream(markdownObjectName);
        markdownContent = await this.streamToString(stream);
      } catch (err) {
        return await this.degradeToSkeleton(job, `拉取 Markdown 内容失败: ${err.message}，降级为骨架模拟`);
      }

      if (!markdownContent.trim()) {
        throw new Error('Markdown 内容为空，无法提取元数据');
      }

      // 4. 内容截断处理 (根据 PRD 10.5.5)
      const MAX_CHARS = 32000; // 约 8000 tokens
      let isTruncated = false;
      const originalLength = markdownContent.length;
      if (originalLength > MAX_CHARS) {
        markdownContent = markdownContent.slice(0, MAX_CHARS);
        isTruncated = true;
        await logTaskEvent({
          taskId: job.parseTaskId,
          event: 'ai-content-truncated',
          level: 'info',
          message: `Markdown 内容过长已截断 (${originalLength} -> ${MAX_CHARS} 字符)`,
          payload: { originalLength, truncatedLength: MAX_CHARS }
        });
      }

      // 5. 执行 AI 识别
      await this.transition(job, {
        state: 'running',
        progress: 20,
        message: `正在使用 ${providerId} (${provider.model}) 进行识别...`
      }, 'ai-provider-called', 'info', { provider: providerId, model: provider.model, inputLength: markdownContent.length });

      let aiResponse;
      try {
        aiResponse = await this.executeWithFallback(provider, markdownContent, aiSettings);
      } catch (err) {
        console.error(`[ai-worker] Job ${job.id} failed after attempts: ${err.message}`);
        // 如果所有 provider 都失败，尝试降级到模拟
        return await this.degradeToSkeleton(job, `AI Provider 调用全部失败: ${err.message}，自动降级为模拟结果完成链路`);
      }

      // 6. 结果后处理与置信度校准
      const result = aiResponse.result;
      const confidence = result.confidence || aiResponse.usage?.confidence || 0;
      
      // 判断是否需要人工审核
      const threshold = Number(aiSettings.confidenceThreshold || 80);
      const isLowConfidence = confidence < threshold;
      const missingKeyFields = !result.subject || !result.grade || !result.materialType;
      const requireAllReview = aiSettings.requireAllReview === true;
      
      const needsReview = isLowConfidence || missingKeyFields || requireAllReview || aiResponse.fallbackOccurred;

      // 7. 完成任务
      const finalState = needsReview ? 'review-pending' : 'confirmed';
      const duration = Date.now() - startTime;

      await this.transition(job, {
        state: finalState,
        progress: 100,
        message: `AI 识别完成 (${duration}ms)${aiResponse.fallbackOccurred ? ' [Fallback已发生]' : ''}`,
        result,
        confidence,
        needsReview,
        providerId: aiResponse.provider,
        model: aiResponse.model,
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }, 'ai-provider-success', 'info', { 
        duration, 
        confidence, 
        needsReview, 
        fallback: !!aiResponse.fallbackOccurred 
      });

    } catch (error) {
      console.error(`[ai-worker] Job ${job.id} unexpected error: ${error.message}`);
      await this.transition(job, {
        state: 'failed',
        errorMessage: error.message,
        message: `AI 识别异常: ${error.message}`
      }, 'ai-provider-failed', 'error', { error: error.message });
    } finally {
      processingMap.delete(job.id);
    }
  }

  /**
   * 降级执行：返回模拟结果
   */
  async degradeToSkeleton(job, reason) {
    console.warn(`[ai-worker] Degrading job ${job.id}: ${reason}`);
    
    await logTaskEvent({
      taskId: job.parseTaskId,
      event: 'ai-skeleton-fallback',
      level: 'warn',
      message: reason,
      payload: { aiJobId: job.id }
    });

    const simulatedResult = {
      title: "模拟试卷 (降级模式)",
      subject: "未知",
      grade: "未知",
      materialType: "其他",
      summary: `[ai skeleton fallback] 由于 "${reason}"，系统使用了降级模拟结果。`,
      confidence: 50,
      needsReview: true,
      warnings: ["系统已降级为模拟模式"]
    };

    await this.transition(job, {
      state: 'review-pending',
      progress: 100,
      message: `[降级屏蔽] ${reason}`,
      result: simulatedResult,
      confidence: 50,
      needsReview: true,
      providerId: 'skeleton',
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }, 'ai-worker-completed');
  }

  /**
   * 执行 AI 条目识别并支持 Fallback
   */
  async executeWithFallback(mainProvider, markdown, aiSettings) {
    const providersToTry = [mainProvider];
    
    // 如果配置了 fallback，可以加入列表（此处简化逻辑，如果主 provider 失败，尝试 openai-compatible 作为垫背）
    if (mainProvider.id === 'ollama' && aiSettings.openaiApiKey) {
      providersToTry.push(this.createProvider('openai-compatible', aiSettings));
    }

    let lastError;
    for (let i = 0; i < providersToTry.length; i++) {
        const provider = providersToTry[i];
        try {
            const systemPrompt = aiSettings.systemPrompt || this.getDefaultPrompt();
            const resp = await provider.extractMetadata(markdown, { systemPrompt });
            if (i > 0) resp.fallbackOccurred = true;
            return resp;
        } catch (err) {
            lastError = err;
            console.warn(`[ai-worker] Provider ${provider.id} failed: ${err.message}`);
            if (i < providersToTry.length - 1) {
                await logTaskEvent({
                   taskId: 'system', // 此处记录系统级别警告
                   event: 'ai-provider-fallback',
                   level: 'warn',
                   message: `Provider ${provider.id} 失败，正在尝试下一个: ${providersToTry[i+1].id}`
                });
            }
        }
    }
    throw lastError;
  }

  createProvider(id, aiSettings) {
    let baseUrl = aiSettings.ollamaBaseUrl || aiSettings.baseUrl || 'http://host.docker.internal:11434';
    
    // 规范化 Ollama 端点：如果包含了 v1 路径，则剥离，因为 OllamaProvider 自带 /api/chat
    if (id === 'ollama' && baseUrl.includes('/v1')) {
      baseUrl = baseUrl.split('/v1')[0];
    }

    const timeoutMs = aiSettings.timeoutMs || 120000;

    if (id === 'ollama') {
      return new OllamaProvider({
        baseUrl,
        model: aiSettings.ollamaModel || aiSettings.model || 'qwen3.5:9b',
        timeoutMs
      });
    }
    if (id === 'openai-compatible') {
      return new OpenAiCompatibleProvider({
        baseUrl: aiSettings.openaiBaseUrl || aiSettings.baseUrl,
        model: aiSettings.openaiModel || aiSettings.model,
        apiKey: aiSettings.openaiApiKey || aiSettings.apiKey,
        timeoutMs
      });
    }
    // 兜底返回 Ollama (Docker 友好地址)
    return new OllamaProvider({ baseUrl: 'http://host.docker.internal:11434' });
  }

  /**
   * 规范化超时时间：如果数值过小（<= 3600），视作秒，转为毫秒
   */
  normalizeTimeout(val) {
    const n = Number(val);
    if (!n || isNaN(n)) return 120000;
    if (n <= 3600) return n * 1000; // 秒转毫秒
    return n;
  }

  getDefaultPrompt() {
    return `你是一个专业的教育资源元数据提取助手。你的任务是从提供的 Markdown 文本中提取结构化信息。
请严格仅返回 JSON 格式，不要包含任何解释性文本或 Markdown 代码块标识。

JSON 结构需包含以下字段（符合 PRD 10.5.3）：
- title (string): 资源标题
- subject (string): 学科（如：数学, 语文, 英语, 物理, 化学等）
- grade (string): 年级标识（如：G1-G12, K1-K3, Y1-Y13）
- semester (string): 学期（上册, 下册, 全一册）
- materialType (string): 资料类型（教材, 试卷, 讲义, 练习册, 课件, 视频等）
- language (string): 语种（中文, 英文等）
- curriculum (string): 课程体系/版本（如：人教版, 北师大版, IB, A-Level）
- tags (array of strings): 3-8个关键词标签
- summary (string): 核心内容简述（不超过200字）
- confidence (number): 0-100 的整体识别置信度
- fieldConfidence (object): 各核心字段的置信度得分
- needsReview (boolean): 建议人工复核

无法判断的字段请填入空字符串或 "unknown"；不要编造信息。`;
  }

  async transition(job, update, eventName, level = 'info', payload = {}) {
    const success = await updateJob(job.id, update);
    if (success) {
      await logTaskEvent({
        taskId: job.parseTaskId,
        taskType: 'parse',
        event: eventName,
        level,
        message: update.message || `AI Job status changed to ${update.state}`,
        payload: {
          aiJobId: job.id,
          ...update,
          ...payload
        }
      });
    }
  }

  async streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf-8');
  }
}
