// Server Component
import { CarDetailClient } from "./car-detail-client"
import { headers } from "next/headers"

// Add route segment config to handle only numeric IDs
export const dynamic = 'force-dynamic'
export const dynamicParams = true

type LocationValue = "burgas" | "pomorie" | "nessebar" | "sunnyBeach" | "svetiVlas" | "varna" | "goldenSands" | "plovdiv"

interface CarDetails {
  id: string
  name: string
  mainImage: string
  thumbnails: string[]
  fuel: string
  transmission: string
  seats: string
  doors: string
  year: string
  consumption: string
  bodyType: string
  priceIncludes: string[]
  features: string[]
}

const rentalLocations: { value: LocationValue; label: LocationValue }[] = [
  { value: "burgas", label: "burgas" },
  { value: "pomorie", label: "pomorie" },
  { value: "nessebar", label: "nessebar" },
  { value: "sunnyBeach", label: "sunnyBeach" },
  { value: "svetiVlas", label: "svetiVlas" },
  { value: "varna", label: "varna" },
  { value: "goldenSands", label: "goldenSands" },
]

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params
  const { id } = await params

  const host = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const apiUrl = `${protocol}://${host}/api/cars/${id}`
  
  console.log('Fetching car details from:', apiUrl)
  
  try {
    const response = await fetch(apiUrl, { 
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store' // Disable caching for debugging
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Failed to fetch car: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    console.log('Response data:', data)

    if (!data.car) {
      console.error('No car data in response')
      throw new Error('Car data not found in response')
    }

    const { car } = data as { car: CarDetails }

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