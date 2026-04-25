/**
 * mineru-timeout-adjudication-smoke.mjs
 * 
 * P0 MinerU 长耗时状态裁决与错误 failed 纠偏的冒烟测试。
 * 
 * 测试场景：
 * 1. MinerU processing 超过本地 timeout → Luceon 不进入 failed
 * 2. failed + mineruTaskId + MinerU completed → 纠偏并入库
 * 3. failed + mineruTaskId + MinerU failed → 保持 failed 且 message 有明确证据
 */

import { ParseTaskWorker } from '../services/queue/task-worker.mjs';
import { MineruStillProcessingError } from '../services/mineru/local-adapter.mjs';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    testsFailed++;
  } else {
    testsPassed++;
  }
}

async function runTest() {
  console.log('=== P0 MinerU Timeout Adjudication & Failed Correction Smoke Test ===\n');

  // ─── Test 1: MinerU processing 超过本地 timeout → Luceon 不进入 failed ───
  console.log('Test 1: MinerU processing 超过本地 timeout → Luceon 不进入 failed');
  {
    const updates = [];
    const mockTaskClient = {
      getAllTasks: async () => [],
      updateTask: async (_id, update) => { updates.push(update); return true; },
      updateMaterial: async (_id, update) => { updates.push({ _material: true, ...update }); return true; },
    };

    const worker = new ParseTaskWorker({
      minioContext: {
        getFileStream: async () => ({}),
        saveMarkdown: async () => {},
        saveObject: async () => {},
      },
      taskClient: mockTaskClient,
      mineruProcessor: async () => {
        // 模拟 MinerU 仍在 processing 的超时场景
        throw new MineruStillProcessingError('mineru-task-abc', 'processing');
      }
    });

    const task = {
      id: 'test-timeout-1',
      engine: 'local-mineru',
      state: 'pending',
      stage: 'upload',
      progress: 0,
      materialId: 'mat-timeout-1',
      optionsSnapshot: {
        localTimeout: 1,
        localEndpoint: 'http://localhost:8083',
        material: {
          fileName: 'big.pdf',
          mimeType: 'application/pdf',
          metadata: { objectName: 'originals/mat-timeout-1/source.pdf' }
        }
      },
      metadata: {},
    };

    await worker.processTask(task);

    // 验证：不应有 state=failed 的更新
    const hasFailed = updates.some(u => u.state === 'failed');
    assert(!hasFailed, 'Task should NOT enter failed when MinerU is still processing');

    // 验证：应有 state=running 的更新
    const hasRunning = updates.some(u => u.state === 'running' && (u.stage === 'mineru-processing' || u.stage === 'mineru-queued'));
    assert(hasRunning, 'Task should remain running with mineru-processing/queued stage');

    // 验证：message 包含超时说明
    const timeoutUpdate = updates.find(u => u.message?.includes('MinerU 仍在'));
    assert(timeoutUpdate !== undefined, 'Task message should mention MinerU still processing');

    // 验证：material 不应被标记 failed
    const materialFailed = updates.some(u => u._material && u.status === 'failed');
    assert(!materialFailed, 'Material should NOT be marked failed');

    console.log('Test 1 Pass ✅\n');
  }

  // ─── Test 2: failed + mineruTaskId + MinerU completed → 纠偏并入库 ───
  console.log('Test 2: failed + mineruTaskId + MinerU completed → 纠偏并入库');
  {
    const updates = [];
    let resumeCalled = false;

    // 模拟 MinerU API 返回 completed
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('/tasks/mineru-completed-xyz')) {
        return { ok: true, status: 200, json: async () => ({ status: 'completed', started_at: '2026-04-25T01:00:00Z' }) };
      }
      return originalFetch(url);
    };

    const mockTaskClient = {
      getAllTasks: async () => [],
      updateTask: async (_id, update) => { updates.push(update); return true; },
      updateMaterial: async (_id, update) => { updates.push({ _material: true, ...update }); return true; },
    };

    const worker = new ParseTaskWorker({
      minioContext: {
        getFileStream: async () => ({}),
        saveMarkdown: async () => {},
        saveObject: async () => {},
      },
      taskClient: mockTaskClient,
      mineruProcessor: async () => ({ objectName: 'parsed/mat-2/full.md', mineruTaskId: 'mineru-completed-xyz', parsedPrefix: 'parsed/mat-2/', parsedFilesCount: 1, parsedArtifacts: [], zipObjectName: null, artifactIncomplete: false, markdown: '# Test' }),
      mineruResumer: async () => {
        resumeCalled = true;
        return { objectName: 'parsed/mat-2/full.md', mineruTaskId: 'mineru-completed-xyz', parsedPrefix: 'parsed/mat-2/', parsedFilesCount: 1, parsedArtifacts: [], zipObjectName: null, artifactIncomplete: false, markdown: '# Test' };
      }
    });

    const failedTasks = [{
      id: 'test-failed-completed-2',
      engine: 'local-mineru',
      state: 'failed',
      stage: 'mineru-processing',
      materialId: 'mat-2',
      message: '超时未完成',
      optionsSnapshot: {
        localEndpoint: 'http://localhost:8083',
        localTimeout: 3600,
        material: { fileName: 'big.pdf', mimeType: 'application/pdf', metadata: { objectName: 'originals/mat-2/source.pdf' } }
      },
      metadata: { mineruTaskId: 'mineru-completed-xyz' },
    }];

    await worker.recoverMisjudgedFailedTasks(failedTasks);

    // 验证：任务应被纠偏为 running
    const hasRunning = updates.some(u => u.state === 'running');
    assert(hasRunning, 'Failed task should be corrected to running when MinerU completed');

    // 验证：stage 应为 result-fetching
    const hasResultFetching = updates.some(u => u.stage === 'result-fetching');
    assert(hasResultFetching, 'Task stage should be result-fetching');

    // 验证：metadata 包含纠偏标记
    const hasRecoveryFlag = updates.some(u => u.metadata?.recoveredFromMisjudgedFailed === true);
    assert(hasRecoveryFlag, 'Task metadata should have recoveredFromMisjudgedFailed flag');

    // 验证：resume 被调用
    // 等待一下让异步 resume 被调度
    await new Promise(r => setTimeout(r, 100));
    assert(resumeCalled, 'resumeMineruTask should be called for completed MinerU task');

    globalThis.fetch = originalFetch;
    console.log('Test 2 Pass ✅\n');
  }

  // ─── Test 3: failed + mineruTaskId + MinerU failed → 保持 failed 且 message 有证据 ───
  console.log('Test 3: failed + mineruTaskId + MinerU failed → 保持 failed 且 message 有明确证据');
  {
    const updates = [];

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('/tasks/mineru-failed-xyz')) {
        return { ok: true, status: 200, json: async () => ({ status: 'failed', error: 'PDF parsing internal error: corrupted file' }) };
      }
      return originalFetch(url);
    };

    const mockTaskClient = {
      getAllTasks: async () => [],
      updateTask: async (_id, update) => { updates.push(update); return true; },
      updateMaterial: async (_id, update) => true,
    };

    const worker = new ParseTaskWorker({
      minioContext: { getFileStream: async () => ({}), saveMarkdown: async () => {}, saveObject: async () => {} },
      taskClient: mockTaskClient,
    });

    const failedTasks = [{
      id: 'test-failed-confirmed-3',
      engine: 'local-mineru',
      state: 'failed',
      stage: 'mineru-processing',
      materialId: 'mat-3',
      message: '超时未完成',
      optionsSnapshot: {
        localEndpoint: 'http://localhost:8083',
        localTimeout: 3600,
        material: { fileName: 'corrupted.pdf', mimeType: 'application/pdf', metadata: { objectName: 'originals/mat-3/source.pdf' } }
      },
      metadata: { mineruTaskId: 'mineru-failed-xyz' },
    }];

    await worker.recoverMisjudgedFailedTasks(failedTasks);

    // 验证：保持 failed
    const hasFailed = updates.some(u => u.state === 'failed');
    assert(hasFailed, 'Task should remain failed when MinerU also confirms failure');

    // 验证：没有变成 running
    const hasRunning = updates.some(u => u.state === 'running');
    assert(!hasRunning, 'Task should NOT be changed to running');

    // 验证：message 包含 MinerU 的明确失败证据
    const evidenceUpdate = updates.find(u => u.state === 'failed');
    assert(evidenceUpdate?.message?.includes('MinerU API 明确返回'), 'Failed message should contain MinerU API evidence');
    assert(evidenceUpdate?.message?.includes('corrupted file'), 'Failed message should contain MinerU error detail');
    assert(evidenceUpdate?.metadata?.failureEvidenceSource === 'MinerU API', 'Metadata should have failureEvidenceSource');

    globalThis.fetch = originalFetch;
    console.log('Test 3 Pass ✅\n');
  }

  // ─── Test 4: failed + mineruTaskId + MinerU processing → 纠偏回 running ───
  console.log('Test 4: failed + mineruTaskId + MinerU still processing → 纠偏回 running');
  {
    const updates = [];
    let resumeCalled = false;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = url.toString();
      if (urlStr.includes('/tasks/mineru-processing-xyz')) {
        return { ok: true, status: 200, json: async () => ({ status: 'processing', started_at: '2026-04-25T01:00:00Z' }) };
      }
      return originalFetch(url);
    };

    const mockTaskClient = {
      getAllTasks: async () => [],
      updateTask: async (_id, update) => { updates.push(update); return true; },
      updateMaterial: async (_id, update) => true,
    };

    const worker = new ParseTaskWorker({
      minioContext: { getFileStream: async () => ({}), saveMarkdown: async () => {}, saveObject: async () => {} },
      taskClient: mockTaskClient,
      mineruResumer: async () => {
        resumeCalled = true;
        return { objectName: 'parsed/mat-4/full.md', mineruTaskId: 'mineru-processing-xyz', parsedPrefix: 'parsed/mat-4/', parsedFilesCount: 1, parsedArtifacts: [], zipObjectName: null, artifactIncomplete: false, markdown: '# Test' };
      }
    });

    const failedTasks = [{
      id: 'test-failed-processing-4',
      engine: 'local-mineru',
      state: 'failed',
      stage: 'mineru-processing',
      materialId: 'mat-4',
      message: '超时未完成',
      optionsSnapshot: {
        localEndpoint: 'http://localhost:8083',
        localTimeout: 3600,
        material: { fileName: 'large.pdf', mimeType: 'application/pdf', metadata: { objectName: 'originals/mat-4/source.pdf' } }
      },
      metadata: { mineruTaskId: 'mineru-processing-xyz' },
    }];

    await worker.recoverMisjudgedFailedTasks(failedTasks);

    // 验证：纠偏为 running
    const hasRunning = updates.some(u => u.state === 'running' && u.stage === 'mineru-processing');
    assert(hasRunning, 'Failed task should be corrected to running + mineru-processing');

    // 验证：message 说明了纠偏原因
    const correctionUpdate = updates.find(u => u.state === 'running');
    assert(correctionUpdate?.message?.includes('纠偏恢复'), 'Message should explain the correction');
    assert(correctionUpdate?.metadata?.recoveredFromMisjudgedFailed === true, 'Metadata should flag the correction');

    // 验证：resume 被调用（不重新提交 MinerU）
    await new Promise(r => setTimeout(r, 100));
    assert(resumeCalled, 'resumeMineruTask should be called (not re-POST)');

    globalThis.fetch = originalFetch;
    console.log('Test 4 Pass ✅\n');
  }

  // ─── Summary ───
  console.log(`\n=== Results: ${testsPassed} passed, ${testsFailed} failed ===`);
  if (testsFailed > 0) {
    console.error('❌ Some tests failed!');
    process.exit(1);
  } else {
    console.log('✅ All P0 MinerU Timeout Adjudication tests passed!');
    process.exit(0);
  }
}

runTest().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
