/**
 * task-events-bus.mjs — 进程内任务事件总线
 *
 * 用途（PRD v0.4 P0 §10.2.2）：
 *   - Worker（ParseTask/AI）产生状态变更或关键事件时，通过 `emit('task-update', payload)` 广播；
 *   - SSE 路由 `/tasks/stream` 订阅该总线并通过 text/event-stream 推送到前端；
 *   - 任务动作 API（Retry/Reparse/Re-AI/...）同样向总线 emit，以便订阅者即时感知。
 *
 * 设计要点：
 *   1. 单进程内 EventEmitter，不跨进程；upload-server 是单一 Worker 宿主，满足 v0.4 需求；
 *   2. 事件总线 `emit` 失败永不影响主流程（Worker/路由捕获异常并降级为 console.warn）；
 *   3. 事件 payload 结构稳定：{ taskId, event, level, update?, at }。
 */

import { EventEmitter } from 'events';

class TaskEventBus extends EventEmitter {
  constructor() {
    super();
    // 订阅者可能较多（SSE 多浏览器 Tab），放宽默认 10 的监听上限
    this.setMaxListeners(200);
  }
}

const bus = new TaskEventBus();
export default bus;
export { bus as taskEventBus };
