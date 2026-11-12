import { Icon, type IconName } from '../../components/Icon';
import { AssignmentStatus } from './AssignmentStatus';
import { formatDate, formatTime } from './date-format';
import type { Assignment, AssignmentSkill } from './assignments.types';

const skillIcons: Record<AssignmentSkill, IconName> = {
  Reading: 'book',
  Listening: 'headphones',
  Writing: 'pen',
  Speaking: 'mic',
};

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const titleId = `assignment-${assignment.id}`;
  return (
    <article className="assignment-row" aria-labelledby={titleId}>
      <div className="assignment-main">
        <span className={`skill-icon skill-${assignment.skill.toLowerCase()}`}>
          <Icon name={skillIcons[assignment.skill]} size={21} />
        </span>
        <div>
          <h3 id={titleId}>{assignment.title}</h3>
          <p className="assignment-meta">
            <span>{assignment.id}</span>
            <span aria-hidden="true">·</span>
            {assignment.skill}
          </p>
        </div>
      </div>
      <div className={`assignment-deadline ${assignment.status === 'overdue' ? 'is-overdue' : ''}`}>
        <span className="mobile-label">Hạn nộp</span>
        <time dateTime={assignment.dueAt}>
          <strong>{formatDate(assignment.dueAt)}</strong>
          <span>{formatTime(assignment.dueAt)}</span>
        </time>
      </div>
      <div className="assignment-state">
        <span className="mobile-label">Trạng thái</span>
        <AssignmentStatus status={assignment.status} isLate={assignment.isLate} />
      </div>
      <div className="assignment-submission">
        <span className="mobile-label">Thời gian nộp</span>
        {assignment.submittedAt ? (
          <time dateTime={assignment.submittedAt}>
            <strong>{formatDate(assignment.submittedAt)}</strong>
            <span>{formatTime(assignment.submittedAt)}</span>
          </time>
        ) : (
          <span className="no-submission">Chưa có bài nộp</span>
        )}
      </div>
    </article>
  );
}
