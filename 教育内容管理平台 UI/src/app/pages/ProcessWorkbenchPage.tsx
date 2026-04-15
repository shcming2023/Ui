import { GitBranch, Play, Pause, RotateCw, Eye, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

const processTasks = [
  {
    id: 1,
    name: 'MinerU解析：2024年高考数学真题',
    type: 'rawcode生成',
    status: 'processing' as const,
    stage: 'MinerU解析中',
    progress: 75,
    input: '2024年高考数学真题（全国卷I）.pdf',
    output: 'markdown + latex + images',
    assignee: '张明',
    startTime: '2026-04-02 14:00',
    estimatedTime: '5分钟',
  },
  {
    id: 2,
    name: 'AI清洗：初中英语语法练习',
    type: 'cleancode生成',
    status: 'reviewing' as const,
    stage: '待人工审核',
    progress: 100,
    input: 'rawcode_english_grammar.md',
    output: 'cleancode_english_grammar.md',
    assignee: '李华',
    startTime: '2026-04-02 13:30',
    estimatedTime: '已完成',
  },
  {
    id: 3,
    name: '题库生成：高中物理实验题',
    type: '成品生成',
    status: 'processing' as const,
    stage: '结构化数据生成',
    progress: 90,
    input: 'cleancode_physics_exp.md',
    output: '题库JSON',
    assignee: '王芳',
    startTime: '2026-04-02 13:00',
    estimatedTime: '2分钟',
  },
  {
    id: 4,
    name: 'OCR识别：小学数学试卷扫描件',
    type: 'rawcode生成',
    status: 'pending' as const,
    stage: '等待开始',
    progress: 0,
    input: 'scan_math_paper_001.jpg',
    output: 'markdown',
    assignee: '刘洋',
    startTime: '待分配',
    estimatedTime: '10分钟',
  },
  {
    id: 5,
    name: '格式转换：高中化学方程式整理',
    type: 'cleancode生成',
    status: 'failed' as const,
    stage: 'LaTeX解析失败',
    progress: 45,
    input: 'rawcode_chemistry.md',
    output: '-',
    assignee: '陈刚',
    startTime: '2026-04-02 12:00',
    estimatedTime: '-',
    error: 'LaTeX 语法错误：第127行缺少闭合括号',
  },
  {
    id: 6,
    name: '讲义生成：初中历史知识点总结',
    type: '成品生成',
    status: 'completed' as const,
    stage: '已完成',
    progress: 100,
    input: 'cleancode_history.md',
    output: '讲义PDF',
    assignee: '赵敏',
    startTime: '2026-04-02 11:00',
    estimatedTime: '已完成',
  },
];

export function ProcessWorkbenchPage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">处理中心</h1>
          <p className="text-sm text-slate-600 mt-1">管理和监控内容处理流程</p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">待处理</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">8</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">处理中</p>
                <p className="text-2xl font-semibold text-blue-600 mt-1">12</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">待审核</p>
                <p className="text-2xl font-semibold text-yellow-600 mt-1">6</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">失败</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">3</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 筛选和操作栏 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                全部任务
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                Rawcode生成
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                Cleancode生成
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                成品生成
              </button>
            </div>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>全部状态</option>
              <option>待处理</option>
              <option>处理中</option>
              <option>待审核</option>
              <option>失败</option>
              <option>已完成</option>
            </select>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-4">
          {processTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* 任务头部 */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-slate-900">{task.name}</h3>
                      <StatusBadge status={task.status} />
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                        {task.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{task.stage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'failed' && (
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="重跑">
                        <RotateCw className="w-5 h-5" />
                      </button>
                    )}
                    {task.status === 'processing' && (
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="暂停">
                        <Pause className="w-5 h-5" />
                      </button>
                    )}
                    {task.status === 'pending' && (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="启动">
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="查看详情">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 进度条 */}
                {task.status !== 'pending' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-600">处理进度</span>
                      <span className="text-xs font-medium text-slate-900">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          task.status === 'failed'
                            ? 'bg-red-500'
                            : task.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* 任务详情网格 */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">输入</p>
                    <p className="text-sm text-slate-900 truncate" title={task.input}>
                      {task.input}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">输出</p>
                    <p className="text-sm text-slate-900 truncate" title={task.output}>
                      {task.output}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">负责人</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <p className="text-sm text-slate-900">{task.assignee}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">预计时间</p>
                    <p className="text-sm text-slate-900">{task.estimatedTime}</p>
                  </div>
                </div>

                {/* 错误信息 */}
                {task.error && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900 mb-1">错误信息</p>
                      <p className="text-sm text-red-700">{task.error}</p>
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium mt-2">
                        查看完整日志 →
                      </button>
                    </div>
                  </div>
                )}

                {/* 开始时间 */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                  <Clock className="w-4 h-4" />
                  <span>开始时间: {task.startTime}</span>
                </div>
              </div>

              {/* Diff视图按钮（仅cleancode任务） */}
              {task.type === 'cleancode生成' && task.status !== 'pending' && (
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                    <GitBranch className="w-4 h-4" />
                    查看 Rawcode vs Cleancode 对比
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
