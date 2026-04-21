/**
 * local-adapter.mjs
 * 从现有 upload-server.mjs 中抽取的真实本地 MinerU 执行逻辑。
 * 由 ParseTaskWorker 调用，用于长耗时后台处理。
 */

export async function processWithLocalMinerU({ task, material, fileStream, fileName, mimeType, timeoutMs, minioContext, updateProgress }) {
  const options = task.optionsSnapshot || {};
  let localEndpoint = options.localEndpoint;
  if (!localEndpoint) throw new Error('缺少 localEndpoint');

  // docker 内部网络地址重写
  if (localEndpoint.includes('localhost') || localEndpoint.includes('127.0.0.1')) {
    localEndpoint = localEndpoint.replace(/localhost|127\.0\.0\.1/g, 'host.docker.internal');
  }
  localEndpoint = localEndpoint.replace(/\/+$/, '');

  const backend = String(options.backend || 'pipeline');
  const maxPages = Number(options.maxPages || 1000);
  const ocrLanguage = String(options.ocrLanguage || options.language || 'ch');
  const enableOcr = isEnabledFlag(options.enableOcr);
  const enableFormula = isEnabledFlag(options.enableFormula);
  const enableTable = isEnabledFlag(options.enableTable);
  const parseMethod = String(options.parseMethod || options.parse_method || '').trim();

  let serverUrl = String(options.serverUrl || options.server_url || options.url || '').trim();
  if (serverUrl && (serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1'))) {
    serverUrl = serverUrl.replace(/localhost|127\.0\.0\.1/g, 'host.docker.internal');
  }

  // 1. Check health
  const isHealthy = await checkHealth(localEndpoint);
  if (!isHealthy) throw new Error(`本地 MinerU 不可达: ${localEndpoint}`);

  await updateProgress({ progress: 10, message: '已连接本地 MinerU，准备提交任务...' });

  const fileSize = material?.fileSize || 0;
  const submitTimeoutMs = Math.max(timeoutMs, Math.max(120_000, Math.ceil(fileSize / 1024) * 50));
  const effectiveBackend = (fileSize > 0 && fileSize < 2 * 1024 * 1024 && /hybrid/i.test(backend)) ? 'pipeline' : backend;
  
  let finalParseMethod = parseMethod || 'auto';
  if (enableOcr && !parseMethod) finalParseMethod = 'ocr';

  // 2. Submit task
  const boundary = `----luceon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const fields = [
    ['backend', effectiveBackend],
    ['parse_method', finalParseMethod],
    ['formula_enable', enableFormula ? '1' : '0'],
    ['table_enable', enableTable ? '1' : '0'],
    ['response_format_zip', 'false']
  ];
  for (const lang of String(ocrLanguage).split(',').map((item) => item.trim()).filter(Boolean)) {
    fields.push(['lang_list', lang]);
  }
  if (serverUrl) fields.push(['server_url', serverUrl]);
  if (Number.isFinite(maxPages) && maxPages > 0) {
    const endPageId = String(Math.max(0, Math.floor(maxPages) - 1));
    fields.push(['end_page_id', endPageId]);
    fields.push(['endpageid', endPageId]);
  }

  const multipart = createMultipartStream({
    boundary, fields,
    fileFieldName: 'files',
    fileName: fileName,
    mimeType: mimeType || 'application/octet-stream',
    fileStream,
  });

  let mineruTaskId = '';
  let markdown = '';

  const fastApiResponse = await fetch(`${localEndpoint}/tasks`, {
    method: 'POST',
    headers: { 'content-type': multipart.contentType },
    body: multipart.body,
    duplex: 'half',
    signal: AbortSignal.timeout(submitTimeoutMs),
  }).catch(err => {
    throw new Error(`本地 MinerU 提交通讯失败: ${err.message}`);
  });

  if (fastApiResponse.status !== 404 && fastApiResponse.status !== 405) {
    const payload = await fastApiResponse.json().catch(() => null);
    if (!fastApiResponse.ok) {
      throw new Error(`MinerU 提交失败: ${payload?.error || payload?.message || fastApiResponse.status}`);
    }
    mineruTaskId = payload?.task_id || payload?.taskid || payload?.taskId || '';
    if (!mineruTaskId) throw new Error('MinerU 未返回任务 id');

    await updateProgress({ progress: 20, message: `任务已提交，内部ID: ${mineruTaskId}` });

    // 3. Poll
    await waitMinerUTask(localEndpoint, mineruTaskId, timeoutMs, async (statusPayload) => {
      const status = String(statusPayload?.status || '').toLowerCase();
      const queued = statusPayload?.queued_ahead || statusPayload?.queue_ahead || 0;
      let msg = `处理中 (${status})...`;
      if (status === 'pending' || status === 'queued') msg = `排队中 (前方 ${queued} 个任务)`;
      else if (status === 'processing') msg = '正在执行 OCR 与解析...';
      await updateProgress({ progress: 50, message: msg });
    });

    await updateProgress({ progress: 80, message: '解析完成，提取结果...' });
    const resultPayload = await fetchMinerUResult(localEndpoint, mineruTaskId, timeoutMs);
    markdown = extractLocalMarkdown(resultPayload);

  } else {
    // 降级 Gradio
    await updateProgress({ progress: 50, message: '降级为 Gradio 接口解析...' });
    throw new Error('当前版本 Worker 暂不支持 Gradio 降级流式上传，请更新 MinerU API');
  }

  if (!markdown) throw new Error('提取到的 Markdown 内容为空');

  // 4. Update state to result-store and Save
  await updateProgress({ stage: 'store', state: 'result-store', progress: 90, message: '正在保存产物到 MinIO...' });
  const objectName = `parsed/${task.materialId || task.id}/full.md`;
  
  await minioContext.saveMarkdown(objectName, markdown);

  return { markdown, mineruTaskId, objectName };
}

// ─── Utils ───────────────────────────────────

function isEnabledFlag(value) {
  return value === true || value === 'true' || value === '1' || value === 1;
}

async function checkHealth(endpoint) {
  try {
    const res = await fetch(`${endpoint}/health`, { signal: AbortSignal.timeout(3000) });
    return res.status === 200;
  } catch {
    return false;
  }
}

function createMultipartStream({ boundary, fields, fileFieldName, fileName, mimeType, fileStream }) {
  const enc = new TextEncoder();
  const safeName = String(fileName || 'upload.bin').replace(/"/g, '_');
  const parts = Array.isArray(fields) ? fields : [];
  const fileHeader = `--${boundary}\r\nContent-Disposition: form-data; name="${fileFieldName}"; filename="${safeName}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
  const fileFooter = `\r\n--${boundary}--\r\n`;
  const fieldChunk = (name, value) => enc.encode(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${String(value ?? '')}\r\n`);

  async function* gen() {
    for (const [k, v] of parts) yield fieldChunk(k, v);
    yield enc.encode(fileHeader);
    for await (const chunk of fileStream) yield chunk;
    yield enc.encode(fileFooter);
  }
  return { contentType: `multipart/form-data; boundary=${boundary}`, body: gen() };
}

async function waitMinerUTask(localEndpoint, taskId, timeoutMs, onProgress) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const response = await fetch(`${localEndpoint}/tasks/${encodeURIComponent(taskId)}`, { signal: AbortSignal.timeout(10000) });
    const payload = await response.json();
    if (!response.ok) throw new Error(`查询状态失败: HTTP ${response.status}`);
    
    if (onProgress) await onProgress(payload);
    
    const status = String(payload?.status || payload?.state || payload?.task_status || payload?.data?.status || payload?.data?.state).toLowerCase();
    if (['done', 'success', 'completed', 'succeeded', 'finished', 'complete'].includes(status)) return payload;
    if (['failed', 'error', 'failure', 'canceled', 'cancelled'].includes(status)) throw new Error(payload?.error || payload?.message || '任务执行失败');
    
    await new Promise(r => setTimeout(r, 1500));
  }
  throw new Error(`超时未完成 (等待超过 ${Math.round(timeoutMs/1000)}s)`);
}

async function fetchMinerUResult(localEndpoint, taskId, timeoutMs) {
  const response = await fetch(`${localEndpoint}/tasks/${encodeURIComponent(taskId)}/result`, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`获取结果失败: HTTP ${response.status}`);
  return await response.json();
}

function extractLocalMarkdown(payload) {
  if (typeof payload === 'string') return payload.trim();
  if (payload?.results) {
    const firstKey = Object.keys(payload.results)[0];
    const md = firstKey ? (payload.results[firstKey]?.md_content || payload.results[firstKey]?.mdcontent || payload.results[firstKey]?.mdContent) : '';
    if (typeof md === 'string') return md.trim();
  }
  const candidates = [payload?.md_content, payload?.markdown, payload?.text, payload?.data?.md_content, payload?.data?.markdown, payload?.data?.text];
  return (candidates.find(i => typeof i === 'string' && i.trim() !== '') || '').trim();
}
