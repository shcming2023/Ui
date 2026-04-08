import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, FileText, Play, Cpu, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appContext';
import { StatusBadge } from '../components/StatusBadge';
import type { ProcessTask } from '../../store/types';
import { runMinerUPipeline } from '../../utils/mineruApi';

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const detail = state.assetDetails[numId];
  const material = state.materials.find((m) => m.id === numId);

  const [tagInput, setTagInput] = useState('');
  const [editingTags, setEditingTags] = useState(false);
  const [localTags, setLocalTags] = useState<string[]>(detail?.tags ?? []);

  // MinerU 解析状态
  const [mineruRunning, setMineruRunning] = useState(false);
  const [mineruProgress, setMineruProgress] = useState(0);
  const [mineruProgressMsg, setMineruProgressMsg] = useState('');
  const [mineruMarkdown, setMineruMarkdown] = useState<string>('');
  const [mineruRetryCount, setMineruRetryCount] = useState(0);

  // AI 分析状态
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  if (!detail) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/source-materials')}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={16} /> 返回资料库
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          资产 #{id} 不存在或已被删除
        </div>
      </div>
    );
  }

  const handleStartProcessing = () => {
    if (!detail) return;

    // 创建一个新的处理任务
    const newTask: ProcessTask = {
      id: Date.now(),
      name: detail.title,
      type: 'rawcode生成',
      status: 'processing',
      stage: '启动中',
      progress: 0,
      input: detail.assetId,
      output: '-',
      assignee: '系统',
      startTime: new Date().toLocaleString('zh-CN'),
      estimatedTime: '预计 30 分钟',
      logs: [
        {
          time: new Date().toLocaleTimeString('zh-CN'),
          level: 'info',
          msg: '任务已创建，开始处理',
        },
      ],
      materialId: numId, // 关联到当前资料
    };

    // 添加任务并更新资料状态
    dispatch({ type: 'ADD_PROCESS_TASK', payload: newTask });

    // 更新资料状态为 processing
    dispatch({
      type: 'UPDATE_MATERIAL_AI_STATUS',
      payload: { id: numId, aiStatus: 'analyzing', status: 'processing' },
    });

    toast.success('处理任务已创建，正在处理中');
  };

  const handleMineruParse = async () => {
    if (!material) { toast.error('找不到资料信息'); return; }
    if (!state.mineruConfig.apiKey?.trim()) {
      toast.error('请先在「系统设置」中配置 MinerU API Key');
      return;
    }

    // 判断文件来源：优先用 objectName 重新获取 presigned URL，否则使用已有 URL
    const objectName = material.metadata?.objectName as string | undefined;
    const fileUrl = material.metadata?.fileUrl as string | undefined;

    if (!objectName && !fileUrl) {
      toast.error('文件尚未上传或缺少访问地址');
      return;
    }

    setMineruRunning(true);
    setMineruProgress(0);
    setMineruMarkdown('');
    setMineruRetryCount(0);
    dispatch({ type: 'UPDATE_MATERIAL_MINERU_STATUS', payload: { id: numId, mineruStatus: 'processing' } });

    try {
      let resolvedUrl = fileUrl;

      // 如果有 objectName，先从 upload-server 获取最新 presigned URL（避免旧 URL 过期）
      if (objectName) {
        setMineruProgressMsg('获取文件访问凭证...');
        const presignRes = await fetch(
          `/__proxy/upload/presign?objectName=${encodeURIComponent(objectName)}`,
        );
        if (presignRes.ok) {
          const presignData = await presignRes.json();
          resolvedUrl = presignData.url;
        }
      }

      if (!resolvedUrl) {
        throw new Error('无法获取文件访问地址');
      }

      // 用 onProgress 回调同步更新进度和重试计数
      const handleProgress = (pct: number, msg: string) => {
        setMineruProgress(pct);
        setMineruProgressMsg(msg);
        // 从消息中提取重试次数（格式：第 N/3 次）
        const retryMatch = msg.match(/第\s*(\d+)\s*\/\s*\d+\s*次/);
        if (retryMatch) setMineruRetryCount(Number(retryMatch[1]) - 1);
      };

      const result = await runMinerUPipeline(
        resolvedUrl,
        `${material.title}.${material.type.toLowerCase()}`,
        state.mineruConfig,
        handleProgress,
      );

      if (result.zipUrl) {
        dispatch({ type: 'UPDATE_MATERIAL_MINERU_ZIP_URL', payload: { id: numId, mineruZipUrl: result.zipUrl } });

        // 解析完成后，让后端下载 ZIP 并将解析物存入存储（MinIO 或 tmpfiles fallback）
        {
          setMineruProgressMsg('保存解析结果到文件库...');
          try {
            const downloadRes = await fetch('/__proxy/upload/parse/download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ zipUrl: result.zipUrl, materialId: numId }),
            });

            if (downloadRes.ok) {
              const downloadData = await downloadRes.json();

              // 内联 markdownContent 始终存在（服务端从 ZIP 提取），优先用于预览
              if (downloadData.markdownContent) {
                setMineruMarkdown(downloadData.markdownContent);
              }

              // markdownObjectName（MinIO）或 markdownUrl（tmpfiles fallback）任一存在即可
              if (downloadData.markdownObjectName || downloadData.markdownUrl) {
                dispatch({
                  type: 'UPDATE_MATERIAL',
                  payload: {
                    id: numId,
                    updates: {
                      metadata: {
                        ...material.metadata,
                        ...(downloadData.markdownObjectName ? { markdownObjectName: downloadData.markdownObjectName } : {}),
                        ...(downloadData.markdownUrl ? { markdownUrl: downloadData.markdownUrl } : {}),
                        parsedFilesCount: String(downloadData.totalFiles ?? '?'),
                      },
                    },
                  },
                });

                // 若没有内联内容，再从 URL 拉取
                if (!downloadData.markdownContent && downloadData.markdownUrl) {
                  const mdRes = await fetch(downloadData.markdownUrl);
                  if (mdRes.ok) {
                    const mdText = await mdRes.text();
                    setMineruMarkdown(mdText);
                  }
                }
              }
              console.log(`[MinerU] 解析物已保存: ${downloadData.totalFiles ?? 0} 个文件，markdownContent: ${downloadData.markdownContent?.length ?? 0} chars`);
            } else {
              console.warn('[MinerU] 解析物保存失败，ZIP URL 仍可下载');
            }
          } catch (downloadErr) {
            console.warn('[MinerU] 解析物回存 MinIO 失败:', downloadErr);
            // 不阻断主流程，ZIP 下载链接依然可用
          }
        }
      }

      dispatch({
        type: 'UPDATE_MATERIAL_MINERU_STATUS',
        payload: { id: numId, mineruStatus: 'completed', mineruCompletedAt: Date.now() },
      });

      toast.success('MinerU 解析完成！');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误';
      dispatch({ type: 'UPDATE_MATERIAL_MINERU_STATUS', payload: { id: numId, mineruStatus: 'failed' } });
      toast.error(`MinerU 解析失败: ${msg}`);
    } finally {
      setMineruRunning(false);
    }
  };

  const handleAiAnalyze = async () => {
    if (!material) { toast.error('找不到资料信息'); return; }

    let markdownObjectName = material.metadata?.markdownObjectName as string | undefined;
    let markdownUrl = material.metadata?.markdownUrl as string | undefined;
    // mineruMarkdown 是本次会话从 parse/download 响应中内联获取的 full.md 文本
    const inlineMarkdownContent = mineruMarkdown || undefined;

    // 如果还没有 markdown，但有 MinerU zipUrl，先尝试 download
    if (!markdownObjectName && !markdownUrl && !inlineMarkdownContent && material.mineruZipUrl) {
      setAiAnalyzing(true);
      try {
        const downloadRes = await fetch('/__proxy/upload/parse/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zipUrl: material.mineruZipUrl, materialId: numId }),
        });
        if (downloadRes.ok) {
          const downloadData = await downloadRes.json();
          if (downloadData.markdownObjectName) markdownObjectName = downloadData.markdownObjectName;
          if (downloadData.markdownUrl) markdownUrl = downloadData.markdownUrl;
          if (downloadData.markdownContent) {
            setMineruMarkdown(downloadData.markdownContent);
          }
          if (downloadData.markdownObjectName || downloadData.markdownUrl) {
            dispatch({
              type: 'UPDATE_MATERIAL',
              payload: {
                id: numId,
                updates: {
                  metadata: {
                    ...material.metadata,
                    ...(downloadData.markdownObjectName ? { markdownObjectName: downloadData.markdownObjectName } : {}),
                    ...(downloadData.markdownUrl ? { markdownUrl: downloadData.markdownUrl } : {}),
                    parsedFilesCount: String(downloadData.totalFiles ?? '?'),
                  },
                },
              },
            });
          }
        }
      } catch (e) {
        console.warn('[AI] download before analyze failed:', e);
      }
    }

    // 最终兜底：用内联内容（组件内存，页面刷新后失效）
    const finalInlineContent = markdownObjectName || markdownUrl
      ? undefined
      : (inlineMarkdownContent || mineruMarkdown || undefined);

    if (!markdownObjectName && !markdownUrl && !finalInlineContent) {
      toast.error('请先完成 MinerU 解析，生成 full.md 后再运行 AI 分析');
      setAiAnalyzing(false);
      return;
    }

    const { apiEndpoint, apiKey, model } = state.aiConfig;
    console.log('[AI] config check — endpoint:', apiEndpoint, '| key:', apiKey ? apiKey.slice(0,8)+'...(len='+apiKey.length+')' : 'EMPTY', '| model:', model);
    if (!apiEndpoint?.trim() || !apiKey?.trim() || !model?.trim()) {
      toast.error('请先在「系统设置」中配置 AI API（接口地址 / Key / 模型名）');
      return;
    }

    if (!aiAnalyzing) setAiAnalyzing(true);
    dispatch({ type: 'UPDATE_MATERIAL_AI_STATUS', payload: { id: numId, aiStatus: 'analyzing' } });

    try {
      const resp = await fetch('/__proxy/upload/parse/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdownObjectName,
          markdownUrl,
          ...(finalInlineContent ? { markdownContent: finalInlineContent } : {}),
          materialId: numId,
          aiApiEndpoint: apiEndpoint.replace(/\/$/, ''),
          aiApiKey: apiKey,
          aiModel: model,
          prompts: state.aiConfig.prompts,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
        throw new Error(errData.error || `HTTP ${resp.status}`);
      }

      const data = await resp.json();

      // 将 AI 分析结果回写到 store
      dispatch({
        type: 'UPDATE_MATERIAL_AI_STATUS',
        payload: {
          id: numId,
          aiStatus: 'analyzed',
          status: 'completed',
          ...(data.title ? { title: data.title } : {}),
          tags: data.tags?.length ? data.tags : material.tags,
          metadata: {
            subject: data.subject || '',
            grade: data.grade || '',
            type: data.materialType || '',
            summary: data.summary || '',
            aiConfidence: String(data.confidence ?? ''),
            aiAnalyzedAt: data.analyzedAt || new Date().toISOString(),
          },
        },
      });

      toast.success(
        `AI 分析完成！置信度 ${data.confidence}%` +
        (data.subject ? `，学科：${data.subject}` : '') +
        (data.grade ? `，年级：${data.grade}` : ''),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      dispatch({ type: 'UPDATE_MATERIAL_AI_STATUS', payload: { id: numId, aiStatus: 'failed' } });
      toast.error(`AI 分析失败: ${msg}`);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSaveTags = () => {
    dispatch({ type: 'UPDATE_ASSET_TAGS', payload: { id: numId, tags: localTags } });
    setEditingTags(false);
    toast.success('标签已保存');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !localTags.includes(t)) {
      setLocalTags((prev) => [...prev, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setLocalTags((prev) => prev.filter((t) => t !== tag));

  return (
    <div className="p-6 space-y-5">
      {/* 返回 + 标题 */}
      <div>
        <button
          onClick={() => navigate('/source-materials')}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-3"
        >
          <ArrowLeft size={15} /> 返回资料库
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{detail.title}</h1>
            <p className="text-xs text-gray-400 mt-1">资产 ID：{detail.assetId}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={detail.status} />
            {/* 当资料状态为 pending 时，显示「开始处理」按钮 */}
            {detail.status === 'pending' && (
              <button
                onClick={handleStartProcessing}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100"
              >
                <Play size={12} />
                开始处理
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* 左主列 */}
        <div className="lg:col-span-2 space-y-5">
        {/* MinerU 解析面板 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Cpu size={16} className="text-orange-500" /> MinerU 解析
              </h2>
              <div className="flex items-center gap-3">
                {/* 状态指示 */}
                {material?.mineruStatus === 'completed' && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={13} /> 解析完成
                  </span>
                )}
                {material?.mineruStatus === 'failed' && (
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <XCircle size={13} /> 解析失败
                  </span>
                )}
                {material?.mineruStatus === 'processing' && (
                  <span className="flex items-center gap-1 text-xs text-blue-500">
                    <Loader size={13} className="animate-spin" /> 解析中
                  </span>
                )}
                <button
                  onClick={handleMineruParse}
                  disabled={mineruRunning}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {mineruRunning
                    ? <><Loader size={12} className="animate-spin" /> 解析中...</>
                    : <><Play size={12} /> {material?.mineruStatus === 'completed' ? '重新解析' : '开始解析'}</>
                  }
                </button>
              </div>
            </div>

            {/* 进度条 */}
            {mineruRunning && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1.5">
                    {mineruProgressMsg}
                    {mineruRetryCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        重试 {mineruRetryCount}/3
                      </span>
                    )}
                  </span>
                  <span>{mineruProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${mineruRetryCount > 0 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                    style={{ width: `${mineruProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 文件信息 */}
            <div className="text-xs text-gray-500 space-y-1">
              {(material?.metadata?.fileUrl || material?.metadata?.objectName) ? (
                <p>文件已上传：<span className="text-gray-700 font-medium">{material.title}.{material.type.toLowerCase()}</span>
                  {material?.metadata?.provider && (
                    <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                      {String(material.metadata.provider) === 'minio' ? 'MinIO' : 'tmpfiles'}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-yellow-600">⚠ 文件尚未上传，请先在资料库上传文件</p>
              )}
              {material?.metadata?.objectName && (
                <p className="text-gray-400 break-all font-mono">
                  存储路径：{material.metadata.objectName as string}
                </p>
              )}
              {material?.metadata?.markdownObjectName && (
                <p className="text-green-600">
                  ✓ 解析物已存入 MinIO（{material.metadata.parsedFilesCount || '?'} 个文件）
                </p>
              )}
              {material?.mineruZipUrl && (
                <a
                  href={material.mineruZipUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-1"
                >
                  <FileText size={12} /> 下载解析结果 ZIP
                </a>
              )}
            </div>

            {/* Markdown 预览 */}
            {mineruMarkdown && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">解析内容预览（Markdown）</p>
                <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 overflow-auto max-h-64 whitespace-pre-wrap">
                  {mineruMarkdown.slice(0, 3000)}{mineruMarkdown.length > 3000 ? '\n\n...(内容已截断)' : ''}
                </pre>
              </div>
            )}
          </div>

          {/* AI 元数据分析面板 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Cpu size={16} className="text-purple-500" /> AI 元数据分析
              </h2>
              <div className="flex items-center gap-3">
                {material?.aiStatus === 'analyzed' && (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle size={13} /> 已分析
                    {material.metadata?.aiConfidence && (
                      <span className="text-gray-400 ml-1">({material.metadata.aiConfidence}%)</span>
                    )}
                  </span>
                )}
                {material?.aiStatus === 'failed' && (
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <XCircle size={13} /> 分析失败
                  </span>
                )}
                {material?.aiStatus === 'analyzing' && (
                  <span className="flex items-center gap-1 text-xs text-purple-500">
                    <Loader size={13} className="animate-spin" /> 分析中
                  </span>
                )}
                <button
                  onClick={handleAiAnalyze}
                  disabled={aiAnalyzing || (!material?.metadata?.markdownObjectName && !material?.metadata?.markdownUrl && !material?.mineruZipUrl)}
                  title={(!material?.metadata?.markdownObjectName && !material?.metadata?.markdownUrl && !material?.mineruZipUrl) ? '请先完成 MinerU 解析' : ''}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {aiAnalyzing
                    ? <><Loader size={12} className="animate-spin" /> 分析中...</>
                    : <><Play size={12} /> {material?.aiStatus === 'analyzed' ? '重新分析' : '开始 AI 分析'}</>
                  }
                </button>
              </div>
            </div>

            {/* AI 分析结果展示 */}
            {material?.aiStatus === 'analyzed' && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {material.metadata?.subject && (
                  <div><dt className="text-gray-400">学科</dt><dd className="font-medium text-gray-700">{material.metadata.subject}</dd></div>
                )}
                {material.metadata?.grade && (
                  <div><dt className="text-gray-400">年级</dt><dd className="font-medium text-gray-700">{material.metadata.grade}</dd></div>
                )}
                {material.metadata?.type && (
                  <div><dt className="text-gray-400">资料类型</dt><dd className="font-medium text-gray-700">{material.metadata.type}</dd></div>
                )}
                {material.metadata?.aiConfidence && (
                  <div><dt className="text-gray-400">置信度</dt><dd className="font-medium text-gray-700">{material.metadata.aiConfidence}%</dd></div>
                )}
                {material.metadata?.summary && (
                  <div className="col-span-2 mt-1">
                    <dt className="text-gray-400 mb-0.5">内容摘要</dt>
                    <dd className="text-gray-600 leading-relaxed">{material.metadata.summary}</dd>
                  </div>
                )}
              </dl>
            )}
            {!material?.metadata?.markdownObjectName && !material?.metadata?.markdownUrl && !material?.mineruZipUrl && (
              <p className="text-xs text-yellow-600">⚠ 请先完成 MinerU 解析，AI 分析将基于解析出的 Markdown 内容</p>
            )}
          </div>

        </div>

        {/* 右侧列 */}
        <div className="space-y-5">
          {/* 元数据 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">元数据</h2>
            <dl className="space-y-2">
              {Object.entries(detail.metadata).filter(([, v]) => v != null && v !== '').map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <dt className="text-gray-500 capitalize">{k}</dt>
                  <dd className="text-gray-800 font-medium text-right max-w-32 truncate">{String(v)}</dd>
                </div>
              ))}
              {Object.entries(detail.metadata).filter(([, v]) => v == null || v === '').length === Object.entries(detail.metadata).length && (
                <div className="text-center py-2 text-gray-400 text-sm">暂无元数据</div>
              )}
            </dl>
          </div>

          {/* 标签 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Tag size={15} className="text-green-500" /> 标签
              </h2>
              {!editingTags ? (
                <button onClick={() => { setEditingTags(true); setLocalTags(detail.tags); }} className="text-xs text-blue-600">
                  编辑
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditingTags(false)} className="text-xs text-gray-400">取消</button>
                  <button onClick={handleSaveTags} className="text-xs text-blue-600 font-medium">保存</button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(editingTags ? localTags : detail.tags).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  {tag}
                  {editingTags && (
                    <button onClick={() => removeTag(tag)} className="text-blue-400 hover:text-red-500">×</button>
                  )}
                </span>
              ))}
            </div>
            {editingTags && (
              <div className="flex gap-2 mt-3">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="输入新标签..."
                  className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
                />
                <button onClick={addTag} className="text-xs px-2 py-1.5 bg-blue-600 text-white rounded">
                  添加
                </button>
              </div>
            )}
          </div>

          {/* 相关资产 */}
          {detail.relatedAssets.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-800 mb-3">相关资产</h2>
              <div className="space-y-2">
                {detail.relatedAssets.map((ra) => (
                  <div
                    key={ra.id}
                    onClick={() => navigate(`/asset/${ra.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{ra.title}</p>
                      <p className="text-xs text-gray-400">{ra.type}</p>
                    </div>
                    <StatusBadge status={ra.status} className="ml-2 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
