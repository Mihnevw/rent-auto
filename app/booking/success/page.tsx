"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { FooterSection } from "@/components/sections/footer-section"
import { useLanguage } from "@/lib/language-context"
import { CheckCircle, XCircle } from "lucide-react"
import { buildApiUrl, config, API_BASE_URL } from '@/lib/config'

// Separate component that uses useSearchParams
function SuccessPageContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  // Handle payment confirmation
  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Get payment_intent from URL
        const fullPaymentIntent = searchParams.get('payment_intent')
        
        if (!fullPaymentIntent) {
          console.error('No payment intent found in URL')
          throw new Error(t("paymentFailed"))
        }

        // Extract the payment intent ID (everything before _secret)
        const paymentIntentId = fullPaymentIntent.split('_secret_')[0]
        
        if (!paymentIntentId) {
          console.error('Could not extract payment intent ID from:', fullPaymentIntent)
          throw new Error(t("paymentFailed"))
        }

        // Add a 10 second delay before confirming payment
        await new Promise(resolve => setTimeout(resolve, 10000))

        // Log the request details for debugging
        console.log('Confirming payment with:', {
          apiUrl: buildApiUrl(config.api.endpoints.confirmPayment),
          paymentIntentId,
          baseUrl: API_BASE_URL
        })

        // Make the API request with proper error handling
        let response
        try {
          response = await fetch(buildApiUrl(config.api.endpoints.confirmPayment), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId })
          })
        } catch (networkError) {
          console.error('Network error during payment confirmation:', networkError)
          throw new Error(t("paymentConfirmationFailed"))
        }

        // Attempt to parse response JSON (may be empty on some error cases)
        let responseData: any = null
        try {
          responseData = await response.json()
        } catch (jsonParseErr) {
          // It's possible the backend returned no JSON (e.g., empty 204). That's fine – we'll handle based on status.
          console.warn('No JSON body in response:', jsonParseErr)
        }

        // Handle different response scenarios
        if (!response.ok) {
          // If the reservation was already finalized on the backend we might get a 404 with
          // "Reservation data not found". In that situation we can safely treat it as a success
          // because the reservation exists – the pending record we look for is simply gone.
          if (
            response.status === 404 &&
            responseData &&
            typeof responseData.error === 'string' &&
            responseData.error.toLowerCase().includes('reservation data not found')
          ) {
            console.warn('Reservation already completed – treating as success.')
            setStatus('success')
            return
          }

          let errorMessage = t("paymentConfirmationFailed")

          if (responseData && responseData.error) {
            errorMessage = responseData.error
          }

          console.error('Payment confirmation failed:', {
            status: response.status,
            statusText: response.statusText,
            error: responseData
          })

          throw new Error(errorMessage)
        }

        // If we reached here the response was OK – ensure it indicates success
        if (!responseData || !responseData.success) {
          console.error('Invalid success response:', responseData)
          throw new Error(responseData?.error || t("paymentConfirmationFailed"))
        }

        // Payment confirmed successfully
        console.log('Payment confirmed successfully:', responseData)
        setStatus('success')
        
      } catch (err) {
        console.error('Payment confirmation error:', err)
        setStatus('error')
        setError(err instanceof Error ? err.message : t("paymentFailed"))
      }
    }

    // Only try to confirm payment if we have a payment_intent parameter
    if (searchParams.get('payment_intent')) {
      confirmPayment()
    } else {
      console.error('No payment_intent parameter in URL')
      setStatus('error')
      setError(t("paymentFailed"))
    }
  }, [searchParams, t])

  // Countdown timer
  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status])

  // Redirect when countdown ends
  useEffect(() => {
    if (status === 'success' && secondsLeft === 0) {
      router.push("/")
    }
  }, [secondsLeft, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {t("loading")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("processing")}
            </p>
          </div>
        </main>
        <FooterSection />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16 mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("error")}
            </h1>
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/cars")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {t("seeMore")}
              </button>
              <p className="text-sm text-gray-500">
                {t("contactForQuestions")}
              </p>
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16 mt-20">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("bookingData")}
          </h1>
          
          <div className="text-lg text-gray-600 mb-8">
            <p className="mb-4">
              {t("bookingConfirmationSent")}
            </p>
            <p className="mb-4">
              {t("thankYouForBooking")}
            </p>
            <p className="text-sm text-gray-500">
              {t("redirectingHome").replace("{seconds}", secondsLeft.toString())}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="text-left max-w-md mx-auto">
              <h2 className="font-semibold text-gray-900 mb-4">
                {t("bookingData")}:
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">1.</span>
                  {t("checkEmailStep")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">2.</span>
                  {t("saveBookingCode")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">3.</span>
                  {t("contactForQuestions")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}

// Loading fallback component
function SuccessPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-16 mt-20">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Loading...
          </h1>
          <p className="text-gray-600 mt-2">
            Preparing your booking confirmation...
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}

// Main page component with Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessPageLoading />}>
      <SuccessPageContent />
    </Suspense>
  )
} 