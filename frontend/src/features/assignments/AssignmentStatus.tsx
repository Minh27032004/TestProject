import { Badge, type BadgeVariant } from '@astryxdesign/core/Badge';
import { Icon } from '../../components/Icon';
import type { AssignmentStatus as Status } from './assignments.types';

export const statusLabels: Record<Status, string> = {
  not_submitted: 'Chưa nộp',
  overdue: 'Quá hạn',
  submitted: 'Đã nộp',
};
const variants: Record<Status, BadgeVariant> = {
  not_submitted: 'neutral',
  overdue: 'error',
  submitted: 'success',
};

export function AssignmentStatus({ status, isLate }: { status: Status; isLate: boolean }) {
  return (
    <div className="status-group">
      <Badge
        className="assignment-badge"
        data-submission-state={status}
        variant={variants[status]}
        label={statusLabels[status]}
        icon={status === 'submitted' ? <Icon name="check" size={13} /> : undefined}
      />
      {isLate && (
        <span className="late-label">
          <Icon name="clock" size={12} />
          Nộp trễ
        </span>
      )}
    </div>
  );
}
