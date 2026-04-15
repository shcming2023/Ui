import { Package, Search, Filter, Star, Download, Eye, TrendingUp, BookOpen, FileText, ClipboardList, Layers } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    title: '初中数学几何专题题库',
    type: '题库',
    cover: '/placeholder.jpg',
    description: '覆盖平面几何、立体几何等核心知识点，适合初中全学段使用',
    items: '320题',
    useCount: 156,
    rating: 4.8,
    status: 'published' as const,
    tags: ['数学', '初中', '几何', '专题'],
    metadata: {
      subject: '数学',
      grade: '初中',
      difficulty: '中等',
      standard: '义务教育课标',
    },
    source: 'cleancode_math_geometry.md',
    createdAt: '2026-03-28',
  },
  {
    id: 2,
    title: '高中英语阅读理解练习册',
    type: '练习册',
    cover: '/placeholder.jpg',
    description: '精选50篇高质量英语阅读材料，涵盖科技、文化、社会等多个话题',
    items: '50篇',
    useCount: 89,
    rating: 4.6,
    status: 'published' as const,
    tags: ['英语', '高中', '阅读理解', '练习册'],
    metadata: {
      subject: '英语',
      grade: '高中',
      difficulty: '中高',
      standard: '新课标2022',
    },
    source: 'cleancode_english_reading.md',
    createdAt: '2026-03-27',
  },
  {
    id: 3,
    title: '小学语文期末复习卷',
    type: '试卷',
    cover: '/placeholder.jpg',
    description: '针对小学语文期末考试的综合复习试卷，10套完整试题',
    items: '10套',
    useCount: 234,
    rating: 4.9,
    status: 'published' as const,
    tags: ['语文', '小学', '期末', '试卷'],
    metadata: {
      subject: '语文',
      grade: '小学',
      difficulty: '基础',
      standard: '部编版',
    },
    source: 'cleancode_chinese_final.md',
    createdAt: '2026-03-26',
  },
  {
    id: 4,
    title: '高考物理力学知识点讲义',
    type: '讲义',
    cover: '/placeholder.jpg',
    description: '系统梳理高中物理力学部分知识点，配有详细例题和解析',
    items: '15章节',
    useCount: 67,
    rating: 4.7,
    status: 'published' as const,
    tags: ['物理', '高三', '力学', '讲义'],
    metadata: {
      subject: '物理',
      grade: '高三',
      difficulty: '难',
      standard: '新课标2022',
    },
    source: 'cleancode_physics_mechanics.md',
    createdAt: '2026-03-25',
  },
  {
    id: 5,
    title: '初中化学实验操作课程包',
    type: '课程包',
    cover: '/placeholder.jpg',
    description: '包含20个化学实验的操作指南、注意事项和配套练习',
    items: '20实验',
    useCount: 45,
    rating: 4.5,
    status: 'draft' as const,
    tags: ['化学', '初中', '实验', '课程包'],
    metadata: {
      subject: '化学',
      grade: '初中',
      difficulty: '中等',
      standard: '义务教育课标',
    },
    source: 'cleancode_chemistry_exp.md',
    createdAt: '2026-03-24',
  },
  {
    id: 6,
    title: '高中历史古代史专题题库',
    type: '题库',
    cover: '/placeholder.jpg',
    description: '中国古代史核心考点题库，包含选择题、材料题等多种题型',
    items: '180题',
    useCount: 92,
    rating: 4.8,
    status: 'published' as const,
    tags: ['历史', '高中', '古代史', '专题'],
    metadata: {
      subject: '历史',
      grade: '高中',
      difficulty: '中等',
      standard: '新课标2022',
    },
    source: 'cleancode_history_ancient.md',
    createdAt: '2026-03-23',
  },
];

const productTypeIcons = {
  '题库': ClipboardList,
  '练习册': BookOpen,
  '试卷': FileText,
  '讲义': BookOpen,
  '课程包': Layers,
};

export function ProductsPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">成品库</h1>
            <p className="text-sm text-slate-600 mt-1">共 892 个教育成品</p>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索成品标题、知识点、标签..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>全部类型</option>
            <option>题库</option>
            <option>练习册</option>
            <option>试卷</option>
            <option>讲义</option>
            <option>课程包</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>全部学科</option>
            <option>数学</option>
            <option>语文</option>
            <option>英语</option>
            <option>物理</option>
            <option>化学</option>
            <option>历史</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>最新发布</option>
            <option>使用最多</option>
            <option>评分最高</option>
          </select>
        </div>
      </div>

      {/* 成品列表 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const TypeIcon = productTypeIcons[product.type as keyof typeof productTypeIcons] || Package;
            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                {/* 封面 */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                  <TypeIcon className="w-20 h-20 text-slate-300" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={product.status} />
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>

                {/* 内容 */}
                <div className="p-5">
                  {/* 标题和类型 */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-blue-600 flex-1">
                      {product.title}
                    </h3>
                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs flex-shrink-0">
                      {product.type}
                    </span>
                  </div>

                  {/* 描述 */}
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{product.description}</p>

                  {/* 元数据 */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                    <span className="font-medium">{product.metadata.subject}</span>
                    <span>•</span>
                    <span>{product.metadata.grade}</span>
                    <span>•</span>
                    <span>{product.metadata.difficulty}</span>
                  </div>

                  {/* 统计信息 */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {product.items}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {product.useCount}次使用
                    </span>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 底部操作 */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{product.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                        回溯来源
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
  );
}
