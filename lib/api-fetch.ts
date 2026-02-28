/**
 * Shared fetch utility for API routes proxying to the Manemus backend.
 * Provides consistent timeouts, error handling, and headers.
 */

export const MANEMUS_URL =
  process.env.MIND_API_URL ||
  process.env.MANEMUS_URL ||
  'https://api.mindprotocol.ai';

const DEFAULT_TIMEOUT_MS = 15_000; // 15 seconds

/**
 * Fetch from the Manemus backend with a timeout.
 * Throws if the request times out or fails.
 */
export async function manemusFetch(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = init || {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${MANEMUS_URL}${path}`, {
      ...fetchInit,
      signal: controller.signal,
      headers: {
        ...fetchInit.headers,
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch JSON from Manemus with timeout and automatic JSON parsing.
 * Returns { data, status } on success or throws on network/timeout error.
 */
export async function manemusFetchJson<T = unknown>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<{ data: T; status: number }> {
  const res = await manemusFetch(path, init);
  const data = await res.json() as T;
  return { data, status: res.status };
}
