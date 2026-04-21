/**
 * settings-client.mjs - 系统设置客户端
 */

const DB_BASE_URL = process.env.DB_BASE_URL || 'http://localhost:8789';

export async function getSettings() {
  try {
    const resp = await fetch(`${DB_BASE_URL}/settings`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (error) {
    console.error(`[settings-client] getSettings failed: ${error.message}`);
    return {};
  }
}
