import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../utils/db'
import { csrfProtect } from '../../utils/csrf'
import { rateLimit } from '../../utils/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Skip non-numeric IDs and source map requests
    if (!id || !/^\d+$/.test(id) || id.includes('.map')) {
      return NextResponse.json(
        { error: 'Invalid car ID' },
        { status: 400 }
      )
    }

    console.log('Fetching car with ID:', id)

    // Check database connection
    try {
      const { error: healthError } = await supabaseAdmin
        .from('cars')
        .select('id')
        .limit(1)
        .single()

      if (healthError) {
        console.error('Database health check failed:', healthError)
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 500 }
        )
      }
    } catch (dbError) {
      console.error('Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Fetch car details
    const { data: cars, error: listError } = await supabaseAdmin
      .from('cars')
      .select('*')
      .eq('id', parseInt(id))
      .limit(1)
    
    console.log('Query result:', { cars, listError })
    
    if (listError) {
      console.error('Database error:', listError)
      return NextResponse.json(
        { error: listError.message || 'Failed to fetch car from database' },
        { status: 500 }
      )
    }

    if (!cars || cars.length === 0) {
      console.log('No car found with ID:', id)
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }

    const car = cars[0]
    console.log('Found car:', car)

    // Transform the data to match the expected format
    const transformedCar = {
      id: car.id,
      name: car.name,
      mainImage: car.image_url || '/placeholder.svg',
      transmission: car.gearbox || 'N/A',
      bodyType: car.body_type || 'N/A',
      thumbnails: [],
      fuel: car.fuel || 'N/A',
      seats: car.seats || 'N/A',
      doors: car.doors || 'N/A',
      year: car.year || 'N/A',
      consumption: car.consumption || 'N/A',
      priceIncludes: [
        "Пълна застраховка",
        "Неограничен пробег",
        "Данъци и такси",
        "24/7 пътна помощ"
      ],
      features: car.features || []
    }

    console.log('Returning transformed car:', transformedCar)
    return NextResponse.json({ car: transformedCar })
  } catch (err) {
    console.error('Unexpected error in /api/cars/[id]:', err)
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? err instanceof Error ? err.message : 'Unknown error'
          : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
} 