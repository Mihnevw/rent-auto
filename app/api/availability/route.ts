import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../utils/db'
import { csrfProtect } from '../utils/csrf'
import { rateLimit } from '../utils/rate-limit'

export async function POST(req: NextRequest) {
  csrfProtect(req)
  rateLimit(req)
  // TODO: Check if car is available for given interval
  return NextResponse.json({ available: true })
} 