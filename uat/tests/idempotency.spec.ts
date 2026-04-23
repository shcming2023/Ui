import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

test.describe('Task Creation Idempotency', () => {
  test('should not allow creating multiple active tasks for the same material', async ({ page, request }) => {
    // 1. 获取一个真实的素材 ID
    const res = await request.get(`${BASE_URL}/__proxy/db/materials`);
    expect(res.ok()).toBeTruthy();
    const materials = await res.json();
    const validMaterials = materials.filter((m: any) => /^\d+$/.test(String(m.id)));
    
    if (validMaterials.length === 0) {
       console.log('No valid materials found for idempotency test, skipping...');
       return;
    }
    
    const materialId = validMaterials[0].id;
    console.log(`Using materialId: ${materialId} for idempotency test`);

    // 2. 进入资产详情页
    await page.goto(`${BASE_URL}/cms/asset/${materialId}`);
    
    // 确保页面加载完成，且"开始解析"或"重新解析"按钮可见
    const parseBtn = page.locator('button:has-text("解析")').first();
    await expect(parseBtn).toBeVisible({ timeout: 15000 });

    // 3. 验证后端幂等 (直接 API 调用)
    // 构造一个 Multipart 请求模拟重复提交
    const secondCall = await request.post(`${BASE_URL}/__proxy/upload/tasks`, {
      multipart: {
        materialId: String(materialId),
        file: {
          name: 'idempotency-test.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4 test content'),
        }
      }
    });

    // 如果当前已经有一个活跃任务，则应直接返回 409
    // 如果当前没有活跃任务，我们先通过 UI 触发一个
    if (secondCall.status() !== 409) {
      console.log('No active task found, triggering one via UI first...');
      await parseBtn.click();
      
      // 等待按钮进入"解析中"状态
      await expect(page.locator('button:has-text("解析中")')).toBeVisible({ timeout: 10000 });
      
      // 再次尝试 API 调用，此时必须返回 409
      const thirdCall = await request.post(`${BASE_URL}/__proxy/upload/tasks`, {
        multipart: {
          materialId: String(materialId),
          file: {
            name: 'idempotency-test-2.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('%PDF-1.4 test content 2'),
          }
        }
      });
      
      expect(thirdCall.status()).toBe(409);
      const errData = await thirdCall.json();
      expect(errData.code).toBe('TASK_ALREADY_ACTIVE');
      expect(errData.existingTaskId).toBeDefined();
    } else {
      console.log('Found existing active task via 409 response');
      const errData = await secondCall.json();
      expect(errData.code).toBe('TASK_ALREADY_ACTIVE');
    }

    // 4. 验证前端拦截与提示
    // 强制通过脚本点击已禁用的按钮（模拟极速双击或并发触发）
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('解析中') || b.innerText.includes('解析'));
      if (btn) {
        (btn as HTMLButtonElement).disabled = false;
        btn.click();
      }
    });

    // 应看到 Toast 提示
    await expect(page.getByText('当前已有进行中的任务')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('查看任务')).toBeVisible();
  });
});
