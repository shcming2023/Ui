/**
 * task-worker.mjs - ParseTask 任务执行器骨架
 * 
 * 约束要求：
 * 1. 模拟执行需明确标记 "worker skeleton"
 * 2. 内存锁防重复处理
 * 3. 常量化轮询与延迟配置
 */

import { getAllTasks, updateTask } from '../tasks/task-client.mjs';
import { logTaskEvent } from '../logging/task-events.mjs';

// 约束 3: 集中配置常量
const POLL_INTERVAL_MS = 10000; // 10秒检查一次
const SIMULATED_DELAY_MS = 5000; // 每个阶段模拟耗时 5秒

// 约束 2: 内存队列锁，防止同一个实例中的多个 tick 重复处理
const processingMap = new Set();

export class ParseTaskWorker {
  constructor() {
    this.timer = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[task-worker] ParseTask Worker started (skeleton mode)');
    this.tick();
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
    this.isRunning = false;
    console.log('[task-worker] ParseTask Worker stopped');
  }

  async tick() {
    try {
      await this.scanAndProcess();
    } catch (error) {
      console.error(`[task-worker] Error in tick: ${error.message}`);
    } finally {
      if (this.isRunning) {
        this.timer = setTimeout(() => this.tick(), POLL_INTERVAL_MS);
      }
    }
  }

  async scanAndProcess() {
    const tasks = await getAllTasks();
    const pendingTasks = tasks.filter(t => t.state === 'pending');

    for (const task of pendingTasks) {
      if (processingMap.has(task.id)) continue;
      
      // 异步处理，不阻塞 tick 扫描下一个
      this.processTask(task);
    }
  }

  async processTask(task) {
    processingMap.add(task.id);
    console.log(`[task-worker] Picked up task: ${task.id} (worker skeleton)`);

    try {
      // 1. 进入 running 状态 (模拟过程)
      await this.transition(task, {
        stage: 'process',
        state: 'running',
        progress: 10,
        message: '[worker skeleton] 正在解析文档结构...'
      }, 'worker-picked');

      await this.sleep(SIMULATED_DELAY_MS);

      // 2. 模拟中途进度
      await this.transition(task, {
        progress: 50,
        message: '[worker skeleton] 正在提取文本与表格内容...'
      }, 'progress-update');

      await this.sleep(SIMULATED_DELAY_MS);

      // 3. 进入 result-store 状态
      await this.transition(task, {
        stage: 'store',
        state: 'result-store',
        progress: 80,
        message: '[worker skeleton] 正在保存解析产物到存储后端...'
      }, 'stage-changed');

      await this.sleep(SIMULATED_DELAY_MS);

      // 4. 完成模拟，进入已就绪待 AI 处理状态
      await this.transition(task, {
        stage: 'complete',
        state: 'ai-pending',
        progress: 100,
        message: '[worker skeleton] 解析完成（模拟），等待 AI 元数据识别',
        completedAt: new Date().toISOString()
      }, 'worker-completed');

    } catch (error) {
      console.error(`[task-worker] Task ${task.id} failed: ${error.message}`);
      await this.transition(task, {
        state: 'failed',
        errorMessage: error.message,
        message: `[worker skeleton] 执行失败: ${error.message}`
      }, 'worker-failed', 'error');
    } finally {
      processingMap.delete(task.id);
    }
  }

  async transition(task, update, eventName, level = 'info') {
    const success = await updateTask(task.id, update);
    if (success) {
      await logTaskEvent({
        taskId: task.id,
        event: eventName,
        level,
        message: update.message || `Status changed to ${update.state}`,
        payload: update
      });
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
