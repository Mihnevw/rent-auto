"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { CustomPagination } from "@/components/ui/custom-pagination"

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
  currentLocation: {
    _id: string
    name: string
    address: string
    city: string
    isActive: boolean
  }
}

interface SearchResponse {
  count: number
  cars: Car[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [bookingDetails, setBookingDetails] = useState({
    pickup: "",
    return: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
  })

  const { t, formatPrice } = useLanguage()

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      try {
        const pickup = searchParams.get("pickup") || ""
        const returnLoc = searchParams.get("return") || ""
        const pickupDate = searchParams.get("pickupDate") || ""
        const returnDate = searchParams.get("returnDate") || ""
        const pickupTime = searchParams.get("pickupTime") || ""
        const returnTime = searchParams.get("returnTime") || ""

        // Format dates to ISO 8601
        const pickupDateTime = new Date(
          `${pickupDate}T${pickupTime}`
        ).toISOString()

        const returnDateTime = new Date(
          `${returnDate}T${returnTime}`
        ).toISOString()

        const queryParams = new URLSearchParams({
          pickupTime: pickupDateTime,
          returnTime: returnDateTime,
          pickupLocation: pickup,
          returnLocation: returnLoc
        })

        const response = await fetch(`http://localhost:8800/reservations/cars/available?${queryParams.toString()}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch cars")
        }
        
        const data: SearchResponse = await response.json()
        setCars(data.cars)
        setBookingDetails({
          pickup,
          return: returnLoc,
          pickupDate,
          returnDate,
          pickupTime,
          returnTime,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("noAvailableCars")}</h2>
            <p className="text-gray-600">{t("changeFilters")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t("availableCars")} {bookingDetails.pickupDate} - {bookingDetails.returnDate}
        </h1>
        
        <p className="text-gray-700 mb-8">
          {t("carsPageDescription")}
        </p>

        <div className="grid gap-6">
          {cars.map((car) => (
            <Card key={car._id} className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-center">
                {/* Car Image */}
                <div className="md:col-span-1">
                  <Image
                    src={`http://localhost:8800${car.mainImage}` || "/placeholder.svg"}
                    alt={car.name}
                    width={300}
                    height={200}
                    className="w-full h-40 object-contain"
                  />
                </div>

                {/* Car Details */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{car.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>• {t("engine")}: {car.engine}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {t("transmission")}: {car.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {t("seats")}: {car.seats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {t("doors")}: {car.doors}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {t("consumption")}: {car.consumption}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {t("carYear")}: {car.year}</span>
                    </div>
                  </div>
                  
                  {/* Features */}
                  {car.features && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {car.features.slice(0, 6).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price Includes */}
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">{t("priceIncludes")}:</span>
                    <span className="ml-1">{car.priceIncludes.slice(0, 3).join(", ")}</span>
                  </div>

                  {/* Location */}
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">{t("location")}:</span>
                    <span className="ml-1">{car.currentLocation.name}, {car.currentLocation.city}</span>
                  </div>
                </div>

                {/* Price and Rent Button */}
                <div className="md:col-span-1 text-right">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">{t("priceForPeriod")}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.pricing["1_3"])}
                    </div>
                    <div className="text-xs text-gray-500">{t("pricePerDay")}</div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold px-6 py-2 rounded-xl"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      window.location.href = `/cars/${car._id}?${params.toString()}`
                    }}
                  >
                    {t("rent")}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
