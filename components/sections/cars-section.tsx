"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, Car, Fuel, DoorOpen } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { type TranslationKey } from "@/lib/translations"

interface Location {
  _id: string
  name: string
  address: string
  city: string
  isActive: boolean
}

interface Car {
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

export function CarsSection() {
  const { t, formatPrice } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const carsPerPage = 6

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:8800/cars')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCars(data)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch cars')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])
  
  // Calculate total number of pages
  const totalPages = Math.ceil(cars.length / carsPerPage)

  // Calculate cars for current page
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar)

  // Handle page change with scroll
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to the top of the cars section
    window.scrollTo({
      top: document.getElementById('cars-section')?.offsetTop || 0,
      behavior: 'smooth'
    })
  }

  if (loading) {
    return (
      <section id="cars-section" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 mb-8 sm:mb-12">{t("ourCars")}</h2>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="cars-section" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 mb-8 sm:mb-12">{t("ourCars")}</h2>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="cars-section" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-blue-600 mb-8 sm:mb-12">{t("ourCars")}</h2>

        {/* Cars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {currentCars.map((car) => (
            <div 
              key={car._id} 
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] p-4 sm:p-6 flex flex-col h-full"
            >
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-blue-600 mb-3 sm:mb-4 line-clamp-1">{car.name}</h3>
                <div className="relative aspect-[4/3] mb-4">
                  <Image
                    src={car.mainImage.startsWith('http') ? car.mainImage : `http://localhost:8800${car.mainImage}`}
                    alt={car.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={currentPage === 1 && car === currentCars[0]}
                  />
                </div>
              </div>

              <div className="flex-grow">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Settings className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <DoorOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{car.doors} {t("doors")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Car className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{car.bodyType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <Fuel className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{car.fuel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="text-center mb-4">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{formatPrice(car.pricing["1_3"])}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{t("perDay")}</div>
                </div>

                <Link href={`/cars/${car._id}`}>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
                  >
                    {t("seeMore")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                variant={currentPage === pageNumber ? "default" : "outline"}
                className={`min-w-[2.5rem] h-10 px-4 ${
                  currentPage === pageNumber 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                {pageNumber}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}