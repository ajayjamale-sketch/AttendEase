import { AttendanceStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: AttendanceStatus | 'Active' | 'Inactive';
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<string, string> = {
  Present: 'status-present',
  Absent: 'status-absent',
  Late: 'status-late',
  Leave: 'status-leave',
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'
    )}>
      {status}
    </span>
  );
}
