import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../utils/db'
import { csrfProtect } from '../utils/csrf'
import { rateLimit } from '../utils/rate-limit'

export async function GET(req: NextRequest) {
  try {
    // Temporarily disable CSRF and rate limiting for testing
    // csrfProtect(req)
    // rateLimit(req)
    
    const { searchParams } = new URL(req.url)
    const availableFrom = searchParams.get('available_from')
    const availableTo = searchParams.get('available_to')

    console.log('Fetching cars with params:', { availableFrom, availableTo })

    // Get all cars first
    const { data: cars, error } = await supabase
      .from('cars')
      .select(`
        id,
        name,
        image_url,
        price_per_day,
        fuel,
        gearbox,
        body_type,
        seats,
        doors,
        year
      `)
      .order('price_per_day', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { 
          cars: [], 
          error: process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Failed to fetch cars'
        }, 
        { status: 500 }
      )
    }

    // If no period specified, return all cars
    if (!availableFrom || !availableTo) {
      return NextResponse.json({ 
        cars: cars?.map(car => ({
          ...car,
          badges: getBadges(car)
        })) || [] 
      })
    }

    // Check if reservations table exists
    const { error: tableCheckError } = await supabase
      .from('reservations')
      .select('id')
      .limit(1)

    // If reservations table doesn't exist yet, return all cars as available
    if (tableCheckError?.message?.includes('relation "public.reservations" does not exist')) {
      console.log('Reservations table does not exist yet, returning all cars as available')
      return NextResponse.json({ 
        cars: cars?.map(car => ({
          ...car,
          badges: getBadges(car)
        })) || [] 
      })
    }

    // Filter out cars that have overlapping reservations
    const availableCars = []
    for (const car of cars || []) {
      const { data: overlaps, error: overlapError } = await supabase
        .from('reservations')
        .select('id')
        .eq('car_id', car.id)
        .or('status.eq.confirmed,status.eq.pending')
        .not('status', 'eq', 'cancelled')
        .lt('start_datetime', availableTo)
        .gt('end_datetime', availableFrom)

      if (overlapError) {
        console.error('Overlap check error:', overlapError)
        continue
      }

      if (!overlaps || overlaps.length === 0) {
        availableCars.push({
          ...car,
          badges: getBadges(car)
        })
      }
    }

    return NextResponse.json({ cars: availableCars })
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

function getBadges(car: any): string[] {
  const badges: string[] = []
  
  // Add body type badge
  if (car.body_type) {
    badges.push(car.body_type.toUpperCase())
  }

  // Add year badge if it's recent
  if (car.year && parseInt(car.year) >= 2022) {
    badges.push(car.year)
  }

  // Add category badges based on price
  if (car.price_per_day <= 50) {
    badges.push('ИКОНОМИЧНИ')
  } else if (car.price_per_day <= 80) {
    badges.push('КОМПАКТНИ')
  } else {
    badges.push('ЛУКС')
  }

  return badges
} 