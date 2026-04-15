import { FileText, Cpu, HardDrive, Clock, Sparkles, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const recentMaterials = [
  {
    id: 1,
    title: '2024年高考数学真题（全国卷I）',
    titleEn: '2024 National College Entrance Exam - Math I',
    type: 'PDF',
    size: '12.5 MB',
    time: '2小时前 / 2h ago',
    status: 'parsing',
    progress: 75
  },
  {
    id: 2,
    title: '初中英语语法专项练习册',
    titleEn: 'Middle School English Grammar Workbook',
    type: 'DOCX',
    size: '3.2 MB',
    time: '5小时前 / 5h ago',
    status: 'completed',
    progress: 100
  },
  {
    id: 3,
    title: '高中物理实验指导手册PPT',
    titleEn: 'High School Physics Lab Manual PPT',
    type: 'PPTX',
    size: '25.3 MB',
    time: '1天前 / 1d ago',
    status: 'completed',
    progress: 100
  },
];

const processingQueue = [
  { id: 1, name: 'MinerU解析队列 / MinerU Parsing Queue', count: 8, color: 'bg-purple-600' },
  { id: 2, name: '待人工审核 / Pending Review', count: 12, color: 'bg-orange-500' },
];

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-2">
            教育资料处理平台 / EDUCATIONAL CONTENT PROCESSING PLATFORM
          </p>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">工作台 / Dashboard</h1>
          <p className="text-slate-600">文档处理流程概览 · 今日处理报告 / Document Processing Overview · Today's Report</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Total Raw Materials */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                原始资料 / RAW MATERIALS
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900 mb-1">3,847</p>
                <p className="text-sm text-green-600 font-medium">↑ +156 本周 / this week</p>
              </div>
            </div>
          </div>

          {/* MinerU Processing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                MinerU 解析中
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-slate-900 mb-1">26</p>
                <p className="text-sm text-purple-600 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  处理中 / Processing
                </p>
              </div>
            </div>
          </div>

          {/* MinIO Storage */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                MinIO 存储
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-3">74.2 GB</p>
              <div className="w-full h-2 bg-blue-800 rounded-full overflow-hidden mb-2">
                <div className="w-[74%] h-full bg-white rounded-full"></div>
              </div>
              <p className="text-sm text-blue-100">已用 / Used: 74% (100GB)</p>
            </div>
          </div>

          {/* Parsed Results */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                解析完成 / PARSED
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 mb-1">3,245</p>
              <p className="text-sm text-slate-600">
                JSON · MD · Images
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recently Uploaded & Processed - Left Column */}
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                最近处理 / Recently Processed
              </h2>
              <Link to="/source-materials" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                查看全部 / VIEW ALL →
              </Link>
            </div>
            <div className="p-6 space-y-3">
              {recentMaterials.map((material) => (
                <Link
                  key={material.id}
                  to={`/asset/${material.id}`}
                  className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
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
                    <h3 className="font-medium text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                      {material.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">{material.titleEn}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">{material.type}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>{material.time}</span>
                    </div>
                    {material.status === 'parsing' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-purple-600 font-medium">
                            <Cpu className="w-3 h-3 animate-spin" />
                            MinerU 解析中... / Parsing
                          </span>
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
                    {material.status === 'completed' && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <CheckCircle className="w-3 h-3" />
                          解析完成 / Parsed
                        </span>
                        <span className="text-xs text-slate-500">→</span>
                        <span className="text-xs text-slate-600">JSON · Markdown · 图片文件夹</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Processing Queue & Quick Actions */}
          <div className="space-y-6">
            {/* Processing Queue */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                处理队列 / Processing Queue
              </h2>
              <div className="space-y-3">
                {processingQueue.map((queue) => (
                  <Link
                    key={queue.id}
                    to="/tasks"
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${queue.color}`}></div>
                      <span className="text-sm font-medium text-slate-900">{queue.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">{queue.count}</span>
                      <Clock className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Upload */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm font-semibold">快速上传 / Quick Upload</span>
                </div>
                <h3 className="text-xl font-bold mb-3">上传新资料自动处理 / Upload & Auto-Process</h3>
                <p className="text-sm text-blue-100 mb-5">
                  支持 PDF、DOC、PPT、图片等格式
                  <br />
                  自动通过 MinerU 解析并存储到 MinIO
                </p>
                <Link
                  to="/source-materials"
                  className="block w-full px-6 py-3 bg-white text-blue-600 text-center font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  上传资料 / Upload Materials
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                系统状态 / System Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">MinerU 服务</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    正常 / Normal
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">MinIO 存储</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    正常 / Normal
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">处理队列</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    运行中 / Running
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
