import type { CSSProperties } from 'react';
import { Icon, type IconName } from '../../components/Icon';
import type { Assignment } from './assignments.types';

export function AssignmentOverview({ items }: { items: Assignment[] }) {
  const total = items.length;
  const submitted = items.filter((item) => item.status === 'submitted').length;
  const progress = total ? Math.round((submitted / total) * 100) : 0;
  const summary: { label: string; value: number; icon: IconName; tone: string }[] = [
    { label: 'Tổng bài tập', value: total, icon: 'grid', tone: 'neutral' },
    { label: 'Đã nộp', value: submitted, icon: 'check', tone: 'green' },
    {
      label: 'Chưa nộp',
      value: items.filter((item) => item.status === 'not_submitted').length,
      icon: 'clock',
      tone: 'amber',
    },
    {
      label: 'Quá hạn',
      value: items.filter((item) => item.status === 'overdue').length,
      icon: 'alert',
      tone: 'red',
    },
  ];

  return (
    <section className="overview" aria-label="Tổng quan bài tập">
      <div className="summary-grid">
        {summary.map((item) => (
          <div className={`summary-item summary-${item.tone}`} key={item.label}>
            <span className="summary-label">
              <Icon name={item.icon} size={17} />
              {item.label}
            </span>
            <strong>{String(item.value).padStart(2, '0')}</strong>
            <span className="summary-unit">bài tập</span>
          </div>
        ))}
      </div>
      <div className="progress-card">
        <div
          className="progress-ring"
          style={{ '--progress': `${progress}%` } as CSSProperties}
          role="progressbar"
          aria-label="Tiến độ nộp bài"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span>
            {progress}
            <small>%</small>
          </span>
        </div>
        <div>
          <p>Tiến độ của bạn</p>
          <strong>
            {submitted}/{total} bài đã nộp
          </strong>
          <span>Mỗi bước nhỏ đều đáng giá.</span>
        </div>
      </div>
    </section>
  );
}
