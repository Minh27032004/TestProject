import { Router } from 'express';
import { getCurrentStudent } from '../../auth/mock-session.js';
import { REFERENCE_TIME } from '../../config/mock-clock.js';
import { listAssignmentsForStudent } from './assignments.service.js';

export const assignmentsRouter = Router();

assignmentsRouter.get('/', (_request, response) => {
  const student = getCurrentStudent();

  response.json({
    student,
    referenceTime: REFERENCE_TIME,
    items: listAssignmentsForStudent(student.id, new Date(REFERENCE_TIME)),
  });
});
