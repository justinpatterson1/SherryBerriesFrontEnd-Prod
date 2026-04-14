/**
 * Simple in-memory rate limiter using a sliding window per IP.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60000, max: 5 });
 *
 *   export async function POST(req) {
 *     const limited = limiter(req);
 *     if (limited) return limited;
 *     // ... handle request
 *   }
 */

const stores = new Map();

export function createRateLimiter({ windowMs = 60_000, max = 5 } = {}) {
  // Each limiter instance gets its own store keyed by a unique id
  const id = Symbol();
  stores.set(id, new Map());

  return function rateLimit(req) {
    const store = stores.get(id);
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const now = Date.now();

    // Get or create entry for this IP
    let entry = store.get(ip);
    if (!entry || now - entry.windowStart > windowMs) {
      entry = { windowStart: now, count: 0 };
      store.set(ip, entry);
    }

    entry.count++;

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfter) }
        }
      );
    }

    // Clean up stale entries periodically (every 100 requests)
    if (entry.count === 1 && store.size > 1000) {
      for (const [key, val] of store) {
        if (now - val.windowStart > windowMs) store.delete(key);
      }
    }

    return null; // Not rate-limited
  };
}
