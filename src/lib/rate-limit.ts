const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now })
    return { success: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: limit - record.count }
}
