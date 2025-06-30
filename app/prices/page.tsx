"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import Head from "next/head"
import { FooterSection } from "@/components/sections/footer-section"

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

export default function PricesPage() {
  const { t, formatPrice } = useLanguage()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Structured data for SEO
  const generateStructuredData = (cars: Car[]) => {
    return {
      "@context": "https://schema.org",
      "@type": "PriceSpecification",
      "name": "Car Rental Pricing",
      "description": "Detailed pricing for car rentals at AUTO Rent Bulgaria",
      "provider": {
        "@type": "Organization",
        "name": "AUTO Rent",
        "description": "Premium car rental services in Bulgaria"
      },
      "priceSpecification": cars.map(car => ({
        "@type": "UnitPriceSpecification",
        "name": car.name,
        "price": car.pricing["1_3"],
        "priceCurrency": "BGN",
        "unitText": "per day",
        "validFrom": "P1D",
        "validThrough": "P3D"
      }))
    }
  }

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('http://localhost:8800/cars')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCars(data)
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
      <>
        <Head>
          <title>Prices | AUTO Rent - Car Rental Services in Bulgaria</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Prices | AUTO Rent - Car Rental Rates in Bulgaria</title>
        <meta name="description" content="View our transparent car rental prices in Bulgaria. Daily rates, long-term discounts, and all-inclusive packages. No hidden fees." />
        <meta name="keywords" content="car rental prices bulgaria, rent a car rates, auto rent pricing, car hire costs, vehicle rental prices" />
        <meta property="og:title" content="Car Rental Prices - AUTO Rent Bulgaria" />
        <meta property="og:description" content="Transparent car rental pricing with daily rates and long-term discounts. All-inclusive packages with no hidden fees." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/dlrent-office.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://autorent.bg/prices" />
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(cars))}
        </script>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 px-2">{t("pricesTitle")}</h1>

          {/* Pricing Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 p-3 sm:p-4">
                <div className="text-left font-semibold col-span-1 sm:col-span-2">{t("carRental")}</div>
                <div className="text-center font-semibold hidden sm:block">1-3 {t("numberOfDays")}</div>
                <div className="text-center font-semibold hidden sm:block">4-7 {t("numberOfDays")}</div>
                <div className="text-center font-semibold hidden sm:block">8-14 {t("numberOfDays")}</div>
                <div className="text-center font-semibold hidden sm:block">15+ {t("numberOfDays")}</div>
                <div className="text-center font-semibold col-span-2 sm:hidden">{t("prices")}</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {cars.map((car, index) => (
                <div
                  key={car._id}
                  className={`grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 p-3 sm:p-4 items-center ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {/* Car Info */}
                  <div className="flex items-start sm:items-center gap-2 sm:gap-4 col-span-1 sm:col-span-2">
                    <div className="w-16 sm:w-24 h-12 sm:h-16 relative flex-shrink-0">
                    <Image
                        src={car.mainImage.startsWith('http') ? car.mainImage : `http://localhost:8800${car.mainImage}`}
                        alt={car.name}
                        fill
                        className="object-contain"
                    />
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900 block text-sm sm:text-base truncate">{car.name}</span>
                      <span className="text-xs sm:text-sm text-gray-500 block truncate">{car.engine} • {car.transmission}</span>
                    </div>
                  </div>

                  {/* Desktop Prices */}
                  <div className="hidden sm:block text-center font-semibold text-gray-900">
                    {formatPrice(car.pricing["1_3"])}
                  </div>
                  <div className="hidden sm:block text-center font-semibold text-gray-900">
                    {formatPrice(car.pricing["4_7"])}
                  </div>
                  <div className="hidden sm:block text-center font-semibold text-gray-900">
                    {formatPrice(car.pricing["8_14"])}
                  </div>
                  <div className="hidden sm:block text-center font-semibold text-gray-900">
                    {formatPrice(car.pricing["15_plus"])}
                  </div>

                  {/* Mobile Prices */}
                  <div className="col-span-2 sm:hidden">
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <div className="text-gray-600">1-3 {t("numberOfDays")}:</div>
                      <div className="text-right font-semibold text-gray-900">{formatPrice(car.pricing["1_3"])}</div>
                      <div className="text-gray-600">4-7 {t("numberOfDays")}:</div>
                      <div className="text-right font-semibold text-gray-900">{formatPrice(car.pricing["4_7"])}</div>
                      <div className="text-gray-600">8-14 {t("numberOfDays")}:</div>
                      <div className="text-right font-semibold text-gray-900">{formatPrice(car.pricing["8_14"])}</div>
                      <div className="text-gray-600">15+ {t("numberOfDays")}:</div>
                      <div className="text-right font-semibold text-gray-900">{formatPrice(car.pricing["15_plus"])}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          {/* <div className="mt-4 sm:mt-8 grid md:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t("includedInPrice")}</h2>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                {cars[0]?.priceIncludes.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-4 sm:h-5 w-4 sm:w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t("additionalFees")}</h2>
              <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                <div className="flex justify-between items-center">
                  <span>{t("deliveryInCity")}</span>
                  <span className="font-semibold">{formatPrice(20)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("deliveryOutsideCity")}</span>
                  <span className="font-semibold">0.50 {t("perKm")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("childSeat")}</span>
                  <span className="font-semibold">{formatPrice(5)}/{t("pricePerDay")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("gps")}</span>
                  <span className="font-semibold">{formatPrice(5)}/{t("pricePerDay")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t("additionalDriver")}</span>
                  <span className="font-semibold">{formatPrice(10)}</span>
                </div>
              </div>
                </div>
          </div> */}
        </main>
        <FooterSection />
      </div>
    </>
  )
}
