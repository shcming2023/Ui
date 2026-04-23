import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8081';

test.describe('Task Creation Idempotency (Concurrency Patch)', () => {
  test('should block concurrent task creation for the same material', async ({ request }) => {
    // 1. 获取一个真实的素材 ID
    const res = await request.get(`${BASE_URL}/__proxy/db/materials`);
    expect(res.ok()).toBeTruthy();
    const materials = await res.json();
    // 选一个数字 ID 的素材
    const validMaterials = materials.filter((m: any) => /^\d+$/.test(String(m.id)));
    
    if (validMaterials.length === 0) {
       console.log('No valid materials found, skipping...');
       return;
    }
    
    const materialId = validMaterials[0].id;
    console.log(`Testing concurrency for materialId: ${materialId}`);

    // 2. 环境清理：确保该素材目前没有活跃任务，否则 409 是正常的但不是并发产生的
    const tasksRes = await request.get(`${BASE_URL}/__proxy/db/tasks`);
    const allTasks = await tasksRes.json();
    const activeStates = ['pending', 'running', 'ai-pending', 'ai-running', 'review-pending'];
    const activeTasks = allTasks.filter((t: any) => 
      String(t.materialId) === String(materialId) && 
      activeStates.includes(t.state)
    );
    
    if (activeTasks.length > 0) {
      console.log(`Cleaning up ${activeTasks.length} existing active tasks for material ${materialId}...`);
      for (const t of activeTasks) {
        // 将状态改为 canceled 避开幂等检查
        await request.patch(`${BASE_URL}/__proxy/db/tasks/${t.id}`, { 
          data: { state: 'canceled', message: 'UAT Cleanup' } 
        });
      }
    }

    // 3. 构造并发请求函数
    const triggerTask = (tag: string) => request.post(`${BASE_URL}/__proxy/upload/tasks`, {
      multipart: {
        materialId: String(materialId),
        file: {
          name: `concurrency-test-${tag}.pdf`,
          mimeType: 'application/pdf',
          buffer: Buffer.from(`%PDF-1.4 concurrency test ${tag} ${Date.now()}`),
        }
      }
    });

    // 4. 发射并发请求
    console.log('Firing 2 concurrent requests to /upload/tasks...');
    const results = await Promise.all([
      triggerTask('A'),
      triggerTask('B')
    ]);

    const statuses = results.map(r => r.status());
    console.log('Results statuses:', statuses);

    // 5. 核心断言：必须满足幂等性
    // 情况 A: 一个 200，一个 409 (最理想的并发拦截)
    // 情况 B: 如果串行极快，第一个成功后第二个由于 DB 写入延迟可能还没看到？
    // 不，db-server 是内存同步操作，只要第一个写进 dbCache，第二个 POST 必能看到。
    
    expect(statuses).toContain(200);
    expect(statuses).toContain(409);

    const conflictRes = results.find(r => r.status() === 409);
    if (conflictRes) {
      const errData = await conflictRes.json();
      expect(errData.code).toBe('TASK_ALREADY_ACTIVE');
      expect(errData.existingTaskId).toBeDefined();
      console.log(`Successfully blocked duplicate task creation. Existing Task: ${errData.existingTaskId}`);
    }

    // 6. 最终一致性检查：DB 中活跃任务总数必须为 1
    const finalTasksRes = await request.get(`${BASE_URL}/__proxy/db/tasks`);
    const finalTasks = await finalTasksRes.json();
    const finalActiveTasks = finalTasks.filter((t: any) => 
      String(t.materialId) === String(materialId) && 
      activeStates.includes(t.state)
    );
    
    expect(finalActiveTasks.length).toBe(1);
    console.log(`Final check passed: Only 1 active task for material ${materialId} in DB.`);
  });
});
