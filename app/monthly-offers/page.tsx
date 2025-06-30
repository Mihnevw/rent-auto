"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import { FooterSection } from "@/components/sections/footer-section"
import { buildApiUrl, formatImageUrl, config } from '@/lib/config'

interface Car {
  _id: string
  name: string
  make: string
  model: string
  mainImage: string
  year: string
  transmission: string
  fuel: string
  doors: string
  pricing: {
    "1_3": number
    "4_7": number
    "8_14": number
    "15_plus": number
  }
}

export default function MonthlyOffersPage() {
  const { t, formatPrice } = useLanguage()
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(buildApiUrl(config.api.endpoints.cars))
        if (!response.ok) {
          throw new Error('Failed to fetch cars')
        }
        const data = await response.json()
        setCars(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cars')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [])

  // Calculate monthly price (30% discount from daily price for 15+ days)
  const calculateMonthlyPrice = (dailyPrice: number) => {
    const monthlyDiscount = 0.30 // 30% discount
    const discountedDailyPrice = dailyPrice * (1 - monthlyDiscount)
    return Math.round(discountedDailyPrice * 30) // 30 days
  }

  // Calculate deposit (usually 2x the daily rate)
  const calculateDeposit = (dailyPrice: number) => {
    return dailyPrice * 2
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-8 sm:mt-10">
          <div className="text-center">{t("loading")}</div>
        </main>
        <FooterSection />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-8 sm:mt-10">
          <div className="text-center text-red-500">{error}</div>
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 mt-8 sm:mt-10" role="main">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8" id="page-title">{t("monthlyOffersTitle")}</h1>

        {/* Header Section */}
        <section className="text-center mb-6 sm:mb-8" aria-labelledby="offers-subtitle">
          <h2 id="offers-subtitle" className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{t("monthlyOffersSubtitle")}</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-2">
            {t("contactForOffer")}*
          </p>
          <p className="text-xs sm:text-sm text-gray-500">{t("pricePeriod")}</p>
        </section>

        {/* Car Offers Section */}
        <section className="car-offers space-y-6 sm:space-y-10" aria-labelledby="car-offers-title">
          <h2 id="car-offers-title" className="sr-only">Available Monthly Car Offers</h2>

          {/* Car Offer Cards */}
          {cars.map((car) => {
            const monthlyPrice = calculateMonthlyPrice(car.pricing["15_plus"])
            const deposit = calculateDeposit(car.pricing["15_plus"])
            
            return (
              <div key={car._id} className="bg-white rounded-2xl border-2 border-[#c4ec64] p-4 sm:p-8 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 items-center">
                  {/* Left Side - Car Details */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">{car.name}</h3>

                    {/* Car Specifications */}
                    <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">
                          {t("carYear")}: <span className="text-gray-900 font-semibold">{car.year}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">
                          {t("transmission")}: <span className="text-gray-900 font-semibold">{car.transmission === "automatic" ? t("automatic") : t("manual")}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">
                          {t("fuel")}: <span className="text-gray-900 font-semibold">{car.fuel}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm sm:text-base text-gray-700">
                          {t("doorsCount")}: <span className="text-gray-900 font-semibold">{car.doors}</span>
                        </span>
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">{t("priceForRental")}</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">
                          {formatPrice(monthlyPrice.toString())}/
                          <span className="text-gray-900 font-semibold">{t("perMonth")}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl font-bold text-gray-800">
                          {formatPrice(deposit.toString())}
                          <span className="text-gray-900 font-semibold"> {t("deposit")}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm sm:text-base text-gray-700 font-semibold">
                          {t("mileageLimit")}: <span className="text-gray-900 font-semibold">3000 {t("kmLimit")}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Car Image */}
                  <div className="flex justify-center mt-4 lg:mt-0">
                    <Image
                      src={formatImageUrl(car.mainImage)}
                      alt={car.name}
                      width={500}
                      height={300}
                      className="max-w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Additional Information Section */}
        <section className="mt-8 sm:mt-12 grid md:grid-cols-2 gap-4 sm:gap-8" aria-labelledby="additional-info">
          <h2 id="additional-info" className="sr-only">Additional Rental Information</h2>

          <article className="bg-white rounded-lg p-4 sm:p-6 shadow-sm" aria-labelledby="advantages-title">
            <h3 id="advantages-title" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t("longTermAdvantages")}</h3>
            <ul role="list" className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
              {[
                t("significantDiscounts"),
                t("flexiblePaymentTerms"),
                t("fullMaintenanceIncluded"),
                t("carChangeOption"),
                t("technicalSupport24_7")
              ].map((advantage, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="bg-white rounded-lg p-4 sm:p-6 shadow-sm" aria-labelledby="conditions-title">
            <h3 id="conditions-title" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{t("longTermConditions")}</h3>
            <ul role="list" className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
              {[
                t("minimumPeriod"),
                t("depositPayment"),
                t("monthlyPaymentInAdvance"),
                t("mileageExcess"),
                t("earlyTermination")
              ].map((condition, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* Contact Section */}
        <section className="mt-8 sm:mt-12 bg-blue-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r-lg" aria-labelledby="contact-title">
          <h3 id="contact-title" className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4">{t("contactForPersonalOffer")}</h3>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <dl className="text-sm sm:text-base">
                <dt className="sr-only">{t("phone")}</dt>
                <dd className="text-blue-700 mb-2">
                  <strong>{t("phone")}:</strong> <a href="tel:+359894818283" className="hover:underline" aria-label="Call us">+359 894 818 283</a>
                </dd>
                <dt className="sr-only">Email</dt>
                <dd className="text-blue-700 mb-2">
                  <strong>Email:</strong> <a href="mailto:ivanrent11@gmail.com" className="hover:underline" aria-label="Email us">ivanrent11@gmail.com</a>
                </dd>
                <dt className="sr-only">{t("workingHours")}</dt>
                <dd className="text-blue-700">
                  <strong>{t("workingHours")}:</strong> <time>{t("workingHoursShort")}</time>
                </dd>
              </dl>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-700">
                {t("personalizedOffer")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
