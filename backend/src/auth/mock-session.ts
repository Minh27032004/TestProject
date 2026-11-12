export function getCurrentStudent() {
  // Exercise-only identity. Replace this with a verified session in production.
  // Never derive the current student from request query, headers or body.
  return { id: 'S01', name: 'Học viên S01' } as const;
}
