import { cn } from "@/lib/utils";
import { GrievanceStatus, Priority } from "@/contexts/GrievanceContext";

interface StatusBadgeProps {
  status: GrievanceStatus;
  className?: string;
}

const statusConfig: Record<GrievanceStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  escalated: {
    label: 'Escalated',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  medium: {
    label: 'Medium',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
