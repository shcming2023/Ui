import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appContext';
import { StatusBadge } from '../components/StatusBadge';
import { PDFPreviewPanel } from '../components/PDFPreviewPanel';
import { PreviewTabPanel } from '../components/PreviewTabPanel';
import { ProcessPipelineCard } from '../components/ProcessPipelineCard';

// ── 工具函数 ──────────────────────────────────────────────
const getMaterialTags = (m: any) =>
  Array.isArray(m.tags) ? m.tags : Array.isArray(m.metadata?.tags) ? m.metadata.tags : [];

function inferTypeFromMimeOrName(mime: string, name: string) {
  if (mime?.includes('pdf') || name?.toLowerCase().endsWith('.pdf')) return 'PDF';
  if (mime?.includes('word') || name?.toLowerCase().endsWith('.docx')) return 'DOCX';
  if (mime?.includes('markdown') || name?.toLowerCase().endsWith('.md')) return 'MD';
  return 'UNKNOWN';
}

const getMaterialType = (m: any) =>
  m?.type || inferTypeFromMimeOrName(m?.metadata?.mimeType || m?.mimeType, m?.fileName || m?.title) || 'UNKNOWN';

function getPresignedExpireAtMs(url: string): number | null {
  try {
    const u = new URL(url);
    const dateStr = u.searchParams.get('X-Amz-Date');
    const expStr = u.searchParams.get('X-Amz-Expires');
    if (!dateStr || !expStr) return null;
    const y = Number(dateStr.slice(0, 4));
    const mo = Number(dateStr.slice(4, 6));
    const d = Number(dateStr.slice(6, 8));
    const h = Number(dateStr.slice(9, 11));
    const mi = Number(dateStr.slice(11, 13));
    const s = Number(dateStr.slice(13, 15));
    const issuedAt = Date.UTC(y, mo - 1, d, h, mi, s);
    const expiresSec = Number(expStr);
    if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresSec)) return null;
    return issuedAt + expiresSec * 1000;
  } catch {
    return null;
  }
}

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const detail = state.assetDetails[numId];
  const material = state.materials.find((m) => m.id === numId);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(detail?.title ?? '');

  const [mineruMarkdown, setMineruMarkdown] = useState<string>('');
  const mineruRunning = material?.mineruStatus === 'processing';
  const mineruProgress = Number(material?.metadata?.processingProgress || 0);
  const mineruProgressMsg = material?.metadata?.processingMsg || (mineruRunning ? '处理中...' : '');
  const mineruRetryCount = 0;

  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const originalRefreshTimerRef = useRef<number | null>(null);

  const objectName = material?.metadata?.objectName;

  useEffect(() => {
    const obj = String(objectName || '').trim();
    if (!obj) return;
    const request = async () => {
      try {
        const r = await fetch(`/__proxy/upload/presign?objectName=${encodeURIComponent(obj)}`, { cache: 'no-store' });
        const d = await r.json();
        if (d?.url) {
          setOriginalUrl(d.url);
          const expireAt = getPresignedExpireAtMs(d.url);
          if (expireAt) {
            const delay = Math.max(30_000, expireAt - Date.now() - 60_000);
            if (originalRefreshTimerRef.current) window.clearTimeout(originalRefreshTimerRef.current);
            originalRefreshTimerRef.current = window.setTimeout(() => {
              void request();
            }, delay);
          }
        }
      } catch {}
    };
    void request();
    return () => {
      if (originalRefreshTimerRef.current) window.clearTimeout(originalRefreshTimerRef.current);
      originalRefreshTimerRef.current = null;
    };
  }, [objectName]);

  const [mdBootLoading, setMdBootLoading] = useState(false);
  const [mdBootError, setMdBootError] = useState('');

  useEffect(() => {
    const mdObj = material?.metadata?.markdownObjectName;
    const mdUrl = material?.metadata?.markdownUrl;
    if (!material?.id || (!mdObj && !mdUrl)) return;

    setMdBootLoading(true);
    setMdBootError('');

    (async () => {
      try {
        let url = mdUrl;
        if (!url && mdObj) {
          const r = await fetch(`/__proxy/upload/presign?objectName=${encodeURIComponent(mdObj)}`, { cache: 'no-store' });
          const d = await r.json();
          url = d?.url;
        }
        if (!url) throw new Error('无法获取 Markdown 访问地址');
        let res = await fetch(url, { cache: 'no-store' });
        if (res.status === 403 && mdObj) {
          const r = await fetch(`/__proxy/upload/presign?objectName=${encodeURIComponent(mdObj)}`, { cache: 'no-store' });
          const d = await r.json();
          const retryUrl = d?.url;
          if (retryUrl) res = await fetch(retryUrl, { cache: 'no-store' });
        }
        if (!res.ok) throw new Error(`读取失败: HTTP ${res.status}`);
        setMineruMarkdown(await res.text());
      } catch (e) {
        setMdBootError(e instanceof Error ? e.message : String(e));
      } finally {
        setMdBootLoading(false);
      }
    })();
  }, [material?.id, material?.metadata?.markdownObjectName, material?.metadata?.markdownUrl]);

  // 元数据可编辑表单（语言/年级/学科/国家/类型 + 摘要）
  const [metaForm, setMetaForm] = useState({
    language:    material?.metadata?.language || '',
    grade:       material?.metadata?.grade || '',
    subject:     material?.metadata?.subject || '',
    country:     material?.metadata?.country || '',
    type:        material?.metadata?.type || '',
    summary:     material?.metadata?.summary || '',
  });

  useEffect(() => {
    if (!material) return;
    setMetaForm({
      language: material.metadata?.language || '',
      grade: material.metadata?.grade || '',
      subject: material.metadata?.subject || '',
      country: material.metadata?.country || '',
      type: material.metadata?.type || '',
      summary: material.metadata?.summary || '',
    });
  }, [
    material?.id,
    material?.metadata?.language,
    material?.metadata?.grade,
    material?.metadata?.subject,
    material?.metadata?.country,
    material?.metadata?.type,
    material?.metadata?.summary,
  ]);

  useEffect(() => {
    setTitleDraft(detail?.title ?? '');
  }, [detail?.title]);

  const updateMeta = (key: keyof typeof metaForm, val: string) =>
    setMetaForm((prev) => ({ ...prev, [key]: val }));

  const isDirty = !!material && (
    metaForm.language !== (material.metadata?.language || '')
    || metaForm.grade !== (material.metadata?.grade || '')
    || metaForm.subject !== (material.metadata?.subject || '')
    || metaForm.country !== (material.metadata?.country || '')
    || metaForm.type !== (material.metadata?.type || '')
    || metaForm.summary !== (material.metadata?.summary || '')
  );

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleBackToList = () => {
    if (isDirty && !window.confirm('当前元数据尚未保存，确定离开此页面吗？')) {
      return;
    }
    navigate('/workspace');
  };

  const handleSaveTitle = () => {
    const nextTitle = titleDraft.trim();
    if (!material) return;
    if (!nextTitle) {
      setTitleDraft(detail?.title ?? '');
      setEditingTitle(false);
      toast.error('标题不能为空');
      return;
    }
    if (nextTitle === detail?.title) {
      setEditingTitle(false);
      return;
    }
    dispatch({
      type: 'UPDATE_MATERIAL',
      payload: {
        id: numId,
        updates: { title: nextTitle },
      },
    });
    setEditingTitle(false);
    toast.success('标题已更新');
  };

  const handleDownloadParsedZip = async () => {
    if (!material?.id) return;
    try {
      toast.info('正在打包解析产物...');
      const r = await fetch('/__proxy/upload/parsed-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: numId }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
        throw new Error(err.error || `HTTP ${r.status}`);
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parsed-${material.title || numId}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('解析产物 ZIP 已下载');
    } catch (err) {
      toast.error(`下载失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (!detail) {
    return (
      <div className="p-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={16} /> 返回工作台
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          资产 #{id} 不存在或已被删除
        </div>
      </div>
    );
  }

  const handleMineruParse = async () => {
    if (!material) { toast.error('找不到资料信息'); return; }

    let objectName = String(material.metadata?.objectName || '').trim();
    const fileUrl = String(material.metadata?.fileUrl || '').trim();
    if (!objectName && !fileUrl) {
      toast.error('文件尚未上传或缺少访问地址');
      return;
    }

    try {
      // 如果没有 objectName 但有 fileUrl，先上传到 MinIO
      if (!objectName && fileUrl) {
        const blob = await fetch(fileUrl).then((r) => {
          if (!r.ok) throw new Error(`下载文件失败: HTTP ${r.status}`);
          return r.blob();
        });
        const name = material.metadata?.fileName || `${material.title}.${material.type.toLowerCase()}`;
        const file = new File([blob], name, { type: blob.type || 'application/octet-stream' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('materialId', String(numId));
        const uploadRes = await fetch('/__proxy/upload/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error(`上传失败: HTTP ${uploadRes.status}`);
        const uploadResult = await uploadRes.json();
        objectName = String(uploadResult?.objectName || '').trim();
        if (!objectName) throw new Error('上传成功但未获得 objectName');

        dispatch({
          type: 'UPDATE_MATERIAL',
          payload: {
            id: numId,
            updates: {
              metadata: {
                ...material.metadata,
                objectName,
                fileUrl: uploadResult.url,
                fileName: uploadResult.fileName,
                provider: uploadResult.provider,
                mimeType: uploadResult.mimeType,
              },
            },
          },
        });
      }

      // 使用 PRD 主链路：下载文件后通过 POST /tasks 创建 ParseTask
      // ParseTaskWorker 会自动拾取并通过 local-mineru adapter 调用 FastAPI
      const presignRes = await fetch(`/__proxy/upload/presign?objectName=${encodeURIComponent(objectName)}`, { cache: 'no-store' });
      const presignData = await presignRes.json();
      if (!presignData?.url) throw new Error('无法获取文件预签名URL');

      const fileBlob = await fetch(presignData.url).then(r => {
        if (!r.ok) throw new Error(`下载文件失败: HTTP ${r.status}`);
        return r.blob();
      });
      const fileName = material.metadata?.fileName || material.title || 'document.pdf';
      const file = new File([fileBlob], fileName, { type: material.metadata?.mimeType || 'application/pdf' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('materialId', String(numId));

      const res = await fetch('/__proxy/upload/tasks', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error((errData as { error?: string }).error || `HTTP ${res.status}`);
      }

      dispatch({
        type: 'UPDATE_MATERIAL',
        payload: {
          id: numId,
          updates: {
            status: 'processing',
            mineruStatus: 'pending',
            aiStatus: 'pending',
            metadata: {
              ...material.metadata,
              processingStage: 'mineru',
              processingMsg: '解析任务已提交（PRD 主链路）',
              processingProgress: '0',
              processingUpdatedAt: new Date().toISOString(),
            },
          },
        },
      });

      toast.info('解析任务已提交，Worker 将自动处理');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误';
      dispatch({ type: 'UPDATE_MATERIAL_MINERU_STATUS', payload: { id: numId, mineruStatus: 'failed' } });
      toast.error(`MinerU 解析失败: ${msg}`);
    }
  };

  const handleAiAnalyze = async () => {
    if (!material) { toast.error('找不到资料信息'); return; }

    setAiAnalyzing(true);
    dispatch({ type: 'UPDATE_MATERIAL_AI_STATUS', payload: { id: numId, aiStatus: 'analyzing' } });

    try {
      // 1. 查找该资料关联的最新 ParseTask
      const tasksResp = await fetch('/__proxy/db/tasks');
      if (!tasksResp.ok) throw new Error(`无法获取任务列表: HTTP ${tasksResp.status}`);
      const allTasks: Array<{ id: string; materialId?: unknown; state?: string; metadata?: Record<string, unknown> }>
        = await tasksResp.json();

      // 按 createdAt 降序取最新任务
      const relatedTasks = allTasks
        .filter((t) => String(t.materialId) === String(numId))
        .sort((a, b) => 0); // 接口已按 createdAt DESC 排序

      // 优先取 completed/review-pending 状态的任务（有 markdown 产物），次选 failed
      const candidate =
        relatedTasks.find((t) => t.state === 'completed' || t.state === 'review-pending') ||
        relatedTasks.find((t) => t.state === 'failed') ||
        relatedTasks[0];

      if (!candidate) {
        throw new Error('该资料尚未创建解析任务，请先通过"开始解析"按钮创建任务后再运行 AI 识别');
      }

      // 2. 检查是否有 Markdown 产物
      const hasMarkdown =
        !!(candidate.metadata?.markdownObjectName) ||
        !!(material.metadata?.markdownObjectName) ||
        !!(material.metadata?.markdownUrl);

      if (!hasMarkdown) {
        throw new Error('Markdown 产物尚未生成，请先完成解析阶段（Reparse），再重跑 AI 识别');
      }

      // 3. 调用 re-ai 动作接口
      const reAiResp = await fetch(`/__proxy/upload/tasks/${encodeURIComponent(candidate.id)}/re-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const reAiData = await reAiResp.json().catch(() => ({} as Record<string, unknown>));
      if (!reAiResp.ok) {
        throw new Error(String(reAiData?.error || `HTTP ${reAiResp.status}`));
      }

      toast.info('AI 识别任务已触发，正在等待结果…');

      // 4. SSE 监听：等待任务进入终态（completed / review-pending / failed）
      await new Promise<void>((resolve, reject) => {
        const TIMEOUT_MS = 300_000; // 5 分钟超时
        let done = false;

        const es = new EventSource(`/__proxy/upload/tasks/stream?taskId=${encodeURIComponent(candidate.id)}`);
        const timer = window.setTimeout(() => {
          if (!done) {
            done = true;
            es.close();
            reject(new Error('AI 识别超时（5 分钟），请稍后在任务管理页查看结果'));
          }
        }, TIMEOUT_MS);

        es.addEventListener('task-update', async (evt: MessageEvent) => {
          if (done) return;
          try {
            const data = JSON.parse(evt.data) as { update?: { state?: string } };
            const newState = data?.update?.state;
            if (newState === 'completed' || newState === 'review-pending') {
              done = true;
              clearTimeout(timer);
              es.close();

              // 从 db 重新拉取最新的 Material 元数据并刷新 store
              try {
                const matResp = await fetch(`/__proxy/db/materials/${encodeURIComponent(String(numId))}`);
                if (matResp.ok) {
                  const latestMat = await matResp.json();
                  dispatch({
                    type: 'UPDATE_MATERIAL_AI_STATUS',
                    payload: {
                      id: numId,
                      aiStatus: 'analyzed',
                      status: 'completed',
                      tags: latestMat.tags?.length ? latestMat.tags : material.tags,
                      metadata: {
                        subject:      latestMat.metadata?.subject || '',
                        grade:        latestMat.metadata?.grade || '',
                        type:         latestMat.metadata?.type || '',
                        language:     latestMat.metadata?.language || '',
                        country:      latestMat.metadata?.country || '',
                        summary:      latestMat.metadata?.summary || '',
                        aiConfidence: String(latestMat.metadata?.aiConfidence ?? ''),
                        aiAnalyzedAt: latestMat.metadata?.aiAnalyzedAt || new Date().toISOString(),
                      },
                    },
                  });
                  // 同步表单
                  setMetaForm({
                    language: latestMat.metadata?.language || '',
                    grade:    latestMat.metadata?.grade || '',
                    subject:  latestMat.metadata?.subject || '',
                    country:  latestMat.metadata?.country || '',
                    type:     latestMat.metadata?.type || '',
                    summary:  latestMat.metadata?.summary || '',
                  });
                }
              } catch { /* 刷新失败不阻塞 */ }

              toast.success('AI 识别完成！元数据已更新');
              resolve();
            } else if (newState === 'failed') {
              done = true;
              clearTimeout(timer);
              es.close();
              reject(new Error('AI 识别任务失败，请检查任务管理页中的错误信息'));
            }
          } catch { /* JSON 解析失败忽略 */ }
        });

        es.onerror = () => {
          // 网络抖动时浏览器会自动重连，此处不强制失败
        };
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      dispatch({ type: 'UPDATE_MATERIAL_AI_STATUS', payload: { id: numId, aiStatus: 'failed' } });
      toast.error(`AI 分析失败: ${msg}`);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSaveMeta = () => {
    if (!material) return;
    dispatch({
      type: 'UPDATE_MATERIAL',
      payload: {
        id: numId,
        updates: {
          metadata: {
            ...material.metadata,
            ...metaForm,
          },
        },
      },
    });
    toast.success('元数据已保存');
  };

  const handleRefreshOriginalUrl = async (opts: { silent?: boolean } = {}) => {
    const silent = opts.silent ?? true;
    const objectName = material?.metadata?.objectName;
    if (!objectName) return;
    try {
      const r = await fetch(`/__proxy/upload/presign?objectName=${encodeURIComponent(objectName)}`);
      const d = await r.json();
      if (d?.url) {
        setOriginalUrl(d.url);
        if (!silent) toast.success('访问链接已刷新');
      }
    } catch {
      if (!silent) toast.error('刷新失败，请检查 MinIO 连接');
    }
  };

  const previewMdContent = mineruMarkdown;

  return (
    <div className="h-full p-6 flex flex-col gap-5 overflow-hidden">
      <div className="flex-shrink-0">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mb-3"
        >
          <ArrowLeft size={15} /> 返回工作台
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            {editingTitle ? (
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setTitleDraft(detail.title);
                    setEditingTitle(false);
                  }
                }}
                autoFocus
                className="w-full max-w-xl text-xl font-bold text-gray-900 border border-blue-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{detail.title}</h1>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="编辑标题"
                >
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">资产 ID：{detail.assetId}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={detail.status} />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 gap-5 lg:grid-cols-5 overflow-hidden">
        <div className="lg:col-span-2 space-y-5 min-h-0 overflow-y-auto pr-1">
          {objectName && getMaterialType(material).toUpperCase() === 'PDF' && (
            <PDFPreviewPanel objectName={objectName} />
          )}
          <ProcessPipelineCard
            material={material}
            originalUrl={originalUrl}
            onRefreshOriginalUrl={handleRefreshOriginalUrl}
            mineruEngineLabel={'本地 FastAPI'}
            mineruRunning={mineruRunning}
            mineruProgress={mineruProgress}
            mineruProgressMsg={mineruProgressMsg}
            mineruRetryCount={mineruRetryCount}
            onMineruParse={handleMineruParse}
            onDownloadParsedZip={handleDownloadParsedZip}
            aiAnalyzing={aiAnalyzing}
            onAiAnalyze={handleAiAnalyze}
            aiDisabledReason={(!material?.metadata?.markdownObjectName && !material?.metadata?.markdownUrl && !material?.mineruZipUrl && !mineruMarkdown) ? '请先完成 MinerU 解析' : ''}
          />
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
        <div className="lg:col-span-3 min-h-0 overflow-hidden">
          <PreviewTabPanel
            materialId={numId}
            material={material}
            markdownContent={previewMdContent}
            mdLoading={mdBootLoading}
            mdError={mdBootError}
            metaForm={metaForm}
            updateMeta={updateMeta}
            isDirty={isDirty}
            onSaveMeta={handleSaveMeta}
          />
        </div>
      </div>
    </div>
  );
}
