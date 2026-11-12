import assert from 'node:assert/strict';
import { test } from 'node:test';
import { listAssignmentsForStudent } from '../src/modules/assignments/assignments.service.js';

const now = new Date('2026-11-11T09:00:00+07:00');

test('S01 gets exactly A01-A04 with the four expected states', () => {
  const items = listAssignmentsForStudent('S01', now);
  assert.deepEqual(
    items.map(({ id, status, isLate }) => ({ id, status, isLate })),
    [
      { id: 'A01', status: 'not_submitted', isLate: false },
      { id: 'A02', status: 'overdue', isLate: false },
      { id: 'A03', status: 'submitted', isLate: false },
      { id: 'A04', status: 'submitted', isLate: true },
    ],
  );
  assert.ok(items.every((item) => !('studentId' in item)));
});

test('S02 fixture exists independently and an unknown student has no assignments', () => {
  assert.deepEqual(
    listAssignmentsForStudent('S02', now).map((item) => item.id),
    ['B01'],
  );
  assert.deepEqual(listAssignmentsForStudent('unknown', now), []);
});
