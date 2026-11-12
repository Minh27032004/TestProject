import { useEffect, useState } from 'react';
import { getJson } from '../lib/api';

type ConnectionState = 'loading' | 'connected' | 'error';
type HealthResponse = { status: 'ok'; service: string };

export default function App() {
  const [connection, setConnection] = useState<ConnectionState>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setConnection('loading');

    getJson<HealthResponse>('/api/health', controller.signal)
      .then((data) => {
        setConnection(data.status === 'ok' ? 'connected' : 'error');
      })
      .catch(() => {
        if (!controller.signal.aborted) setConnection('error');
      });

    return () => controller.abort();
  }, [attempt]);

  return (
    <div className="shell">
      <header className="brand">IELTS MASTER <span>E-LEARNING</span></header>
      <main>
        <p className="eyebrow">KHÔNG GIAN HỌC TẬP</p>
        <h1>Bài tập của tôi</h1>
        <p className="intro">Theo dõi bài tập và tiến độ học tập của bạn tại một nơi.</p>
        <section className="panel" aria-labelledby="panel-title">
          <span className="section-number" aria-hidden="true">01</span>
          <h2 id="panel-title">Không gian bài tập</h2>
          <p>Danh sách bài tập sẽ xuất hiện tại đây khi chức năng được hoàn thiện.</p>
        </section>
        <div className="connection" role="status" aria-live="polite">
          <span className={`dot ${connection}`} aria-hidden="true" />
          {connection === 'loading' && 'Đang kết nối dịch vụ…'}
          {connection === 'connected' && 'Đã kết nối dịch vụ'}
          {connection === 'error' && (
            <>
              Chưa kết nối được dịch vụ.
              <button onClick={() => setAttempt((value) => value + 1)}>Thử lại</button>
            </>
          )}
        </div>
      </main>
      <footer>IELTS Master · Học tập mỗi ngày, tiến bộ từng bước.</footer>
    </div>
  );
}
