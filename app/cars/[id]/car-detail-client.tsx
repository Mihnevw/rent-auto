"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Fuel, Users, Car, Settings, Gauge, ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { format, isBefore, startOfToday, differenceInDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { FooterSection } from "@/components/sections/footer-section"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

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

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  label: string
}

function TimeInput({ value, onChange, label }: TimeInputProps) {
  // Split time into hours and minutes, handle empty value
  const [hours, minutes] = value 
    ? value.split(":").map(num => num === "00" ? "" : String(parseInt(num, 10)))
    : ["", ""]

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (newValue === "") {
      // If hours are cleared and no minutes, clear the whole value
      if (!minutes) {
        onChange("")
        return
      }
      // If minutes exist, keep them with 00 hours
      onChange(`00:${minutes.padStart(2, '0')}`)
      return
    }

    const newHour = parseInt(newValue)
    if (!isNaN(newHour) && newHour >= 0 && newHour <= 23) {
      onChange(`${newHour.toString().padStart(2, '0')}:${(minutes || "0").padStart(2, '0')}`)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (newValue === "") {
      // If minutes are cleared and no hours, clear the whole value
      if (!hours) {
        onChange("")
        return
      }
      // If hours exist, keep them with 00 minutes
      onChange(`${hours.padStart(2, '0')}:00`)
      return
    }

    const newMinute = parseInt(newValue)
    if (!isNaN(newMinute) && newMinute >= 0 && newMinute <= 59) {
      onChange(`${(hours || "0").padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`)
    }
  }

  return (
    <div>
      <Label className="text-sm text-gray-600 mb-2 block">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              value={value || "--:--"}
              readOnly
              className="w-full h-12 rounded-lg border-gray-200 cursor-pointer bg-white pl-4 pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="start">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <Input
                  type="number"
                  min={0}
                  max={23}
                  value={hours}
                  onChange={handleHourChange}
                  className="w-24 text-center h-12 text-lg font-medium"
                  placeholder="--"
                />
                <span className="text-xl font-medium text-gray-500">:</span>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={handleMinuteChange}
                  className="w-24 text-center h-12 text-lg font-medium"
                  placeholder="--"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface CustomerInfo {
  customerName: string
  email: string
  phone: string
}

interface ReservationData {
  carId: string
  fromDate: string
  toDate: string
  fromTime: string
  toTime: string
  fromPlace: string
  toPlace: string
  customerName: string
  email: string
  phone: string
}

export function CarDetailClient({ car }: CarDetailClientProps) {
  const [pickupLocation, setPickupLocation] = useState(car.currentLocation._id)
  const [returnLocation, setReturnLocation] = useState(car.currentLocation._id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pickupDate, setPickupDate] = useState<Date | undefined>()
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [returnTime, setReturnTime] = useState("10:00")
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t, formatPrice } = useLanguage()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    customerName: "",
    email: "",
    phone: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Функция за форматиране на URL адресите на снимките
  const formatImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith("http")) return imagePath
    return `http://localhost:8800${imagePath}`
  }

  const currentImage = formatImageUrl(currentImageIndex === 0 ? car.mainImage : car.thumbnails[currentImageIndex - 1])
  const allImages = [car.mainImage, ...car.thumbnails].map(formatImageUrl)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8800/locations')
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Function to check if a date is in the past
  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  // Handle pickup date change
  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date)
    // If return date is before pickup date, reset it
    if (date && returnDate && isBefore(returnDate, date)) {
      setReturnDate(undefined)
    }
  }

  // Calculate total price based on selected dates and pricing tiers
  useEffect(() => {
    if (pickupDate && returnDate) {
      const days = differenceInDays(returnDate, pickupDate) + 1
      let pricePerDay = car.pricing["15_plus"]
      
      if (days <= 3) pricePerDay = car.pricing["1_3"]
      else if (days <= 7) pricePerDay = car.pricing["4_7"]
      else if (days <= 14) pricePerDay = car.pricing["8_14"]
      
      setTotalPrice(days * pricePerDay)
    } else {
      setTotalPrice(0)
    }
  }, [pickupDate, returnDate, car.pricing])

  const handleCustomerInfoChange = (field: keyof CustomerInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleReservation = async () => {
    if (!pickupDate || !returnDate || !pickupLocation || !returnLocation) {
      toast.error(t("fillAllFields"))
      return
    }

    const reservationData: ReservationData = {
      carId: car._id,
      fromDate: format(pickupDate, "yyyy-MM-dd"),
      toDate: format(returnDate, "yyyy-MM-dd"),
      fromTime: pickupTime,
      toTime: returnTime,
      fromPlace: pickupLocation,
      toPlace: returnLocation,
      customerName: customerInfo.customerName,
      email: customerInfo.email,
      phone: customerInfo.phone
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:8800/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error('Failed to create reservation')
      }

      toast.success(t("reservationSuccess"))
      // You might want to redirect to a confirmation page or clear the form here
    } catch (error) {
      console.error('Error creating reservation:', error)
      toast.error(t("reservationError"))
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Current Location */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{t("currentLocation")}</h3>
                <p className="text-gray-600">{car.currentLocation.name}</p>
                <p className="text-sm text-gray-500">{car.currentLocation.address}</p>
              </div>

              {/* Pickup Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("pickupDetails")}</h3>

                <div className="space-y-4">
                  <div>
                  <Label className="text-sm text-gray-600 mb-2 block">{t("pickupLocation")}</Label>
                    <Select value={pickupLocation} onValueChange={setPickupLocation}>
                      <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 text-gray-500">
                        <SelectValue placeholder={isLoading ? "Loading..." : t("selectCity")} />
                    </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {locations.filter(loc => loc.isActive).map((location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {location.name} ({location.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal rounded-lg border-gray-200",
                              !pickupDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pickupDate ? format(pickupDate, "dd.MM.yyyy") : <span>{t("selectDate")}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={handlePickupDateChange}
                            disabled={isDateDisabled}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <TimeInput
                      value={pickupTime}
                      onChange={setPickupTime}
                      label={t("pickupTime")}
                    />
                  </div>
                </div>
              </div>

              {/* Return Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("returnDetails")}</h3>

                <div className="space-y-4">
                  <div>
                  <Label className="text-sm text-gray-600 mb-2 block">{t("returnLocation")}</Label>
                    <Select value={returnLocation} onValueChange={setReturnLocation}>
                      <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 text-gray-500">
                        <SelectValue placeholder={isLoading ? "Loading..." : t("selectCity")} />
                    </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {locations.filter(loc => loc.isActive).map((location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {location.name} ({location.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnDate")}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal rounded-lg border-gray-200",
                              !returnDate && "text-gray-500"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {returnDate ? format(returnDate, "dd.MM.yyyy") : <span>{t("selectDate")}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            disabled={(date) => isDateDisabled(date) || (pickupDate ? isBefore(date, pickupDate) : false)}
                            initialFocus
                            fromDate={pickupDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <TimeInput
                      value={returnTime}
                      onChange={setReturnTime}
                      label={t("returnTime")}
                    />
                  </div>
                </div>
              </div>

              {/* Customer Information Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("customerDetails")}</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("name" as const)}</Label>
                    <Input
                      type="text"
                      value={customerInfo.customerName}
                      onChange={handleCustomerInfoChange("customerName")}
                      className="w-full h-12 rounded-lg border-gray-200"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("email" as const)}</Label>
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange("email")}
                      className="w-full h-12 rounded-lg border-gray-200"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("phone" as const)}</Label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange("phone")}
                      className="w-full h-12 rounded-lg border-gray-200"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Cart Section */}
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-bold text-gray-800">{t("reservationSummary")}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("carRental")}:</span>
                    <span className="font-medium">{car.name}</span>
                  </div>
                  {pickupDate && returnDate && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("numberOfDays")}:</span>
                        <span className="font-medium">
                          {differenceInDays(returnDate, pickupDate) + 1}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("pickupPlace")}:</span>
                        <span className="font-medium">
                          {format(pickupDate, "dd.MM.yyyy")} {pickupTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("returnPlace")}:</span>
                        <span className="font-medium">
                          {format(returnDate, "dd.MM.yyyy")} {returnTime}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-base font-bold">
                      <span>{t("totalAmount")}:</span>
                      <span>{formatPrice(totalPrice.toString())}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-lg"
                disabled={!pickupDate || !returnDate || !pickupLocation || !returnLocation || 
                         !customerInfo.customerName || !customerInfo.email || !customerInfo.phone ||
                         isSubmitting}
                onClick={handleReservation}
              >
                {isSubmitting ? t("processingReservation") : t("makeReservation")}
              </Button>
            </div>
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