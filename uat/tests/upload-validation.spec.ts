import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8081';

test.describe('【P0】上传校验原子化', () => {
  test('不支持格式不得创建 Material/Task', async ({ request }) => {
    const materialId = `uat-bad-${Date.now()}`;

    const uploadResp = await request.post(`${BASE_URL}/__proxy/upload/tasks`, {
      multipart: {
        file: {
          name: 'bad.unsupported',
          mimeType: 'application/octet-stream',
          buffer: Buffer.from('bad'),
        },
        materialId,
      },
    });

    expect(uploadResp.status()).toBe(400);

    const matResp = await request.get(`${BASE_URL}/__proxy/db/materials/${encodeURIComponent(materialId)}`);
    expect(matResp.status()).toBe(404);

    const tasksResp = await request.get(`${BASE_URL}/__proxy/db/tasks`);
    if (tasksResp.ok()) {
      const tasks = await tasksResp.json();
      if (Array.isArray(tasks)) {
        const related = tasks.filter((t) => String(t?.materialId) === String(materialId));
        expect(related.length).toBe(0);
      }
    }
  });

  test('中文文件名上传后不得写入乱码', async ({ request }) => {
    const materialId = `uat-filename-${Date.now()}`;
    const fileName = '附件二：语音指导及监考话术.md';

    const uploadResp = await request.post(`${BASE_URL}/__proxy/upload/tasks`, {
      multipart: {
        file: {
          name: fileName,
          mimeType: 'text/markdown',
          buffer: Buffer.from('# 中文文件名编码回归\n\n用于验证上传链路。', 'utf-8'),
        },
        materialId,
      },
    });

    expect(uploadResp.status()).toBe(200);
    const body = await uploadResp.json();
    expect(body.fileName).toBe(fileName);
    expect(body.taskId).toBeTruthy();

    const matResp = await request.get(`${BASE_URL}/__proxy/db/materials/${encodeURIComponent(materialId)}`);
    expect(matResp.status()).toBe(200);
    const material = await matResp.json();
    expect(material.fileName).toBe(fileName);
    expect(material.title).toBe('附件二：语音指导及监考话术');

    const taskResp = await request.get(`${BASE_URL}/__proxy/db/tasks/${encodeURIComponent(body.taskId)}`);
    expect(taskResp.status()).toBe(200);
    const task = await taskResp.json();
    expect(task.optionsSnapshot?.material?.fileName).toBe(fileName);
  });

  test('上传请求被 abort 不得留下 processing 脏素材', async ({ page, request }) => {
    const stamp = Date.now();
    const baseName = `uat-abort-${stamp}`;
    const fileName = `${baseName}.pdf`;

    const beforeResp = await request.get(`${BASE_URL}/__proxy/db/materials`);
    expect(beforeResp.status()).toBe(200);
    const beforeList = await beforeResp.json();
    void beforeList;

    await page.route('**/__proxy/upload/tasks', async (route) => {
      await route.abort();
    });

    await page.goto(`${BASE_URL}/cms/workspace`);
    const input = page.locator('input[type="file"]').first();
    await input.setInputFiles({
      name: fileName,
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n% abort-test\n', 'utf-8'),
    });

    await page.waitForTimeout(800);

    const afterResp = await request.get(`${BASE_URL}/__proxy/db/materials`);
    expect(afterResp.status()).toBe(200);
    const afterList = await afterResp.json();
    if (Array.isArray(afterList)) {
      const exists = afterList.some((m) =>
        String((m as any)?.title || '').trim() === baseName
        || String((m as any)?.fileName || '').trim() === fileName
        || String((m as any)?.metadata?.fileName || '').trim() === fileName
      );
      expect(exists).toBe(false);
    }
  });
});
