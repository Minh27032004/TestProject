import { Icon } from '../../components/Icon';
import type { AssignmentStatus as Status } from './assignments.types';

export const statusLabels: Record<Status, string> = {
  not_submitted: 'Chưa nộp',
  overdue: 'Quá hạn',
  submitted: 'Đã nộp',
};

export function AssignmentStatus({ status, isLate }: { status: Status; isLate: boolean }) {
  return (
    <div className="status-group">
      <span className={`status-badge status-${status}`}>
        {status === 'submitted' ? <Icon name="check" size={14} /> : <span className="status-dot" />}
        {statusLabels[status]}
      </span>
      {isLate && (
        <span className="late-label">
          <Icon name="clock" size={12} />
          Nộp trễ
        </span>
      )}
    </div>
  );
}
