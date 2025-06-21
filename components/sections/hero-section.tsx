import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { format, isBefore, startOfToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

type LocationKey = "burgas" | "pomorie" | "nessebar" | "sunnyBeach" | "svetiVlas" | "varna" | "goldenSands"

const rentalLocations: { value: LocationKey; labelKey: LocationKey }[] = [
  { value: "burgas", labelKey: "burgas" },
  { value: "pomorie", labelKey: "pomorie" },
  { value: "nessebar", labelKey: "nessebar" },
  { value: "sunnyBeach", labelKey: "sunnyBeach" },
  { value: "svetiVlas", labelKey: "svetiVlas" },
  { value: "varna", labelKey: "varna" },
  { value: "goldenSands", labelKey: "goldenSands" },
]

// Featured cars data
const featuredCars = [
  {
    id: 1,
    name: "SHKODA OCTAVIA",
    image: "/images/shkoda.png?height=300&width=500",
    alt: "SHKODA OCTAVIA"
  },
  {
    id: 2,
    name: "RANGE ROVER",
    image: "/images/range.png?height=300&width=500",
    alt: "RANGE ROVER"
  },
  {
    id: 3,
    name: "OPEL INSIGNIA",
    image: "/images/opel.png?height=300&width=500",
    alt: "OPEL INSIGNIA"
  },
  {
    id: 4,
    name: "MERCEDES C220",
    image: "/images/mercedes.png?height=300&width=500",
    alt: "MERCEDES C220"
  },
  {
    id: 5,
    name: "JAGUAR XE",
    image: "/images/jaguar.png?height=300&width=500",
    alt: "JAGUAR XE"
  }
]

export function HeroSection() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date | undefined>()
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [returnTime, setReturnTime] = useState("10:00")
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSearch = () => {
    if (!pickupLocation || !returnLocation || !pickupDate || !returnDate) return
    const params = new URLSearchParams({
      pickup: pickupLocation,
      return: returnLocation,
      pickupDate: format(pickupDate, "yyyy-MM-dd"),
      pickupTime,
      returnDate: format(returnDate, "yyyy-MM-dd"),
      returnTime,
    })
    router.push(`/search?${params.toString()}`)
  }

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

  const handleCarSelect = (carId: number) => {
    setSelectedCarId(carId)
    if (pickupDate && returnDate && pickupLocation && returnLocation) {
      const params = new URLSearchParams({
        pickup: pickupLocation,
        return: returnLocation,
        pickupDate: format(pickupDate, "yyyy-MM-dd"),
        pickupTime,
        returnDate: format(returnDate, "yyyy-MM-dd"),
        returnTime,
      })
      router.push(`/booking/${carId}?${params.toString()}`)
    }
  }

  return (
    <section className="relative min-h-[600px] bg-gradient-to-r from-blue-500 to-green-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Form */}
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-8 ">{t("carsForRent")}</h1>

            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm mx-auto lg:mx-0">
              {/* Pickup Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("rental")}</h3>

                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-2 block">{t("pickupLocation")}</Label>
                  <Select value={pickupLocation} onValueChange={setPickupLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {t(location.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : <span>Изберете дата</span>}
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
                  <div className="min-w-0">
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupTime")}</Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("return")}</h3>

                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-2 block">{t("returnLocation")}</Label>
                  <Select value={returnLocation} onValueChange={setReturnLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {t(location.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "PPP") : <span>Изберете дата</span>}
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
                  <div className="min-w-0">
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnTime")}</Label>
                    <div className="relative">
                      <Input
                        type="time"
                        value={returnTime}
                        onChange={e => setReturnTime(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-lg text-lg"
                disabled={!pickupDate || !returnDate || !pickupLocation || !returnLocation}
                onClick={handleSearch}
              >
                {t("search")}
              </Button>
            </div>
          </div>

          {/* Right side - Car showcase */}
          <div className="relative text-center">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 5000,
                }),
              ]}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {featuredCars.map((car) => (
                  <CarouselItem key={car.id}>
                    <div className="p-1">
                      <div className="text-white text-lg font-semibold mb-4">{car.name}</div>
                      <div className="relative">
                        <Image
                          src={car.image}
                          alt={car.alt}
                          width={500}
                          height={300}
                          className="mx-auto"
                        />
                      </div>
                      <Button 
                        className="mt-8 bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-lg"
                        onClick={() => handleCarSelect(car.id)}
                      >
                        {pickupDate && returnDate && pickupLocation && returnLocation 
                          ? t("rental")
                          : t("seeMore")}
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
} 
