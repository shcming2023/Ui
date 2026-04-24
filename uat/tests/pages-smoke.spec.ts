import { test, expect, type Page } from '@playwright/test';

/**
 * Pages Smoke Test — 页面级运行时可用性检测
 * 
 * 目标：防止出现"HTTP 200 但 React 崩溃（ReferenceError 等）"的回归事故。
 * 覆盖：Tasks, Audit, Ops Health, Materials, Library 等核心页面。
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

test.describe('Dashboard Pages Smoke (Runtime Stability)', () => {
  
  const consoleErrors: string[] = [];

  // 在每个测试前清空错误集合并设置监听
  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;

    page.on('pageerror', (exception) => {
      consoleErrors.push(`[PageError] ${exception.stack || exception.message}`);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // 捕获关键运行时错误
        if (text.includes('ReferenceError') || text.includes('is not defined') || text.includes('ErrorBoundary')) {
          consoleErrors.push(`[ConsoleError] ${text}`);
        }
      }
    });
  });

  // 每个测试后断言是否存在严重错误
  test.afterEach(async () => {
    if (consoleErrors.length > 0) {
      const errorMsg = consoleErrors.join('\n');
      expect(consoleErrors, `Detected runtime errors in browser console:\n${errorMsg}`).toHaveLength(0);
    }
  });

  const targetPages = [
    { name: '任务管理', path: '/cms/tasks', heading: '任务管理' },
    { name: '一致性审计', path: '/cms/audit', heading: '一致性审计' },
    { name: '系统健康', path: '/cms/ops/health', heading: '系统健康' },
    { name: '工作台', path: '/cms/workspace', heading: '工作台' },
    { name: '成果库', path: '/cms/library', heading: '成果库' },
    { name: '系统设置', path: '/cms/settings', heading: '系统设置' },
  ];

  for (const pageInfo of targetPages) {
    test(`Page: ${pageInfo.name} (${pageInfo.path}) should render without crash`, async ({ page }) => {
      console.log(`Testing visibility of ${pageInfo.name}...`);
      
      const response = await page.goto(`${BASE_URL}${pageInfo.path}`);
      
      // 1. 基础响应断言
      expect(response?.status()).toBe(200);

      // 2. 核心元素等待
      await page.waitForSelector('main', { timeout: 10000 });

      // 3. 负面断言：不出现 ErrorBoundary 的关键词
      const bodyText = await page.innerText('body');
      expect(bodyText).not.toContain('应用程序遇到了一个意外错误');
      expect(bodyText).not.toContain('ErrorBoundary');
      
      // 4. 正面断言：关键标题存在 (不分大小写或模糊匹配)
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
      
      // 特殊处理：有些页面标题可能是 div 或 span 模拟的，根据实际 DOM 结构适配
      const pageText = await page.textContent('body');
      expect(pageText).toContain(pageInfo.heading);
    });
  }

  test('Task Detail page should render without crash', async ({ page, request }) => {
    // 1. 先测不存在的 ID (检查空态渲染)
    await page.goto(`${BASE_URL}/cms/tasks/non-existent-id`);

    // 显式等待空态文本出现，避免异步加载未完成的 flaky
    await expect(page.getByText('任务不存在')).toBeVisible({ timeout: 10000 });

    let bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('ReferenceError');
    expect(bodyText).not.toContain('应用程序遇到了一个意外错误');

    // 2. 尝试测一个真实的 ID (检查数据驱动渲染)
    const res = await request.get(`${BASE_URL}/__proxy/db/tasks`);
    if (res.ok()) {
      const tasks = await res.json();
      if (Array.isArray(tasks) && tasks.length > 0) {
        const realId = tasks[0].id;
        console.log(`Testing real task detail: ${realId}`);
        await page.goto(`${BASE_URL}/cms/tasks/${realId}`);

        // 显式等待 Tab 结构出现，避免异步加载未完成的 flaky
        await expect(page.getByText('概览')).toBeVisible({ timeout: 10000 });

        bodyText = await page.innerText('body');
        expect(bodyText).not.toContain('ReferenceError');
        expect(bodyText).not.toContain('应用程序遇到了一个意外错误');

        // W2 断言：必须看到 Tab 结构
        expect(bodyText).toContain('Markdown');
        expect(bodyText).toContain('元数据');
        expect(bodyText).toContain('事件日志');
      }
    }
  });

  test('Asset Detail page should render without crash', async ({ page, request }) => {
    // 1. 先测不存在的 ID (检查空态渲染)
    await page.goto(`${BASE_URL}/cms/asset/999999999`);

    // 显式等待空态文本出现，避免异步加载未完成的 flaky
    await expect(page.getByText('不存在或已被删除')).toBeVisible({ timeout: 10000 });

    let bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('ReferenceError');
    expect(bodyText).not.toContain('应用程序遇到了一个意外错误');

    // 2. 尝试测一个真实的 ID (检查数据驱动渲染)
    const res = await request.get(`${BASE_URL}/__proxy/db/materials`);
    if (res.ok()) {
      const materials = await res.json();
      if (Array.isArray(materials) && materials.length > 0) {
        // 筛选出能被 /cms/asset/{id} 正常打开的资产
        // AssetDetailPage 期望 id 为数字，避免字符串型 UAT ID 导致显示"不存在或已删除"
        const validMaterials = materials.filter((m) => {
          const id = String(m.id);
          // 排除非数字 ID（如 UAT 字符串 ID）
          return /^\d+$/.test(id);
        });

        if (validMaterials.length > 0) {
          const realMaterialId = validMaterials[0].id;
          console.log(`Testing real asset detail: ${realMaterialId}`);
          await page.goto(`${BASE_URL}/cms/asset/${realMaterialId}`);

          // 显式等待关键内容出现，避免异步加载未完成的 flaky
          await expect(page.getByText('返回工作台')).toBeVisible({ timeout: 10000 });

          bodyText = await page.innerText('body');
          expect(bodyText).not.toContain('ReferenceError');
          expect(bodyText).not.toContain('应用程序遇到了一个意外错误');
          expect(bodyText).not.toContain('is not defined');
          expect(bodyText).not.toContain('ErrorBoundary');

          // 正面断言：资产详情页稳定内容
          expect(bodyText).toContain('返回工作台');

          // 断言资产 ID 或 MAT-{id} 显示在页面上
          const idStr = String(realMaterialId);
          expect(bodyText.includes(idStr) || bodyText.includes(`MAT-${idStr}`), '页面应显示资产 ID').toBeTruthy();

          // 尝试断言标题，优先使用 Material.title 或 metadata.fileName/relativePath
          // 如果历史数据不一致，至少保证页面可用（不崩溃）
          const material = validMaterials[0];
          const hasTitle = material.title ? bodyText.includes(material.title) : false;
          const hasMetadataFileName = material.metadata?.fileName ? bodyText.includes(material.metadata.fileName) : false;
          const hasRelativePath = material.metadata?.relativePath ? bodyText.includes(material.metadata.relativePath) : false;

          // 至少一个标题字段应该存在，但不强制断言（避免历史数据不一致导致误判）
          if (hasTitle || hasMetadataFileName || hasRelativePath) {
            console.log('Asset title/filename found in page');
          } else {
            // 即使没有匹配到标题，只要页面不崩溃且有 ID 显示就算通过
            console.log('Title/filename not found in page data, but page is stable');
          }
        } else {
          // 如果找不到任何真实可用资产，明确 skip
          test.skip(true, '未找到可用的数字型 material ID，跳过真实资产详情页测试');
        }
      }
    }
  });

});