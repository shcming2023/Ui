# MinIO / MinerU / Ollama 集成状态语义模型与自动恢复策略 v1.0

日期：2026-04-25  
作者：Lucia  
适用范围：Luceon2026 生产交付前 P0/P1 收口阶段  
关联文档：
- `docs/prd/Luceon2026-PRD-v0.4.md`
- `docs/reviews/PRD-v0.4-状态与追踪模型收口修订建议.md`
- `docs/reviews/任务状态诊断说明.md`

## 1. 结论

Luceon2026 的生产准入阻塞，已经不是单一页面、单一接口或单一 Worker 的问题，而是本地 MinIO、MinerU、Ollama 与 Luceon 主系统之间的**状态语义没有形成统一裁决模型**。

后续所有 P0/P1 修复必须遵守本文件：

1. 每一个状态必须有事实来源。
2. 每一个状态必须原子化、结构化、标准化。
3. `failed` 只能由明确失败证据裁决，不能由本地等待超时、页面刷新、网络中断等间接现象直接裁决。
4. 自动恢复动作必须由状态驱动，禁止无证据重启、无证据重试、无证据重复提交。
5. 用户在任务列表、任务详情页、资产详情页、系统健康页看到的状态，必须能追溯到同一套事实源。

## 2. 第一性原理

Luceon2026 的核心任务不是“上传文件”，而是把一个教育资料加工成可管理、可检索、可审核、可导出的教育内容资产。

一次完整加工链路包含：

1. 文件进入 MinIO 原始对象存储。
2. Luceon 创建 ParseTask。
3. MinerU 执行解析。
4. MinerU 返回 Markdown、JSON、图片、原文件等解析产物。
5. Luceon 将解析产物完整入库 MinIO。
6. Ollama / AI Worker 基于解析结果提取教育元数据。
7. 人工审核并归档。

因此状态判断必须回答三个问题：

1. **事实在哪里**：状态来自 API、日志、对象存储，还是 Luceon 自己的 DB？
2. **系统在做什么**：排队、解析、存储、AI 分析、审核，必须是单一阶段语义。
3. **是否需要动作**：继续等待、提示观察、接回结果、重试、重启、人工清理，必须由证据触发。

## 3. 事实源分层

### 3.1 Luceon DB

Luceon DB 是任务编排与用户可见生命周期的事实源，但不是外部系统执行状态的唯一事实源。

主要对象：

| 对象 | 职责 |
| :--- | :--- |
| `ParseTask` | 一次加工请求的生命周期事实源。表达任务状态、阶段、进度、错误、关联 material、外部任务 ID、结果入库信息。 |
| `Material` | 原始素材与最终元数据事实源。表达文件名、类型、大小、原始对象、最终审核元数据。 |
| `AIJob` | AI 元数据提取任务事实源。表达 Ollama 调用状态、结果、失败原因。 |

### 3.2 MinIO

MinIO 是文件对象事实源。

关键路径：

| 路径 | 语义 |
| :--- | :--- |
| `originals/{materialId}/source.*` | 用户上传的原始文件。 |
| `parsed/{materialId}/` | MinerU 返回并由 Luceon 保存的完整解析产物目录。 |
| `parsed/{materialId}/full.md` | Luceon 规范化后的主 Markdown 文件。 |
| `parsed/{materialId}/mineru-result.zip` | MinerU 原始 ZIP 快照。 |

MinIO 状态只回答“对象是否存在、是否完整、能否读取”，不回答任务是否仍在执行。

### 3.3 MinerU API

MinerU API 是解析任务执行状态的主事实源。

关键事实：

| MinerU API 事实 | Luceon 语义 |
| :--- | :--- |
| `task_id` 已返回 | 已成功提交到 MinerU，后续不得重复提交。 |
| `status=queued/pending` | MinerU 已接收但尚未开始处理。 |
| `status=processing` | MinerU 正在处理。 |
| `status=completed/done/success` | MinerU 已完成，必须尝试拉取 result。 |
| `status=failed/error/canceled` | MinerU 明确失败，可进入失败裁决。 |
| `queued_ahead > 0` | 排队中，应展示排队语义，不应展示正在解析。 |

