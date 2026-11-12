import { app } from './app.js';

const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT phải là số nguyên từ 1 đến 65535.');
}

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`Backend đang chạy tại http://127.0.0.1:${port}`);
});

server.on('error', (error) => {
  console.error('Không khởi động được backend:', error.message);
  process.exitCode = 1;
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
