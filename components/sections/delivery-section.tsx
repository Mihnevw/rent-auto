"use client"

import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import { Truck, Plane, Map } from "lucide-react"

export function DeliverySection() {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: t("homeDelivery"),
      text: t("homeDeliveryText"),
      icon: Truck,
    },
    {
      title: t("airportDelivery"),
      text: t("airportDeliveryText"),
      icon: Plane,
    },
    {
      title: t("countryDelivery"),
      text: t("countryDeliveryText"),
      icon: Map,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center shadow-lg relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:64px_64px] opacity-10"></div>

          <div className="relative">
            {/* Content */}
            <div className="transition-all duration-500 transform">
              {/* Icon */}
              <div className="flex justify-center mb-6 sm:mb-8 h-16 sm:h-20">
                {slides.map((slide, index) => {
                  const Icon = slide.icon
                  return (
                    <div
                      key={index}
                      className={`transition-all duration-500 absolute ${
                        currentSlide === index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-8"
                      }`}
                    >
                      <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  )
                })}
              </div>

              {/* Text Content */}
              <div className="min-h-[200px] sm:min-h-[180px] flex flex-col items-center justify-start">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-4xl">
                  {slides[currentSlide].text}
                </p>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center gap-3 mt-6 sm:mt-8">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? "bg-white scale-110" 
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 