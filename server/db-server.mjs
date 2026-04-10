/**
 * db-server.mjs — 持久化 REST API（JSON 文件存储）
 *
 * 端口：8789（通过 DB_PORT 环境变量覆盖）
 * 数据文件：server/db-data.json（本地开发）/ /data/db-data.json（Docker）
 *
 * 与原 SQLite 版本保持完全相同的 REST API 接口，
 * 底层改为 JSON 文件，避免 better-sqlite3 原生模块编译问题。
 */

import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = Number(process.env.DB_PORT || 8789);

// 数据文件路径：优先 /data（Docker volume），否则 server/ 目录
const DATA_PATH = (() => {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  try {
    mkdirSync('/data', { recursive: true });
    return '/data/db-data.json';
  } catch {
    return path.join(__dirname, 'db-data.json');
  }
})();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// 请求日志（方便排查）
app.use((req, _res, next) => {
  if (req.method !== 'GET') {
    console.log(`[db-server] ${req.method} ${req.path}`, req.method !== 'GET' ? JSON.stringify(req.body).slice(0, 200) : '');
  }
  next();
});

// ─── JSON 文件读写 ─────────────────────────────────────────────

const EMPTY_DB = {
  materials: {},       // id → Material
  assetDetails: {},    // id → AssetDetail
  processTasks: {},    // id → ProcessTask
  tasks: {},           // id → Task
  products: {},        // id → Product
  flexibleTags: {},    // id → FlexibleTag
  aiRules: {},         // id → AiRule
  settings: {},        // key → value
};

function readDB() {
  try {
    if (!existsSync(DATA_PATH)) return structuredClone(EMPTY_DB);
    const raw = readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    // 兼容缺失字段
    return { ...EMPTY_DB, ...parsed };
  } catch {
    return structuredClone(EMPTY_DB);
  }
}

function writeDB(db) {
  try {
    const dir = path.dirname(DATA_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(DATA_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('[db-server] Failed to write DB:', e.message);
  }
}

console.log(`[db-server] Data file: ${DATA_PATH}`);

// ─── Health ───────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'db-server', dataPath: DATA_PATH });
});

// ─── Materials ────────────────────────────────────────────────

app.get('/materials', (_req, res) => {
  const db = readDB();
  const list = Object.values(db.materials).sort((a, b) => b.id - a.id);
  res.json(list);
});

app.get('/materials/:id', (req, res) => {
  const db = readDB();
  const item = db.materials[req.params.id];
  if (!item) { res.status(404).json({ error: 'not found' }); return; }
  res.json(item);
});

app.post('/materials', (req, res) => {
  const item = req.body;
  if (!item?.id) { res.status(400).json({ error: '缺少 id' }); return; }
  const db = readDB();
  db.materials[item.id] = item;
  writeDB(db);
  res.json({ ok: true, id: item.id });
});

app.put('/materials/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  db.materials[id] = { ...req.body, id: Number(id) };
  writeDB(db);
  res.json({ ok: true, id });
});

app.patch('/materials/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const existing = db.materials[id];
  if (!existing) { res.status(404).json({ error: 'not found' }); return; }
  const merged = {
    ...existing,
    ...req.body,
    ...(req.body.metadata ? { metadata: { ...existing.metadata, ...req.body.metadata } } : {}),
  };
  db.materials[id] = merged;
  writeDB(db);
  res.json({ ok: true, id, data: merged });
});

app.delete('/materials', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '缺少 ids 数组' }); return;
  }
  const db = readDB();
  for (const id of ids) {
    delete db.materials[id];
    delete db.assetDetails[id]; // 联动删除
  }
  writeDB(db);
  res.json({ ok: true, deleted: ids.length });
});

// ─── Asset Details ────────────────────────────────────────────

app.get('/asset-details', (_req, res) => {
  const db = readDB();
  res.json(db.assetDetails);
});

app.get('/asset-details/:id', (req, res) => {
  const db = readDB();
  const item = db.assetDetails[req.params.id];
  if (!item) { res.status(404).json({ error: 'not found' }); return; }
  res.json(item);
});

app.put('/asset-details/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  db.assetDetails[id] = { ...req.body, id: Number(id) };
  writeDB(db);
  res.json({ ok: true, id });
});

// ─── Process Tasks ────────────────────────────────────────────

app.get('/process-tasks', (_req, res) => {
  const db = readDB();
  const list = Object.values(db.processTasks).sort((a, b) => b.id - a.id);
  res.json(list);
});

app.post('/process-tasks', (req, res) => {
  const item = req.body;
  if (!item?.id) { res.status(400).json({ error: '缺少 id' }); return; }
  const db = readDB();
  db.processTasks[item.id] = item;
  writeDB(db);
  res.json({ ok: true, id: item.id });
});

app.patch('/process-tasks/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const existing = db.processTasks[id];
  if (!existing) { res.status(404).json({ error: 'not found' }); return; }
  db.processTasks[id] = { ...existing, ...req.body };
  writeDB(db);
  res.json({ ok: true, id });
});

// ─── Tasks ────────────────────────────────────────────────────

app.get('/tasks', (_req, res) => {
  const db = readDB();
  res.json(Object.values(db.tasks));
});

