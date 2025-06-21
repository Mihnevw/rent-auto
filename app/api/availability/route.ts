import { NextRequest, NextResponse } from 'next/server'
import { csrfProtect } from '../utils/csrf'
import { rateLimit } from '../utils/rate-limit'
import { getMongoDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  csrfProtect(req)
  rateLimit(req)
  const { carId, startDate, endDate } = await req.json()
  
  try {
    // Convert string dates to Date objects
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Convert carId to ObjectId
    const carObjectId = new ObjectId(carId)
    
    const db = await getMongoDb()
    const overlap = await db.collection('reservations').findOne({
      carId: carObjectId,
      status: { $in: ['pending', 'confirmed'] },
      startDate: { $lt: end },
      endDate: { $gt: start },
    })
    return NextResponse.json({ available: !overlap })
  } catch (err) {
    return NextResponse.json({ available: false, error: 'Database error' }, { status: 500 })
  }
} 