/**
 * Hybrid Rate Limiter: Upstash Redis REST (Serverless / Edge) + In-Memory Fallback
 * Anurag Enclave Web Protection Suite
 * Prevents brute-force attacks and abuse across serverless instances and local dev.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// Global in-memory cache for local dev / fallback
const hitMap = new Map<string, RateLimitRecord>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

function cleanupStaleEntries(now: number, maxWindowMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of hitMap.entries()) {
    record.timestamps = record.timestamps.filter(ts => now - ts < maxWindowMs);
    if (record.timestamps.length === 0) {
      hitMap.delete(key);
    }
  }
}

/**
 * Extracts the real client IP from trusted infrastructure headers.
 * Prefers Vercel / Cloudflare platform-verified headers to prevent header spoofing.
 */
export function getTrustedClientIp(request: Request): string {
  // 1. Vercel verified client IP
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) return vercelIp.split(',')[0].trim();

  // 2. Cloudflare verified connecting IP
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  // 3. Real IP from reverse proxy
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // 4. Standard forwarded header (take leftmost IP)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  return '127.0.0.1';
}

/**
 * Checks rate limits asynchronously.
 * If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, uses Redis pipeline for distributed serverless limits.
 * If Redis is configured but down, fails closed if failClosedOnRedisError is true (e.g. for admin logins).
 * Otherwise, falls back to the in-memory sliding-window limiter.
 */
export async function checkRateLimitAsync(
  identifier: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
  options?: { failClosedOnRedisError?: boolean }
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const windowSeconds = Math.ceil(windowMs / 1000);
  const safeId = `ratelimit:${identifier || 'anonymous'}`;

  // 1. Try Upstash Redis REST API if configured
  if (upstashUrl && upstashToken) {
    try {
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', safeId],
          ['EXPIRE', safeId, windowSeconds],
          ['TTL', safeId],
        ]),
        // 2-second timeout so database hiccups never hang user requests
        signal: AbortSignal.timeout(2000),
      });

      if (res.ok) {
        const results = await res.json();
        const count = results[0]?.result || 1;
        const ttl = results[2]?.result > 0 ? results[2].result : windowSeconds;

        if (count > limit) {
          return {
            success: false,
            limit,
            remaining: 0,
            resetSeconds: ttl,
          };
        }

        return {
          success: true,
          limit,
          remaining: Math.max(0, limit - count),
          resetSeconds: ttl,
        };
      }
    } catch (redisErr) {
      console.warn('[RateLimit] Upstash Redis call failed:', redisErr);
      // For high-security endpoints (e.g. admin login), fail closed if Redis is down
      if (options?.failClosedOnRedisError) {
        console.error('[RateLimit] High-security endpoint failing closed due to Redis outage.');
        return {
          success: false,
          limit,
          remaining: 0,
          resetSeconds: 60,
        };
      }
    }
  }

  // 2. In-Memory Sliding Window Fallback
  return checkRateLimit(identifier, limit, windowMs);
}

/**
 * Synchronous in-memory sliding-window rate limiter
 */
export function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  cleanupStaleEntries(now, windowMs);

  const safeId = identifier || 'anonymous';
  const record = hitMap.get(safeId) || { timestamps: [] };

  // Filter timestamps within current window
  const validTimestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this hit
  validTimestamps.push(now);
  hitMap.set(safeId, { timestamps: validTimestamps });

  return {
    success: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}
