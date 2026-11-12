// Public API contract only. Ownership and source fixtures stay in the backend.
export type AssignmentStatus = 'not_submitted' | 'overdue' | 'submitted';
export type AssignmentSkill = 'Reading' | 'Listening' | 'Writing' | 'Speaking';

export type Assignment = {
  id: string;
  title: string;
  skill: AssignmentSkill;
  dueAt: string;
  submittedAt: string | null;
  status: AssignmentStatus;
  isLate: boolean;
};

export type AssignmentsResponse = {
  student: { id: string; name: string };
  referenceTime: string;
  items: Assignment[];
};
