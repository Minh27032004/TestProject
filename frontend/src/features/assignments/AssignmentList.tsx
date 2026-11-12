import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { AssignmentCard } from './AssignmentCard';
import { statusLabels } from './AssignmentStatus';
import type { Assignment, AssignmentStatus } from './assignments.types';

type Filter = 'all' | AssignmentStatus;
const filters: Filter[] = ['all', 'not_submitted', 'overdue', 'submitted'];

export function AssignmentList({
  items,
  studentName,
}: {
  items: Assignment[];
  studentName: string;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const visibleItems = items.filter((item) => filter === 'all' || item.status === filter);

  return (
    <section className="assignments-section" id="assignments" aria-labelledby="list-heading">
      <div className="section-heading">
        <div>
          <h2 id="list-heading">
            Danh sách bài tập <span>{items.length}</span>
          </h2>
          <p>Tất cả bài tập trong lộ trình Foundation của bạn.</p>
        </div>
        <span className="timezone-note">
          <Icon name="clock" size={14} />
          Giờ Việt Nam · GMT+7
        </span>
      </div>
      <div className="filter-bar" role="group" aria-label="Lọc bài tập theo trạng thái">
        {filters.map((value) => (
          <button
            className="filter-button"
            type="button"
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === 'all' ? 'Tất cả' : statusLabels[value]}
            <span>
              {value === 'all'
                ? items.length
                : items.filter((item) => item.status === value).length}
            </span>
          </button>
        ))}
      </div>
      <div className="assignment-list">
        <div className="list-header" aria-hidden="true">
          <span>BÀI TẬP</span>
          <span>HẠN NỘP</span>
          <span>TRẠNG THÁI</span>
          <span>THỜI GIAN NỘP</span>
        </div>
        {visibleItems.length > 0 ? (
          <ul className="assignment-items">
            {visibleItems.map((assignment) => (
              <li key={assignment.id}>
                <AssignmentCard assignment={assignment} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <span className="empty-icon">
              <Icon name="book" size={28} />
            </span>
            <h3>
              {items.length === 0 ? 'Bạn chưa có bài tập nào' : 'Không có bài tập ở trạng thái này'}
            </h3>
            <p>
              {items.length === 0
                ? 'Bài tập được giao sẽ xuất hiện tại đây.'
                : 'Chọn trạng thái khác để xem các bài tập còn lại.'}
            </p>
            {items.length > 0 && (
              <button className="text-button" onClick={() => setFilter('all')}>
                Xem tất cả bài tập <Icon name="arrow" size={16} />
              </button>
            )}
          </div>
        )}
      </div>
      <p className="list-caption" role="status" aria-live="polite">
        Hiển thị {visibleItems.length} trên {items.length} bài tập{' '}
        <span>Chỉ bài tập của {studentName}</span>
      </p>
    </section>
  );
}
