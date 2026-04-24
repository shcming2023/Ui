/**
 * mineru-deep-uat.mjs - MinerU 深度探活脚本 (Deep Probe)
 * 
 * 作用：
 * 1. 模拟真实 PDF 解析全闭环：提交 -> 轮询 -> 结果拉取。
 * 2. 绕过 Luceon 业务逻辑，直接探测本地 MinerU FastAPI 服务的业务路由健康度。
 * 3. 解决 "health 200 但 /tasks 500" 的半失效检测问题。
 */

import { PDFDocument, rgb } from 'pdf-lib';
// 使用 Node.js 18+ 内置 fetch


const DB_BASE_URL = process.env.DB_BASE_URL || 'http://localhost:8080';
const TEST_PDF_DIR = process.env.TEST_PDF_DIR || './temp_test_pdf';

async function getMineruConfig() {
  try {
    const res = await fetch(`${DB_BASE_URL}/settings`);
    if (!res.ok) throw new Error(`无法从 db-server 获取配置: ${res.status}`);
    const settings = await res.json();
    return settings?.mineruConfig || {};
  } catch (err) {
    console.error('❌ 获取 mineruConfig 失败:', err.message);
    return {};
  }
}

async function createTestPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText('MinerU Deep Health Check PDF Content', { x: 50, y: 350, size: 20, color: rgb(0, 0, 0) });
  page.drawText(`Timestamp: ${new Date().toISOString()}`, { x: 50, y: 300, size: 12 });
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function createMultipartBody(boundary, fileName, pdfBuffer, config) {
  const enc = new TextEncoder();
  const parts = [];

  const addField = (name, value) => {
    parts.push(enc.encode(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  };

  addField('backend', config.localBackend || 'pipeline');
  addField('lang_list', config.localOcrLanguage || 'ch');
  addField('response_format_zip', 'true');
  
  parts.push(enc.encode(`--${boundary}\r\nContent-Disposition: form-data; name="files"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n`));
  parts.push(pdfBuffer);
  parts.push(enc.encode(`\r\n--${boundary}--\r\n`));

  return Buffer.concat(parts);
}

async function runDeepCheck() {
  console.log('🚀 Starting MinerU Deep Health Check...');

  const config = await getMineruConfig();
  const endpoint = (config.localEndpoint || 'http://localhost:8083').replace(/\/+$/, '');
  
  console.log(`📍 MinerU Endpoint: ${endpoint}`);
  console.log(`⚙️ Config: backend=${config.localBackend}, lang=${config.localOcrLanguage}`);

  // 1. Basic Health Check
  try {
    const healthRes = await fetch(`${endpoint}/health`, { signal: AbortSignal.timeout(5000) });
    console.log(`✅ Basic Health Check: ${healthRes.status} ${await healthRes.text()}`);
  } catch (err) {
    console.error('❌ Basic Health Check Failed:', err.message);
    process.exit(1);
  }

  // 2. Create Test PDF
  const pdfBuffer = await createTestPdf();
  const boundary = `----uat-${Date.now()}`;
  const body = createMultipartBody(boundary, 'deep-check.pdf', pdfBuffer, config);

  // 3. Submit Task
  console.log('📤 Submitting parsing task to /tasks...');
  let taskId = '';
  try {
    const submitRes = await fetch(`${endpoint}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
      body,
      signal: AbortSignal.timeout(30000)
    });

    const result = await submitRes.json();
    if (!submitRes.ok) {
      console.error(`❌ Task Submission Failed: HTTP ${submitRes.status}`);
      console.error('Response:', JSON.stringify(result, null, 2));
      process.exit(1);
    }
    
    taskId = result.task_id || result.taskId;
    console.log(`✅ Task Submitted. ID: ${taskId}`);
  } catch (err) {
    console.error('❌ Task Submission Error:', err.message);
    process.exit(1);
  }

  // 4. Polling
  console.log('⏳ Polling for task completion...');
  const deadline = Date.now() + 120000; // 2 minutes
  let finished = false;
  while (Date.now() < deadline) {
    try {
      const statusRes = await fetch(`${endpoint}/tasks/${taskId}`);
      const statusData = await statusRes.json();
      const status = (statusData.status || statusData.state || '').toLowerCase();
      
      console.log(`   Status: ${status}`);
      
      if (['done', 'success', 'completed'].includes(status)) {
        finished = true;
        break;
      }
      if (['failed', 'error'].includes(status)) {
        console.error('❌ Task Failed internally at MinerU');
        console.error('Response:', JSON.stringify(statusData, null, 2));
        process.exit(1);
      }
    } catch (err) {
      console.warn(`⚠️ Polling error: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  if (!finished) {
    console.error('❌ Task timed out after 120s');
    process.exit(1);
  }

  // 5. Fetch Result
  console.log('📥 Fetching result from /tasks/:id/result...');
  try {
    const resultRes = await fetch(`${endpoint}/tasks/${taskId}/result`);
    if (!resultRes.ok) {
      console.error(`❌ Result Fetch Failed: HTTP ${resultRes.status}`);
      process.exit(1);
    }
    
    const contentType = resultRes.headers.get('content-type');
    const contentLength = resultRes.headers.get('content-length');
    console.log(`✅ Result Received. Content-Type: ${contentType}, Length: ${contentLength}`);
    
    if (contentType.includes('application/zip') || contentType.includes('application/json')) {
      console.log('✨ DEEP CHECK PASSED: MinerU is fully operational.');
    } else {
      console.warn(`⚠️ Unexpected Content-Type: ${contentType}`);
    }
  } catch (err) {
    console.error('❌ Result Fetch Error:', err.message);
    process.exit(1);
  }
}

runDeepCheck().catch(err => {
  console.error('💥 Unexpected Script Error:', err);
  process.exit(1);
});