app.post('/tasks', (req, res) => {
  const item = req.body;
  if (!item?.id) { res.status(400).json({ error: '缺少 id' }); return; }
  const db = readDB();
  db.tasks[item.id] = item;
  writeDB(db);
  res.json({ ok: true, id: item.id });
});

app.patch('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const existing = db.tasks[id];
  if (!existing) { res.status(404).json({ error: 'not found' }); return; }
  db.tasks[id] = { ...existing, ...req.body };
  writeDB(db);
  res.json({ ok: true, id });
});

// ─── Products ─────────────────────────────────────────────────

app.get('/products', (_req, res) => {
  const db = readDB();
  const list = Object.values(db.products).sort((a, b) => b.id - a.id);
  res.json(list);
});

app.post('/products', (req, res) => {
  const item = req.body;
  if (!item?.id) { res.status(400).json({ error: '缺少 id' }); return; }
  const db = readDB();
  db.products[item.id] = item;
  writeDB(db);
  res.json({ ok: true, id: item.id });
});

app.delete('/products', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '缺少 ids 数组' }); return;
  }
  const db = readDB();
  for (const id of ids) delete db.products[id];
  writeDB(db);
  res.json({ ok: true, deleted: ids.length });
});

// ─── Flexible Tags ────────────────────────────────────────────

app.get('/flexible-tags', (_req, res) => {
  const db = readDB();
  res.json(Object.values(db.flexibleTags).sort((a, b) => a.id - b.id));
});

app.post('/flexible-tags', (req, res) => {
  const item = req.body;
  if (!item?.id) { res.status(400).json({ error: '缺少 id' }); return; }
  const db = readDB();
  db.flexibleTags[item.id] = item;
  writeDB(db);
  res.json({ ok: true, id: item.id });
});

app.delete('/flexible-tags', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '缺少 ids 数组' }); return;
  }
  const db = readDB();
  for (const id of ids) delete db.flexibleTags[id];
  writeDB(db);
  res.json({ ok: true, deleted: ids.length });
});

// ─── AI Rules ─────────────────────────────────────────────────

app.get('/ai-rules', (_req, res) => {
  const db = readDB();
  res.json(Object.values(db.aiRules).sort((a, b) => a.id - b.id));
});

app.post('/ai-rules', (req, res) => {
  const item = req.body;
  if (!item?.id) { res.status(400).json({ error: '缺少 id' }); return; }
  const db = readDB();
  db.aiRules[item.id] = item;
  writeDB(db);
  res.json({ ok: true, id: item.id });
});

app.patch('/ai-rules/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const existing = db.aiRules[id];
  if (!existing) { res.status(404).json({ error: 'not found' }); return; }
  db.aiRules[id] = { ...existing, ...req.body };
  writeDB(db);
  res.json({ ok: true, id });
});

app.delete('/ai-rules', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: '缺少 ids 数组' }); return;
  }
  const db = readDB();
  for (const id of ids) delete db.aiRules[id];
  writeDB(db);
  res.json({ ok: true, deleted: ids.length });
});

// ─── Settings ─────────────────────────────────────────────────

app.get('/settings', (_req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.put('/settings/:key', (req, res) => {
  const { key } = req.params;
  const db = readDB();
  db.settings[key] = req.body;
  writeDB(db);
  res.json({ ok: true, key });
});

// ─── Bulk Restore ─────────────────────────────────────────────

app.post('/bulk-restore', (req, res) => {
  const {
    materials, assetDetails, processTasks, tasks,
    products, flexibleTags, aiRules,
    aiRuleSettings, aiConfig, mineruConfig, minioConfig,
  } = req.body;

  const db = readDB();

  for (const m of (materials || [])) {
    if (!db.materials[m.id]) db.materials[m.id] = m;
  }
  for (const [id, detail] of Object.entries(assetDetails || {})) {
    if (!db.assetDetails[id]) db.assetDetails[id] = detail;
  }
  for (const t of (processTasks || [])) {
    if (!db.processTasks[t.id]) db.processTasks[t.id] = t;
  }
  for (const t of (tasks || [])) {
    if (!db.tasks[t.id]) db.tasks[t.id] = t;
  }
  for (const p of (products || [])) {
    if (!db.products[p.id]) db.products[p.id] = p;
  }
  for (const tag of (flexibleTags || [])) {
    if (!db.flexibleTags[tag.id]) db.flexibleTags[tag.id] = tag;
  }
  for (const r of (aiRules || [])) {
    if (!db.aiRules[r.id]) db.aiRules[r.id] = r;
  }
  if (aiRuleSettings && !db.settings.aiRuleSettings) db.settings.aiRuleSettings = aiRuleSettings;
  if (aiConfig && !db.settings.aiConfig) db.settings.aiConfig = aiConfig;
  if (mineruConfig && !db.settings.mineruConfig) db.settings.mineruConfig = mineruConfig;
  if (minioConfig && !db.settings.minioConfig) db.settings.minioConfig = minioConfig;

  writeDB(db);
  res.json({ ok: true, message: 'bulk restore completed (existing rows skipped)' });
});

// ─── 启动 ─────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`[db-server] listening on http://localhost:${port}`);
  console.log(`[db-server] Data file: ${DATA_PATH}`);
});
