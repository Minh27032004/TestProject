import { Button } from '@astryxdesign/core/Button';
import { Icon } from '../../components/Icon';
import { AssignmentList } from './AssignmentList';
import { AssignmentOverview } from './AssignmentOverview';
import { formatDate, formatTime } from './date-format';
import { useAssignments } from './useAssignments';

export function AssignmentsPage() {
  const { state, retry } = useAssignments();

  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">
        Đến nội dung chính
      </a>
      <header className="app-header">
        <div className="header-inner">
          <a className="brand" href="#main-content" aria-label="IELTS Master, đến nội dung chính">
            <span className="brand-mark">
              <Icon name="book" size={23} />
            </span>
            <span>
              IELTS<span className="brand-master">Master</span>
            </span>
          </a>
          <nav className="main-nav" aria-label="Điều hướng chính">
            <a href="#assignments" aria-current="page">
              Bài tập của tôi
            </a>
          </nav>
          <div className="student-profile">
            <span>{state.phase === 'success' ? state.data.student.name : 'Học viên'}</span>
            <span className="avatar">
              {state.phase === 'success' ? state.data.student.id : 'HV'}
            </span>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <div className="breadcrumb" aria-label="Khoá học">
          <span>Khoá học</span>
          <Icon name="chevron" size={13} />
          <strong>Foundation</strong>
        </div>
        <div className="page-heading">
          <div>
            <h1>Bài tập của tôi</h1>
            <p className="page-description">Các bài tập được giao trong khoá Foundation.</p>
          </div>
          {state.phase === 'success' && <AssignmentOverview items={state.data.items} />}
        </div>

        {state.phase === 'loading' && (
          <section className="feedback-state" role="status" aria-live="polite">
            <span className="loading-spinner" />
            <h2>Đang tải bài tập…</h2>
            <p>Vui lòng chờ trong giây lát.</p>
          </section>
        )}
        {state.phase === 'error' && (
          <section className="feedback-state" role="alert">
            <span className="feedback-icon">
              <Icon name="alert" size={27} />
            </span>
            <h2>Chưa tải được bài tập</h2>
            <p>Kiểm tra kết nối mạng rồi thử tải lại.</p>
            <Button
              className="retry-button"
              label="Thử lại"
              variant="primary"
              size="lg"
              onClick={retry}
            />
          </section>
        )}
        {state.phase === 'success' && (
          <>
            <AssignmentList items={state.data.items} studentName={state.data.student.name} />
            <aside className="reference-note" aria-label="Thời điểm đối chiếu">
              <Icon name="calendar" size={15} />
              <p>
                Thời điểm đối chiếu:{' '}
                <time dateTime={state.data.referenceTime}>
                  {formatDate(state.data.referenceTime)} · {formatTime(state.data.referenceTime)}{' '}
                  (GMT+7)
                </time>
              </p>
            </aside>
          </>
        )}
      </main>

      <footer className="page-footer">
        <span>IELTS Master</span>
        <span>Không gian học tập của bạn</span>
      </footer>
    </div>
  );
}
