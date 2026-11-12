import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import type { Assignment } from './assignments.types';

export function AssignmentOverview({ items }: { items: Assignment[] }) {
  const submitted = items.filter((item) => item.status === 'submitted').length;
  const progress = items.length ? Math.round((submitted / items.length) * 100) : 0;

  return (
    <section className="assignment-progress" aria-label="Tổng quan bài tập">
      <div>
        <span>Tiến độ nộp bài</span>
        <strong>
          {submitted}/{items.length} <span>bài đã nộp</span>
        </strong>
      </div>
      <ProgressBar label="Tiến độ nộp bài" value={progress} isLabelHidden variant="accent" />
    </section>
  );
}
