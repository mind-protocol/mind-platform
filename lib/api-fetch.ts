/**
 * Shared fetch utility for API routes proxying to the Mind Home backend.
 * Provides consistent timeouts, error handling, and headers.
 */

export const MIND_HOME_URL =
  process.env.MIND_API_URL ||
  process.env.MIND_HOME_URL ||
  'https://api.mindprotocol.ai';

const DEFAULT_TIMEOUT_MS = 15_000; // 15 seconds

/**
 * Fetch from the Mind Home backend with a timeout.
 * Throws if the request times out or fails.
 */
export async function mindFetch(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = init || {};

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${MIND_HOME_URL}${path}`, {
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
 * Fetch JSON from Mind Home with timeout and automatic JSON parsing.
 * Returns { data, status } on success or throws on network/timeout error.
 */
export async function mindFetchJson<T = unknown>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<{ data: T; status: number }> {
  const res = await mindFetch(path, init);
  const data = await res.json() as T;
  return { data, status: res.status };
}