### 3.4 MinerU 日志

MinerU 日志是细粒度阶段进度的辅助事实源。

用途：

1. 补足 MinerU API 不返回细粒度进度的问题。
2. 判断 `processing` 是否真的有推进。
3. 判断是否出现停滞。

限制：

1. 日志进度是**阶段进度**，不是全局总进度。
2. 只有能唯一归因到当前任务时，才允许展示为任务进度。
3. 日志文件 mtime 不是进度更新时间。只有 tqdm 阶段、百分比、current/total 变化，或日志行自带时间戳，才可作为进度更新时间。

### 3.5 Ollama / AI Worker

Ollama 是元数据提取执行事实源，但当前通常由 Luceon AI Worker 封装调用。

关键事实：

| AI 事实 | Luceon 语义 |
| :--- | :--- |
| AIJob 已创建 | 进入 AI 阶段。 |
| AI 请求中 | `ai-processing`，不得影响 MinerU 已完成事实。 |
| Ollama timeout 但请求不确定 | 不直接判定解析失败，只能判定 AI 阶段待恢复。 |
| Ollama 明确错误 | AI 阶段失败，可允许重试 AI，不应重跑 MinerU。 |
| AI 返回 `needsReview=true` | 进入人工复核，不可因 confidence 高而自动完成。 |

## 4. Canonical 状态模型

### 4.1 顶层任务状态

`ParseTask.state` 建议只表达任务的用户可见生命周期：

| Canonical State | 含义 | 是否终态 |
| :--- | :--- | :--- |
| `pending` | Luceon 已创建任务，尚未提交外部系统。 | 否 |
| `running` | 任务正在外部系统或本地 Worker 中推进。 | 否 |
| `review-pending` | 解析与 AI 已完成，但需要人工复核。 | 否 |
| `completed` | 人工审核或自动规则确认后归档完成。 | 是 |
| `failed` | 已有明确失败证据，且自动恢复不可继续推进。 | 是 |
| `canceled` | 人工取消。 | 是 |

### 4.2 阶段状态

`ParseTask.stage` 表达任务当前所在阶段：

| Stage | 主事实源 | 含义 |
| :--- | :--- | :--- |
| `upload-stored` | MinIO | 原始文件已入库。 |
| `mineru-submitted` | MinerU API | 已提交 MinerU，已有 `mineruTaskId`。 |
| `mineru-queued` | MinerU API | MinerU 已接收但未开始。 |
| `mineru-processing` | MinerU API + 日志 | MinerU 正在解析。 |
| `mineru-stale-warning` | MinerU API + 日志 | MinerU 仍 processing，但日志短期无真实进展。 |
| `mineru-stale-critical` | MinerU API + 日志 | MinerU 长时间无真实进展，需要恢复动作。 |
| `result-fetching` | MinerU API | MinerU 完成，正在拉取 result。 |
| `result-store` | MinIO | 解析产物正在入库。 |
| `parsed-stored` | MinIO | 解析产物已完整入库。 |
| `ai-processing` | AIJob / Ollama | AI 元数据提取中。 |
| `review` | Luceon DB | 等待人工复核。 |
| `done` | Luceon DB | 完成。 |
| `failed` | 多事实源裁决 | 失败。 |

### 4.3 外部系统状态结构

建议在 `ParseTask.metadata` 中维护结构化外部状态快照：

```json
{
  "external": {
    "mineru": {
      "taskId": "a8b51d08-a206-4b88-adb0-ed6891be3eb5",
      "apiStatus": "processing",
      "stage": "OCR-rec Predict",
      "queuedAhead": 0,
      "startedAt": "2026-04-25T00:12:22.388Z",
      "completedAt": null,
      "logProgress": {
        "phase": "OCR-rec Predict",
        "current": 120,
        "total": 144,
        "percent": 83,
        "lastProgressObservedAt": "2026-04-25T01:22:12.224Z",
        "freshness": "active"
      }
    },
    "minio": {
      "originalObjectName": "originals/{materialId}/source.pdf",
      "parsedPrefix": "parsed/{materialId}/",
      "parsedFilesCount": 94,
      "artifactCompleteness": "complete"
    },
    "ollama": {
      "aiJobId": "ai-job-...",
      "status": "processing",
      "lastObservedAt": "2026-04-25T01:30:00.000Z"
    }
  }
}
```

