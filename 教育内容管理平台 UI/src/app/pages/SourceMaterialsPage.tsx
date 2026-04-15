import { Search, ChevronDown, Grid, List, Upload, FileText, Cpu, CheckCircle, Clock, MoreVertical, Download } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const materials = [
  {
    id: 1,
    title: '2024年高考数学真题（全国卷I）',
    titleEn: '2024 National College Entrance Exam - Math I',
    type: 'PDF',
    size: '12.5 MB',
    uploadTime: '2小时前 / 2h ago',
    status: 'parsing' as const,
    progress: 75,
    thumbnail: '/api/placeholder/400/300'
  },
  {
    id: 2,
    title: '初中英语语法专项练习册',
    titleEn: 'Middle School English Grammar Workbook',
    type: 'DOCX',
    size: '3.2 MB',
    uploadTime: '5小时前 / 5h ago',
    status: 'completed' as const,
    progress: 100,
    thumbnail: '/api/placeholder/400/300'
  },
  {
    id: 3,
    title: '小学数学应用题集（人教版）',
    titleEn: 'Elementary Math Problem Collection',
    type: 'PDF',
    size: '8.7 MB',
    uploadTime: '1天前 / 1d ago',
    status: 'completed' as const,
    progress: 100,
    thumbnail: '/api/placeholder/400/300'
  },
  {
    id: 4,
    title: '高中物理实验指导手册PPT',
    titleEn: 'High School Physics Lab Manual PPT',
    type: 'PPTX',
    size: '25.3 MB',
    uploadTime: '1天前 / 1d ago',
    status: 'completed' as const,
    progress: 100,
    thumbnail: '/api/placeholder/400/300'
  },
  {
    id: 5,
    title: '初中历史知识点总结',
    titleEn: 'Middle School History Summary',
    type: 'PDF',
    size: '5.1 MB',
    uploadTime: '2天前 / 2d ago',
    status: 'pending' as const,
    progress: 0,
    thumbnail: '/api/placeholder/400/300'
  },
  {
    id: 6,
    title: '高考英语作文范文集',
    titleEn: 'College Entrance Exam English Essay Collection',
    type: 'DOCX',
    size: '1.8 MB',
    uploadTime: '2天前 / 2d ago',
    status: 'completed' as const,
    progress: 100,
    thumbnail: '/api/placeholder/400/300'
  }
];

export function SourceMaterialsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'pending') {
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          待解析 / Pending
        </span>
      );
    }
    if (status === 'parsing') {
      return (
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <Cpu className="w-3 h-3 animate-spin" />
          解析中 {progress}% / Parsing
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        已完成 / Completed
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            原始资料库 / Source Materials Library
          </h1>
          <p className="text-slate-600">
            管理上传的教育资料 · 支持 PDF、DOC、PPT、图片等格式 / Manage uploaded educational materials · Support PDF, DOC, PPT, images, etc.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Total Materials */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              资料总数 / TOTAL MATERIALS
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900 mb-1">3,847</p>
                <p className="text-sm text-green-600 font-medium">▲ +156 本周 / this week</p>
              </div>
            </div>
          </div>

          {/* MinIO Storage */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-blue-100">
              MinIO 存储使用 / STORAGE USED
            </p>
            <p className="text-4xl font-bold mb-4">74.2 GB</p>
            <div className="w-full h-3 bg-blue-800 rounded-full overflow-hidden mb-2">
              <div className="w-[74%] h-full bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-blue-100">已用 / Used: 74% (100GB)</p>
          </div>

          {/* Processing Status */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              处理状态 / PROCESSING STATUS
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">待解析 / Pending</span>
                <span className="font-semibold text-yellow-600">156</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">解析中 / Parsing</span>
                <span className="font-semibold text-purple-600">26</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">已完成 / Completed</span>
                <span className="font-semibold text-green-600">3,665</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="p-6">
            {/* Top Row - Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索资料标题、文件名... / Search materials, filenames..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Bottom Row - Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  文件类型 / FILE TYPE: 全部 / ALL
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  状态 / STATUS: 全部 / ALL
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                  上传时间 / DATE
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-slate-50'}`}
                  >
                    <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-slate-50'}`}
                  >
                    <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </button>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  上传资料 / UPLOAD
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Materials Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <FileText className={`w-16 h-16 ${
                    material.type === 'PDF' ? 'text-red-300' :
                    material.type === 'DOCX' ? 'text-blue-300' : 'text-orange-300'
                  }`} />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      material.type === 'PDF' ? 'bg-red-600 text-white' :
                      material.type === 'DOCX' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'
                    }`}>
                      {material.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(material.status, material.progress)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Link to={`/asset/${material.id}`}>
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">{material.titleEn}</p>
                  </Link>

                  {/* Progress Bar for Parsing */}
                  {material.status === 'parsing' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-purple-600 font-medium">MinerU 解析中...</span>
                        <span className="text-slate-600">{material.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                          style={{ width: `${material.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                    <span>{material.size}</span>
                    <span>{material.uploadTime.split(' / ')[0]}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {material.status === 'pending' && (
                      <button className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                        <Cpu className="w-4 h-4" />
                        启动解析 / Parse
                      </button>
                    )}
                    {material.status === 'completed' && (
                      <Link
                        to={`/asset/${material.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        查看详情 / View
                      </Link>
                    )}
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {materials.map((material) => (
              <div
                key={material.id}
                className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-6"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  material.type === 'PDF' ? 'bg-red-100' :
                  material.type === 'DOCX' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    material.type === 'PDF' ? 'text-red-600' :
                    material.type === 'DOCX' ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <Link to={`/asset/${material.id}`}>
                    <h3 className="font-semibold text-slate-900 mb-0.5 hover:text-blue-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-sm text-slate-500">{material.titleEn}</p>
                  </Link>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{material.type}</span>
                    <span className="mx-2">•</span>
                    <span>{material.size}</span>
                  </div>
                  {getStatusBadge(material.status, material.progress)}
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
