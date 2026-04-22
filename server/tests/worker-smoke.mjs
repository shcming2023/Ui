/**
 * AI Worker Smoke Test
 * 验证 AI Worker 是否能正确加载 MinIO 上下文并读取 Markdown 文件
 */
import { AiMetadataWorker } from '../services/ai/metadata-worker.mjs';

async function runTest() {
  console.log('--- AI Worker Smoke Test Start ---');

  // 1. 模拟 MinIO 上下文
  const mockMinio = {
    getFileStream: async (name) => {
      console.log(`[mock-minio] getFileStream called for: ${name}`);
      return {
        [Symbol.asyncIterator]: async function* () {
          yield Buffer.from('# Test Document\nThis is a test markdown file.');
        }
      };
    }
  };

  // 2. 模拟 Job
  const mockJob = {
    id: 'smoke-job-1',
    parseTaskId: 'task-1',
    inputMarkdownObjectName: 'test/doc.md',
    state: 'pending'
  };

  // 3. 模拟依赖
  // 注意：worker 会调用 getTaskById 和 updateJob，我们需要在全局 Mock 它们
  global.getTaskById = async (id) => ({
    id,
    metadata: { markdownObjectName: 'test/doc.md' }
  });
  global.updateJob = async (id, update) => {
    console.log(`[mock-db] updateJob ${id}:`, update.state, update.message);
    return true;
  };
  global.logTaskEvent = async (event) => {
    console.log(`[mock-db] logEvent: ${event.event} - ${event.message}`);
  };

  // 4. 初始化 Worker (使用 Spread 模式，模拟 upload-server.mjs 的调用方式)
  const worker = new AiMetadataWorker({
    ...mockMinio,
    onComplete: async (job, update) => {
      console.log('[smoke-test] onComplete triggered!');
    }
  });

  // 验证 Context 注入诊断
  if (typeof worker.minioContext?.getFileStream !== 'function') {
    console.error('❌ FAILED: minioContext was not correctly injected!');
    process.exit(1);
  } else {
    console.log('✅ PASSED: minioContext injected correctly.');
  }

  // 5. 手动触发一个 Tick 处理
  // 我们不需要启动循环，直接调用 tickOnce 处理特定 job
  try {
    // 模拟从 DB 扫描到一个任务
    // 这里我们绕过 start()，直接测试内部逻辑
    console.log('--- Testing Job Processing ---');
    await worker.processJob(mockJob);
    console.log('✅ PASSED: Job processing finished.');
  } catch (err) {
    console.error('❌ FAILED: Job processing error:', err.message);
    process.exit(1);
  }

  console.log('--- AI Worker Smoke Test Success ---');
}

runTest();
