# Luceon2026 PRD（修订版）

版本：v0.3  
日期：2026-04-22  
基线代码：`e7a08ec711c113be02ed9e4c356651bb443adc7b`  
参考原型：<https://mineru.net/OpenSourceTools/Extractor>

---

## 1. 修订目标与范围

本版 PRD 只做三件事：

1. 基于当前代码事实重建“现状基线”。
2. 以官方 MinerU Extractor 的任务工作流为对齐目标，明确差距。
3. 输出下一阶段可执行、可验收的开发任务书。

本版不再混写“历史断点描述 + 已实现事项 + 未来建议”，统一采用“现状事实 / 目标要求 / 里程碑验收”结构。

---

## 2. 独立评审交叉核查结论

对外部“独立评审分析”进行交叉核查后的结论如下：

### 2.1 结论为“成立”的判断

- “上传即创建任务链路已打通”成立：前端上传走 `/__proxy/upload/tasks`，后端创建 Material + ParseTask。
- “后端已有 ParseTask Worker”成立：`server/services/queue/task-worker.mjs` 已运行并处理 `pending` 任务。
- “解析完成后自动创建 AI Job”成立：ParseTask Worker 会创建 `AiMetadataJob`。
- “AI 响应 JSON 提取鲁棒性已增强”成立：`AiMetadataWorker.extractJson()` 支持 `<think>` 清理、代码块提取、花括号兜底解析。

### 2.2 需要修正的判断

- “当前主要断点已整体消失”不成立。关键断点仍在：
  - 任务状态模型仍较粗（与官方状态链路不一致）。
  - 无统一任务事件推送（仍以页面手动刷新/轮询为主）。
  - 队列恢复与重试策略仍不完整（尤其 ParseTask 链路）。
  - 前端主入口仍以 Material 工作台为中心，尚未完全转为“新建任务 + 任务管理”双核心。

---

## 3. 当前产品事实基线（As-Is）

## 3.1 已具备能力

### 前端

- 路由已包含：`/workspace`、`/tasks`、`/tasks/:id`、`/library`、`/settings`。
- 顶层导航已出现“任务管理”入口。
- 上传可直接触发任务创建（通过 `/__proxy/upload/tasks`）。
- 已有任务列表页与任务详情页（可查看 ParseTask、TaskEvent、AiMetadataJob）。

### 后端

- `upload-server` + `db-server` + MinIO 结构已稳定运行。
- 新增 ParseTask 数据集合（`/tasks`）和 AiMetadataJob（`/ai-metadata-jobs`）。
- ParseTask Worker 已启动并自动处理 `pending` 任务。
- 本地 MinerU FastAPI `/tasks` 提交、轮询、结果获取链路已接入 worker。
- AI Worker 已支持多 provider 策略、fallback、低置信度转审核状态。
- AI 完成后会回填 Material 与 ParseTask 终态。

### 运维能力

- 完整备份/恢复、孤儿对象扫描与清理、存储统计能力已存在。
- Docker 代理链路中 `/__proxy/upload` 与 `/__proxy/db` 已固定。

## 3.2 当前架构特征

1. 数据模型处于“新旧并存”阶段：`Material` 与 `ParseTask` 并行存在，职责尚未完全解耦。
2. `upload-server.mjs` 仍是高耦合单体文件（上传、MinerU、AI、备份、审计等集中在一个入口）。
3. ParseTask Worker 采用“定时扫描 + 内存锁”模式，尚非完整持久队列框架。

## 3.3 已知现实约束

- ParseTask 轮询间隔当前为 10 秒（并非官方参考的 5 秒节奏）。
- ParseTask Worker 在本地 MinerU路径下未保留 Gradio 降级执行。
- 任务事件目前可查询（`/task-events`），但未提供统一 SSE 事件流接口。
- 任务操作 API 仍偏基础（缺少标准化重试/取消/批量动作端点）。

---

## 4. 与官方原型的差距（Gap）

官方原型核心体验是：

**上传文件 → 创建任务 → 队列推进 → 状态可见 → 结果可查 → 失败可重试 → 结果可导出**

Luceon2026 当前差距：

1. **状态机差距**：尚未形成覆盖上传/排队/解析/产物处理/AI/审核/完成的统一状态标准。
2. **任务控制差距**：缺少面向任务的标准动作（retry/cancel/reparse/batch retry）。
3. **实时性差距**：缺少统一实时推送层，任务管理页实时性与可感知性不足。
4. **职责边界差距**：前端仍保留较强 Material 视角，任务视角尚未成为唯一事实源。
5. **后端分层差距**：任务编排已出现，但服务拆分尚不充分。

---

## 5. 产品定位（v0.3 统一口径）

Luceon2026 的定位：

> 面向教育文档场景的本地化“解析任务工作台”。以官方 MinerU 的任务体验为基线，以本地 MinerU 解析 + AI 元数据识别为核心能力，沉淀可审核、可检索、可复用的教学资源资产。

---

## 6. 目标与非目标

## 6.1 下一阶段目标（P0）

1. 完成“任务为中心”的主链路闭环（创建、推进、查看、重试、完成）。
2. 固化统一任务状态机与状态映射规则。
3. 建立可恢复的任务执行与异常补偿机制（服务重启后可持续推进）。
4. 将 AI 元数据识别稳定纳入主流水线（默认自动触发，可单任务重跑）。

## 6.2 非目标（本阶段不做）

- 不做多租户权限系统。
- 不做官方客户端化学高级能力完整复刻。
- 不做支付/额度体系。
- 不做复杂 BPM 工作流引擎。

