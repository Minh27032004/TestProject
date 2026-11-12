import { useEffect, useState } from 'react';
import { getMyAssignments } from './assignments.api';
import type { AssignmentsResponse } from './assignments.types';

type AssignmentsState =
  { phase: 'loading' } | { phase: 'success'; data: AssignmentsResponse } | { phase: 'error' };

export function useAssignments() {
  const [state, setState] = useState<AssignmentsState>({ phase: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getMyAssignments(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ phase: 'success', data });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ phase: 'error' });
      });
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ phase: 'loading' });
    setAttempt((value) => value + 1);
  }

  return { state, retry };
}
