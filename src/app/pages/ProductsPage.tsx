import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Star,
  TrendingUp,
  Trash2,
  GitBranch,
  Search,
  FileText,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Material, Product } from '../../store/types';
import { useAppStore } from '../../store/appContext';
import { StatusBadge } from '../components/StatusBadge';
import { sortProducts } from '../../utils/sort';
import { fetchMinerUMarkdown } from '../../utils/mineruApi';

type SortKey = '最新发布' | '使用最多' | '评分最高';
const SORT_OPTIONS: SortKey[] = ['最新发布', '使用最多', '评分最高'];

const PRODUCT_COLORS: Record<string, string> = {
  blue:   'border-blue-200 bg-blue-50/60',
  green:  'border-green-200 bg-green-50/60',
  purple: 'border-purple-200 bg-purple-50/60',
  orange: 'border-orange-200 bg-orange-50/60',
  yellow: 'border-yellow-200 bg-yellow-50/60',
  indigo: 'border-indigo-200 bg-indigo-50/60',
};

const ICON_COLORS: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-600',
  green:  'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  yellow: 'bg-yellow-100 text-yellow-700',
  indigo: 'bg-indigo-100 text-indigo-600',
};

const THUMB_GRADIENTS: Record<string, string> = {
  blue:   'from-blue-100 to-blue-200',
  green:  'from-green-100 to-green-200',
  purple: 'from-purple-100 to-purple-200',
  orange: 'from-orange-100 to-orange-200',
  yellow: 'from-yellow-100 to-yellow-200',
  indigo: 'from-indigo-100 to-indigo-200',
};

