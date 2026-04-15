import { useState } from 'react';
import { Search, ChevronDown, Grid, List, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import imgResource1 from '../../imports/教学资源库SourceLibrary/1cdd58848aff98d26da36e0f5423d651578c5cea.png';
import imgResource2 from '../../imports/教学资源库SourceLibrary/777ed09984f2bbc2694415cc110dbe12d2ead7e0.png';
import imgResource3 from '../../imports/教学资源库SourceLibrary/03552a28e6ff7c0cd7ccc92df86c4b89de7899a6.png';
import imgResource4 from '../../imports/教学资源库SourceLibrary/d11c7053705d71136ff18957d7929f80d47d1930.png';

const materials = [
  {
    id: 1,
    title: 'Advanced Calculus: Winter Theory Series',
    category: 'EDUCATIONAL CONCEPT',
    size: '24.2 MB',
    views: 932,
    image: imgResource1,
    badge: 'NEW'
  },
  {
    id: 2,
    title: 'Molecular Biology: The CRISPR Revolution',
    category: 'VIDEO COURSE',
    size: '89 MB',
    views: 1267,
    image: imgResource2,
    badge: 'NEW'
  },
  {
    id: 3,
    title: '小学数学应用题集（人教版）',
    type: 'PDF',
    size: '8.7 MB',
    uploadTime: '1天前',
    status: 'completed' as const,
    aiAnalyzed: true,
    aiAnalyzing: false,
    tags: ['数学', '小学', '应用题', '人教版'],
    metadata: {
      subject: '数学',
      grade: '小学',
      type: '练习册',
      standard: '人教版',
      region: '通用',
    },
    uploader: '王芳',
  },
  {
    id: 4,
    title: '高中物理实验指导手册',
    type: 'PPT',
    size: '25.3 MB',
    uploadTime: '1天前',
    status: 'completed' as const,
    aiAnalyzed: true,
    aiAnalyzing: false,
    tags: ['物理', '高中', '实验', '指导手册'],
    metadata: {
      subject: '物理',
      grade: '高中',
      type: '教学资料',
      standard: '新课标2022',
      region: '通用',
    },
    uploader: '刘洋',
  },
  {
    id: 5,
    title: '初中历史知识点总结',
    type: 'PDF',
    size: '5.1 MB',
    uploadTime: '2天前',
    status: 'pending' as const,
    aiAnalyzed: false,
    aiAnalyzing: false,
    tags: [],
    metadata: {},
    uploader: '陈刚',
  },
  {
    id: 6,
    title: '高考英语作文范文集',
    type: 'DOCX',
    size: '1.8 MB',
    uploadTime: '2天前',
    status: 'completed' as const,
    aiAnalyzed: true,
    aiAnalyzing: false,
    tags: ['英语', '高三', '作文', '范文'],
    metadata: {
      subject: '英语',
      grade: '高三',
      type: '教学资料',
      standard: '新课标2022',
      region: '通用',
    },
    uploader: '赵敏',
  },
];

export function SourceMaterialsPage() {
  const [selectedMaterials, setSelectedMaterials] = useState<number[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showBatchTagModal, setShowBatchTagModal] = useState(false);

  const toggleSelectMaterial = (id: number) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedMaterials(prev =>
      prev.length === materials.length ? [] : materials.map(m => m.id)
    );
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左侧筛选面板 */}
      {showFilterPanel && (
        <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-slate-900">高级筛选</h2>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 学科筛选 */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">学科</label>
                <div className="space-y-2">
                  {['全部', '数学', '语文', '英语', '物理', '化学', '生物', '历史', '地理', '政治'].map(subject => (
                    <label key={subject} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={subject === '全部'} />
                      <span className="text-sm text-slate-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 学段/年级 */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-700 mb-3 block">学段/年级</label>
                <div className="space-y-2">
                  {['全部', '小学', '初中', '高中', '高三'].map(grade => (
                    <label key={grade} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={grade === '全部'} />
                      <span className="text-sm text-slate-700">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 课程标准 */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-700 mb-3 block">课程标准</label>
                <div className="space-y-2">
                  {['全部', '新课标2022', '义务教育课标', '人教版', '部编版', '苏教版'].map(standard => (
                    <label key={standard} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={standard === '全部'} />
                      <span className="text-sm text-slate-700">{standard}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 文件格式 */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-700 mb-3 block">文件格式</label>
                <div className="space-y-2">
                  {['全部', 'PDF', 'DOC/DOCX', 'PPT/PPTX', '图片', '其他'].map(format => (
                    <label key={format} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={format === '全部'} />
                      <span className="text-sm text-slate-700">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 资料类型 */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-700 mb-3 block">资料类型</label>
                <div className="space-y-2">
                  {['全部', '真题', '练习册', '试卷', '教学资料', '讲义', '课件'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={type === '全部'} />
                      <span className="text-sm text-slate-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* AI分析状态 */}
              <div className="pt-6 border-t border-slate-200">
                <label className="text-sm font-medium text-slate-700 mb-3 block">AI分析状态</label>
                <div className="space-y-2">
                  {['全部', '已分析', '未分析', '分析中'].map(status => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600" defaultChecked={status === '全部'} />
                      <span className="text-sm text-slate-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 底部操作 */}
              <div className="pt-6 border-t border-slate-200 space-y-2">
                <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                  应用筛选
                </button>
                <button className="w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                  重置筛选
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 右侧主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-slate-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">原始资料库</h1>
              <p className="text-sm text-slate-600 mt-1">共 3,847 份原始教育资料 • AI已分析 3,245 份</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                上传资料
              </button>
              <Link
                to="/metadata"
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                管理分类标签
              </Link>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索资料标题、标签、上传者..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {!showFilterPanel && (
              <button
                onClick={() => setShowFilterPanel(true)}
                className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                显示筛选
              </button>
            )}
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>最新上传</option>
              <option>最早上传</option>
              <option>文件大小</option>
              <option>AI分析完成</option>
            </select>
          </div>

          {/* 批量操作栏 */}
          {selectedMaterials.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="p-1.5 hover:bg-blue-100 rounded"
                >
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                </button>
                <span className="text-sm font-medium text-blue-900">
                  已选择 {selectedMaterials.length} 项
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  批量AI分析
                </button>
                <button
                  onClick={() => setShowBatchTagModal(true)}
                  className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  批量打标签
                </button>
                <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  批量下载
                </button>
                <button className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  批量删除
                </button>
                <button
                  onClick={() => setSelectedMaterials([])}
                  className="p-2 hover:bg-slate-100 rounded"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 资料列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-all ${
                  selectedMaterials.includes(material.id) ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                }`}
              >
                {/* 缩略图区域 */}
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                  <FileText className="w-16 h-16 text-slate-300" />

                  {/* 选择框 */}
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelectMaterial(material.id);
                      }}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* AI分析标识 */}
                  {material.aiAnalyzing ? (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-medium animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      AI分析中...
                    </div>
                  ) : material.aiAnalyzed ? (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      AI已分析
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      待分析
                    </div>
                  )}

                  {/* 状态标识 */}
                  <div className="absolute bottom-3 left-3">
                    <StatusBadge status={material.status} />
                  </div>

                  {/* 文件类型 */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-slate-700">
                    {material.type}
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="p-5">
                  <Link to={`/asset/${material.id}`} className="block">
                    <h3 className="font-medium text-slate-900 line-clamp-2 hover:text-blue-600 mb-2">
                      {material.title}
                    </h3>
                  </Link>

                  {/* 元数据 */}
                  {Object.keys(material.metadata).length > 0 ? (
                    <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span className="text-purple-600 font-medium">AI识别结果</span>
                      </div>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-700">
                          {material.metadata.subject && <span className="font-medium">{material.metadata.subject}</span>}
                          {material.metadata.grade && <><span>•</span><span>{material.metadata.grade}</span></>}
                          {material.metadata.type && <><span>•</span><span>{material.metadata.type}</span></>}
                        </div>
                        {material.metadata.standard && (
                          <div className="text-xs text-slate-600">{material.metadata.standard}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-xs text-yellow-700 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-medium">未进行AI分析</span>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">点击下方按钮启动AI自动识别</p>
                    </div>
                  )}

                  {/* 标签 */}
                  {material.tags.length > 0 ? (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {material.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {material.tags.length > 4 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                            +{material.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3 text-xs text-slate-400">暂无标签</div>
                  )}

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>{material.uploadTime}</span>
                    </div>
                    <button
                      className="p-1.5 hover:bg-slate-100 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* 操作按钮 */}
                  {!material.aiAnalyzed && !material.aiAnalyzing && (
                    <button className="w-full mt-3 px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center justify-center gap-2 font-medium">
                      <Sparkles className="w-4 h-4" />
                      启动AI自动分析
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg">
              上一页
            </button>
            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">1</button>
            <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg">
              2
            </button>
            <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg">
              3
            </button>
            <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg">
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* 上传资料弹窗 */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}

      {/* 批量打标签弹窗 */}
      {showBatchTagModal && (
        <BatchTagModal
          selectedCount={selectedMaterials.length}
          onClose={() => setShowBatchTagModal(false)}
        />
      )}
    </div>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [enableAIAnalysis, setEnableAIAnalysis] = useState(true);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">上传教育资料</h2>
          <p className="text-sm text-slate-600 mt-1">支持PDF、DOC、DOCX、PPT、PPTX格式，单个文件不超过100MB</p>
        </div>

        <div className="p-6 space-y-6">
          {/* 文件上传区 */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 mb-2">点击或拖拽文件到此处上传</p>
            <p className="text-sm text-slate-500">支持批量上传多个文件</p>
          </div>

          {/* AI自动分析选项 */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAIAnalysis}
                onChange={(e) => setEnableAIAnalysis(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-purple-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">上传后自动启动AI智能分析（推荐）</span>
                </div>
                <div className="space-y-2 text-sm text-purple-700">
                  <p>AI将自动完成以下任务：</p>
                  <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>识别文件内容和教育领域（学科、年级、知识点）</li>
                    <li>提取关键元数据（课程标准、地区、资料类型）</li>
                    <li>根据您预设的<Link to="/metadata" className="underline font-medium">分类规则</Link>自动打标签</li>
                    <li>生成资料摘要和知识点结构</li>
                  </ul>
                </div>
              </div>
            </label>
          </div>

          {/* 手动填写基础信息 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900">基础信息（可选）</h3>
              <span className="text-xs text-slate-500">AI分析后会自动填充或修正</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700 mb-2 block">学科</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">自动识别</option>
                  <option>数学</option>
                  <option>语文</option>
                  <option>英语</option>
                  <option>物理</option>
                  <option>化学</option>
                  <option>生物</option>
                  <option>历史</option>
                  <option>地理</option>
                  <option>政治</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-700 mb-2 block">学段/年级</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">自动识别</option>
                  <option>小学</option>
                  <option>初中</option>
                  <option>高中</option>
                  <option>高三</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-700 mb-2 block">资料类型</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">自动识别</option>
                  <option>真题</option>
                  <option>练习册</option>
                  <option>试卷</option>
                  <option>教学资料</option>
                  <option>讲义</option>
                  <option>课件</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-700 mb-2 block">课程标准</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">自动识别</option>
                  <option>新课标2022</option>
                  <option>义务教育课标</option>
                  <option>人教版</option>
                  <option>部编版</option>
                  <option>苏教版</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="p-6 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            {enableAIAnalysis && (
              <span className="flex items-center gap-1 text-purple-600">
                <Sparkles className="w-4 h-4" />
                将在上传完成后自动启动AI分析
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              取消
            </button>
            <button className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2">
              <Upload className="w-4 h-4" />
              开始上传
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatchTagModal({ selectedCount, onClose }: { selectedCount: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">批量打标签</h2>
          <p className="text-sm text-slate-600 mt-1">为选中的 {selectedCount} 个资料添加或移除标签</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">添加标签</label>
            <input
              type="text"
              placeholder="输入标签名称，按回车添加"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">提示：如标签不存在，将自动创建新标签</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">常用标签</label>
            <div className="flex flex-wrap gap-2">
              {['数学', '语文', '英语', '高考', '中考', '真题', '练习册', '新课标2022'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg text-sm transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link
              to="/metadata"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Tag className="w-4 h-4" />
              前往标签管理配置自动打标规则
            </Link>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            取消
          </button>
          <button className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
            确定添加
          </button>
        </div>
      </div>
    </div>
  );
}
