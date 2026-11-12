import type { Assignment } from './assignment.types.js';

// This module belongs to the backend only, including the S02 isolation fixture.
export const assignments: readonly Assignment[] = [
  {
    id: 'A01',
    studentId: 'S01',
    title: 'Foundation U1 – Reading',
    skill: 'Reading',
    dueAt: '2026-11-13T23:59:00+07:00',
    submittedAt: null,
  },
  {
    id: 'A02',
    studentId: 'S01',
    title: 'Foundation U2 – Listening',
    skill: 'Listening',
    dueAt: '2026-11-09T23:59:00+07:00',
    submittedAt: null,
  },
  {
    id: 'A03',
    studentId: 'S01',
    title: 'Foundation U3 – Writing',
    skill: 'Writing',
    dueAt: '2026-11-10T23:59:00+07:00',
    submittedAt: '2026-11-10T20:00:00+07:00',
  },
  {
    id: 'A04',
    studentId: 'S01',
    title: 'Foundation U4 – Speaking',
    skill: 'Speaking',
    dueAt: '2026-11-08T23:59:00+07:00',
    submittedAt: '2026-11-10T12:00:00+07:00',
  },
  {
    id: 'B01',
    studentId: 'S02',
    title: 'Foundation U1 – Reading',
    skill: 'Reading',
    dueAt: '2026-11-13T23:59:00+07:00',
    submittedAt: null,
  },
];
