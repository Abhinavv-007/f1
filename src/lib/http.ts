export async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    throw new Error(`Empty response body (${response.status})`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text.slice(0, 200));
  }
}
