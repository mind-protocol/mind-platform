/**
 * In-memory sliding-window rate limiter for API routes.
 *
 * NOTE: On Vercel serverless, each instance has its own memory.
 * This provides per-instance protection — not globally consistent,
 * but still effective against single-origin floods.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup when store grows too large (memory pressure)
const MAX_KEYS = 5000;

function cleanup(windowMs: number) {
  if (store.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

/**
 * Check if a request should be rate-limited.
 * Returns { limited: false } or { limited: true, retryAfter: seconds }.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { limited: false } | { limited: true; retryAfter: number } {
  const now = Date.now();

  cleanup(windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { limited: true, retryAfter };
  }

  entry.timestamps.push(now);
  return { limited: false };
}
