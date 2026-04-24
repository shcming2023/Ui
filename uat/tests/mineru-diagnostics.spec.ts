import { test, expect } from '@playwright/test';

test.describe('MinerU Diagnostics Semantics (UAT)', () => {
  test('健康页必须提示 MinerU 当前被未知任务占用', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error));
    const mockHealth = {
      frontend: { status: 'ok', version: 'test' },
      uploadServer: { status: 'ok', version: 'test' },
      dbServer: { status: 'ok', version: 'test' },
      minio: { status: 'ok' },
      mineru: { status: 'ok' },
      ollama: { status: 'ok' },
      timestamp: new Date().toISOString()
    };

    const mockDiagnostics = {
      ok: true,
      mineru: {
        endpoint: "http://mock:8083",
        healthy: true,
        processingTasks: 1,
        queuedTasks: 4,
        maxConcurrentRequests: 1
      },
      luceon: {
        activeTasks: [],
        knownMineruTaskIds: [],
        mineruQueuedTasks: ["task-123", "task-456"],
        mineruProcessingTasks: []
      },
      diagnosis: {
        status: "blocked",
        kind: "orphan-processing-blocker",
        message: "MinerU 当前被未知任务占用，Luceon 队列暂停推进",
        blockingMineruTaskId: "unknown",
        safeToAutoRecover: false
      }
    };

    await page.route(`**/__proxy/upload/ops/health`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockHealth) });
    });

    await page.route(`**/__proxy/upload/ops/mineru/diagnostics`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockDiagnostics) });
    });

    await page.route('**/__proxy/db/**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      }
    });

    await page.goto('/cms/ops/health');
    
    // 断言有阻塞风险的卡片可见
    await expect(page.getByText('MinerU 通畅诊断')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('MinerU 队列状态: blocked')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('发现阻塞风险')).toBeVisible();

    // 断言必须提示明确文本
    await expect(page.getByText('MinerU 当前被未知任务占用，Luceon 队列暂停推进。请先执行人工清障。')).toBeVisible();
    await expect(page.getByText('恢复建议（干跑）：')).toBeVisible();
    await expect(page.getByText('停止 mineru_api tmux session')).toBeVisible();
  });
});
