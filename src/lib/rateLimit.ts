const rateLimiters = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(apiName: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const limiter = rateLimiters.get(apiName);
  if (!limiter || now >= limiter.resetAt) {
    rateLimiters.set(apiName, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (limiter.count >= maxCalls) return false;
  limiter.count++;
  return true;
}
