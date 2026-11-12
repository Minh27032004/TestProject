import { assignments } from './assignments.data.js';
import { evaluateAssignmentStatus } from './assignment-status.js';
import type { AssignmentDto } from './assignment.types.js';

export function listAssignmentsForStudent(studentId: string, now: Date): AssignmentDto[] {
  return assignments
    .filter((assignment) => assignment.studentId === studentId)
    .map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      skill: assignment.skill,
      dueAt: assignment.dueAt,
      submittedAt: assignment.submittedAt,
      ...evaluateAssignmentStatus(assignment, now),
    }));
}
