# IELTS Master — Bài tập của tôi

Ứng dụng bài test Junior Full-stack Developer: hiển thị bài tập của học viên S01, phân biệt chưa nộp, quá hạn, đã nộp và nộp trễ. React + TypeScript ở frontend, Express + TypeScript ở backend, quản lý bằng npm workspaces.

## Chạy ứng dụng

Yêu cầu Node.js **>= 22.12.0** và npm; đã kiểm tra bằng Node.js 24.13.0.

```sh
npm ci
npm run dev
```

- Giao diện: http://localhost:5173
- API: http://127.0.0.1:3001/api/me/assignments
- Health: http://127.0.0.1:3001/api/health

Trên PowerShell, dùng `npm.cmd`/`npx.cmd` nếu execution policy chặn script `.ps1`. Không cần `.env`, database hoặc tài khoản nội bộ.

Frontend gọi `/api`; Vite proxy chuyển request tới backend. Có thể đổi cổng backend bằng biến môi trường `PORT` và đổi đích proxy bằng `API_PROXY_TARGET` khi chạy frontend. Mặc định backend chỉ lắng nghe trên `127.0.0.1` để chạy local.

## Kiến trúc

```text
frontend/src/
  app/                         Điểm ghép giao diện
  components/Icon.tsx          Bộ icon SVG dùng chung
  features/assignments/
    assignments.api.ts         Gọi API của học viên hiện tại
    assignments.types.ts       Kiểu dữ liệu public của API
    useAssignments.ts          Loading, success, error và retry
    AssignmentsPage.tsx         Trang chính
    AssignmentOverview.tsx     Thống kê và tiến độ
    AssignmentList.tsx         Bộ lọc trạng thái và danh sách
    AssignmentCard.tsx         Nội dung từng bài
    AssignmentStatus.tsx       Nhãn trạng thái
    date-format.ts             Định dạng ngày giờ GMT+7
  lib/api.ts                   HTTP helper, timeout và huỷ request
  styles/                      Bố cục responsive
backend/src/
  auth/mock-session.ts         Danh tính S01 giả lập tại server
  config/mock-clock.ts         Thời điểm đối chiếu cố định
  modules/assignments/
    assignments.data.ts        Đủ năm bản ghi S01/S02 của đề
    assignment-status.ts       Hàm thuần tính trạng thái
    assignments.service.ts     Lọc dữ liệu và tạo DTO
    assignments.routes.ts      GET /api/me/assignments
  middleware/                  Lỗi JSON và 404
  app.ts                       Khai báo Express, không tự mở cổng
  server.ts                    Khởi động và đóng server
backend/tests/                 Unit và HTTP integration tests
e2e/                          Playwright tests
```

Luồng chính: **React → API → danh tính server → lọc bài của S01 → tính trạng thái → DTO → giao diện**. Backend giữ nghiệp vụ; frontend chỉ trình bày trạng thái, thống kê và lọc trên các bài đã được phép nhận.

Tách frontend/backend theo yêu cầu project nhưng giữ một lockfile để cài và chạy thuận tiện. Chưa cần database, generic repository hoặc state management library cho một luồng đọc dữ liệu nhỏ.

## Quy tắc và kết quả

Thời điểm đối chiếu luôn là **11/11/2026 09:00 GMT+7**, lưu bằng `2026-11-11T09:00:00+07:00`. Không dùng thời gian hiện tại của máy để tính trạng thái. Timestamps dùng ISO có offset; giao diện định dạng rõ `Asia/Ho_Chi_Minh`, bất kể múi giờ trình duyệt.

1. Có thời gian nộp → **Đã nộp**.
2. Thời gian nộp lớn hơn hạn nộp → thêm **Nộp trễ**.
3. Chưa nộp và thời điểm đối chiếu lớn hơn hạn → **Quá hạn**.
4. Còn lại → **Chưa nộp**.

Quy ước biên: đúng bằng hạn nộp vẫn đúng hạn; lớn hơn dù 1 ms thì đã qua hạn.

| Bài | Hạn nộp GMT+7    | Kết quả                            |
| --- | ---------------- | ---------------------------------- |
| A01 | 13/11/2026 23:59 | Chưa nộp                           |
| A02 | 09/11/2026 23:59 | Quá hạn                            |
| A03 | 10/11/2026 23:59 | Đã nộp                             |
| A04 | 08/11/2026 23:59 | Đã nộp + Nộp trễ                   |
| B01 | Thuộc S02        | Không xuất hiện trong response S01 |

### Cách tránh lộ dữ liệu S02

Danh tính S01 lấy từ `mock-session.ts` ở server. Route không dùng `studentId` từ URL, query, header hoặc body làm danh tính. Service lọc ownership **trước khi** tạo response, chỉ trả các trường UI cần và không trả trường `studentId` của từng bản ghi. Fixture S02 chỉ tồn tại trong backend, không được import vào frontend hay đặt trong `public/`.

Response `/api` có `Cache-Control: private, no-store`. Đây là danh tính giả lập đúng phạm vi đề, chưa phải cơ chế xác thực thật. Khi dùng thực tế cần thay bằng session đã xác thực.

## Kiểm tra

```sh
npm run check
```

Lệnh trên kiểm tra định dạng, TypeScript, chạy **16 unit/HTTP tests**, sau đó build cả frontend và backend. Unit tests kiểm đủ bốn trường hợp, biên thời gian và offset; HTTP tests thử giả mạo S02 qua query, header, authorization, body và URL khác.

Kiểm thử trình duyệt:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright chạy **8 kịch bản × 2 cấu hình = 16 tests**: desktop Chromium và mobile Chromium. Kiểm tra API thật, bốn trạng thái, lọc bằng bàn phím, loading, lỗi server/thử lại, lỗi mạng, tài khoản rỗng, bộ lọc rỗng và bố cục tới 320px. Trình duyệt dùng múi giờ UTC và America/Los_Angeles để xác minh giao diện vẫn hiển thị giờ Việt Nam.

E2E tự mở server tại cổng **3002/5174**, tách khỏi ứng dụng dev tại 3001/5173. Các cổng kiểm thử phải đang trống. Ảnh giao diện được sinh tại `artifacts/assignments-desktop.png` và `artifacts/assignments-mobile.png`; thư mục này được Git bỏ qua, gửi ảnh riêng kèm bài nộp.

### Kiểm tra thủ công nhanh

1. Mở giao diện: thấy đúng A01–A04; A04 có thêm “Nộp trễ”; tiến độ là 2/4.
2. Chọn bộ lọc: Chưa nộp có 1 bài, Quá hạn có 1 bài, Đã nộp có 2 bài.
3. Mở `/api/me/assignments?studentId=S02`: vẫn chỉ có bốn bài của S01, không có B01.
4. Thu nhỏ màn hình: thông tin hạn và thời gian nộp vẫn đọc được, không tràn ngang.

## Chạy bản build local

```sh
npm run build
npm start
```

Mở terminal khác:

```sh
npm run preview
```

Truy cập http://localhost:4173. Vite preview chỉ để kiểm tra local; triển khai thật cần static hosting cho `frontend/dist` và reverse proxy `/api` tới backend.

## Phạm vi chưa làm

Chưa có đăng nhập/session thật, database, chức năng upload/nộp bài hoặc deploy. E2E đã cấu hình cho Chromium; chưa kiểm thử Firefox, Safari hay thiết bị vật lý. Dữ liệu hoàn toàn giả lập theo đề, không sử dụng dữ liệu thật hoặc secrets.
