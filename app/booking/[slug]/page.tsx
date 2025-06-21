"use client"

import React, { use, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/language-context"
import { X } from "lucide-react"
import { toast } from "sonner"

interface CarDetails {
  id: string
  name: string
  image: string
  price: string
  specifications: string[]
}

type BookingPageProps = {
  params: Promise<{
    slug: string
  }>
}

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  drivingLicense: string
  additionalNotes: string
}

type BookingDetails = {
  pickup: string
  return: string
  pickupDate: string
  returnDate: string
  pickupTime: string
  returnTime: string
}

export default function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const router = useRouter()

  const searchParams = useSearchParams()
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    drivingLicense: "",
    additionalNotes: "",
  })

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    pickup: "",
    return: "",
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
  })

  const { language, t, formatPrice } = useLanguage()
  const [car, setCar] = useState<CarDetails | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    // Fetch car details from the API
    fetch(`/api/cars/id/${slug}`)
      .then(res => res.json())
      .then(data => setCar(data.car))
      .catch(() => setCar(null))
  }, [slug])

  useEffect(() => {
    // Check for incomplete reservation in localStorage
    const incompleteBooking = localStorage.getItem('incompleteBooking')
    if (incompleteBooking && incompleteBooking !== slug) {
      setShowIncompleteDialog(true)
    } else {
      // Store current booking in localStorage
      localStorage.setItem('incompleteBooking', slug)
    }

    // Get booking details from URL parameters
    setBookingDetails({
      pickup: searchParams.get("pickup") || "",
      return: searchParams.get("return") || "",
      pickupDate: searchParams.get("pickupDate") || "",
      returnDate: searchParams.get("returnDate") || "",
      pickupTime: searchParams.get("pickupTime") || "",
      returnTime: searchParams.get("returnTime") || "",
    })
  }, [searchParams, slug])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateDays = () => {
    if (bookingDetails.pickupDate && bookingDetails.returnDate) {
      try {
        const [pickupDay, pickupMonth, pickupYear] = bookingDetails.pickupDate.split("-")
        const [returnDay, returnMonth, returnYear] = bookingDetails.returnDate.split("-")
        
        const pickup = new Date(Number(pickupYear), Number(pickupMonth) - 1, Number(pickupDay))
        const returnDate = new Date(Number(returnYear), Number(returnMonth) - 1, Number(returnDay))
        
        if (isNaN(pickup.getTime()) || isNaN(returnDate.getTime())) {
          return 1
        }
        
        const diffTime = Math.abs(returnDate.getTime() - pickup.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays || 1 // Return 1 if diffDays is 0
      } catch (error) {
        console.error('Error calculating days:', error)
        return 1
      }
    }
    return 1
  }

  const totalPrice = car ? Number.parseFloat(car.price) * calculateDays() : 0

  const handleContinueBooking = () => {
    setShowIncompleteDialog(false)
    // Navigate to the incomplete booking
    const incompleteBooking = localStorage.getItem('incompleteBooking')
    if (incompleteBooking) {
      router.push(`/booking/${incompleteBooking}`)
    }
  }

  const handleCancelBooking = () => {
    // Clear the incomplete booking
    localStorage.removeItem('incompleteBooking')
    setShowIncompleteDialog(false)
    // Store current booking
    localStorage.setItem('incompleteBooking', slug)
  }

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Only clear if it's the current booking being cleared
      const currentIncomplete = localStorage.getItem('incompleteBooking')
      if (currentIncomplete === slug) {
        localStorage.removeItem('incompleteBooking')
      }
    }
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!termsAccepted) {
      toast.error(t("pleaseAcceptTerms"))
      return
    }

    setIsSubmitting(true)

    try {
      // Create reservation
      const reservationResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          car_id: slug,
          customer_name: formData.firstName,
          customer_last_name: formData.lastName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          notes: formData.additionalNotes,
          pickup_location: bookingDetails.pickup,
          return_location: bookingDetails.return,
          start_datetime: `${bookingDetails.pickupDate} ${bookingDetails.pickupTime}`,
          end_datetime: `${bookingDetails.returnDate} ${bookingDetails.returnTime}`,
        }),
      })

      const reservationData = await reservationResponse.json()

      if (!reservationResponse.ok) {
        throw new Error(reservationData.error || 'Failed to create reservation')
      }

      // Create Stripe checkout session
      const stripeResponse = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservation_id: reservationData.reservation.id,
          amount: totalPrice,
          customer_email: formData.email,
        }),
      })

      const stripeData = await stripeResponse.json()

      if (!stripeResponse.ok) {
        throw new Error(stripeData.error || 'Failed to create payment session')
      }

      // Clear incomplete booking from localStorage
      localStorage.removeItem('incompleteBooking')

      // Redirect to Stripe checkout
      window.location.href = stripeData.url
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!car) {
    return <div>Car not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Incomplete Reservation Dialog */}
      <Dialog open={showIncompleteDialog} onOpenChange={setShowIncompleteDialog}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-bold text-center">
              Имате недовършена резервация
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Затвори</span>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-center text-gray-700 text-lg">
              Трябва да довършите своята резервация преди да може да започнете нова?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-center text-red-600 text-sm">
                При отказ, започната резервация ще бъде изтрита и няма да можете да я достъпе отново!
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={handleContinueBooking}
                className="w-full sm:w-auto bg-[#FDB022] hover:bg-black/90 text-white font-semibold py-2 px-6 rounded-full"
              >
                Завършихте резервацията
              </Button>
              <Button
                onClick={handleCancelBooking}
                variant="outline"
                className="w-full sm:w-auto bg-black text-white hover:bg-[#FDB022]/90 font-semibold py-2 px-6 rounded-full"
              >
                Откажи резервацията
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t("bookingTitle")}</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("bookingData")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t("personalData")}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t("firstName")} *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Вашето име"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t("lastName")} *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Вашата фамилия"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("email")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+359 ..."
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="drivingLicense">{t("drivingLicense")} *</Label>
                      <Input
                        id="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={(e) => handleInputChange("drivingLicense", e.target.value)}
                        placeholder="Номер на шофьорска книжка"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="additionalNotes">{t("additionalNotes")}</Label>
                  <textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    placeholder={t("additionalRequirements")}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1" 
                    required 
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    {t("agreeToTerms")}{" "}
                    <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {t("termsAndConditions")}
                    </a>{" "}
                    {t("and")}{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      {t("privacyPolicy")}
                    </a>
                  </label>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("processing") : t("confirmBooking")}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t("bookingSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Car Details */}
                <div>
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain bg-gray-50 rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-lg text-blue-600 mb-2">{car.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {car.specifications.map((spec: string, index: number) => (
                      <div key={index}>• {spec}</div>
                    ))}
                  </div>
                </div>

                {/* Rental Details */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">{t("rentalDetails")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t("pickupPlace")}:</span>
                      <span className="font-medium">{bookingDetails.pickup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("returnPlace")}:</span>
                      <span className="font-medium">{bookingDetails.return}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("period")}:</span>
                      <span className="font-medium">
                        {bookingDetails.pickupDate} - {bookingDetails.returnDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("time")}:</span>
                      <span className="font-medium">
                        {bookingDetails.pickupTime} - {bookingDetails.returnTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("numberOfDays")}:</span>
                      <span className="font-medium">{calculateDays()}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">{t("priceBreakdown")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t("pricePerDay")}:</span>
                      <span>{formatPrice(car.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("numberOfDays")}:</span>
                      <span>{calculateDays().toString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                      <span>{t("total")}:</span>
                      <span className="text-blue-600">{formatPrice(totalPrice.toString())}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4 text-xs text-gray-400">
                  {t("contactInfo")}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
