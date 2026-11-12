import express from 'express';
import { healthRouter } from './modules/health/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { assignmentsRouter } from './modules/assignments/assignments.routes.js';

export const app = express();

app.disable('x-powered-by');
app.use('/api', (_request, response, next) => {
  response.setHeader('Cache-Control', 'private, no-store');
  next();
});
app.use('/api/health', healthRouter);
app.use('/api/me/assignments', assignmentsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
