// Minimal in-memory rate limiter for development and single-instance deployments.
// For scaled production deployments, rely on infrastructure (Nginx, Cloudflare, Vercel edge rate limiting)
// or an external store like Redis.

type RateLimitRecord = { count: number; expiresAt: number };
const store = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): RateLimitResult {
  const now = Date.now();
  
  // Cleanup expired entries periodically to prevent memory leaks in long-running processes
  if (Math.random() < 0.01) {
    for (const [key, record] of store.entries()) {
      if (record.expiresAt < now) {
        store.delete(key);
      }
    }
  }

  let record = store.get(identifier);
  
  if (!record || record.expiresAt < now) {
    record = { count: 1, expiresAt: now + windowMs };
    store.set(identifier, record);
    return { success: true, limit, remaining: limit - 1, reset: record.expiresAt };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0, reset: record.expiresAt };
  }

  record.count += 1;
  store.set(identifier, record);
  return { success: true, limit, remaining: limit - record.count, reset: record.expiresAt };
}
