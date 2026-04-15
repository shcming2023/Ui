import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FileText,
  Cpu,
  HardDrive,
  Clock,
  Sparkles,
  CheckCircle,
  Upload,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../store/appContext';
import { StatusBadge } from '../components/StatusBadge';

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export function Dashboard() {
  const { state } = useAppStore();
  const navigate = useNavigate();

  const { materials, processTasks } = state;

  // 统计数据
  const totalMaterials = materials.length;
  const processingCount = materials.filter((m) => m.status === 'processing').length;
  const completedMaterials = materials.filter((m) => m.status === 'completed').length;
  const pendingCount = materials.filter((m) => m.status === 'pending').length;
  const totalSizeBytes = materials.reduce((sum, m) => sum + (m.sizeBytes || 0), 0);

  // 最近5条资料
  const recentMaterials = [...materials]
    .sort((a, b) => b.uploadTimestamp - a.uploadTimestamp)
    .slice(0, 5);

  // 进行中任务
  const inProgressTasks = processTasks
    .filter((t) => t.status === 'processing' || t.status === 'reviewing')
    .slice(0, 4);

  const reviewingCount = processTasks.filter((t) => t.status === 'reviewing').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            教育资料处理平台
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">工作台</h1>
          <p className="text-slate-500 text-sm">文档处理流程概览</p>
        </div>

        {/* Stats Grid — 4 列 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* 原始资料 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                原始资料
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{totalMaterials}</p>
            <p className="text-sm text-green-600 font-medium">
              {completedMaterials} 已完成
            </p>
          </div>

          {/* MinerU 解析中 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                处理中
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{processingCount}</p>
            <p className="text-sm text-purple-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              待处理 {pendingCount}
            </p>
          </div>

          {/* 存储占用 — 蓝色渐变 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">
                存储占用
              </p>
            </div>
            <p className="text-3xl font-bold mb-3">{formatBytes(totalSizeBytes)}</p>
            <div className="w-full h-1.5 bg-blue-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${Math.min(100, totalSizeBytes / (100 * 1024 * 1024 * 1024) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-blue-200">原始资料总存储</p>
          </div>

          {/* 解析完成 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                已完成
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{completedMaterials}</p>
            <p className="text-sm text-slate-500">
              JSON / MD / Images
            </p>
          </div>
        </div>

        {/* Main Content Grid — 3 列 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 最近处理 — 左侧 2 列宽 */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                最近上传资料
              </h2>
              <Link
                to="/source-materials"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                查看全部 →
              </Link>
            </div>
            <div className="p-4 space-y-1">
              {recentMaterials.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">暂无资料</p>
              )}
              {recentMaterials.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                  onClick={() => navigate(`/asset/${m.id}`)}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      m.type === 'PDF'
                        ? 'bg-red-100'
                        : m.type === 'DOCX' || m.type === 'DOC'
                          ? 'bg-blue-100'
                          : 'bg-orange-100'
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 ${
                        m.type === 'PDF'
                          ? 'text-red-600'
                          : m.type === 'DOCX' || m.type === 'DOC'
                            ? 'text-blue-600'
                            : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {m.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-medium">
                        {m.type}
                      </span>
                      <span>{m.size}</span>
                      <span>{m.uploadTime}</span>
                    </div>
                  </div>
                  <StatusBadge status={m.status} className="flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* 右侧列 */}
          <div className="space-y-6">
            {/* 处理队列 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                处理队列
              </h2>
              <div className="space-y-2.5">
                <div
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  onClick={() => navigate('/source-materials')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-sm font-medium text-slate-700">MinerU 解析队列</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{processingCount}</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  onClick={() => navigate('/source-materials')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm font-medium text-slate-700">待审核</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900">{reviewingCount}</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 快速上传 — 蓝色渐变 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-10 rounded-full -mr-14 -mt-14" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full -ml-10 -mb-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs font-semibold">快速上传</span>
                </div>
                <h3 className="text-lg font-bold mb-2">上传资料自动处理</h3>
                <p className="text-sm text-blue-100 mb-4 leading-relaxed">
                  支持 PDF、DOC、PPT、图片等格式，自动通过 MinerU 解析并存储
                </p>
                <button
                  onClick={() => navigate('/source-materials')}
                  className="block w-full px-5 py-2.5 bg-white text-blue-600 text-center text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  上传资料
                </button>
              </div>
            </div>

            {/* 系统状态 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">系统状态</h2>
              <div className="space-y-3">
                {[
                  { name: 'MinerU 服务', status: '正常' },
                  { name: 'MinIO 存储', status: '正常' },
                  { name: '处理队列', status: '运行中' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
