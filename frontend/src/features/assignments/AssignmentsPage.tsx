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
      <aside className="sidebar" aria-label="Không gian học tập">
        <a className="brand" href="#main-content" aria-label="IELTS Master, đến nội dung chính">
          <span className="brand-mark">
            <Icon name="book" size={24} />
          </span>
          <span>
            IELTS<span className="brand-second">MASTER</span>
          </span>
        </a>
        <p className="nav-label">KHÔNG GIAN HỌC TẬP</p>
        <nav aria-label="Điều hướng chính">
          <a className="nav-item" href="#assignments" aria-current="page">
            <Icon name="grid" size={19} />
            Bài tập của tôi
            <span className="nav-indicator" />
          </a>
        </nav>
        <div className="sidebar-note">
          <span className="note-line" />
          <p>
            Học đều mỗi ngày.
            <br />
            <strong>Tiến xa từng bước.</strong>
          </p>
          <span>YOUR LEARNING JOURNEY</span>
        </div>
        <div className="sidebar-footer">
          <span className="live-dot" />
          Không gian học tập cá nhân
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>
            Lộ trình học tập <span className="breadcrumb-divider">/</span>{' '}
            <strong>Foundation</strong>
          </span>
          <div className="student-profile">
            <span>{state.phase === 'success' ? state.data.student.name : 'Học viên'}</span>
            <span className="avatar">
              {state.phase === 'success' ? state.data.student.id : 'HV'}
            </span>
          </div>
        </header>
        <main id="main-content" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <p className="eyebrow">HỌC TẬP CÓ MỤC TIÊU</p>
              <h1>
                Bài tập của tôi<span>.</span>
              </h1>
              <p className="page-description">
                Theo dõi bài tập, giữ nhịp học và nhìn thấy tiến bộ mỗi ngày.
              </p>
            </div>
            <span className="course-label">
              <span />
              FOUNDATION
            </span>
          </div>
          {state.phase === 'loading' && (
            <section className="loading-state" role="status" aria-live="polite">
              <span className="loading-spinner" />
              <h2>Đang tải bài tập…</h2>
              <p>Đang chuẩn bị không gian học tập của bạn.</p>
            </section>
          )}
          {state.phase === 'error' && (
            <section className="error-state" role="alert">
              <span className="error-icon">
                <Icon name="alert" size={28} />
              </span>
              <h2>Chưa tải được bài tập</h2>
              <p>Vui lòng kiểm tra kết nối và thử lại sau một chút.</p>
              <button className="primary-button" type="button" onClick={retry}>
                Thử lại <Icon name="arrow" size={17} />
              </button>
            </section>
          )}
          {state.phase === 'success' && (
            <>
              <AssignmentOverview items={state.data.items} />
              <AssignmentList items={state.data.items} studentName={state.data.student.name} />
              <aside className="reference-note" aria-label="Thời điểm đối chiếu">
                <span className="reference-icon">
                  <Icon name="calendar" size={20} />
                </span>
                <div>
                  <strong>Thời điểm đối chiếu</strong>
                  <p>
                    Trạng thái được xác định tại{' '}
                    <time dateTime={state.data.referenceTime}>
                      {formatDate(state.data.referenceTime)} ·{' '}
                      {formatTime(state.data.referenceTime)} (GMT+7)
                    </time>
                    .
                  </p>
                </div>
              </aside>
            </>
          )}
        </main>
        <footer className="page-footer">
          <span>
            IELTS MASTER <span className="footer-divider">/</span> E-LEARNING
          </span>
          <span>Kiên trì hôm nay. Tự tin ngày mai.</span>
        </footer>
      </div>
    </div>
  );
}
