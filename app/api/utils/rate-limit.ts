import { NextRequest } from 'next/server'

const ipRequests: Record<string, { count: number; last: number }> = {}
const LIMIT = process.env.NODE_ENV === 'production' ? 10 : 100 // Higher limit in development
const WINDOW = 60 * 1000 // 1 minute

export function rateLimit(req: NextRequest) {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const ip = req.headers.get('x-forwarded-for') || 'local'
  const now = Date.now()
  if (!ipRequests[ip] || now - ipRequests[ip].last > WINDOW) {
    ipRequests[ip] = { count: 1, last: now }
  } else {
    ipRequests[ip].count++
    ipRequests[ip].last = now
  }
  if (ipRequests[ip].count > LIMIT) {
    throw new Error('Rate limit exceeded')
  }
} 