"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { CustomPagination } from "@/components/ui/custom-pagination"
import { buildApiUrl, config } from '@/lib/config'
import { FooterSection } from "@/components/sections/footer-section"

interface Car {
  _id: string
  id?: string  // Add optional id field to handle API responses that might use id instead of _id
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
      setError(null)

      try {
        const pickup = searchParams.get("pickup") || ""
        const returnLoc = searchParams.get("return") || ""
        const pickupDate = searchParams.get("pickupDate") || ""
        const returnDate = searchParams.get("returnDate") || ""
        const pickupTime = searchParams.get("pickupTime") || ""
        const returnTime = searchParams.get("returnTime") || ""

        // Validate required parameters
        if (!pickup || !returnLoc || !pickupDate || !returnDate || !pickupTime || !returnTime) {
          throw new Error(t("missingSearchParameters"))
        }

        // Format dates to ISO 8601
        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`).toISOString()
        const returnDateTime = new Date(`${returnDate}T${returnTime}`).toISOString()

        const params = {
          pickupTime: pickupDateTime,
          returnTime: returnDateTime,
          pickupLocation: pickup,
          returnLocation: returnLoc
        }

        const response = await fetch(buildApiUrl(config.api.endpoints.availableCars, params))
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t("failedToFetchCars"))
        }

        const data: SearchResponse = await response.json()
        console.log("API Response:", data)

        // Ensure cars data is valid
        if (!data || !Array.isArray(data.cars)) {
          throw new Error("Invalid API response format")
        }

        // Map and validate the response
        const validCars = data.cars
          .map(car => {
            const carId = car._id || car.id
            if (typeof carId !== 'string') return null
            return {
              ...car,
              _id: carId
            }
          })
          .filter((car): car is Car => car !== null)

        setCars(validCars)
        setBookingDetails({
          pickup,
          return: returnLoc,
          pickupDate,
          returnDate,
          pickupTime,
          returnTime,
        })
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : t("errorOccurred"))
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [searchParams, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cars.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("noAvailableCars")}</h2>
            <p className="text-gray-600">{t("tryDifferentDates")}</p>
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
          {cars.map((car) => {
            // Generate unique IDs for nested features and includes
            const carFeatures = car.features?.map((feature, index) => ({
              id: `${car._id}-feature-${index}`,
              text: feature
            })) || []

            const carIncludes = car.priceIncludes?.map((item, index) => ({
              id: `${car._id}-include-${index}`,
              text: item
            })) || []

            return (
              <Card key={car._id} className="p-6 relative group hover:scale-[1.02] transition-all duration-300">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
                  <div className="h-full w-full bg-white rounded-lg"></div>
                </div>
                <div className="relative grid md:grid-cols-4 gap-6 items-center">
                  {/* Car Image */}
                  <div className="md:col-span-1">
                    <div className="relative h-40">
                      <Image
                        src={car.mainImage ? `http://localhost:8800${car.mainImage}` : "/placeholder.svg"}
                        alt={car.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">{car.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>• {t("engine")}: {car.engine}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>• {t("transmission")}: {car.transmission === "automatic" ? t("automatic") : t("manual")}</span>
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
                    {carFeatures.length > 0 && (
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {carFeatures.slice(0, 6).map((feature) => (
                          <span
                            key={feature.id}
                            className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold"
                          >
                            {feature.text}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price Includes */}
                    {carIncludes.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">{t("fullInsurance")}:</span>
                        <span className="ml-1">
                          {carIncludes.slice(0, 3).map(item => item.text).join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Location */}
                    {car.currentLocation && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">{t("location")}:</span>
                        <span className="ml-1">{car.currentLocation.name}, {car.currentLocation.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Price and Book Button */}
                  <div className="md:col-span-1 flex flex-col items-end justify-between">
                    <div className="text-right mb-4">
                      {typeof (car as any).price !== "undefined" ? (
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice((car as any).price)}
                          <span className="text-sm font-normal text-gray-600">/{t("pricePerDay")}</span>
                        </p>
                      ) : car.pricing && typeof car.pricing["1_3"] !== "undefined" ? (
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(car.pricing["1_3"])}
                          <span className="text-sm font-normal text-gray-600">/{t("pricePerDay")}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600 italic">N/A</p>
                      )}
                    </div>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold px-6 py-2 rounded-3xl"
                    >
                      <a href={`/cars/${car._id}?fromDate=${bookingDetails.pickupDate}&fromTime=${bookingDetails.pickupTime}&toDate=${bookingDetails.returnDate}&toTime=${bookingDetails.returnTime}`}>
                        {t("bookNow")}
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
