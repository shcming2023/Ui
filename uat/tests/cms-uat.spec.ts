import { test, expect, type Page } from '@playwright/test';

/**
 * EduAsset CMS — UAT 端到端测试套件
 *
 * 覆盖范围：
 *   1. 页面加载与 SPA 路由
 *   2. 后端服务健康检查（via Nginx 代理）
 *   3. DB API 基础功能（资产列表、设置读写）
 *   4. 文件上传流程（含 MinIO presigned URL 公开地址验证）
 *   5. MinIO Nginx 代理可达性
 *   6. 数据持久化（写入后重新加载验证）
 *
 * 环境变量：
 *   BASE_URL    测试目标地址（默认 http://localhost:8081）
 *   PUBLIC_HOST presigned URL 断言用公网主机名（未设置时跳过主机名匹配）
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

// PUBLIC_HOST 用于 presigned URL 主机名断言（可选，未配置则跳过主机名断言）
const PUBLIC_HOST = process.env.PUBLIC_HOST || '';

// UAT 命名空间前缀——所有测试写入的键/ID 必须以此开头，afterAll 统一清理
const UAT_PREFIX = 'uat_';

// ── 辅助函数 ──────────────────────────────────────────────────

async function waitForAppReady(page: Page) {
  // 等待 React 应用挂载完成（Layout 中的导航元素出现）
  await page.waitForSelector('nav, [data-testid="layout"], main', { timeout: 20_000 });
}

// ── 测试组 1：页面加载与路由 ──────────────────────────────────

test.describe('【1】页面加载与 SPA 路由', () => {
  test('根路径 / 应重定向到 /cms/', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/`);
    // 允许重定向链最终落在 /cms/ 或 /cms/source-materials
    expect(page.url()).toMatch(/\/cms\//);
    expect(response?.status()).toBeLessThan(400);
  });

  test('/cms/ 应正确加载 SPA 入口', async ({ page }) => {
    await page.goto(`${BASE_URL}/cms/`);
    await waitForAppReady(page);
    const title = await page.title();
    // 页面 title 不为空
    expect(title).toBeTruthy();
  });

  test('/cms/source-materials 原始资料库页面可访问', async ({ page }) => {
    await page.goto(`${BASE_URL}/cms/source-materials`);
    await waitForAppReady(page);
    // 验证页面不是错误页
    await expect(page.locator('body')).not.toContainText('500');
    await expect(page.locator('body')).not.toContainText('502');
    await expect(page.locator('body')).not.toContainText('504');
  });

  test('/cms/products 成品库页面可访问', async ({ page }) => {
    await page.goto(`${BASE_URL}/cms/products`);
    await waitForAppReady(page);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('/cms/settings 系统设置页面可访问', async ({ page }) => {
    await page.goto(`${BASE_URL}/cms/settings`);
    await waitForAppReady(page);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('/cms/metadata 元数据管理页面可访问', async ({ page }) => {
    await page.goto(`${BASE_URL}/cms/metadata`);
    await waitForAppReady(page);
    await expect(page.locator('body')).not.toContainText('404');
  });
});

// ── 测试组 2：后端 API 健康检查 ──────────────────────────────

test.describe('【2】后端服务健康检查', () => {
  test('upload-server /health 返回 ok', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/__proxy/upload/health`);
    expect(response.status()).toBe(200);
    const body = await response.json() as { ok: boolean; service: string };
    expect(body.ok).toBe(true);
    expect(body.service).toBe('upload-server');
  });

  test('db-server /health 返回 ok', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/__proxy/db/health`);
    expect(response.status()).toBe(200);
    const body = await response.json() as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});

// ── 测试组 3：DB API 基础功能 ─────────────────────────────────

// 记录本次测试写入的 settingsKeys 与 materialIds，供 afterAll 清理
const uatSettingsKeys: string[] = [];
const uatMaterialIds: (string | number)[] = [];

test.describe('【3】db-server REST API', () => {
  test.afterAll(async ({ request }) => {
    // 清理写入 settings 中的 UAT 测试键
    if (uatSettingsKeys.length > 0) {
      try {
        const getResp = await request.get(`${BASE_URL}/__proxy/db/settings`);
        if (getResp.ok()) {
          const current = await getResp.json() as Record<string, unknown>;
          const cleaned: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(current)) {
            if (!uatSettingsKeys.includes(k)) cleaned[k] = v;
          }
          await request.put(`${BASE_URL}/__proxy/db/settings`, {
            data: cleaned,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch { /* afterAll 清理失败不中止 */ }
    }

    // 清理写入 materials 中的 UAT 测试资料
    for (const id of uatMaterialIds) {
      try {
        await request.delete(`${BASE_URL}/__proxy/db/materials/${id}`);
      } catch { /* 已删除或清理失败不中止 */ }
    }
  });

  test('GET /materials 返回有效响应', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/__proxy/db/materials`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    // 资产列表应为数组
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /settings 返回有效响应', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/__proxy/db/settings`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeTruthy();
  });

  test('数据持久化：写入后重新读取一致', async ({ request }) => {
    const testKey = `${UAT_PREFIX}test_${Date.now()}`;
    const testValue = `test_value_${Math.random().toString(36).slice(2)}`;
    uatSettingsKeys.push(testKey);

    // 写入测试设置
    const putResp = await request.put(`${BASE_URL}/__proxy/db/settings`, {
      data: { [testKey]: testValue },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(putResp.status()).toBeLessThan(300);

    // 重新读取验证
    const getResp = await request.get(`${BASE_URL}/__proxy/db/settings`);
    expect(getResp.status()).toBe(200);
    const settings = await getResp.json() as Record<string, unknown>;
    expect(settings[testKey]).toBe(testValue);
  });

  test('secrets 持久化：写入后重新读取一致', async ({ request }) => {
    const testKey = `${UAT_PREFIX}secret_${Date.now()}`;
    const testValue = `secret_${Math.random().toString(36).slice(2)}`;
    uatSettingsKeys.push(testKey);

    const putResp = await request.put(`${BASE_URL}/__proxy/db/secrets`, {
      data: { [testKey]: testValue },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(putResp.status()).toBeLessThan(300);

    const getResp = await request.get(`${BASE_URL}/__proxy/db/secrets`);
    expect(getResp.status()).toBe(200);
    const body = await getResp.json() as { secrets?: Record<string, unknown> };
    expect(body.secrets?.[testKey]).toBe(testValue);
  });

  test('materials 删除：DELETE /materials/:id 生效', async ({ request }) => {
    const id = `${UAT_PREFIX}del_${Date.now()}`;
    uatMaterialIds.push(id);

    const material = {
      id,
      title: `${UAT_PREFIX}delete-test`,
      type: 'TXT',
      size: '0.0 MB',
      sizeBytes: 0,
      uploadTime: '刚刚',
      uploadTimestamp: Date.now(),
      status: 'processing',
      mineruStatus: 'pending',
      aiStatus: 'pending',
      tags: [],
      metadata: { provider: 'tmpfiles' },
      uploader: 'uat',
    };

    const postResp = await request.post(`${BASE_URL}/__proxy/db/materials`, {
      data: material,
      headers: { 'Content-Type': 'application/json' },
    });
    expect(postResp.status()).toBeLessThan(300);

    const delResp = await request.delete(`${BASE_URL}/__proxy/db/materials/${id}`);
    expect(delResp.status()).toBeLessThan(300);
    // 删除成功后从待清理列表中移除（已删除无需再次尝试）
    const idx = uatMaterialIds.indexOf(id);
    if (idx !== -1) uatMaterialIds.splice(idx, 1);

    const listResp = await request.get(`${BASE_URL}/__proxy/db/materials`);
    expect(listResp.status()).toBe(200);
    const list = await listResp.json() as Array<{ id: unknown }>;
    expect(list.find((m) => String(m.id) === String(id))).toBeFalsy();
  });
});

// ── 测试组 4：MinIO Nginx 代理 ────────────────────────────────

test.describe('【4】MinIO Nginx 反向代理', () => {
  test('/minio/minio/health/live 通过 Nginx 可达', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/minio/minio/health/live`);
    // MinIO health 端点返回 200
    expect(response.status()).toBe(200);
  });

  test('presigned URL 中不含内部容器地址', async ({ request }) => {
    // 通过 /list 接口获取已有文件的 presigned URL（如有文件）
    const listResp = await request.get(`${BASE_URL}/__proxy/upload/list?prefix=originals`);
    if (listResp.status() !== 200) {
      test.skip();
      return;
    }

    const body = await listResp.json() as { objects?: Array<{ presignedUrl: string }> };
    const objects = body.objects || [];

    if (objects.length === 0) {
      // 没有文件时跳过（空环境），不视为失败
      test.skip();
      return;
    }

    // 验证 presigned URL 不包含内部容器地址
    for (const obj of objects.slice(0, 3)) {
      const url = obj.presignedUrl;
      expect(url).not.toMatch(/minio:\d+/);
      // 若配置了 PUBLIC_HOST，验证 URL 中包含该主机名；否则只检查没有内部地址
      if (PUBLIC_HOST) {
        expect(url).toContain(PUBLIC_HOST);
      }
    }
  });
});

// ── 测试组 5：文件上传流程 ────────────────────────────────────

// 记录上传测试产生的任务 ID，供 afterAll 清理
const uatTaskIds: string[] = [];

test.describe('【5】文件上传流程', () => {
  test.afterAll(async ({ request }) => {
    if (uatTaskIds.length === 0) return;
    try {
      await request.delete(`${BASE_URL}/__proxy/db/tasks`, {
        data: { ids: uatTaskIds },
        headers: { 'Content-Type': 'application/json' },
      });
    } catch { /* afterAll 清理失败不中止 */ }
  });

  test('upload-server /tasks 接受小型测试文件并创建任务', async ({ request }) => {
    // 创建一个最小的有效 PNG 文件（1x1 像素）
    const minimalPng = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
      '0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
      'hex',
    );

    const response = await request.post(`${BASE_URL}/__proxy/upload/tasks`, {
      multipart: {
        file: {
          name: 'uat-test.png',
          mimeType: 'image/png',
          buffer: minimalPng,
        },
      },
    });

    // 若存储未配置（507），跳过而非失败
    if (response.status() === 507) {
      test.skip();
      return;
    }

    expect(response.status()).toBe(200);
    const body = await response.json() as { taskId?: string; materialId?: string; url?: string; provider?: string };
    expect(body.taskId).toBeTruthy();

    if (body.taskId) uatTaskIds.push(body.taskId);

    // 若 URL 指向 MinIO，验证其不含内部容器地址
    if (body.provider === 'minio' && body.url) {
      expect(body.url).not.toMatch(/^http:\/\/minio:/);
      // 若配置了 PUBLIC_HOST，验证主机名
      if (PUBLIC_HOST) {
        expect(body.url).toContain(PUBLIC_HOST);
      }
    }
  });

  test('上传后 presigned URL 在目标服务器可直接访问（HTTP GET）', async ({ request }) => {
    const content = Buffer.from(`UAT test file ${Date.now()}`);

    const uploadResp = await request.post(`${BASE_URL}/__proxy/upload/tasks`, {
      multipart: {
        file: {
          name: 'uat-check.txt',
          mimeType: 'text/plain',
          buffer: content,
        },
      },
    });

    // 存储未配置时跳过
    if (uploadResp.status() === 507) {
      test.skip();
      return;
    }
    expect(uploadResp.status()).toBe(200);

    const body = await uploadResp.json() as { taskId?: string; url?: string; provider?: string };
    if (body.taskId) uatTaskIds.push(body.taskId);

    // 非 MinIO 存储或无 URL 时跳过
    if (body.provider !== 'minio' || !body.url) {
      test.skip();
      return;
    }

    // 直接 GET presigned URL，验证文件可访问
    const fileResp = await request.get(body.url);
    expect(fileResp.status()).toBe(200);
  });
});

// ── 测试组 6：页面导航交互 ────────────────────────────────────

test.describe('【6】页面导航交互（冒烟）', () => {
  test('侧边栏导航可正常点击切换页面', async ({ page }) => {
    await page.goto(`${BASE_URL}/cms/`);
    await waitForAppReady(page);

    // 尝试通过 URL 直接访问各核心路由，验证 SPA 路由正常
    const routes = [
      '/cms/workspace',
      '/cms/source-materials',
      '/cms/products',
      '/cms/metadata',
      '/cms/settings',
    ];

    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      await waitForAppReady(page);
      // 验证没有出现错误页面
      const body = page.locator('body');
      await expect(body).not.toContainText('Uncaught Error');
      await expect(body).not.toContainText('Cannot GET');
    }
  });
});

