import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, MapPin, Car, ArrowRight, Search } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { format, isBefore, startOfToday, addDays, isWithinInterval, parseISO } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, STORAGE_KEYS, saveToStorage, getFromStorage } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { type TranslationKey } from "@/lib/translations"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { buildApiUrl, config } from '@/lib/config'

interface Location {
  _id: string
  name: string
  address: string
  city: string
  isActive: boolean
  displayName?: string
}

interface Reservation {
  pickupTime: string;
  returnTime: string;
  carId: string;
}

interface BookedDates {
  start: string;
  end: string;
}

interface AvailabilityStatus {
  date: string;
  status: 'fully-booked' | 'partially-available' | 'available';
  availableHours?: string[];
}

// Featured cars data
const featuredCars: Array<{
  id: number
  name: string
  image: string
  alt: string
}> = [
  {
    id: 1,
    name: "SKODA OCTAVIA",
    image: "/images/shkoda.png?height=300&width=500",
    alt: "SKODA OCTAVIA"
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
    name: "BMW 3 SERIES",
    image: "/images/bmw-3.png?height=300&width=500",
    alt: "BMW 3"
  }
]

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

export function HeroSection() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date | undefined>()
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [returnTime, setReturnTime] = useState("10:00")
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { t } = useLanguage()
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  // Load saved data from localStorage
  useEffect(() => {
    const savedPickupDate = getFromStorage(STORAGE_KEYS.PICKUP_DATE)
    const savedPickupTime = getFromStorage(STORAGE_KEYS.PICKUP_TIME)
    const savedReturnDate = getFromStorage(STORAGE_KEYS.RETURN_DATE)
    const savedReturnTime = getFromStorage(STORAGE_KEYS.RETURN_TIME)
    const savedPickupLocation = getFromStorage(STORAGE_KEYS.PICKUP_LOCATION)
    const savedReturnLocation = getFromStorage(STORAGE_KEYS.RETURN_LOCATION)

    if (savedPickupDate) setPickupDate(new Date(savedPickupDate))
    if (savedPickupTime) setPickupTime(savedPickupTime)
    if (savedReturnDate) setReturnDate(new Date(savedReturnDate))
    if (savedReturnTime) setReturnTime(savedReturnTime)
    if (savedPickupLocation) setPickupLocation(savedPickupLocation)
    if (savedReturnLocation) setReturnLocation(savedReturnLocation)
  }, [])

  // Save dates and times to localStorage when they change
  useEffect(() => {
    if (pickupDate) saveToStorage(STORAGE_KEYS.PICKUP_DATE, pickupDate.toISOString())
    saveToStorage(STORAGE_KEYS.PICKUP_TIME, pickupTime)
  }, [pickupDate, pickupTime])

  useEffect(() => {
    if (returnDate) saveToStorage(STORAGE_KEYS.RETURN_DATE, returnDate.toISOString())
    saveToStorage(STORAGE_KEYS.RETURN_TIME, returnTime)
  }, [returnDate, returnTime])

  // Save locations to localStorage when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PICKUP_LOCATION, pickupLocation)
  }, [pickupLocation])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RETURN_LOCATION, returnLocation)
  }, [returnLocation])

  // Custom location setters
  const handlePickupLocationChange = (value: string) => {
    setPickupLocation(value)
    // If return location is not set, set it to the same as pickup
    if (!returnLocation) {
      setReturnLocation(value)
      saveToStorage(STORAGE_KEYS.RETURN_LOCATION, value)
    }
  }

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(buildApiUrl(config.api.endpoints.locations))
        if (!response.ok) throw new Error('Failed to fetch locations')
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setError(t("errorFetchingLocations"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Handle search with availability check
  const handleSearch = async () => {
    if (!pickupLocation || !returnLocation || !pickupDate || !returnDate) {
      setError(t("fillAllFields"))
      return
    }

    setError(null)
    setIsCheckingAvailability(true)
    
    try {
      // Format dates for the API
      const pickupDateTime = new Date(
        pickupDate.getFullYear(),
        pickupDate.getMonth(),
        pickupDate.getDate(),
        ...pickupTime.split(":").map(Number)
      ).toISOString()

      const returnDateTime = new Date(
        returnDate.getFullYear(),
        returnDate.getMonth(),
        returnDate.getDate(),
        ...returnTime.split(":").map(Number)
      ).toISOString()

      // Check car availability
      const params = {
        pickupTime: pickupDateTime,
        returnTime: returnDateTime,
        pickupLocation,
        returnLocation
      }

      const response = await fetch(buildApiUrl(config.api.endpoints.availableCars, params))
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t("failedToCheckAvailability"))
      }

      if (data.count === 0) {
        setError(t("noAvailableCars"))
        return
      }

      // If cars are available, redirect to search page
      const searchParams = new URLSearchParams({
      pickup: pickupLocation,
      return: returnLocation,
      pickupDate: format(pickupDate, "yyyy-MM-dd"),
      pickupTime,
      returnDate: format(returnDate, "yyyy-MM-dd"),
      returnTime,
    })

      router.push(`/search?${searchParams.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorOccurred"))
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  // Handle pickup date change
  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date)
    // If return date is before pickup date, reset it
    if (date && returnDate && isBefore(returnDate, date)) {
      setReturnDate(undefined)
      saveToStorage(STORAGE_KEYS.RETURN_DATE, null)
    }
  }

  // Function to check if a date is disabled
  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  // Calendar modifiers
  const modifiers = {
    past: (date: Date) => isBefore(date, startOfToday())
  }

  // Calendar modifier styles
  const modifiersStyles = {
    past: {
      color: 'white',
      backgroundColor: 'rgba(107, 114, 128, 0.8)',
      textDecoration: 'line-through'
    }
  }

  // Calendar class names
  const modifiersClassNames = {
    past: 'text-white bg-gray-500 line-through'
  }

  // Format location display name
  const getLocationDisplayName = (location: Location) => {
    if (location.city === "Varna" && location.name.includes("Airport")) {
      return t("varnaAirport")
    }
    if (location.city === "Burgas" && location.name.includes("Airport")) {
      return t("burgasAirport")
    }
    if (location.city === "Sunny Beach" || location.city === "Слънчев бряг") {
      return t("sunnyBeach")
    }
    return `${location.name} (${location.city})`
  }

  return (
    <section className="relative min-h-[600px] bg-gradient-to-r from-blue-500 to-green-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Form */}
          <div className="order-2 lg:order-1 w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8 text-center lg:text-left">
              {t("carsForRent")}
            </h1>

            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl w-full max-w-md mx-auto lg:mx-0">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Pickup Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">{t("rental")}</h3>

                <div className="space-y-4">
                  {/* Pickup Location */}
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupLocation")}</Label>
                    <Select value={pickupLocation} onValueChange={handlePickupLocationChange}>
                      <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 text-gray-500">
                        <SelectValue placeholder={isLoading ? t("loading") : t("selectCity")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {locations.filter(loc => loc.isActive).map((location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {getLocationDisplayName(location)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pickup Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
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
                            modifiers={modifiers}
                            modifiersStyles={modifiersStyles}
                            modifiersClassNames={modifiersClassNames}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <TimeInput
                        value={pickupTime}
                        onChange={setPickupTime}
                        label={t("pickupTime")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wide">{t("return")}</h3>

                <div className="space-y-4">
                  {/* Return Location */}
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnLocation")}</Label>
                    <Select value={returnLocation} onValueChange={setReturnLocation}>
                      <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 text-gray-500">
                        <SelectValue placeholder={isLoading ? t("loading") : t("selectCity")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {locations.filter(loc => loc.isActive).map((location) => (
                          <SelectItem key={location._id} value={location._id}>
                            {getLocationDisplayName(location)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Return Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
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
                            modifiers={modifiers}
                            modifiersStyles={modifiersStyles}
                            modifiersClassNames={modifiersClassNames}
                            initialFocus
                            fromDate={pickupDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <TimeInput
                        value={returnTime}
                        onChange={setReturnTime}
                        label={t("returnTime")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <Button
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition-colors uppercase tracking-wide"
                disabled={!pickupDate || !returnDate || !pickupLocation || !returnLocation || isCheckingAvailability}
                onClick={handleSearch}
              >
                {isCheckingAvailability ? t("checking") : t("search")}
              </Button>
            </div>
          </div>

          {/* Right side - Car showcase */}
          <div className="order-1 lg:order-2 relative">
            <div className="text-center">
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 4000,
                    stopOnInteraction: true,
                  }),
                ]}
                className="w-full max-w-[90vw] lg:max-w-full mx-auto"
              >
                <CarouselContent>
                  {featuredCars.map((car) => (
                    <CarouselItem key={car.id}>
                      <div className="px-4">
                        <div className="text-xl md:text-2xl text-white font-bold mb-4 md:mb-8">{car.name}</div>
                        <div className="aspect-[16/9] relative px-4 md:px-16">
                          <Image
                            src={car.image}
                            alt={car.alt}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 33vw"
                            priority={car.id === 1}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full" />
                <CarouselNext className="absolute -right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full" />
              </Carousel>

              <div className="mt-6 md:mt-8">
                <Link href="/cars">
                  <Button
                    className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 md:px-8 py-2 md:py-3 rounded-lg text-base md:text-lg transition-colors uppercase tracking-wide"
                  >
                    {t("seeMore")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}