---

## 7. 核心用户流程（To-Be）

## 7.1 单文件标准流程

1. 用户在“新建任务”上传文件并提交参数。
2. 系统创建 `Material` 与 `ParseTask`，状态进入 `pending`。
3. Worker 执行本地 MinerU 解析，落库 `full.md`。
4. 系统自动创建并执行 `AiMetadataJob`。
5. AI 完成后，任务进入 `confirmed` 或 `review-pending` 对应终态。
6. 用户在任务详情中查看产物与元数据，完成审核后进入资源库。

## 7.2 失败恢复流程

1. 任务失败后可针对失败阶段重试（而非整链路重跑）。
2. 服务重启后自动扫描未终态任务并恢复执行。
3. 若解析产物缺失但任务已推进，系统回滚到可重试阶段并记录事件。

---

## 8. 功能需求（按优先级）

## 8.1 P0（必须完成）

### A. 统一任务状态机

定义并落地统一状态：

- 主状态：`pending` / `running` / `result-store` / `ai-pending` / `review-pending` / `completed` / `failed`
- 每次状态变更必须写入 `task-events`。
- 前端所有任务页面只读任务状态机，不再自行推导“真实状态”。

### B. 标准任务动作 API

新增/规范以下业务端点（由 upload-server 提供业务语义）：

- `POST /tasks/:id/retry`
- `POST /tasks/:id/reparse`
- `POST /tasks/:id/cancel`
- `POST /tasks/batch/retry`

### C. 任务管理页增强

- 支持按状态筛选、搜索、失败聚合。
- 提供单任务重试与批量重试。
- 在列表中展示阶段、进度、最近事件。

### D. 任务详情页增强

- 展示解析产物（至少 full.md 预览/下载）。
- 展示 AI 结果、置信度与审核状态。
- 展示完整事件时间线。

### E. 重启恢复与一致性补偿

- 启动时扫描 `pending/running/ai-pending` 任务。
- 对异常状态执行补偿（重置、重试或标记失败）。
- 所有补偿动作写入 `task-events`。

## 8.2 P1（应完成）

- 任务事件 SSE 推送接口（替代高频手动刷新）。
- `upload-server` 分层拆分（routes/services）。
- 任务与资源库字段映射标准化（减少 Material 与 ParseTask 冗余字段）。

## 8.3 P2（可延后）

- 收藏/内容块管理（对齐官方 collections）。
- 更细粒度阶段可视化（上传、轮询、存储、AI 子阶段）。

---

## 9. 数据模型规范（v0.3）

## 9.1 Material（资料主数据）

职责：文件与资源资产归档，不承担任务编排事实源。

## 9.2 ParseTask（任务事实源）

最小必填字段：

- `id`, `materialId`, `engine`, `stage`, `state`, `progress`
- `optionsSnapshot`
- `metadata.markdownObjectName`, `metadata.mineruTaskId`
- `createdAt`, `updatedAt`, `completedAt`

## 9.3 AiMetadataJob

最小必填字段：

- `id`, `parseTaskId`, `state`, `progress`
- `providerId`, `model`
- `result`, `confidence`, `needsReview`
- `createdAt`, `updatedAt`, `completedAt`

## 9.4 TaskEvent

要求：所有任务推进、失败、补偿、重试动作都必须落事件日志。

---

## 10. 技术实现原则

1. **后端为任务事实源**：前端不得自行“猜测”最终状态。
2. **任务参数快照不可变**：重试默认使用创建时参数快照。
3. **失败可恢复优先于一步到位成功**：先保证可重试与可追踪。
4. **与官方对齐的是“交互模型”，不是逐 API 复刻**。

---

## 11. 里程碑

### M1（任务基础能力收口）

- 统一状态机与状态映射。
- 补齐 retry/reparse/cancel API。
- 任务管理页支持失败重试。

### M2（实时可见与恢复）

- 增加任务事件推送（SSE）。
- 实现启动恢复与一致性补偿流程。

### M3（结构化重构）

- 拆分 `upload-server.mjs`。
- 固化任务域与资源域边界。

---

## 12. 验收标准

## 12.1 主链路验收

- 上传后可在任务管理页看到任务并自动推进。
- 解析完成后自动进入 AI 任务。
- AI 完成后任务进入 `completed` 或 `review-pending`。

## 12.2 异常与恢复验收

- 故障任务支持单任务重试。
- 服务重启后未终态任务可继续推进。
- 每个任务均可在详情页看到完整事件日志。

## 12.3 一致性验收

- ParseTask 与 AiMetadataJob 关联关系可追溯。
- 任务终态与资源库状态映射一致，无“已完成但无产物”假完成。

---

## 13. 风险与应对

1. **本地 MinerU 接口版本差异**：通过 adapter 层隔离并记录能力矩阵。
2. **AI 输出不稳定**：保留 JSON 抽取兜底 + 失败降级 + 审核分流。
3. **状态漂移风险**：以 ParseTask 为唯一任务事实源并强制事件化。
4. **单体服务复杂度增长**：按里程碑执行服务拆分，避免继续堆积。

---

## 14. 下一步执行清单（直接用于开发）

1. 实现任务动作 API：retry/reparse/cancel（含事件日志）。
2. 改造任务管理页：失败筛选 + 单/批重试。
3. 实现启动恢复扫描：补偿 `pending/running/ai-pending`。
4. 增加任务事件 SSE 推送并接入任务页实时刷新。
5. 完成 `upload-server` 第一阶段拆分（task routes + worker services）。

