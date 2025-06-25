"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { format, isBefore, startOfToday } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, STORAGE_KEYS, saveToStorage, getFromStorage } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { buildApiUrl, config } from '@/lib/config'

interface Location {
  _id: string
  name: string
  address: string
  city: string
  isActive: boolean
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
      if (!minutes) {
        onChange("")
        return
      }
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
      if (!hours) {
        onChange("")
        return
      }
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

interface RentalFormProps {
  carId?: string
  className?: string
}

// Add storage keys for contact info
const CONTACT_STORAGE_KEYS = {
  NAME: 'contactName',
  EMAIL: 'contactEmail',
  PHONE: 'contactPhone'
} as const

export function RentalForm({ carId, className }: RentalFormProps) {
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [pickupDate, setPickupDate] = useState<Date | undefined>()
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [returnTime, setReturnTime] = useState("10:00")
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({})

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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(buildApiUrl(config.api.endpoints.locations))
        if (!response.ok) {
          throw new Error(`Failed to fetch locations: ${response.status}`)
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Invalid locations data format')
        }
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setError(t("errorFetchingLocations"))
        setLocations([]) // Reset to empty array on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Load saved contact info from localStorage
  useEffect(() => {
    const savedName = getFromStorage(CONTACT_STORAGE_KEYS.NAME)
    const savedEmail = getFromStorage(CONTACT_STORAGE_KEYS.EMAIL)
    const savedPhone = getFromStorage(CONTACT_STORAGE_KEYS.PHONE)

    setContactInfo({
      name: savedName || '',
      email: savedEmail || '',
      phone: savedPhone || ''
    })
  }, [])

  // Save contact info to localStorage when it changes
  useEffect(() => {
    saveToStorage(CONTACT_STORAGE_KEYS.NAME, contactInfo.name)
    saveToStorage(CONTACT_STORAGE_KEYS.EMAIL, contactInfo.email)
    saveToStorage(CONTACT_STORAGE_KEYS.PHONE, contactInfo.phone)
  }, [contactInfo])

  // Handle contact info changes
  const handleContactInfoChange = (field: keyof typeof contactInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // Validate contact info
  const validateContactInfo = () => {
    const errors: typeof validationErrors = {}

    if (!contactInfo.name.trim()) {
      errors.name = t("nameRequired")
    }

    if (!contactInfo.email.trim()) {
      errors.email = t("emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.email = t("invalidEmail")
    }

    if (!contactInfo.phone.trim()) {
      errors.phone = t("phoneRequired")
    } else if (!/^\+?[\d\s-]{8,}$/.test(contactInfo.phone)) {
      errors.phone = t("invalidPhone")
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSearch = async () => {
    if (!pickupLocation || !returnLocation || !pickupDate || !returnDate) {
      setError(t("fillAllFields"))
      return
    }

    if (!validateContactInfo()) {
      return
    }

    setError(null)
    setIsCheckingAvailability(true)
    
    try {
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

      // First check if car is available
      const availabilityParams = {
        pickupTime: pickupDateTime,
        returnTime: returnDateTime,
        pickupLocation,
        returnLocation,
        ...(carId && { carId })
      }

      const availabilityResponse = await fetch(buildApiUrl(config.api.endpoints.availableCars, availabilityParams))
      const availabilityData = await availabilityResponse.json()

      if (!availabilityResponse.ok) {
        throw new Error(availabilityData.error || t("failedToCheckAvailability"))
      }

      if (availabilityData.count === 0) {
        setError(t("noAvailableCars"))
        return
      }

      // If car is available, create reservation
      const reservationData = {
        carId: carId || availabilityData.cars[0]._id,
        fromDate: format(pickupDate, "yyyy-MM-dd"),
        toDate: format(returnDate, "yyyy-MM-dd"),
        fromTime: pickupTime,
        toTime: returnTime,
        fromPlace: pickupLocation,
        toPlace: returnLocation,
        customerName: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        fromDateTime: pickupDateTime,
        toDateTime: returnDateTime,
        totalAmount: availabilityData.cars[0].price,
        additionalServices: {
          childSeat: false
        }
      }

      // Make reservation request
      const reservationResponse = await fetch(buildApiUrl(config.api.endpoints.reservations), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      })

      const reservationResult = await reservationResponse.json()

      if (!reservationResponse.ok) {
        throw new Error(reservationResult.error || t("errorOccurred"))
      }

      // If successful, redirect to success page with reservation details
      router.push(`/booking/success?code=${reservationResult.code}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorOccurred"))
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date)
    if (date && returnDate && isBefore(returnDate, date)) {
      setReturnDate(undefined)
      saveToStorage(STORAGE_KEYS.RETURN_DATE, null)
    }
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  const modifiers = {
    past: (date: Date) => isBefore(date, startOfToday())
  }

  const modifiersStyles = {
    past: {
      color: 'white',
      backgroundColor: 'rgba(107, 114, 128, 0.8)',
      textDecoration: 'line-through'
    }
  }

  const modifiersClassNames = {
    past: 'text-white bg-gray-500 line-through'
  }

  // Custom location setters
  const handlePickupLocationChange = (value: string) => {
    setPickupLocation(value)
    // If return location is not set, set it to the same as pickup
    if (!returnLocation) {
      setReturnLocation(value)
      saveToStorage(STORAGE_KEYS.RETURN_LOCATION, value)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{carId ? t("reservationDetails") : t("detailsForRental")}</h3>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Pickup Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t("pickupDetails")}</h3>

        <div className="space-y-4">
          {/* Pickup Location */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">{t("pickupLocation")}</Label>
            <Select value={pickupLocation} onValueChange={handlePickupLocationChange}>
              <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 text-gray-500">
                <SelectValue placeholder={isLoading ? t("loading") : t("selectCity")} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {(locations || []).filter(loc => loc && loc.isActive).map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name} ({location.city})
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
          {/* Return Location */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">{t("returnLocation")}</Label>
            <Select value={returnLocation} onValueChange={setReturnLocation}>
              <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 text-gray-500">
                <SelectValue placeholder={isLoading ? t("loading") : t("selectCity")} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {(locations || []).filter(loc => loc && loc.isActive).map((location) => (
                  <SelectItem key={location._id} value={location._id}>
                    {location.name} ({location.city})
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
            <TimeInput
              value={returnTime}
              onChange={setReturnTime}
              label={t("returnTime")}
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t("customerDetails")}</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">{t("fullName")}</Label>
            <Input
              type="text"
              value={contactInfo.name}
              onChange={handleContactInfoChange('name')}
              className={cn(
                "w-full h-12 rounded-lg",
                validationErrors.name && "border-red-500"
              )}
              placeholder={t("enterFullName")}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">{t("email")}</Label>
            <Input
              type="email"
              value={contactInfo.email}
              onChange={handleContactInfoChange('email')}
              className={cn(
                "w-full h-12 rounded-lg",
                validationErrors.email && "border-red-500"
              )}
              placeholder={t("enterEmail")}
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">{t("phone")}</Label>
            <Input
              type="tel"
              value={contactInfo.phone}
              onChange={handleContactInfoChange('phone')}
              className={cn(
                "w-full h-12 rounded-lg",
                validationErrors.phone && "border-red-500"
              )}
              placeholder={t("enterPhone")}
            />
            {validationErrors.phone && (
              <p className="text-sm text-red-500 mt-1">{validationErrors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 rounded-lg text-lg transition-colors"
        disabled={!pickupDate || !returnDate || !pickupLocation || !returnLocation || isLoading || isCheckingAvailability}
        onClick={handleSearch}
      >
        {isCheckingAvailability ? t("processing") : (isLoading ? t("loading") : t("confirmBooking"))}
      </Button>
    </div>
  )
} 