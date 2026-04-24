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
});

