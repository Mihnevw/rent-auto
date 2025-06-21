import { NextRequest, NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { toCarModel } from '@/models'
import { ObjectId } from 'mongodb'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    
    // Пропускаме заявки с невалиден ID или source map заявки
    if (!id || id.includes('.map')) {
      return NextResponse.json(
        { error: 'Invalid car ID' },
        { status: 400 }
      )
    }

    console.log('Fetching car with ID:', id)

    const db = await getMongoDb()
    // Валидация дали id е валиден ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ObjectId' }, { status: 400 })
    }

    const carData = await db.collection('cars').findOne({ _id: new ObjectId(id) })
    
    if (!carData) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }
    
    const car = toCarModel(carData)
    return NextResponse.json({ car })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' 
          ? err instanceof Error ? err.message : 'Unknown error'
          : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
} 
