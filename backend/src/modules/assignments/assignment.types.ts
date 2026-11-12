export type AssignmentSkill = 'Reading' | 'Listening' | 'Writing' | 'Speaking';
export type AssignmentStatus = 'not_submitted' | 'overdue' | 'submitted';

export type Assignment = Readonly<{
  id: string;
  studentId: string;
  title: string;
  skill: AssignmentSkill;
  dueAt: string;
  submittedAt: string | null;
}>;

export type SubmissionState = {
  status: AssignmentStatus;
  isLate: boolean;
};

export type AssignmentDto = Omit<Assignment, 'studentId'> & SubmissionState;
