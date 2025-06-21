"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"

interface CarPricing {
  id: string
  name: string
  image_url: string
  price_per_day: string
  deposit: string
  summer_price: string
  summer_deposit: string
  june_price: string
  winter_price: string
  winter_deposit: string
}

export default function PricesPage() {
  const { t, formatPrice } = useLanguage()
  const [cars, setCars] = useState<CarPricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/cars')
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          })
          throw new Error(errorData.error || `Failed to fetch pricing data: ${response.statusText}`)
        }
        const data = await response.json()
        if (!data.cars) {
          console.error('Invalid API response:', data)
          throw new Error('Invalid data format received from server')
        }
        setCars(data.cars)
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to retrieve price data')
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Prices</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t("pricesTitle")}</h1>

        {/* Pricing Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400 text-white">
            <div className="grid grid-cols-6 gap-4 p-4 text-center font-semibold">
              <div className="text-left">{/* Car column - no header text */}</div>
              <div>
                <div className="text-sm">{t("summerPrice")}</div>
              </div>
              <div>
                <div className="text-sm">{t("summerDeposit")}</div>
              </div>
              <div>
                <div className="text-sm">{t("junePrice")}</div>
              </div>
              <div>
                <div className="text-sm">{t("winterPrice")}</div>
              </div>
              <div>
                <div className="text-sm">{t("winterDeposit")}</div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {cars.map((car, index) => (
              <div
                key={car.id}
                className={`grid grid-cols-6 gap-4 p-4 items-center ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                {/* Car Image and Name */}
                <div className="flex items-center gap-4">
                  <Image
                    src={car.image_url || "/placeholder.svg"}
                    alt={car.name}
                    width={120}
                    height={80}
                    className="w-20 h-12 object-contain"
                  />
                  <span className="font-semibold text-gray-800">{car.name}</span>
                </div>

                {/* Summer Price */}
                <div className="text-center text-gray-800 font-medium">{formatPrice(car.summer_price || car.price_per_day)}</div>

                {/* Summer Deposit */}
                <div className="text-center text-gray-800 font-medium">{formatPrice(car.summer_deposit || car.deposit)}</div>

                {/* June Price */}
                <div className="text-center text-gray-800 font-medium">{formatPrice(car.june_price || car.price_per_day)}</div>

                {/* Winter Price */}
                <div className="text-center text-gray-800 font-medium">{formatPrice(car.winter_price || car.price_per_day)}</div>

                {/* Winter Deposit */}
                <div className="text-center text-gray-800 font-medium">{formatPrice(car.winter_deposit || car.deposit)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("includedInPrice")}</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• {t("unlimitedMileage")}</li>
              <li>• {t("liabilityInsurance")}</li>
              <li>• {t("cascoInsurance")}</li>
              <li>• {t("technicalAssistance")}</li>
              <li>• {t("basicCleaning")}</li>
              <li>• {t("winterTires")}</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("additionalFees")}</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>{t("deliveryInCity")}</span>
                <span className="font-semibold">{formatPrice(20)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("deliveryOutsideCity")}</span>
                <span className="font-semibold">0.50 {t("perKm")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("childSeat")}</span>
                <span className="font-semibold">{formatPrice(5)}/{t("perDay")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("gps")}</span>
                <span className="font-semibold">{formatPrice(5)}/{t("perDay")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("additionalDriver")}</span>
                <span className="font-semibold">{formatPrice(10)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("lateReturn")}</span>
                <span className="font-semibold">{formatPrice(10)}/{t("perHour")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">{t("importantNotes")}</h3>
          <ul className="space-y-1 text-blue-700 text-sm">
            <li>• {t("pricesInBGN")}</li>
            <li>• {t("depositInfo")}</li>
            <li>• {t("minimumRental")}</li>
            <li>• {t("weeklyDiscount")}</li>
            <li>• {t("priceChangeNotice")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
