/**
 * task-events.mjs - 任务事件记录服务
 * 
 * 负责将任务状态变更等关键信息写入 db-server 的 taskEvents 集合。
 */

const DB_BASE_URL = process.env.DB_BASE_URL || 'http://localhost:8789';

export async function logTaskEvent({ taskId, taskType = 'parse', level = 'info', event, message, payload = {} }) {
  const eventId = `evt-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  const eventData = {
    id: eventId,
    taskId,
    taskType,
    level,
    event,
    message,
    payload,
    createdAt: new Date().toISOString()
  };

  try {
    const resp = await fetch(`${DB_BASE_URL}/task-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });

    if (!resp.ok) {
      console.error(`[task-events] Failed to log event to db-server: HTTP ${resp.status}`);
    }
  } catch (error) {
    // 约束 4: 写入失败不能导致 worker 崩溃，但必须记录服务端日志
    console.error(`[task-events] Network error logging event: ${error.message}`);
  }
}
