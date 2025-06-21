"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface Car {
  id: string
  name: string
  image_url: string
  price_per_day: string
  fuel: string
  gearbox: string
  seats: string
  doors: string
  body_type: string
  badges: string[]
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

        // Format the datetime strings
        const availableFrom = pickupDate && pickupTime ? `${pickupDate}T${pickupTime}` : null
        const availableTo = returnDate && returnTime ? `${returnDate}T${returnTime}` : null

        const queryParams = new URLSearchParams()
        if (availableFrom) queryParams.set("available_from", availableFrom)
        if (availableTo) queryParams.set("available_to", availableTo)

        const response = await fetch(`/api/cars?${queryParams.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch cars")
        
        const data = await response.json()
        setCars(data.cars || [])
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
            <Card key={car.id} className="p-6">
              <div className="grid md:grid-cols-4 gap-6 items-center">
                {/* Car Image */}
                <div className="md:col-span-1">
                  <Image
                    src={car.image_url || "/placeholder.svg"}
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
                      <span>• {car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {car.gearbox}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {car.seats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>• {car.doors}</span>
                    </div>
                  </div>
                  {car.badges && (
                    <div className="mt-4 flex gap-2">
                      {car.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Rent Button */}
                <div className="md:col-span-1 text-right">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">{t("priceForPeriod")}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.price_per_day)}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-orange-400 hover:bg-orange-500 text-white"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      window.location.href = `/booking/${car.id}?${params.toString()}`
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
