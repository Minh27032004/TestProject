import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '../../components/Icon';
import { AssignmentCard } from './AssignmentCard';
import { statusLabels } from './AssignmentStatus';
import type { Assignment, AssignmentStatus } from './assignments.types';

type Filter = 'all' | AssignmentStatus;
const filters: Filter[] = ['all', 'not_submitted', 'overdue', 'submitted'];

function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase('vi-VN')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .trim();
}

export function AssignmentList({
  items,
  studentName,
}: {
  items: Assignment[];
  studentName: string;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const search = normalizeSearch(query);
  const visibleItems = items.filter(
    (item) =>
      (filter === 'all' || item.status === filter) &&
      normalizeSearch(`${item.title} ${item.id}`).includes(search),
  );

  function resetFilters() {
    setFilter('all');
    setQuery('');
  }

  return (
    <section className="assignments-section" id="assignments" aria-labelledby="list-heading">
      <div className="assignment-toolbar">
        <h2 id="list-heading">
          Bài tập được giao <span>{items.length}</span>
        </h2>
        <div className="assignment-search">
          <TextInput
            label="Tìm bài tập"
            isLabelHidden
            placeholder="Tìm tên hoặc mã bài tập…"
            value={query}
            onChange={setQuery}
            startIcon={<Icon name="search" size={17} />}
            size="lg"
            width="100%"
          />
        </div>
      </div>

      <TabList
        className="assignment-tabs"
        role="tablist"
        aria-label="Lọc bài tập theo trạng thái"
        value={filter}
        onChange={(value) => setFilter(value as Filter)}
        size="lg"
        layout="fill"
        hasDivider
      >
        {filters.map((value) => (
          <Tab
            key={value}
            id={`assignment-tab-${value}`}
            value={value}
            label={value === 'all' ? 'Tất cả' : statusLabels[value]}
            panelId="assignment-results"
            endContent={
              <span className="filter-count">
                {value === 'all'
                  ? items.length
                  : items.filter((item) => item.status === value).length}
              </span>
            }
          />
        ))}
      </TabList>

      <div
        id="assignment-results"
        className="assignment-results"
        role="tabpanel"
        aria-labelledby={`assignment-tab-${filter}`}
        tabIndex={0}
      >
        <div className="list-header" aria-hidden="true">
          <span>Bài tập</span>
          <span>Hạn nộp</span>
          <span>Trạng thái</span>
          <span>Thời gian nộp</span>
        </div>
        {visibleItems.length ? (
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
              <Icon name={search ? 'search' : 'book'} size={25} />
            </span>
            <h3>
              {items.length === 0
                ? 'Bạn chưa có bài tập nào'
                : search
                  ? 'Không tìm thấy bài tập'
                  : 'Không có bài tập ở trạng thái này'}
            </h3>
            <p>
              {items.length === 0
                ? 'Bài tập được giao sẽ xuất hiện tại đây.'
                : search
                  ? 'Thử một tên, mã bài tập hoặc trạng thái khác.'
                  : 'Chọn trạng thái khác để xem các bài tập còn lại.'}
            </p>
            {items.length > 0 && (
              <Button
                className="empty-reset"
                label="Xem tất cả bài tập"
                variant="secondary"
                onClick={resetFilters}
              />
            )}
          </div>
        )}
      </div>
      <div className="list-footer">
        <p role="status" aria-live="polite">
          Hiển thị {visibleItems.length} trên {items.length} bài tập
        </p>
        <span>{studentName}</span>
      </div>
    </section>
  );
}