export function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAppStore();
  const [sortKey, setSortKey] = useState<SortKey>('最新发布');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeProductId, setActiveProductId] = useState<number | null>(null);
  const [mdLoading, setMdLoading] = useState(false);
  const [mdPreview, setMdPreview] = useState<string | null>(null);
  const [mdError, setMdError] = useState('');

  const activeProduct = useMemo(() => {
    if (activeProductId === null) return null;
    return state.products.find((p) => p.id === activeProductId) ?? null;
  }, [activeProductId, state.products]);

  const sourceMaterial = useMemo<Material | null>(() => {
    if (!activeProduct?.source) return null;
    const m = String(activeProduct.source).match(/^material:(\d+)$/);
    if (!m) return null;
    const id = Number(m[1]);
    if (!Number.isFinite(id)) return null;
    return state.materials.find((x) => x.id === id) ?? null;
  }, [activeProduct?.source, state.materials]);

  const openProduct = (product: Product) => {
    setActiveProductId(product.id);
    setMdPreview(null);
    setMdError('');
  };

  const closeProduct = () => {
    setActiveProductId(null);
    setMdPreview(null);
    setMdError('');
  };

  const handleToggleMarkdown = async () => {
    if (mdLoading) return;
    if (mdPreview !== null) { setMdPreview(null); setMdError(''); return; }
    if (!sourceMaterial) { setMdError('找不到来源资料，无法加载内容'); return; }
    const { markdownObjectName, markdownUrl } = sourceMaterial.metadata || {};
    setMdLoading(true);
    setMdError('');
    try {
      let text = '';
      if (markdownObjectName) {
        const bucket = String(state.minioConfig.parsedBucket || state.minioConfig.bucket || '');
        const url = `/__proxy/upload/proxy-file?objectName=${encodeURIComponent(markdownObjectName)}${bucket ? `&bucket=${encodeURIComponent(bucket)}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`读取失败: HTTP ${res.status}`);
        text = await res.text();
      } else {
        text = await fetchMinerUMarkdown(markdownUrl, sourceMaterial.mineruZipUrl);
      }
      if (!text.trim()) { setMdError('暂无可用的 Markdown 内容'); return; }
      setMdPreview(text.length > 20000 ? `${text.slice(0, 20000)}\n\n...(内容已截断)` : text);
    } catch (error) {
      setMdError(error instanceof Error ? error.message : String(error));
    } finally {
      setMdLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!mdPreview) return;
    const blob = new Blob([mdPreview], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(activeProduct?.title || 'product').replace(/[\\/:*?"<>|]+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const materialIdFilter = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const raw = sp.get('materialId');
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }, [location.search]);

  const filterMaterial = useMemo<Material | null>(() => {
    if (materialIdFilter === null) return null;
    return state.materials.find((m) => m.id === materialIdFilter) ?? null;
  }, [materialIdFilter, state.materials]);

  const baseList = useMemo(() => {
    if (materialIdFilter === null) return state.products;
    const source = `material:${materialIdFilter}`;
    return state.products.filter(
      (p) => p.source === source || (p.lineage || []).some((id) => Number(id) === materialIdFilter),
    );
  }, [materialIdFilter, state.products]);

  const filtered = useMemo(() => {
    let list = baseList;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return sortProducts(list, sortKey);
  }, [baseList, search, sortKey]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    dispatch({ type: 'DELETE_PRODUCT', payload: Array.from(selectedIds) });
    setSelectedIds(new Set());
    toast.success(`已删除 ${selectedIds.size} 件成品`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* ── 页面头部 ─────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">成品库</h1>
            <p className="text-slate-500 text-sm">
              共 {baseList.length} 件成品{materialIdFilter !== null ? ` · 全部 ${state.products.length}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-medium transition-colors"
              >
                <Trash2 size={14} /> 删除选中 ({selectedIds.size})
              </button>
            )}
          </div>
        </div>

        {/* 来源筛选提示 */}
        {materialIdFilter !== null && (
          <div className="flex items-center gap-2 flex-wrap text-sm text-slate-600 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
            <span className="text-slate-700">
              当前筛选：来源资料 {filterMaterial ? `"${filterMaterial.title}"` : `ID=${materialIdFilter}`}
            </span>
            {filterMaterial && (
              <button
                onClick={() => navigate(`/asset/${filterMaterial.id}`)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 font-medium"
              >
                打开资料
              </button>
            )}
            <button
              onClick={() => navigate('/products')}
              className="text-xs px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium"
            >
              清除筛选
            </button>
          </div>
        )}

        {/* ── 搜索 + 排序工具栏 ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索成品名称、标签、描述..."
                className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm bg-slate-50"
              />
            </div>
            <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setSortKey(o)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    sortKey === o
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
          {search && (
            <p className="text-sm text-slate-500 mt-3">
              找到 <span className="font-semibold text-slate-800">{filtered.length}</span> 件成品
            </p>
          )}
        </div>

        {/* ── 卡片网格 ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">暂无成品</div>
          )}
          {filtered.map((product) => {
            const colorClass = PRODUCT_COLORS[product.color] ?? 'border-slate-200 bg-slate-50/60';
            const iconClass = ICON_COLORS[product.color] ?? 'bg-slate-100 text-slate-600';
            const thumbGrad = THUMB_GRADIENTS[product.color] ?? 'from-slate-100 to-slate-200';
            const isSelected = selectedIds.has(product.id);
            return (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => openProduct(product)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openProduct(product); }}
                className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg cursor-pointer group ${
                  isSelected ? 'ring-2 ring-blue-400 border-blue-200' : 'border-slate-200'
                }`}
              >
                {/* 缩略图区域 */}
                <div className={`relative aspect-[16/9] bg-gradient-to-br ${thumbGrad} flex items-center justify-center`}>
                  <FileText className="w-12 h-12 text-slate-300" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white ${
                      product.color === 'blue' ? 'bg-blue-600' :
                      product.color === 'green' ? 'bg-green-600' :
                      product.color === 'purple' ? 'bg-purple-600' :
                      product.color === 'orange' ? 'bg-orange-600' :
                      product.color === 'indigo' ? 'bg-indigo-600' : 'bg-slate-600'
                    }`}>
                      {product.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded"
                    />
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <StatusBadge status={product.status} />
                  </div>
                </div>

                {/* 内容区 */}
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>

                  {/* 统计行 */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500" />
                      {product.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={12} />
                      {product.useCount} 次
                    </span>
                    <span>{product.items}</span>
                  </div>

                  {/* 标签 */}
                  {product.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{product.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* 血缘 + 日期 */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {product.lineage.length > 0 ? (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[60%]">
                        <GitBranch size={10} />
                        {product.lineage.join(' → ')}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] text-slate-400">{product.createdAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 详情弹窗 ─────────────────────────────────── */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeProduct}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-slate-400 mb-1">{activeProduct.type}</p>
                <h2 className="text-lg font-semibold text-slate-900 truncate">{activeProduct.title}</h2>
              </div>
              <button
                onClick={closeProduct}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">{activeProduct.description}</p>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <StatusBadge status={activeProduct.status} />
                <span className="text-xs text-slate-400">创建：{activeProduct.createdAt}</span>
                {sourceMaterial && (
                  <button
                    onClick={() => navigate(`/asset/${sourceMaterial.id}`)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium"
                  >
                    打开来源资料
                  </button>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={handleToggleMarkdown}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  disabled={mdLoading}
                >
                  <Eye size={14} />
                  {mdLoading ? '读取中...' : mdPreview !== null ? '收起内容' : '预览内容'}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  disabled={!mdPreview}
                >
                  <Download size={14} />
                  下载 .md
                </button>
              </div>

              {!!activeProduct.source && (
                <p className="text-xs text-slate-400 mb-3 break-all">
                  <span className="text-slate-500">来源：</span>
                  {activeProduct.source}
                </p>
              )}

              {mdError && <p className="text-sm text-red-600 mb-3">{mdError}</p>}

              {mdPreview !== null && (
                <pre className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-[12px] text-slate-700 overflow-auto max-h-[50vh] whitespace-pre-wrap leading-relaxed">
                  {mdPreview}
                </pre>
              )}

              {mdPreview === null && !mdError && (
                <p className="text-sm text-slate-400">
                  {sourceMaterial?.metadata?.markdownObjectName || sourceMaterial?.metadata?.markdownUrl || sourceMaterial?.mineruZipUrl
                    ? '点击"预览内容"加载 Markdown'
                    : '当前成品未关联可预览内容（请先完成 MinerU 解析）'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
