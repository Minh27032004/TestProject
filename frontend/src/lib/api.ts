export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { signal });

  if (!response.ok) {
    throw new Error(`Yêu cầu thất bại (HTTP ${response.status}).`);
  }

  return response.json() as Promise<T>;
}
