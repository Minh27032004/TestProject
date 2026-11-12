import { getJson } from '../../lib/api';
import type { AssignmentsResponse } from './assignments.types';

export function getMyAssignments(signal: AbortSignal) {
  return getJson<AssignmentsResponse>('/api/me/assignments', signal);
}
