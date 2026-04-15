import { CheckSquare, Filter, Download, Eye, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

const tasks = [
  {
    id: 'TASK-2024-001',
    name: 'MinerU解析：2024年高考数学真题',
    type: 'MinerU解析',
    status: 'processing' as const,
    priority: 'high',
    createdAt: '2026-04-02 14:00',
    updatedAt: '2026-04-02 14:35',
    assignee: '张明',
    input: '2024年高考数学真题（全国卷I）.pdf',
    output: 'rawcode/',
    progress: 75,
    logs: [
      { time: '14:35', message: '正在解析第9页...' },
      { time: '14:30', message: '图片提取完成' },
      { time: '14:15', message: 'LaTeX 公式识别中' },
    ],
  },
  {
    id: 'TASK-2024-002',
    name: 'AI清洗：初中英语语法练习',
    type: 'AI清洗',
    status: 'reviewing' as const,
    priority: 'medium',
    createdAt: '2026-04-02 13:30',
    updatedAt: '2026-04-02 14:20',
    assignee: '李华',
    input: 'rawcode_english_grammar.md',
    output: 'cleancode_english_grammar.md',
    progress: 100,
    logs: [
      { time: '14:20', message: '待审核人员确认' },
      { time: '14:00', message: '清洗完成，等待审核' },
      { time: '13:45', message: '格式标准化处理中' },
    ],
    reviewNote: '请重点检查语法术语的标准化',
  },
  {
    id: 'TASK-2024-003',
    name: '题库生成：高中物理实验题',
    type: '成品生成',
    status: 'processing' as const,
    priority: 'high',
    createdAt: '2026-04-02 13:00',
    updatedAt: '2026-04-02 14:30',
    assignee: '王芳',
    input: 'cleancode_physics_exp.md',
    output: 'product_physics_bank.json',
    progress: 90,
    logs: [
      { time: '14:30', message: '题目难度标注中...' },
      { time: '14:15', message: '知识点关联完成' },
      { time: '14:00', message: '题型分类完成' },
    ],
  },
  {
    id: 'TASK-2024-004',
    name: 'OCR识别：小学数学试卷扫描件',
    type: 'OCR识别',
    status: 'pending' as const,
    priority: 'low',
    createdAt: '2026-04-02 12:45',
    updatedAt: '2026-04-02 12:45',
    assignee: '刘洋',
    input: 'scan_math_paper_001.jpg',
    output: '-',
    progress: 0,
    logs: [],
  },
  {
    id: 'TASK-2024-005',
    name: '格式转换：高中化学方程式整理',
    type: '格式转换',
    status: 'failed' as const,
    priority: 'medium',
    createdAt: '2026-04-02 12:00',
    updatedAt: '2026-04-02 12:45',
    assignee: '陈刚',
    input: 'rawcode_chemistry.md',
    output: '-',
    progress: 45,
    logs: [
      { time: '12:45', message: '任务失败：LaTeX 解析错误' },
      { time: '12:30', message: '检测到语法错误' },
      { time: '12:15', message: '开始解析化学方程式' },
    ],
    error: 'LaTeX 语法错误：第127行缺少闭合括号',
  },
  {
    id: 'TASK-2024-006',
    name: '讲义生成：初中历史知识点总结',
    type: '成品生成',
    status: 'completed' as const,
    priority: 'medium',
    createdAt: '2026-04-02 11:00',
    updatedAt: '2026-04-02 13:00',
    assignee: '赵敏',
    input: 'cleancode_history.md',
    output: 'product_history_notes.pdf',
    progress: 100,
    logs: [
      { time: '13:00', message: '任务完成' },
      { time: '12:45', message: 'PDF 生成完成' },
      { time: '12:00', message: '排版处理中' },
    ],
  },
];

const priorityConfig = {
  high: { label: '高', className: 'bg-red-100 text-red-700' },
  medium: { label: '中', className: 'bg-yellow-100 text-yellow-700' },
  low: { label: '低', className: 'bg-slate-100 text-slate-700' },
};

const statusIcons = {
  pending: Clock,
  processing: RefreshCw,
  reviewing: Eye,
  completed: CheckCircle,
  failed: XCircle,
};

export function TaskCenterPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">任务中心 / 审核台</h1>
          <p className="text-sm text-slate-600 mt-1">监控和管理所有处理任务</p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">全部任务</p>
              <CheckSquare className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-900">156</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">待处理</p>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-2xl font-semibold text-slate-700">23</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">处理中</p>
              <RefreshCw className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-blue-600">18</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">待审核</p>
              <Eye className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-semibold text-yellow-600">9</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">失败</p>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-semibold text-red-600">6</p>
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
                待处理
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                处理中
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                待审核
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                失败
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg">
                已完成
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
              <button className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出报告
              </button>
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const StatusIcon = statusIcons[task.status];
            return (
              <div key={task.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                {/* 任务头部 */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${
                          task.status === 'processing' ? 'animate-spin text-blue-600' :
                          task.status === 'completed' ? 'text-green-600' :
                          task.status === 'failed' ? 'text-red-600' :
                          task.status === 'reviewing' ? 'text-yellow-600' :
                          'text-slate-400'
                        }`} />
                        <h3 className="font-medium text-slate-900">{task.name}</h3>
                        <StatusBadge status={task.status} />
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          priorityConfig[task.priority as keyof typeof priorityConfig].className
                        }`}>
                          {priorityConfig[task.priority as keyof typeof priorityConfig].label}优先级
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">任务ID: {task.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status === 'reviewing' && (
                        <>
                          <button className="px-4 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-lg">
                            通过审核
                          </button>
                          <button className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                            驳回
                          </button>
                        </>
                      )}
                      {task.status === 'failed' && (
                        <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          重新执行
                        </button>
                      )}
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* 进度条 */}
                  {task.progress > 0 && task.status !== 'completed' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-600">执行进度</span>
                        <span className="text-xs font-medium text-slate-900">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            task.status === 'failed' ? 'bg-red-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 任务信息网格 */}
                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">任务类型</p>
                      <p className="text-sm text-slate-900">{task.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">负责人</p>
                      <p className="text-sm text-slate-900">{task.assignee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">创建时间</p>
                      <p className="text-sm text-slate-900">{task.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">更新时间</p>
                      <p className="text-sm text-slate-900">{task.updatedAt}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">输入文件</p>
                      <p className="text-sm text-slate-900 truncate" title={task.input}>{task.input}</p>
                    </div>
                  </div>

                  {/* 审核备注 */}
                  {task.reviewNote && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <p className="text-sm font-medium text-yellow-900 mb-1">审核备注</p>
                      <p className="text-sm text-yellow-700">{task.reviewNote}</p>
                    </div>
                  )}

                  {/* 错误信息 */}
                  {task.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                      <p className="text-sm font-medium text-red-900 mb-1">错误信息</p>
                      <p className="text-sm text-red-700">{task.error}</p>
                    </div>
                  )}

                  {/* 执行日志 */}
                  {task.logs.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-900">执行日志</p>
                        <button className="text-xs text-blue-600 hover:text-blue-700">查看完整日志</button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {task.logs.map((log, index) => (
                          <div key={index} className="flex gap-3 text-xs">
                            <span className="text-slate-500 flex-shrink-0">{log.time}</span>
                            <span className="text-slate-700">{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-center gap-2 mt-6">
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
