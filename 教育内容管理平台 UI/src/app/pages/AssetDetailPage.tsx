import { ArrowLeft, FileText, Download, Edit, Trash2, GitBranch, Clock, User, Tag, Eye, Share2, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';

export function AssetDetailPage() {
  const { id } = useParams();

  return (
    <div className="h-full overflow-y-auto">
      {/* 顶部面包屑 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/source-materials" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/source-materials" className="hover:text-slate-900">原始资料库</Link>
            <span>/</span>
            <span className="text-slate-900">资产详情</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* 基础信息卡片 */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold text-slate-900">2024年高考数学真题（全国卷I）</h1>
                  <StatusBadge status="processing" />
                </div>
                <p className="text-sm text-slate-600">资产ID: AST-20240401-{id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
                <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  下载
                </button>
                <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  编辑
                </button>
              </div>
            </div>

            {/* 元数据网格 */}
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">学科</p>
                <p className="text-sm font-medium text-slate-900">数学</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">学段/年级</p>
                <p className="text-sm font-medium text-slate-900">高三</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">课程标准</p>
                <p className="text-sm font-medium text-slate-900">新课标2022</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">地区</p>
                <p className="text-sm font-medium text-slate-900">全国</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">文件格式</p>
                <p className="text-sm font-medium text-slate-900">PDF</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">文件大小</p>
                <p className="text-sm font-medium text-slate-900">12.5 MB</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">上传时间</p>
                <p className="text-sm font-medium text-slate-900">2026-04-01 14:23</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">上传者</p>
                <p className="text-sm font-medium text-slate-900">张明</p>
              </div>
            </div>

            {/* 标签 */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-2">标签</p>
                  <div className="flex flex-wrap gap-2">
                    {['数学', '高三', '高考', '全国卷', '真题', '2024', '新课标'].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                    <button className="px-3 py-1 border border-dashed border-slate-300 text-slate-600 rounded-full text-sm hover:border-slate-400 hover:text-slate-900">
                      + 添加标签
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* 左侧主要内容区 */}
            <div className="col-span-2 space-y-6">
              {/* 预览区 */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">文件预览</h2>
                </div>
                <div className="p-6">
                  <div className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-600">PDF 文件预览</p>
                      <p className="text-xs text-slate-500 mt-1">共 12 页</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 血缘关系 */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">血缘关系图</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* 原始资料 */}
                    <div className="text-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-900">原始资料</p>
                      <p className="text-xs text-slate-600 mt-1">PDF 文档</p>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-slate-300 relative">
                        <div className="absolute right-0 top-0 -translate-y-1/2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Rawcode */}
                    <div className="text-center">
                      <div className="w-24 h-24 bg-orange-100 rounded-lg flex items-center justify-center mb-2 relative">
                        <GitBranch className="w-10 h-10 text-orange-600" />
                        <div className="absolute -top-2 -right-2">
                          <StatusBadge status="processing" />
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-900">Rawcode</p>
                      <p className="text-xs text-slate-600 mt-1">MinerU 输出</p>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-slate-300 relative">
                        <div className="absolute right-0 top-0 -translate-y-1/2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Cleancode */}
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="w-10 h-10 text-green-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-900">Cleancode</p>
                      <p className="text-xs text-slate-600 mt-1">待生成</p>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="border-t-2 border-dashed border-slate-300 relative">
                        <div className="absolute right-0 top-0 -translate-y-1/2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* 成品 */}
                    <div className="text-center">
                      <div className="w-24 h-24 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="w-10 h-10 text-purple-600" />
                      </div>
                      <p className="text-xs font-medium text-slate-900">成品</p>
                      <p className="text-xs text-slate-600 mt-1">待生成</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 处理历史 */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">处理历史</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="w-0.5 h-full bg-slate-200"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-900">启动 MinerU 解析</p>
                          <span className="text-xs text-slate-500">10分钟前</span>
                        </div>
                        <p className="text-sm text-slate-600">操作人: 张明</p>
                        <div className="mt-2 p-3 bg-blue-50 rounded text-xs text-slate-700">
                          解析进度: 75% (9/12 页已完成)
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div className="w-0.5 h-full bg-slate-200"></div>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-900">元数据自动抽取完成</p>
                          <span className="text-xs text-slate-500">2小时前</span>
                        </div>
                        <p className="text-sm text-slate-600">系统自动执行</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-slate-900">文件上传成功</p>
                          <span className="text-xs text-slate-500">2小时前</span>
                        </div>
                        <p className="text-sm text-slate-600">操作人: 张明</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧信息栏 */}
            <div className="space-y-6">
              {/* 版本信息 */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">版本信息</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">当前版本</p>
                      <p className="text-sm font-medium text-slate-900">v1.0</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">版本状态</p>
                      <StatusBadge status="processing" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">创建时间</p>
                      <p className="text-sm text-slate-900">2026-04-01 14:23</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">最后更新</p>
                      <p className="text-sm text-slate-900">2026-04-01 16:15</p>
                    </div>
                    <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg">
                      查看历史版本
                    </button>
                  </div>
                </div>
              </div>

              {/* 权限设置 */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">权限设置</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">内部可见</span>
                      <input type="checkbox" checked className="rounded border-slate-300 text-blue-600" readOnly />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">生产可见</span>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">审核可见</span>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">对外可见</span>
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" />
                    </label>
                  </div>
                </div>
              </div>

              {/* 相关资产 */}
              <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="font-semibold text-slate-900">相关资产</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <Link to="/asset/2" className="block p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">2024年高考数学真题（全国卷II）</p>
                      <p className="text-xs text-slate-600 mt-1">原始资料</p>
                    </Link>
                    <Link to="/asset/3" className="block p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">高考数学冲刺模拟卷</p>
                      <p className="text-xs text-slate-600 mt-1">成品</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
