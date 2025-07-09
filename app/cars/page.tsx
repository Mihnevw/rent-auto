"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Fuel, Users, Car, Settings, Gauge } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isBefore, startOfToday } from "date-fns"
import { cn, STORAGE_KEYS, saveToStorage, getFromStorage } from "@/lib/utils"
import { FooterSection } from "@/components/sections/footer-section"
import { useMobile } from "@/hooks/use-mobile"

interface Location {
  _id: string
  name: string
  address: string
  city: string
  isActive: boolean
  displayName?: string
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

interface CarType {
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
  currentLocation: {
    _id: string
    name: string
    address: string
    city: string
    isActive: boolean
  }
}

const rentalLocations = [
  { value: "burgas", labelKey: "burgas" },
  { value: "pomorie", labelKey: "pomorie" },
  { value: "nessebar", labelKey: "nessebar" },
  { value: "sunny-beach", labelKey: "sunnyBeach" },
  { value: "sveti-vlas", labelKey: "svetiVlas" },
  { value: "varna", labelKey: "varna" },
  { value: "golden-sands", labelKey: "goldenSands" },
]

export default function CarsPage() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [bodyType, setBodyType] = useState("all")
  const [pickupDate, setPickupDate] = useState<Date | undefined>()
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnTime, setReturnTime] = useState("10:00")
  const [cars, setCars] = useState<CarType[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add filter states
  const [filters, setFilters] = useState({
    diesel: false,
    gasoline: false,
    automatic: false,
    manual: false,
  })

  const { t, formatPrice } = useLanguage()

  const [visibleCarsOnMobile, setVisibleCarsOnMobile] = useState(4)
  const isMobile = useMobile()

  // Filter cars based on selected criteria
  const filteredCars = cars.filter((car) => {
    // Fuel type filtering
    const fuelMatch =
      (!filters.diesel && !filters.gasoline) || // No fuel filter selected
      (filters.diesel && car.fuel.toLowerCase().includes("diesel")) ||
      (filters.gasoline && car.fuel.toLowerCase().includes("gasoline"))

    // Transmission filtering
    const transmissionMatch =
      (!filters.automatic && !filters.manual) || // No transmission filter selected
      (filters.automatic && car.transmission.toLowerCase() === "automatic") ||
      (filters.manual && car.transmission.toLowerCase() === "manual")

    // Body type filtering
    const bodyTypeMatch = bodyType === "all" || car.bodyType.toLowerCase() === bodyType.toLowerCase()

    return fuelMatch && transmissionMatch && bodyTypeMatch
  })

  // Get visible cars based on device
  const displayedCars = isMobile 
    ? filteredCars.slice(0, visibleCarsOnMobile)
    : filteredCars

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

  const fetchAvailableCars = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!pickupLocation || !returnLocation || !pickupDate || !returnDate) {
        // If no search criteria, fetch all cars
        const response = await fetch('http://localhost:8800/cars')
        if (!response.ok) throw new Error('Failed to fetch cars')
        const data = await response.json()
        setCars(data)
        return
      }

      // Format dates to ISO 8601
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

      const queryParams = new URLSearchParams({
        pickupTime: pickupDateTime,
        returnTime: returnDateTime,
        pickupLocation,
        returnLocation
      })

      const response = await fetch(`http://localhost:8800/reservations/cars/available?${queryParams.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch available cars')
      }
      
      const data = await response.json()
      // Transform the cars data to ensure _id is present
      const transformedCars = data.availableCars.map((car: { id?: string; _id?: string } & Omit<CarType, '_id'>) => ({
        ...car,
        _id: car._id || car.id // Use _id if present, otherwise use id
      }))
      setCars(transformedCars)
    } catch (err) {
      console.error('Error fetching cars:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8800/locations')
        if (!response.ok) throw new Error('Failed to fetch locations')
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
    fetchAvailableCars() // Initial fetch of all cars
  }, []) // Empty dependency array for initial load only

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date)
    if (date && returnDate && isBefore(returnDate, date)) {
      setReturnDate(undefined)
      saveToStorage(STORAGE_KEYS.RETURN_DATE, null)
    }
  }

  const handleFilterChange = (filterType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked,
      // Reset opposite transmission when one is selected
      ...(filterType === "automatic" && checked ? { manual: false } : {}),
      ...(filterType === "manual" && checked ? { automatic: false } : {})
    }))
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

  const showAllCarsOnMobile = () => {
    setVisibleCarsOnMobile(filteredCars.length)
  }

  const hideAllCarsOnMobile = () => {
    setVisibleCarsOnMobile(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading cars...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Description Text - Always visible on top for mobile */}
        <div className="lg:hidden mb-8">
          <p className="text-gray-700 text-lg leading-relaxed">{t("carsPageDescription")}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Rental Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("rental")}</h3>

                {/* Pickup Location */}
                <div className="space-y-4">
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
                  <div className="grid grid-cols-1 gap-4">
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
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("return")}</h3>

                {/* Return Location */}
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
                            {getLocationDisplayName(location)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Return Date and Time */}
                  <div className="grid grid-cols-1 gap-4">
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
                    <TimeInput
                      value={returnTime}
                      onChange={setReturnTime}
                      label={t("returnTime")}
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 rounded-lg mb-6"
                disabled={!pickupDate || !returnDate || !pickupLocation || !returnLocation || isLoading}
                onClick={fetchAvailableCars}
              >
                {isLoading ? t("loading") : t("search")}
                </Button>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* Filters Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{t("filter")}</h3>
                  {(filters.diesel || filters.gasoline || filters.automatic || filters.manual || bodyType) && (
                    <button
                      onClick={() => {
                        setFilters({ diesel: false, gasoline: false, automatic: false, manual: false })
                        setBodyType("all")
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {t("clearAllFilters")}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="diesel"
                      className="rounded"
                      checked={filters.diesel}
                      onChange={(e) => handleFilterChange("diesel", e.target.checked)}
                    />
                    <label htmlFor="diesel" className="text-sm text-gray-600">
                      {t("diesel")} {filters.diesel && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="automatic"
                      className="rounded"
                      checked={filters.automatic}
                      onChange={(e) => handleFilterChange("automatic", e.target.checked)}
                    />
                    <label htmlFor="automatic" className="text-sm text-gray-600">
                      {t("automatic")} {filters.automatic && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gasoline"
                      className="rounded"
                      checked={filters.gasoline}
                      onChange={(e) => handleFilterChange("gasoline", e.target.checked)}
                    />
                    <label htmlFor="gasoline" className="text-sm text-gray-600">
                      {t("gasoline")} {filters.gasoline && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="manual"
                      className="rounded"
                      checked={filters.manual}
                      onChange={(e) => handleFilterChange("manual", e.target.checked)}
                    />
                    <label htmlFor="manual" className="text-sm text-gray-600">
                      {t("manual")} {filters.manual && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">{t("bodyType")}</Label>
                  <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all" value="all">{t("all")}</SelectItem>
                      <SelectItem key="sedan" value="sedan">{t("sedan")}</SelectItem>
                      <SelectItem key="hatchback" value="hatchback">{t("hatchback")}</SelectItem>
                      <SelectItem key="suv" value="suv">{t("suv")}</SelectItem>
                      <SelectItem key="coupe" value="coupe">{t("coupe")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Description Text - Only visible on desktop */}
            <div className="hidden lg:block mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{t("carsPageDescription")}</p>
            </div>

            {/* Cars count info */}
            <div className="mb-8 text-sm text-gray-600">
              {t("showingCars")} {filteredCars.length} {t("ofCars")} {cars.length} {t("carsForPeriod")}
            </div>

            {/* Cars List */}
            <div className="space-y-6">
              {filteredCars.length > 0 ? (
                <>
                  {displayedCars.map((car) => (
                    <div 
                      key={car._id} 
                      className="relative bg-white rounded-lg shadow-sm p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                    >
                      {/* Gradient border overlay */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
                        <div className="h-full w-full bg-white rounded-lg"></div>
                      </div>
                      
                      {/* Content container */}
                      <div className="relative z-10 grid md:grid-cols-3 gap-6 items-center">
                        {/* Car Image */}
                        <div className="md:col-span-1">
                          <Image
                            src={car.mainImage ? `http://localhost:8800${car.mainImage}` : "/placeholder.svg"}
                            alt={car.name}
                            width={300}
                            height={200}
                            className="w-full h-40 object-contain"
                          />
                        </div>

                        {/* Car Details */}
                        <div className="md:col-span-1">
                          <div className="flex items-start gap-2 mb-4">
                            <h3 className="text-xl font-bold text-blue-600">{car.name}</h3>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Fuel className="w-4 h-4 text-blue-500" />
                              <span>{t("engineType")}: {car.engine}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Settings className="w-4 h-4 text-blue-500" />
                              <span>{t("transmission")}: {car.transmission === "automatic" ? t("automatic") : t("manual")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{car.seats} {t("seats")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Car className="w-4 h-4 text-blue-500" />
                              <span>{car.doors} {t("doors")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Gauge className="w-4 h-4 text-blue-500" />
                              <span>{t("fuelConsumption")}: {car.consumption}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="md:col-span-1 text-right">
                          <div className="flex justify-end mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-400 text-white">
                              {car.bodyType.toLowerCase() === 'sedan' ? t("economicCar") : 
                               car.bodyType.toLowerCase() === 'suv' ? t("suvCar") :
                               car.bodyType.toLowerCase() === 'wagon' ? t("wagonCar") :
                               car.bodyType.toUpperCase()}
                            </span>
                          </div>
                          <div className="mb-4">
                            <div className="text-3xl font-bold text-blue-600">{formatPrice(car.pricing["1_3"].toString())}</div>
                            <div className="text-sm text-gray-500">{t("perDay")}</div>
                          </div>
                          <Link href={`/cars/${car._id}`}>
                            <Button className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 transition-all duration-300 font-semibold px-6 py-2 rounded-3xl">
                              {t("viewDetails")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Mobile-only pagination buttons */}
                  {isMobile && filteredCars.length > 4 && (
                    <div className="flex flex-col items-center gap-4 mt-8">
                      {visibleCarsOnMobile < filteredCars.length && (
                        <Button
                          onClick={showAllCarsOnMobile}
                          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-full w-full max-w-xs"
                        >
                          Виж повече
                        </Button>
                      )}
                      
                      {visibleCarsOnMobile > 4 && (
                        <Button
                          onClick={hideAllCarsOnMobile}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-full w-full max-w-xs"
                        >
                          Скрий всички
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">Няма автомобили, отговарящи на избраните критерии</div>
                  <p className="text-gray-400">Моля, променете филтрите или се свържете с нас за повече опции</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