该结构不要求一次性重构完成，但后续 P0/P1 任务必须朝这个方向收敛。

## 5. 失败裁决原则

### 5.1 不得直接裁决 failed 的情况

以下情况只能进入“观察、排队、恢复待确认”语义，不能直接进入 `failed`：

| 现象 | 正确语义 |
| :--- | :--- |
| Luceon 本地等待 MinerU 超时 | `running + mineru-processing` 或 `mineru-stale-*` |
| HTTP 请求 abort | 请求中断，不代表外部任务失败。 |
| 前端页面刷新 | UI 生命周期变化，不影响任务事实。 |
| Worker 重启 | 需要 recovery scan，不代表任务失败。 |
| MinerU 日志很慢但仍推进 | 长耗时处理中。 |
| Ollama timeout | AI 阶段不确定，不影响 MinerU 解析结果。 |

### 5.2 可以裁决 failed 的情况

只有以下证据成立时，才允许进入 `failed`：

| 失败证据 | 裁决 |
| :--- | :--- |
| MinerU API 明确返回 `failed/error/canceled` | MinerU 阶段失败。 |
| MinerU API 显示 completed，但 result 多次不可取且返回明确错误 | result 获取失败。 |
| MinIO 原始对象缺失 | 不可重跑，进入人工审计。 |
| MinIO parsed 入库失败且重试耗尽 | parsed-store 失败。 |
| Ollama 明确返回错误，且 AI 重试耗尽 | AI 阶段失败。 |
| MinerU `processing` 且日志 `stale-critical`，深度探活和恢复动作失败 | MinerU 停滞失败。 |

## 6. 自动恢复策略

自动恢复必须遵循“先确认事实，再执行动作”的顺序。

### 6.1 MinerU 恢复策略

| 状态组合 | 自动动作 | 禁止动作 |
| :--- | :--- | :--- |
| `mineruTaskId` 存在，MinerU API `queued/processing` | 保持 running，继续轮询；展示排队/进度。 | 禁止重复 POST `/tasks`。 |
| MinerU API `processing`，日志 active | 继续观察。 | 禁止重启 MinerU。 |
| MinerU API `processing`，日志 stale-warning | 提示可能停滞，继续观察或执行深度探活。 | 禁止立即 failed。 |
| MinerU API `processing`，日志 stale-critical | 执行深度探活；必要时人工确认后重启 MinerU。 | 禁止静默重启并重复提交。 |
| Luceon `failed`，MinerU API `completed`，result 可取 | 纠正 Luceon 错误终态，拉取 result 并入库。 | 禁止重新解析。 |
| MinerU API `failed/error/canceled` | 标记 MinerU 阶段失败，允许用户重试解析。 | 禁止自动无限重试。 |
| MinerU API 404，但 Luceon 有 `mineruTaskId` | 标记为不可确认，进入人工审计。 | 禁止无提示重新提交。 |

### 6.2 MinIO 恢复策略

| 状态组合 | 自动动作 | 禁止动作 |
| :--- | :--- | :--- |
| original 存在，parsed 缺失，MinerU 未完成 | 等待 MinerU。 | 禁止伪造 parsed 完成。 |
| original 存在，MinerU completed，parsed 缺失 | 拉取 result 并入库。 | 禁止重复提交 MinerU。 |
| original 缺失，任务未完成 | 标记不可恢复，进入审计。 | 禁止重跑。 |
| parsedFilesCount 与 MinIO 实际对象数不一致 | 重新对账 metadata。 | 禁止删除对象，除非人工确认。 |
| orphan-object | 只读提示，人工确认后选择性清理。 | 禁止默认全量删除。 |

