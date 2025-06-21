"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Fuel, Users, Car, Settings, Gauge } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

type LocationValue = "burgas" | "pomorie" | "nessebar" | "sunnyBeach" | "svetiVlas" | "varna" | "goldenSands" | "plovdiv"

interface CarDetails {
  id: string
  name: string
  mainImage: string
  thumbnails: string[]
  fuel: string
  transmission: string
  seats: string
  doors: string
  year: string
  consumption: string
  bodyType: string
  priceIncludes: string[]
  features: string[]
}

const rentalLocations: { value: LocationValue; label: LocationValue }[] = [
  { value: "burgas", label: "burgas" },
  { value: "pomorie", label: "pomorie" },
  { value: "nessebar", label: "nessebar" },
  { value: "sunnyBeach", label: "sunnyBeach" },
  { value: "svetiVlas", label: "svetiVlas" },
  { value: "varna", label: "varna" },
  { value: "goldenSands", label: "goldenSands" },
]

interface CarDetailClientProps {
  car: CarDetails
}

export function CarDetailClient({ car }: CarDetailClientProps) {
  const [pickupLocation, setPickupLocation] = useState<LocationValue>("plovdiv")
  const [returnLocation, setReturnLocation] = useState<LocationValue>("plovdiv")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { t, formatPrice } = useLanguage()

  const handleLocationChange = (value: string, setter: (value: LocationValue) => void) => {
    setter(value as LocationValue)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Car Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{car.name}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Car Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="mb-4">
              <Image
                src={car.mainImage || "/placeholder.svg"}
                alt={car.name}
                width={600}
                height={400}
                className="w-full h-80 object-contain bg-white rounded-lg"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 mb-4">
              {car.thumbnails?.map((thumb: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={thumb || "/placeholder.svg"}
                    alt={`${car.name} ${index + 1}`}
                    width={150}
                    height={100}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Car Name Repeat */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">{car.name}</h2>
          </div>

          {/* Middle Column - Car Specifications */}
          <div className="lg:col-span-1">
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
                <span className="text-gray-700">{car.seats}</span>
              </div>

              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{car.doors}</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-500" />
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
          </div>

          {/* Right Column - Rental Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Pickup Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("rental" as const)}</h3>

                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-2 block">{t("pickupLocation")}</Label>
                  <Select value={pickupLocation} onValueChange={(value) => handleLocationChange(value, setPickupLocation)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {t(location.value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupDate")}</Label>
                    <div className="relative">
                      <Input type="text" defaultValue="19-06-2025" className="pr-10" />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupTime")}</Label>
                    <div className="relative">
                      <Input type="text" defaultValue="10:00" className="pr-10" />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("return" as const)}</h3>

                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-2 block">{t("returnLocation")}</Label>
                  <Select value={returnLocation} onValueChange={(value) => handleLocationChange(value, setReturnLocation)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {t(location.value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnDate")}</Label>
                    <div className="relative">
                      <Input type="text" defaultValue="21-06-2025" className="pr-10" />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnTime")}</Label>
                    <div className="relative">
                      <Input type="text" defaultValue="10:00" className="pr-10" />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-lg">
                {t("search")}
              </Button>
            </div>
          </div>
        </div>

        {/* Price and Features Section */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          {/* Price Includes */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Цената включва Пълно покритие <span className="text-sm font-normal">(няма добавени и скрити такси):</span>
            </h3>
            <ul className="space-y-2">
              {car.priceIncludes?.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Features */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Особености на автомобила</h3>
            <div className="grid grid-cols-2 gap-2">
              {car.features?.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  <span className="text-blue-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 