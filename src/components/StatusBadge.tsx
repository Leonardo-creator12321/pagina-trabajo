import { SubmissionStatus } from '@/types/database';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const statusConfig: Record<
  SubmissionStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className:
      'bg-warning/15 text-warning border-warning/30',
  },
  approved: {
    label: 'Approved',
    className:
      'bg-success/15 text-success border-success/30',
  },
  rejected: {
    label: 'Rejected',
    className:
      'bg-danger/15 text-danger border-danger/30',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