### 6.3 Ollama / AI 恢复策略

| 状态组合 | 自动动作 | 禁止动作 |
| :--- | :--- | :--- |
| parsed-stored 已完成，AIJob pending | 启动 AIJob。 | 禁止重跑 MinerU。 |
| AIJob running，Ollama 健康 | 继续等待。 | 禁止直接 failed。 |
| AIJob running 超过阈值，Ollama 不健康 | 标记 AI stale，允许 AI 重试。 | 禁止重跑 MinerU。 |
| AIJob failed | 允许重试 AI。 | 禁止删除 parsed 产物。 |
| AI 返回 needsReview | 进入 review-pending。 | 禁止自动完成。 |

## 7. 页面展示要求

用户看到任务状态时，必须能知道状态来自哪里。

### 7.1 任务列表

任务列表应展示：

| 字段 | 示例 |
| :--- | :--- |
| 总状态 | `运行中` |
| 当前阶段 | `MinerU 正在解析` |
| 事实来源 | `MinerU API + 本地日志` |
| 阶段进度 | `OCR-rec Predict 120/144` |
| 新鲜度 | `刚刚更新 / 8 分钟未更新 / 16 分钟未更新` |
| 操作建议 | `继续等待 / 深度探活 / 人工清障` |

### 7.2 任务详情页

任务详情页应展示结构化诊断矩阵：

1. Luceon ParseTask 状态。
2. MinIO 原始对象状态。
3. MinerU API 状态。
4. MinerU 日志观测状态。
5. MinIO parsed 入库状态。
6. Ollama / AIJob 状态。
7. 当前推荐动作。

### 7.3 系统健康页

系统健康页不应只显示 `/health` 是否 200。必须区分：

| 健康项 | 语义 |
| :--- | :--- |
| MinIO reachable | 对象存储可用。 |
| MinerU API reachable | API 可访问。 |
| MinerU deep probe | 真实提交/解析链路可用。 |
| MinerU slot status | 当前解析槽是否被占用。 |
| MinerU log observation | 是否能读取真实日志进度。 |
| Ollama reachable | 模型服务可访问。 |
| Ollama inference probe | 真实推理链路可用。 |

## 8. 当前已暴露问题的归类

### 8.1 复杂 PDF 长耗时被 Luceon 误判 failed

现象：

- Luceon 任务进入 `failed`。
- MinerU 内部任务仍 `processing`，日志持续推进。
- 后续 MinerU 完成并可取 result，但 Luceon parsed 目录为空。

正确裁决：

- Luceon 不应因本地 timeout 直接 failed。
- 应保持 `running + mineru-processing`，直到 MinerU API 给出终态。
- 若历史上已经误判 failed，但 MinerU completed 且 result 可取，应纠正终态并接回结果。

### 8.2 页面显示“解析中”但实际是排队

正确裁决：

- `queued_ahead > 0` 或 MinerU API `queued/pending` 时，显示 `MinerU 排队中`。
- 只有 MinerU API `processing` 且日志或 startedAt 证明开始处理，才显示 `MinerU 正在解析`。

### 8.3 日志文件 mtime 更新但进度未更新

正确裁决：

- health check 日志导致文件 mtime 更新，不代表解析进度更新。
- 只有进度行变化或日志行时间戳变化，才代表真实进度更新。

## 9. 后续实施分批原则

本模型是上位契约，但代码实施必须小批量、可验收。

建议顺序：

1. **P0-1 MinerU 长耗时状态裁决与错误 failed 纠偏**。
2. P0-2 MinIO parsed 对账与结果入库完整性裁决。
3. P1-1 Ollama AIJob timeout / stale 语义收口。
4. P1-2 任务详情页三系统诊断矩阵标准化。
5. P2 运维手册与审计报告字段对齐。

每一批任务必须满足：

1. 不扩功能。
2. 不改业务主流程目标。
3. 不重复提交外部任务。
4. 不删除已有产物。
5. 完成后主动同步 GitHub，并提交开发报告。

## 10. 给 lucode 的最小 P0 任务书

