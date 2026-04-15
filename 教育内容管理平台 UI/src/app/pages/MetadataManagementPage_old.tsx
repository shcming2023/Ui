import { useState } from 'react';
import { Tags, Plus, Edit2, Trash2, BarChart3, TrendingUp, Sparkles, CheckCircle, AlertCircle, Settings } from 'lucide-react';

const structuredFields = [
  { name: '学科', values: ['数学', '语文', '英语', '物理', '化学', '历史', '地理', '生物'], type: '单选' },
  { name: '学段', values: ['小学', '初中', '高中'], type: '单选' },
  { name: '年级', values: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三', '高一', '高二', '高三'], type: '单选' },
  { name: '课程标准', values: ['新课标2022', '义务教育课标', '人教版', '部编版', '苏教版', 'California Standard'], type: '多选' },
  { name: '地区', values: ['全国', '北京', '上海', '广东', '江苏', '浙江', 'California', 'New York'], type: '单选' },
  { name: '语言', values: ['中文', 'English'], type: '单选' },
  { name: '资料类型', values: ['教科书', '练习册', '试卷', '讲义', '课件', '题库'], type: '多选' },
  { name: '处理阶段', values: ['原始资料', 'rawcode', 'cleancode', '成品'], type: '单选' },
  { name: '权限级别', values: ['内部可见', '生产可见', '审核可见', '对外可见'], type: '多选' },
];

const flexibleTags = [
  { name: '新课标2022', count: 1285, category: '课程标准', color: 'blue' as const },
  { name: '数学', count: 2341, category: '学科', color: 'purple' as const },
  { name: '高考', count: 892, category: '考试', color: 'red' as const },
  { name: '初中', count: 1654, category: '学段', color: 'green' as const },
  { name: '阅读理解', count: 567, category: '题型', color: 'orange' as const },
  { name: '人教版', count: 1432, category: '教材版本', color: 'indigo' as const },
  { name: '几何', count: 734, category: '知识点', color: 'pink' as const },
  { name: '语法', count: 623, category: '知识点', color: 'yellow' as const },
  { name: 'G3', count: 445, category: '年级', color: 'teal' as const },
  { name: '专项练习', count: 821, category: '资料类型', color: 'cyan' as const },
  { name: '中考', count: 678, category: '考试', color: 'red' as const },
  { name: '实验', count: 389, category: '内容类型', color: 'lime' as const },
];

const tagCategories = [
  '全部',
  '课程标准',
  '学科',
  '考试',
  '学段',
  '题型',
  '知识点',
  '教材版本',
  '资料类型',
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  red: 'bg-red-100 text-red-700 hover:bg-red-200',
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
  yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  teal: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
  cyan: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  lime: 'bg-lime-100 text-lime-700 hover:bg-lime-200',
};

const aiAutoTagRules = [
  {
    id: 1,
    name: '自动识别学科',
    enabled: true,
    condition: '文件内容包含学科关键词',
    action: '自动添加学科标签',
    priority: 1,
    executedCount: 2341,
    successRate: 96,
  },
  {
    id: 2,
    name: '课程标准识别',
    enabled: true,
    condition: '标题或内容包含"新课标"、"人教版"等',
    action: '自动添加课程标准标签',
    priority: 2,
    executedCount: 1854,
    successRate: 94,
  },
  {
    id: 3,
    name: '考试类型识别',
    enabled: true,
    condition: '标题包含"高考"、"中考"、"真题"',
    action: '自动添加考试类型标签',
    priority: 3,
    executedCount: 1432,
    successRate: 98,
  },
  {
    id: 4,
    name: '年级智能判断',
    enabled: true,
    condition: 'AI分析内容难度和知识点',
    action: '自动赋值年级字段',
    priority: 4,
    executedCount: 2156,
    successRate: 91,
  },
  {
    id: 5,
    name: '资料类型分类',
    enabled: false,
    condition: '根据文件结构和内容特征',
    action: '自动分类为试卷、练习册、讲义等',
    priority: 5,
    executedCount: 892,
    successRate: 87,
  },
];

export function MetadataManagementPage() {
  const [activeTab, setActiveTab] = useState<'fields' | 'tags' | 'ai-rules'>('fields');

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">元数据与标签管理</h1>
          <p className="text-sm text-slate-600 mt-1">管理结构化字段、灵活标签和AI自动标注规则</p>
        </div>

        {/* Tab导航 */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('fields')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'fields'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span>结构化字段</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'tags'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5" />
                <span>灵活标签</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ai-rules')}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === 'ai-rules'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>AI自动标注规则</span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  新功能
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'ai-rules' ? (
          <AIAutoTagRulesTab rules={aiAutoTagRules} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧内容 */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'fields' && <StructuredFieldsTab fields={structuredFields} />}
              {activeTab === 'tags' && <FlexibleTagsTab tags={flexibleTags} categories={tagCategories} colorClasses={colorClasses} />}
            </div>

            {/* 右侧统计 */}
            <div className="space-y-6">
              <StatisticsPanel />
              <TrendingTagsPanel />
              <SuggestionsPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StructuredFieldsTab({ fields }: { fields: typeof structuredFields }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              结构化字段配置
            </h2>
            <p className="text-sm text-slate-600 mt-1">预定义的标准元数据字段</p>
          </div>
          <button className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            添加字段
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-slate-900">{field.name}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                      {field.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{field.values.length} 个预设值</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {field.values.map((value, vIndex) => (
                  <span
                    key={vIndex}
                    className="px-2 py-1 bg-slate-50 text-slate-700 rounded text-xs border border-slate-200"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlexibleTagsTab({ tags, categories, colorClasses }: { tags: typeof flexibleTags; categories: string[]; colorClasses: typeof colorClasses }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Tags className="w-5 h-5" />
              灵活标签管理
            </h2>
            <p className="text-sm text-slate-600 mt-1">用户自定义的内容标签</p>
          </div>
          <button className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            创建标签
          </button>
        </div>
      </div>

      <div className="px-6 pt-6 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                category === '全部'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                colorClasses[tag.color]
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-xs opacity-75">{tag.category}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                  <TrendingUp className="w-3 h-3" />
                  <span>{tag.count} 次使用</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-black/5 rounded" onClick={(e) => e.stopPropagation()}>
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-black/5 rounded" onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatisticsPanel() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">统计概览</h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-1">结构化字段</p>
          <p className="text-2xl font-semibold text-slate-900">9</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-1">灵活标签</p>
          <p className="text-2xl font-semibold text-slate-900">247</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-1">标签类别</p>
          <p className="text-2xl font-semibold text-slate-900">12</p>
        </div>
        <div>
          <p className="text-sm text-slate-600 mb-1">总使用次数</p>
          <p className="text-2xl font-semibold text-slate-900">12,865</p>
        </div>
      </div>
    </div>
  );
}

function TrendingTagsPanel() {
  const trendingData = [
    { name: '数学', value: 2341, percent: 18 },
    { name: '初中', value: 1654, percent: 13 },
    { name: '人教版', value: 1432, percent: 11 },
    { name: '新课标2022', value: 1285, percent: 10 },
    { name: '高考', value: 892, percent: 7 },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">使用趋势</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {trendingData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-900">{item.name}</span>
                <span className="text-slate-600">{item.value}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionsPanel() {
  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">自动抽取建议</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">新建标签建议</p>
            <p className="text-sm text-blue-700">在最近上传的资料中检测到 "应用题" 出现 23 次</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                创建标签
              </button>
              <button className="px-3 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded">
                忽略
              </button>
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-1">标签合并建议</p>
            <p className="text-sm text-green-700">"练习" 和 "练习题" 可能重复，建议合并</p>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                合并
              </button>
              <button className="px-3 py-1 text-xs text-green-600 hover:bg-green-100 rounded">
                保留
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAutoTagRulesTab({ rules }: { rules: typeof aiAutoTagRules }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左侧：规则列表 */}
      <div className="lg:col-span-2 space-y-4">
        {/* 顶部操作栏 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">AI自动标注规则</h3>
              <p className="text-sm text-slate-600 mb-4">
                当用户上传资料或手动触发时,系统将按照优先级顺序执行AI分析，自动提取元数据并打标签。
                您可以自定义规则、调整优先级、启用/禁用特定规则。
              </p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  新建规则
                </button>
                <button className="px-4 py-2 text-sm text-purple-700 bg-white hover:bg-purple-50 border border-purple-300 rounded-lg">
                  批量测试规则
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 规则列表 */}
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-white border-2 rounded-lg p-5 transition-all ${
                rule.enabled ? 'border-slate-200 hover:border-blue-300' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* 优先级 */}
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-semibold text-slate-700 text-sm">
                    {rule.priority}
                  </div>

                  {/* 规则信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-slate-900">{rule.name}</h3>
                      {rule.enabled ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          已启用
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                          已禁用
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 flex-shrink-0">触发条件：</span>
                        <span className="text-slate-700">{rule.condition}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-500 flex-shrink-0">执行动作：</span>
                        <span className="text-slate-700">{rule.action}</span>
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                      <span>执行 {rule.executedCount} 次</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        成功率
                        <span className={`font-medium ${
                          rule.successRate >= 95 ? 'text-green-600' :
                          rule.successRate >= 90 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {rule.successRate}%
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      className="sr-only peer"
                      readOnly
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 进度条（成功率） */}
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    rule.successRate >= 95 ? 'bg-green-500' :
                    rule.successRate >= 90 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${rule.successRate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：规则统计和设置 */}
      <div className="space-y-6">
        {/* 总体统计 */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">规则统计</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">总规则数</p>
              <p className="text-2xl font-semibold text-slate-900">{rules.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">已启用</p>
              <p className="text-2xl font-semibold text-green-600">
                {rules.filter(r => r.enabled).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">已禁用</p>
              <p className="text-2xl font-semibold text-slate-400">
                {rules.filter(r => !r.enabled).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">总执行次数</p>
              <p className="text-2xl font-semibold text-slate-900">
                {rules.reduce((sum, r) => sum + r.executedCount, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">平均成功率</p>
              <p className="text-2xl font-semibold text-blue-600">
                {Math.round(rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length)}%
              </p>
            </div>
          </div>
        </div>

        {/* 执行设置 */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">执行设置</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">上传时自动执行</p>
                <p className="text-xs text-slate-600 mt-1">资料上传完成后立即触发AI分析</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">并行执行规则</p>
                <p className="text-xs text-slate-600 mt-1">多个规则同时执行以提高速度</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">人工审核确认</p>
                <p className="text-xs text-slate-600 mt-1">AI标注结果需人工审核后生效</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded border-slate-300 text-blue-600"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">低置信度提醒</p>
                <p className="text-xs text-slate-600 mt-1">当AI置信度低于阈值时发送通知</p>
              </div>
            </label>

            <div className="pt-4 border-t border-slate-200">
              <label className="text-sm font-medium text-slate-900 mb-2 block">置信度阈值</label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="85"
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>0%</span>
                <span className="font-medium text-blue-600">85%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 最近执行记录 */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">最近执行</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { rule: '自动识别学科', time: '5分钟前', status: 'success' as const, confidence: 96 },
                { rule: '课程标准识别', time: '12分钟前', status: 'success' as const, confidence: 94 },
                { rule: '年级智能判断', time: '18分钟前', status: 'warning' as const, confidence: 78 },
                { rule: '考试类型识别', time: '25分钟前', status: 'success' as const, confidence: 98 },
              ].map((record, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{record.rule}</p>
                    {record.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>{record.time}</span>
                    <span>置信度 {record.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
