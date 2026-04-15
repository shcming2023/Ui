type StatusType =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reviewing'
  | 'published'
  | 'draft';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: '待处理', className: 'bg-slate-100 text-slate-700' },
  processing: { label: '处理中', className: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-700' },
  failed: { label: '失败', className: 'bg-red-100 text-red-700' },
  reviewing: { label: '待审核', className: 'bg-yellow-100 text-yellow-700' },
  published: { label: '已发布', className: 'bg-emerald-100 text-emerald-700' },
  draft: { label: '草稿', className: 'bg-slate-100 text-slate-600' },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
