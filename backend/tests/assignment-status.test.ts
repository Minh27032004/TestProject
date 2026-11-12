import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateAssignmentStatus } from '../src/modules/assignments/assignment-status.js';

const now = new Date('2026-11-11T09:00:00+07:00');

const cases = [
  {
    name: 'A01: unsubmitted work before its deadline',
    dueAt: '2026-11-13T23:59:00+07:00',
    submittedAt: null,
    expected: { status: 'not_submitted', isLate: false },
  },
  {
    name: 'A02: unsubmitted work after its deadline',
    dueAt: '2026-11-09T23:59:00+07:00',
    submittedAt: null,
    expected: { status: 'overdue', isLate: false },
  },
  {
    name: 'A03: work submitted before its deadline remains submitted',
    dueAt: '2026-11-10T23:59:00+07:00',
    submittedAt: '2026-11-10T20:00:00+07:00',
    expected: { status: 'submitted', isLate: false },
  },
  {
    name: 'A04: work submitted after its deadline is also late',
    dueAt: '2026-11-08T23:59:00+07:00',
    submittedAt: '2026-11-10T12:00:00+07:00',
    expected: { status: 'submitted', isLate: true },
  },
  {
    name: 'unsubmitted work exactly at the deadline is not overdue',
    dueAt: '2026-11-11T09:00:00+07:00',
    submittedAt: null,
    expected: { status: 'not_submitted', isLate: false },
  },
  {
    name: 'submission exactly at the deadline is on time',
    dueAt: '2026-11-10T23:59:00+07:00',
    submittedAt: '2026-11-10T23:59:00+07:00',
    expected: { status: 'submitted', isLate: false },
  },
  {
    name: 'submission one millisecond after the deadline is late',
    dueAt: '2026-11-10T23:59:00+07:00',
    submittedAt: '2026-11-10T23:59:00.001+07:00',
    expected: { status: 'submitted', isLate: true },
  },
  {
    name: 'different offsets representing the same instant compare equally',
    dueAt: '2026-11-11T02:00:00Z',
    submittedAt: '2026-11-11T09:00:00+07:00',
    expected: { status: 'submitted', isLate: false },
  },
] as const;

for (const { name, dueAt, submittedAt, expected } of cases) {
  test(name, () => {
    assert.deepEqual(evaluateAssignmentStatus({ dueAt, submittedAt }, now), expected);
  });
}

test('unsubmitted work one millisecond past the deadline is overdue', () => {
  assert.deepEqual(
    evaluateAssignmentStatus(
      { dueAt: '2026-11-11T09:00:00+07:00', submittedAt: null },
      new Date('2026-11-11T09:00:00.001+07:00'),
    ),
    { status: 'overdue', isLate: false },
  );
});
