import { useState } from 'react';
import { Tag, Trash2, ToggleLeft, ToggleRight, Settings, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/appContext';

const TAG_COLOR_CLASSES: Record<string, string> = {
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  pink:   'bg-pink-50 text-pink-700 border-pink-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  teal:   'bg-teal-50 text-teal-700 border-teal-200',
  cyan:   'bg-cyan-50 text-cyan-700 border-cyan-200',
  lime:   'bg-lime-50 text-lime-700 border-lime-200',
};

type ActiveTab = 'tags' | 'rules';

export function MetadataManagementPage() {
  const { state, dispatch } = useAppStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>('tags');
  const [tagSearch, setTagSearch] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());
  const [selectedRuleIds, setSelectedRuleIds] = useState<Set<number>>(new Set());

  // ——— 标签 ———
  const filteredTags = state.flexibleTags.filter(
    (t) =>
      !tagSearch.trim() ||
      t.name.toLowerCase().includes(tagSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const toggleTagSelect = (id: number) =>
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleDeleteTags = () => {
    if (selectedTagIds.size === 0) return;
    dispatch({ type: 'DELETE_FLEXIBLE_TAG', payload: Array.from(selectedTagIds) });
    setSelectedTagIds(new Set());
    toast.success(`已删除 ${selectedTagIds.size} 个标签`);
  };

  // ——— AI 规则 ———
  const toggleRuleSelect = (id: number) =>
    setSelectedRuleIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleToggleRule = (id: number) => {
    dispatch({ type: 'TOGGLE_AI_RULE', payload: { id } });
  };

  const handleDeleteRules = () => {
    if (selectedRuleIds.size === 0) return;
    dispatch({ type: 'DELETE_AI_RULE', payload: Array.from(selectedRuleIds) });
    setSelectedRuleIds(new Set());
    toast.success(`已删除 ${selectedRuleIds.size} 条规则`);
  };

  const { aiRuleSettings } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* ── 页面头部 ─────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">元数据管理</h1>
          <p className="text-slate-500 text-sm">管理灵活标签与 AI 自动标注规则</p>
        </div>

        {/* ── Tab 切换 ─────────────────────────────────── */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'tags'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Tag size={15} /> 标签管理
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'rules'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings size={15} /> AI 规则
          </button>
        </div>

        {/* ===== 标签管理 ===== */}
        {activeTab === 'tags' && (
          <div className="space-y-5">
            {/* 搜索 + 操作 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="搜索标签名称或分类..."
                    className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm bg-slate-50"
                  />
                </div>
                {selectedTagIds.size > 0 && (
                  <button
                    onClick={handleDeleteTags}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-medium transition-colors"
                  >
                    <Trash2 size={14} /> 删除 ({selectedTagIds.size})
                  </button>
                )}
              </div>
            </div>

            {/* 标签表格 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="w-10 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedTagIds.size === filteredTags.length && filteredTags.length > 0}
                        onChange={(e) =>
                          setSelectedTagIds(e.target.checked ? new Set(filteredTags.map((t) => t.id)) : new Set())
                        }
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide">标签名称</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide">分类</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-xs uppercase tracking-wide">使用次数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTags.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-14 text-slate-400">暂无标签</td>
                    </tr>
                  )}
                  {filteredTags.map((tag) => {
                    const colorClass = TAG_COLOR_CLASSES[tag.color] ?? 'bg-slate-50 text-slate-600 border-slate-200';
                    return (
                      <tr key={tag.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selectedTagIds.has(tag.id)}
                            onChange={() => toggleTagSelect(tag.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-full ${colorClass}`}>
                            {tag.name}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{tag.category}</td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">{tag.count.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== AI 规则 ===== */}
        {activeTab === 'rules' && (
          <div className="space-y-5">
            {/* 规则执行设置 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-500" />
                执行设置
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { key: 'autoOnUpload',       label: '上传后自动执行' },
                  { key: 'parallelExecution',   label: '并行执行规则' },
                  { key: 'requireManualReview', label: '需要人工审核' },
                  { key: 'lowConfidenceAlert',  label: '低置信度告警' },
                ].map((item) => {
                  const val = aiRuleSettings[item.key as keyof typeof aiRuleSettings] as boolean;
                  return (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <button
                        onClick={() =>
                          dispatch({ type: 'UPDATE_AI_RULE_SETTINGS', payload: { [item.key]: !val } })
                        }
                      >
                        {val ? (
                          <ToggleRight size={24} className="text-blue-600" />
                        ) : (
                          <ToggleLeft size={24} className="text-slate-400" />
                        )}
                      </button>
                    </label>
                  );
                })}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-700">置信度阈值</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={50}
                      max={100}
                      value={aiRuleSettings.confidenceThreshold}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_AI_RULE_SETTINGS',
                          payload: { confidenceThreshold: Number(e.target.value) },
                        })
                      }
                      className="w-24 accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-slate-800 w-10 text-right">
                      {aiRuleSettings.confidenceThreshold}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 规则列表头 */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">共 {state.aiRules.length} 条规则</p>
              {selectedRuleIds.size > 0 && (
                <button
                  onClick={handleDeleteRules}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-medium transition-colors"
                >
                  <Trash2 size={14} /> 删除 ({selectedRuleIds.size})
                </button>
              )}
            </div>

            {/* 规则卡片 */}
            <div className="space-y-3">
              {state.aiRules.length === 0 && (
                <div className="text-center py-14 text-slate-400 bg-white rounded-2xl border border-slate-200">暂无规则</div>
              )}
              {state.aiRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm ${
                    rule.enabled ? 'border-slate-200' : 'border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedRuleIds.has(rule.id)}
                      onChange={() => toggleRuleSelect(rule.id)}
                      className="rounded mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            P{rule.priority}
                          </span>
                          <p className="text-sm font-semibold text-slate-800">{rule.name}</p>
                        </div>
                        <button onClick={() => handleToggleRule(rule.id)}>
                          {rule.enabled ? (
                            <ToggleRight size={24} className="text-blue-600" />
                          ) : (
                            <ToggleLeft size={24} className="text-slate-400" />
                          )}
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 block mb-0.5">条件</span>
                          <span className="text-slate-600">{rule.condition}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                          <span className="text-slate-400 block mb-0.5">动作</span>
                          <span className="text-slate-600">{rule.action}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-4 text-xs text-slate-400">
                        <span>执行 {rule.executedCount.toLocaleString()} 次</span>
                        <span>成功率 {rule.successRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
