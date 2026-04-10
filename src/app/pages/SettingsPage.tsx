import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Bot, ScanLine, Database, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appContext';
import type { AiConfig, MinerUConfig, MinioConfig } from '../../store/types';

type ActiveTab = 'ai' | 'mineru' | 'storage';

// ─── 提示词字段中文标签映射 ──────────────────────────────────
const PROMPT_LABELS: Record<string, string> = {
  title:        '资料名称',
  subject:      '学科识别',
  grade:        '年级识别',
  materialType: '资料类型',
  language:     '语言识别',
  country:      '国家/地区',
  tags:         '标签提取',
  summary:      '内容摘要',
};

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-36 flex-shrink-0 mt-2">
        <label className="text-sm text-gray-500">{label}</label>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  className = '',
  disabled = false,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
    />
  );
}

export function SettingsPage() {
  const { state, dispatch } = useAppStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai');
  const [showKey, setShowKey] = useState(false);
  const [showMinioKeys, setShowMinioKeys] = useState({ access: false, secret: false });

  // 本地副本（保存前不 dispatch）
  const [aiForm, setAiForm] = useState<AiConfig>({ ...state.aiConfig });
  const [mineruForm, setMineruForm] = useState<MinerUConfig>({ ...state.mineruConfig });
  const [minioForm, setMinioForm] = useState<MinioConfig>({ ...state.minioConfig });

  // 测试连接状态
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  // 保存中状态
  const [savingMinio, setSavingMinio] = useState(false);

  // 切换到 storage tab 时从 upload-server 读取最新配置
  useEffect(() => {
    if (activeTab !== 'storage') return;
    setTestResult(null);
    fetch('/__proxy/upload/settings/storage')
      .then((r) => r.json())
      .then((data) => {
        setMinioForm((prev) => ({
          ...prev,
          storageBackend:  data.storageBackend  ?? prev.storageBackend,
          endpoint:        data.endpoint        ?? prev.endpoint,
          port:            data.port            ?? prev.port,
          useSSL:          data.useSSL          ?? prev.useSSL,
          // 密钥返回 *** 时保留本地 store 中保存的值（若有）
          accessKey:       data.accessKey === '***' ? (state.minioConfig.accessKey || '') : (data.accessKey || ''),
          secretKey:       data.secretKey === '***' ? (state.minioConfig.secretKey || '') : (data.secretKey || ''),
          bucket:          data.bucket          ?? prev.bucket,
          parsedBucket:    data.parsedBucket    ?? prev.parsedBucket,
          presignedExpiry: data.presignedExpiry  ?? prev.presignedExpiry,
        }));
      })
      .catch(() => {/* upload-server 不可用时静默，使用 store 默认值 */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const updateAi = (patch: Partial<AiConfig>) => setAiForm((prev) => ({ ...prev, ...patch }));
  const updateAiPrompt = (key: keyof AiConfig['prompts'], val: string) =>
    setAiForm((prev) => ({ ...prev, prompts: { ...prev.prompts, [key]: val } }));
  const updateMineru = (patch: Partial<MinerUConfig>) => setMineruForm((prev) => ({ ...prev, ...patch }));
  const updateMinio = (patch: Partial<MinioConfig>) => {
    setMinioForm((prev) => ({ ...prev, ...patch }));
    setTestResult(null);
  };

  const handleSaveAi = () => {
    dispatch({ type: 'UPDATE_AI_CONFIG', payload: aiForm });
    toast.success('AI 配置已保存');
  };

  const handleSaveMineru = () => {
    dispatch({ type: 'UPDATE_MINERU_CONFIG', payload: mineruForm });
    toast.success('MinerU 配置已保存');
  };

  const handleTestMinio = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const resp = await fetch('/__proxy/upload/settings/storage/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minioForm),
      });
      const data = await resp.json();
      setTestResult({ ok: data.ok, message: data.message });
    } catch (e) {
      setTestResult({ ok: false, message: `请求失败：${e instanceof Error ? e.message : String(e)}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveMinio = async () => {
    setSavingMinio(true);
    try {
      const resp = await fetch('/__proxy/upload/settings/storage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(minioForm),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ message: `HTTP ${resp.status}` }));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      // 同步到 store（含 localStorage + db-server）
      dispatch({ type: 'UPDATE_MINIO_CONFIG', payload: minioForm });
      toast.success('存储配置已保存');
    } catch (e) {
      toast.error(`保存失败：${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSavingMinio(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      {/* 头部 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="text-sm text-gray-500 mt-0.5">配置 AI 识别、MinerU 解析接口及存储后端</p>
      </div>

      {/* Tab */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-1.5"><Bot size={15} /> AI 识别配置</span>
        </button>
        <button
          onClick={() => setActiveTab('mineru')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'mineru'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-1.5"><ScanLine size={15} /> MinerU 配置</span>
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'storage'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="flex items-center gap-1.5"><Database size={15} /> 存储配置</span>
        </button>
      </div>

      {/* ===== AI 配置 ===== */}
      {activeTab === 'ai' && (
        <div className="space-y-5">
          {/* 接口参数 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">接口参数</h2>
            <FieldRow label="API 地址">
              <Input
                value={aiForm.apiEndpoint}
                onChange={(v) => updateAi({ apiEndpoint: v })}
                placeholder="https://api.example.com/v1/chat/completions"
              />
            </FieldRow>
            <FieldRow label="API Key">
              <div className="relative">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={aiForm.apiKey}
                  onChange={(v) => updateAi({ apiKey: v })}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FieldRow>
            <FieldRow label="模型">
              <Input
                value={aiForm.model}
                onChange={(v) => updateAi({ model: v })}
                placeholder="moonshot-v1-32k"
              />
            </FieldRow>
            <FieldRow label="超时（秒）">
              <Input
                type="number"
                value={aiForm.timeout}
                onChange={(v) => updateAi({ timeout: Number(v) })}
              />
            </FieldRow>
          </div>

          {/* 提示词配置 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">识别提示词</h2>
            {(Object.keys(aiForm.prompts) as (keyof AiConfig['prompts'])[]).map((key) => (
              <FieldRow key={key} label={PROMPT_LABELS[key] ?? key}>
                <Textarea
                  value={aiForm.prompts[key]}
                  onChange={(v) => updateAiPrompt(key, v)}
                  rows={2}
                />
              </FieldRow>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveAi}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={15} /> 保存 AI 配置
            </button>
          </div>
        </div>
      )}

      {/* ===== MinerU 配置 ===== */}
      {activeTab === 'mineru' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">接口参数</h2>
            <FieldRow label="API 地址">
              <Input
                value={mineruForm.apiEndpoint}
                onChange={(v) => updateMineru({ apiEndpoint: v })}
              />
            </FieldRow>
            <FieldRow label="API Key">
              <div className="relative">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={mineruForm.apiKey}
                  onChange={(v) => updateMineru({ apiKey: v })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FieldRow>
            <FieldRow label="超时（秒）">
              <Input
                type="number"
                value={mineruForm.timeout}
                onChange={(v) => updateMineru({ timeout: Number(v) })}
              />
            </FieldRow>
            <FieldRow label="API 模式">
              <div className="flex gap-3">
                {(['precise', 'agent'] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="apiMode"
                      value={mode}
                      checked={mineruForm.apiMode === mode}
                      onChange={() => updateMineru({ apiMode: mode })}
                    />
                    <span className="text-sm text-gray-700 capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </FieldRow>
            <FieldRow label="模型版本">
              <div className="flex gap-3">
                {(['pipeline', 'vlm'] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="modelVersion"
                      value={v}
                      checked={mineruForm.modelVersion === v}
                      onChange={() => updateMineru({ modelVersion: v })}
                    />
                    <span className="text-sm text-gray-700 uppercase">{v}</span>
                  </label>
                ))}
              </div>
            </FieldRow>
          </div>

          {/* 功能开关 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h2 className="font-semibold text-gray-800">功能开关</h2>
            {[
              { key: 'enableOcr',     label: 'OCR 识别' },
              { key: 'enableFormula', label: '公式识别' },
              { key: 'enableTable',   label: '表格识别' },
            ].map((item) => {
              const val = mineruForm[item.key as keyof MinerUConfig] as boolean;
              return (
                <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => updateMineru({ [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                </label>
              );
            })}
            <FieldRow label="识别语言">
              <Input
                value={mineruForm.language}
                onChange={(v) => updateMineru({ language: v })}
                placeholder="ch"
              />
            </FieldRow>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveMineru}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={15} /> 保存 MinerU 配置
            </button>
          </div>
        </div>
      )}

      {/* ===== 存储配置 ===== */}
      {activeTab === 'storage' && (
        <div className="space-y-5">
          {/* 存储后端 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">存储后端</h2>
            <FieldRow label="存储后端" hint="minio：私有对象存储；tmpfiles：临时公开存储">
              <div className="flex gap-4">
                {(['minio', 'tmpfiles'] as const).map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="storageBackend"
                      value={b}
                      checked={minioForm.storageBackend === b}
                      onChange={() => updateMinio({ storageBackend: b })}
                    />
                    <span className="text-sm text-gray-700">{b === 'minio' ? 'MinIO（推荐）' : 'tmpfiles（临时）'}</span>
                  </label>
                ))}
              </div>
            </FieldRow>
          </div>

          {/* MinIO 连接参数 */}
          <div className={`bg-white rounded-xl border p-5 space-y-4 transition-opacity ${minioForm.storageBackend !== 'minio' ? 'opacity-50 pointer-events-none border-gray-200' : 'border-gray-200'}`}>
            <h2 className="font-semibold text-gray-800">MinIO 连接参数</h2>
            <FieldRow label="端点地址" hint="主机名或 IP，不含协议">
              <Input
                value={minioForm.endpoint}
                onChange={(v) => updateMinio({ endpoint: v })}
                placeholder="minio 或 192.168.1.100"
                disabled={minioForm.storageBackend !== 'minio'}
              />
            </FieldRow>
            <FieldRow label="端口">
              <Input
                type="number"
                value={minioForm.port}
                onChange={(v) => updateMinio({ port: Number(v) })}
                placeholder="9000"
                disabled={minioForm.storageBackend !== 'minio'}
              />
            </FieldRow>
            <FieldRow label="使用 SSL">
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={minioForm.useSSL}
                  onChange={(e) => updateMinio({ useSSL: e.target.checked })}
                  disabled={minioForm.storageBackend !== 'minio'}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">启用 HTTPS</span>
              </label>
            </FieldRow>
            <FieldRow label="Access Key">
              <div className="relative">
                <Input
                  type={showMinioKeys.access ? 'text' : 'password'}
                  value={minioForm.accessKey}
                  onChange={(v) => updateMinio({ accessKey: v })}
                  placeholder="minioadmin"
                  className="pr-10"
                  disabled={minioForm.storageBackend !== 'minio'}
                />
                <button
                  type="button"
                  onClick={() => setShowMinioKeys((p) => ({ ...p, access: !p.access }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showMinioKeys.access ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FieldRow>
            <FieldRow label="Secret Key">
              <div className="relative">
                <Input
                  type={showMinioKeys.secret ? 'text' : 'password'}
                  value={minioForm.secretKey}
                  onChange={(v) => updateMinio({ secretKey: v })}
                  placeholder="minioadmin"
                  className="pr-10"
                  disabled={minioForm.storageBackend !== 'minio'}
                />
                <button
                  type="button"
                  onClick={() => setShowMinioKeys((p) => ({ ...p, secret: !p.secret }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showMinioKeys.secret ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FieldRow>
            <FieldRow label="原始资料 Bucket" hint="存放上传原始文件的存储桶">
              <Input
                value={minioForm.bucket}
                onChange={(v) => updateMinio({ bucket: v })}
                placeholder="eduassets"
                disabled={minioForm.storageBackend !== 'minio'}
              />
            </FieldRow>
            <FieldRow label="解析产物 Bucket" hint="存放 MinerU 解析输出物的存储桶">
              <Input
                value={minioForm.parsedBucket}
                onChange={(v) => updateMinio({ parsedBucket: v })}
                placeholder="eduassets-parsed"
                disabled={minioForm.storageBackend !== 'minio'}
              />
            </FieldRow>
            <FieldRow label="URL 有效期" hint="预签名 URL 有效秒数">
              <Input
                type="number"
                value={minioForm.presignedExpiry}
                onChange={(v) => updateMinio({ presignedExpiry: Number(v) })}
                placeholder="3600"
                disabled={minioForm.storageBackend !== 'minio'}
              />
            </FieldRow>
          </div>

          {/* 测试结果 */}
          {testResult && (
            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${testResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {testResult.ok
                ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                : <XCircle size={16} className="mt-0.5 flex-shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleTestMinio}
              disabled={testing || minioForm.storageBackend !== 'minio'}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? <Loader size={14} className="animate-spin" /> : <Database size={14} />}
              {testing ? '测试中...' : '测试连接'}
            </button>
            <button
              onClick={handleSaveMinio}
              disabled={savingMinio}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {savingMinio ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
              {savingMinio ? '保存中...' : '保存存储配置'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
