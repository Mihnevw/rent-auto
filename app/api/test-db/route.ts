import { NextRequest, NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getMongoDb()
    // Try to list collections to verify connection
    const collections = await db.listCollections().toArray()
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection successful',
      collections: collections.map(c => c.name)
    })
  } catch (err) {
    console.error('Database connection error:', err)
    return NextResponse.json({ 
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
} 