import { NextRequest } from 'next/server'

export function csrfProtect(req: NextRequest) {
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    const csrf = req.headers.get('x-csrf-token')
    if (!csrf || csrf !== process.env.CSRF_TOKEN) {
      throw new Error('CSRF token invalid')
    }
  }
} 