### 任务名称

《P0 MinerU 长耗时状态裁决与错误 failed 纠偏收口任务书》

### 背景

当前真实复验发现：复杂 PDF 在 MinerU 本地解析时耗时较长，MinerU API 与日志均证明任务仍在正常执行，但 Luceon 因本地等待超时将 ParseTask 标记为 `failed`。随后 MinerU 实际完成并可下载 result ZIP，但 Luceon 未接回结果，导致 `parsed/{materialId}/` 为空。

这违反本状态模型的核心原则：**HTTP timeout 不等于业务失败；MinerU 已有 taskId 后，MinerU API 与日志才是解析阶段事实源。**

### 修改范围

允许修改：

- `server/services/mineru/local-adapter.mjs`
- `server/services/queue/task-worker.mjs`
- `server/lib/ops-mineru-diagnostics.mjs`
- 必要的 server smoke test
- 必要的 UAT test
- `说明文档.md`

禁止修改：

- MinerU 官方源码
- 上传队列交互
- parsed-zip 导出逻辑
- Ollama / AI 业务逻辑
- 无关页面 UI

### 必须实现

1. **timeout 语义修正**
   - Luceon 等待 MinerU 的本地 timeout / AbortError 不得直接把任务置为 `failed`。
   - 如果已有 `metadata.mineruTaskId`，必须查询 MinerU `/tasks/{id}` 后再裁决。

2. **MinerU processing 保持 running**
   - 若 MinerU 返回 `queued/pending/processing`，ParseTask 必须保持 `state=running`。
   - `stage` 根据 MinerU API 与日志分别设置为 `mineru-queued`、`mineru-processing`、`mineru-stale-warning`、`mineru-stale-critical`。

3. **错误 failed 纠偏**
   - recovery scan 中若发现 `ParseTask.state=failed` 但 `metadata.mineruTaskId` 仍存在：
     - 若 MinerU API `queued/processing`：纠正回 `running`，继续观察，不重新提交。
     - 若 MinerU API `completed` 且 result 可取：拉取 result，完整入库 `parsed/{materialId}/`，恢复 metadata，并进入后续 AI 或 review 流程。
     - 若 MinerU API `failed/error/canceled`：保持 failed，并写明 MinerU 明确失败证据。

4. **失败裁决证据**
   - 只有 MinerU 明确失败、result 明确不可取且重试耗尽、MinIO 原始对象缺失、或 stale-critical 恢复失败，才允许进入 failed。
   - failed message 必须包含事实来源，例如 `MinerU API returned failed`、`original object missing`。

5. **不得重复提交**
   - 只要已有 `mineruTaskId`，任何恢复路径都禁止重新 POST MinerU `/tasks`。

### 必须新增/更新测试

1. server smoke：模拟 MinerU processing 超过本地 timeout，断言 Luceon 不进入 failed。
2. server smoke：模拟 `failed + mineruTaskId + MinerU completed + result zip`，断言能纠偏并入库。
3. server smoke：模拟 `failed + mineruTaskId + MinerU failed`，断言保持 failed 且 message 有明确证据。
4. UAT：任务详情页展示长耗时 running / mineru-processing，不显示错误 failed。

### 验收命令

```bash
cd /Users/concm/prod_workspace/Luceon2026
node --check server/services/mineru/local-adapter.mjs
node --check server/services/queue/task-worker.mjs
node --check server/lib/ops-mineru-diagnostics.mjs
npx tsc --noEmit
npm run build
node server/tests/worker-smoke.mjs
node server/tests/mineru-diagnostics-smoke.mjs
```

若新增 smoke 文件，也必须一并运行。

### 交付要求

lucode 完成后必须：

1. 主动 `git pull --rebase origin main`。
2. 提交清晰 commit。
3. 主动 `git push origin main`。
4. 在开发报告中写明：
   - Commit Hash
   - 修改文件清单
   - timeout 如何裁决
   - failed 如何纠偏
   - 哪些情况下仍允许 failed
   - 如何保证不重复提交 MinerU
   - 测试命令结果

