/**
 * Sliding-window in-memory rate limiter.
 *
 * Suitable for a single Node process (the default deployment). On serverless
 * platforms each instance keeps its own window, which still blunts abuse; for
 * a durable shared limit, back this interface with Supabase or a KV store
 * (see docs/DEPLOYMENT.md — "Rate limiting").
 */

interface Bucket {
  timestamps: number[];
}

export interface RateLimiter {
  /** Returns true when the request is allowed. */
  check(key: string): boolean;
}

export function createRateLimiter(options: {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}): RateLimiter {
  const { limit, windowMs, maxKeys = 5000 } = options;
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string): boolean {
      const now = Date.now();
      let bucket = buckets.get(key);
      if (!bucket) {
        // Cheap protection against unbounded growth from spoofed keys.
        if (buckets.size >= maxKeys) {
          const oldest = buckets.keys().next().value;
          if (oldest !== undefined) buckets.delete(oldest);
        }
        bucket = { timestamps: [] };
        buckets.set(key, bucket);
      }
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
      if (bucket.timestamps.length >= limit) return false;
      bucket.timestamps.push(now);
      return true;
    },
  };
}
