import http from 'http';
import { processWithLocalMinerU } from '../services/mineru/local-adapter.mjs';

// 模拟 MinerU 服务器
function createMockMinerUServer() {
  let callCount = 0;
  
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200);
      res.end('ok');
    } else if (req.method === 'POST' && req.url === '/tasks') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ task_id: 'mock-task-123' }));
    } else if (req.method === 'GET' && req.url === '/tasks/mock-task-123') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      callCount++;
      if (callCount === 1) {
        // 第一轮返回 pending/queued
        res.end(JSON.stringify({ status: 'pending', queued_ahead: 2, started_at: null }));
      } else if (callCount === 2) {
        // 第二轮返回 processing
        res.end(JSON.stringify({ status: 'processing', started_at: new Date().toISOString(), queued_ahead: 0 }));
      } else {
        // 第三轮完成
        res.end(JSON.stringify({ status: 'done' }));
      }
    } else if (req.method === 'GET' && req.url === '/tasks/mock-task-123/result') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        md_content: '# Test Markdown\n\nDone.',
        artifacts: []
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.2', () => {
      resolve(`http://127.0.0.2:${server.address().port}`);
    });
  });
}

// 模拟流
async function* mockStream() {
  yield Buffer.from('mock pdf content');
}

async function main() {
  console.log('=== MinerU Queue Status Smoke Test ===');
  const endpoint = await createMockMinerUServer();
  console.log(`Mock Server listening at: ${endpoint}`);

  const task = {
    id: 'cms-task-001',
    materialId: 'mat-001',
    optionsSnapshot: {
      localEndpoint: endpoint,
      backend: 'pipeline',
      maxPages: 10
    },
    metadata: {}
  };

  const materialInfo = {
    fileSize: 1024,
    fileName: 'test.pdf',
    mimeType: 'application/pdf',
    metadata: {}
  };

  const minioContext = {
    saveMarkdown: async () => true,
    saveObject: async () => true,
  };

  const history = [];

  try {
    await processWithLocalMinerU({
      task,
      material: materialInfo,
      fileStream: mockStream(),
      fileName: 'test.pdf',
      mimeType: 'application/pdf',
      timeoutMs: 30000,
      minioContext,
      updateProgress: async (updateInfo) => {
        console.log(`[Update] stage=${updateInfo.stage || 'N/A'}, status=${updateInfo.metadata?.mineruStatus || 'N/A'}, msg=${updateInfo.message}`);
        history.push(updateInfo);
      }
    });

    // 验证
    const submitted = history.find(h => h.metadata?.mineruStatus === 'submitted');
    const queued = history.find(h => h.metadata?.mineruStatus === 'queued' && h.stage === 'mineru-queued');
    const processing = history.find(h => h.metadata?.mineruStatus === 'processing' && h.stage === 'mineru-processing');

    if (!submitted || submitted.metadata.mineruTaskId !== 'mock-task-123') {
      throw new Error('提交失败，未能正确记录 mineruTaskId 和 submitted 状态');
    }
    if (!queued || queued.metadata.mineruQueuedAhead !== 2) {
      throw new Error('未能正确识别和记录 MinerU queued 状态及排队数量');
    }
    if (!processing || processing.metadata.mineruStartedAt == null) {
      throw new Error('未能正确识别和记录 MinerU processing 状态');
    }

    console.log('✅ 队列状态对账语义验证通过！');
    process.exit(0);
  } catch (err) {
    console.error('❌ 测试失败:', err);
    process.exit(1);
  }
}

main();
