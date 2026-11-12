import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: 'Không tìm thấy endpoint.' });
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Có lỗi xảy ra ở máy chủ.' });
};
