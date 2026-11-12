# IELTS Master — Bài tập của tôi

Bộ khung ứng dụng gồm frontend React + TypeScript + Vite và backend Node.js + Express + TypeScript. Hai phần nằm trong npm workspaces, dùng chung một lockfile.

## Yêu cầu

- Node.js >= 22.12.0 (đề xuất Node.js 24 LTS).
- npm đi kèm Node.js.

## Chạy trong môi trường phát triển

Chạy tại thư mục gốc:

```sh
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:3001/api/health

Trên PowerShell nếu execution policy chặn `npm.ps1`, dùng `npm.cmd` thay cho `npm`.

Frontend gọi đường dẫn tương đối `/api`. Vite proxy chuyển request tới backend ở cổng 3001, vì vậy không cần bật CORS cho môi trường local. Không cần tạo file `.env` để chạy mặc định.

## Cấu trúc

```text
frontend/src/
  app/           Thành phần ứng dụng
  lib/           Hàm gọi API dùng chung
  styles/        CSS responsive
backend/src/
  app.ts         Khai báo Express app, tách khỏi bước mở cổng để dễ kiểm thử
  server.ts      Khởi động và đóng server
  middleware/    Xử lý lỗi và endpoint không tồn tại
  modules/       Các module API; hiện có health
```

Khi triển khai bài tập, thêm module `assignments` trong backend, tách route, service, dữ liệu giả lập và hàm tính trạng thái. Chỉ trả dữ liệu của danh tính S01 giả lập ở server; không dùng `studentId` từ client làm danh tính. Thời điểm đối chiếu nghiệp vụ là `2026-11-11T09:00:00+07:00`.

## Kiểm tra và build

```sh
npm run typecheck
npm run build
```

Kiểm tra kết nối bằng trình duyệt hoặc:

```sh
curl http://127.0.0.1:3001/api/health
```

Kết quả mong đợi:

```json
{"status":"ok","service":"ielts-assignments-api"}
```

Sau khi build, chạy hai terminal để kiểm tra bản build local:

```sh
npm start
```

```sh
npm run preview
```

Mở http://localhost:4173. `vite preview` chỉ phục vụ kiểm tra local, không phải production server. Khi deploy cần static hosting cho `frontend/dist` và reverse proxy `/api` tới backend. `PORT` có thể đổi cổng backend; nếu đổi phải cập nhật proxy trong `frontend/vite.config.ts` cho local.

## Phạm vi hiện tại

Đã có cấu hình TypeScript strict, lệnh chạy/build, giao diện khởi đầu, API health và xử lý lỗi JSON. Chưa triển khai danh sách bài tập, dữ liệu mẫu, danh tính S01, logic trạng thái hoặc kiểm thử nghiệp vụ. Đây chưa phải bản nộp hoàn chỉnh của bài test.
