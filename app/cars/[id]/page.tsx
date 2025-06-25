// Server Component
import { CarDetailClient } from "./car-detail-client"
import { headers } from "next/headers"

// Add route segment config to handle only numeric IDs
export const dynamic = 'force-dynamic'
export const dynamicParams = true

interface Location {
  _id: string
  name: string
  address: string
  city: string
  isActive: boolean
}

interface CarDetails {
  _id: string
  make: string
  model: string
  name: string
  mainImage: string
  thumbnails: string[]
  engine: string
  fuel: string
  transmission: string
  seats: string
  doors: string
  year: string
  consumption: string
  bodyType: string
  priceIncludes: string[]
  features: string[]
  pricing: {
    "1_3": number
    "4_7": number
    "8_14": number
    "15_plus": number
  }
  currentLocation: Location
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params
  const { id } = await params

  try {
    const response = await fetch(`http://localhost:8800/cars/${id}`, { 
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store' // Disable caching for debugging
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch car: ${response.statusText}`)
    }

    const car = await response.json()
    console.log('Response data:', car)

    return <CarDetailClient car={car} />
  } catch (error) {
    console.error('Error in CarDetailPage:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Car</h2>
          <p className="text-gray-600 mb-4">Unable to load car details. Please try again later.</p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-left text-sm text-red-600 bg-red-50 p-4 rounded overflow-auto">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          )}
          <a 
            href="/cars" 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Cars
          </a>
        </div>
      </div>
    )
  }
} 