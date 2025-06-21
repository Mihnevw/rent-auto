"use client"

import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"

export function DeliverySection() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: t("homeDelivery"),
      text: t("homeDeliveryText"),
    },
    {
      title: t("airportDelivery"),
      text: t("airportDeliveryText"),
    },
    {
      title: t("countryDelivery"),
      text: t("countryDeliveryText"),
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-400 rounded-3xl p-12 text-center shadow-lg min-h-[300px] flex flex-col justify-center">
          <div className="transition-all duration-500 transform">
            <h2 className="text-3xl font-bold text-white mb-6">{slides[currentSlide].title}</h2>
            <p className="text-white text-lg leading-relaxed mb-8 max-w-4xl mx-auto">{slides[currentSlide].text}</p>
          </div>
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-orange-400" : "bg-white/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 