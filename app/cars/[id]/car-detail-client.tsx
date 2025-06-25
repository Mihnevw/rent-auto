"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Fuel, Users, Car, Settings, Gauge, ShoppingCart, ChevronLeft, ChevronRight, X, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { format, isBefore, startOfToday, differenceInDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { FooterSection } from "@/components/sections/footer-section"
import { RentalForm } from "@/components/ui/rental-form"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { buildApiUrl, config, formatImageUrl } from '@/lib/config'
import { useSearchParams } from 'next/navigation'

interface Location {
  _id: string
  name: string
  address: string
  city: string
  isActive: boolean
}

interface CarDetails {
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

interface CarDetailClientProps {
  car: CarDetails
}

export function CarDetailClient({ car }: CarDetailClientProps) {
  const { t, formatPrice } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Функция за форматиране на URL адресите на снимките
  const currentImage = formatImageUrl(currentImageIndex === 0 ? car.mainImage : car.thumbnails[currentImageIndex - 1])
  const allImages = [car.mainImage, ...car.thumbnails].map(formatImageUrl)

  const plugin = Autoplay({ delay: 4000, stopOnInteraction: true })

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{car.name}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Car Images */}
          <div className="lg:col-span-1">
            {/* Main Carousel */}
            <div className="relative mb-6">
              <Carousel
                plugins={[plugin]}
                className="w-full"
                setApi={(api) => {
                  api?.on('select', () => {
                    setCurrentImageIndex(api.selectedScrollSnap())
                  })
                }}
              >
                <CarouselContent>
                  {allImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div 
                        className="relative aspect-[4/3] w-full cursor-pointer"
                        onClick={() => handleImageClick(index)}
                      >
                        <Image
                          src={image}
                          alt={`${car.name} ${index + 1}`}
                          fill
                          className="object-contain bg-white rounded-lg"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
              </Carousel>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden rounded-lg border-2",
                    currentImageIndex === index
                      ? "border-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${car.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Car Name and Engine */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">{car.make} {car.model}</h2>
            <p className="text-gray-600 mb-4">{car.engine}</p>
          </div>

          {/* Middle Column - Car Specifications */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t("carSpecifications")}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Fuel className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.fuel}</span>
              </div>

              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.transmission}</span>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.seats} {t("seats")}</span>
              </div>

              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.doors} {t("doors")}</span>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.year}</span>
              </div>

              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.consumption}</span>
              </div>

              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.bodyType}</span>
              </div>
            </div>

            {/* Price Table */}
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-3">{t("pricing")}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>1-3 {t("daysOfRental")}:</span>
                  <span className="font-semibold">{formatPrice(car.pricing["1_3"].toString())}/{t("pricePerDayShort")}</span>
                </div>
                <div className="flex justify-between">
                  <span>4-7 {t("daysOfRental")}:</span>
                  <span className="font-semibold">{formatPrice(car.pricing["4_7"].toString())}/{t("pricePerDayShort")}</span>
                </div>
                <div className="flex justify-between">
                  <span>8-14 {t("daysOfRental")}:</span>
                  <span className="font-semibold">{formatPrice(car.pricing["8_14"].toString())}/{t("pricePerDayShort")}</span>
                </div>
                <div className="flex justify-between">
                  <span>15+ {t("daysOfRental")}:</span>
                  <span className="font-semibold">{formatPrice(car.pricing["15_plus"].toString())}/{t("pricePerDayShort")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Rental Form */}
          <div className="lg:col-span-1">
            <RentalForm carId={car._id} />
          </div>
        </div>

        {/* Price and Features Section */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Price Includes */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t("priceIncludesFullCoverage")} <span className="text-sm font-normal">{t("noHiddenFees")}</span>
            </h3>
            <ul className="space-y-2">
              {[
                t("fullInsurance"),
                t("unlimitedMileage"),
                t("roadsideAssistance"),
                t("freeCancellation")
              ].map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Features */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("carFeatures")}</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                t("gpsNavigation"),
                t("parkingSensors"),
                t("climateControl"),
                t("cruiseControl"),
                t("leatherSeats"),
                t("bluetooth")
              ].map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          <DialogTitle asChild>
            <VisuallyHidden>
              {`${car.name} image gallery - Image ${selectedImageIndex + 1} of ${allImages.length}`}
            </VisuallyHidden>
          </DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center bg-black/95">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              aria-label="Close image gallery"
            >
              <X className="h-6 w-6" />
            </button>
            
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 text-white hover:text-gray-300 z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={allImages[selectedImageIndex]}
                alt={`${car.name} - Image ${selectedImageIndex + 1} of ${allImages.length}`}
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            
            <button
              onClick={handleNextImage}
              className="absolute right-4 text-white hover:text-gray-300 z-50"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <FooterSection />
    </div>
  )
} 