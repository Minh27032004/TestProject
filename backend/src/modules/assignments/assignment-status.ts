import type { Assignment, SubmissionState } from './assignment.types.js';

export function evaluateAssignmentStatus(
  assignment: Pick<Assignment, 'dueAt' | 'submittedAt'>,
  now: Date,
): SubmissionState {
  const dueTime = Date.parse(assignment.dueAt);

  // Submitted work stays submitted even after its deadline has passed.
  if (assignment.submittedAt !== null) {
    return {
      status: 'submitted',
      isLate: Date.parse(assignment.submittedAt) > dueTime,
    };
  }

  return {
    status: now.getTime() > dueTime ? 'overdue' : 'not_submitted',
    isLate: false,
  };
}
