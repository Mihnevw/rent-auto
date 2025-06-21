import { NextRequest, NextResponse } from 'next/server'
import { csrfProtect } from '../utils/csrf'
import { rateLimit } from '../utils/rate-limit'
import { getMongoDb } from '@/lib/mongodb'
import { Car, toCarModel } from '@/models'

export async function GET(req: NextRequest) {
  try {
    const db = await getMongoDb()
    const carsData = await db.collection('cars').find({}).toArray()
    const cars = carsData.map(toCarModel)
    return NextResponse.json({ cars })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { 
        cars: [], 
        error: process.env.NODE_ENV === 'development' 
          ? err instanceof Error ? err.message : 'Unknown error'
          : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

function getBadges(car: Car): string[] {
  const badges: string[] = []
  
  // Add category badge
  if (car.category) {
    badges.push(car.category.toUpperCase())
  }

  // Add year badge if it's recent
  if (car.year && car.year >= 2022) {
    badges.push(car.year.toString())
  }

  // Add category badges based on price
  if (car.price.daily <= 50) {
    badges.push('ИКОНОМИЧНИ')
  } else if (car.price.daily <= 80) {
    badges.push('КОМПАКТНИ')
  } else {
    badges.push('ЛУКС')
  }

  return badges
} 