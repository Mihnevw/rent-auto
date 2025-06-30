"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Head from "next/head"
import { FooterSection } from "@/components/sections/footer-section"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

// List of allowed email domains
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'abv.bg',
  'mail.bg',
  'dir.bg',
  'bol.bg',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  'seznam.cz',
  'wp.pl',
  'o2.pl',
  'meta.ua',
  'ukr.net'
]

// List of business domains (always allowed)
const BUSINESS_DOMAINS = [
  '.com',
  '.net',
  '.org',
  '.edu',
  '.gov',
  '.bg',
  '.eu',
  '.info',
  '.biz',
  '.co',
  '.io',
  '.me',
  '.dev',
  '.app'
]

// Common patterns in randomly generated emails
const SUSPICIOUS_PATTERNS = [
  /[0-9]{3,}/,          // 3 or more consecutive numbers
  /(.)\1{2,}/,          // Same character repeated 3 or more times
  /[a-z]{8,}/,          // 8 or more consecutive letters
  /^[0-9]/,             // Starts with a number
  /^(test|temp|fake)/,  // Common test prefixes
  /^[a-z]{1,2}\d+/,     // 1-2 letters followed by numbers
  /^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{10,}$/, // Mixed letters and numbers over 10 chars
]

export default function ContactsPage() {
  const { t, formatPrice } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [phoneError, setPhoneError] = useState("")

  const isValidEmail = (email: string) => {
    if (!email) return false

    // Basic email format validation using a simple regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) return false

    // Get the domain part
    const domain = email.split('@')[1]
    if (!domain) return false

    // Only check if the domain is either in allowed list or ends with a valid TLD
    return ALLOWED_EMAIL_DOMAINS.includes(domain.toLowerCase()) ||
      BUSINESS_DOMAINS.some(tld => domain.toLowerCase().endsWith(tld))
  }

  const isValidPhone = (phone: string) => {
    if (!phone) return true // Phone is optional

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')

    // Check if we have at least 10 digits
    if (digits.length < 10) return false

    // Check for valid Bulgarian formats
    const validFormats = [
      /^\+?359[0-9]{9}$/, // +359xxxxxxxxx or 359xxxxxxxxx
      /^0[0-9]{9}$/, // 0xxxxxxxxxx
      /^[0-9]{10}$/, // xxxxxxxxxx (10 digits)
    ]

    return validFormats.some(format => format.test(digits))
  }

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')

    // If it starts with 359 or +359, format as international
    if (digits.startsWith('359')) {
      return '+' + digits.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')
    }

    // If it starts with 0, format as national
    if (digits.startsWith('0')) {
      return digits.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
    }

    // Default format for 10 digits
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    // Reset error states
    setEmailError("")
    setPhoneError("")

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError(t("invalidEmailFormat"))
      toast({
        title: t("error"),
        description: t("invalidEmailFormat"),
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    // Validate phone if provided
    if (phone && !isValidPhone(phone)) {
      setPhoneError(t("invalidPhoneFormat"))
      toast({
        title: t("error"),
        description: t("invalidPhoneFormat"),
        variant: "destructive",
        duration: 5000,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: phone ? formatPhoneNumber(phone) : '',
        subject: formData.get('subject'),
        message: formData.get('message'),
      }

      const response = await fetch('http://localhost:8800/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      toast({
        title: "Успешно изпратено",
        description: "Вашето съобщение беше изпратено успешно. Ще се свържем с вас скоро.",
        duration: 5000,
      })

      // Reset form and errors
      e.currentTarget.reset()
      setEmailError("")
      setPhoneError("")
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Възникна проблем при изпращането на съобщението. Моля, опитайте отново.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "AUTO Rent",
      "description": "Premium car rental services in Bulgaria",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sunny Beach",
        "postalCode": "8230",
        "addressCountry": "Bulgaria"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+359 894818283",
        "email": "info@autorent.bg",
        "contactType": "customer service",
        "availableLanguage": ["Bulgarian", "English"],
        "hoursAvailable": "24/7 for emergencies"
      }
    }
  }

  return (
    <>
      <Head>
        <title>Contact AUTO Rent | Car Rental Services in Bulgaria</title>
        <meta name="description" content="Contact AUTO Rent for premium car rental services in Bulgaria. 24/7 support, multiple locations, and professional service. Get in touch for reservations and inquiries." />
        <meta name="keywords" content="contact auto rent, car rental contact, rent a car bulgaria contact, car hire sunny beach, auto rent support" />
        <meta property="og:title" content="Contact AUTO Rent - Car Rental Services" />
        <meta property="og:description" content="Get in touch with AUTO Rent for all your car rental needs in Bulgaria. Professional service and 24/7 support available." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/dlrent-office.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://autorent.bg/contacts" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">{t("contactsTitle")}</h1>
            <p className="text-xl text-gray-600">{t("contactsSubtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <section aria-label="Contact Information" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-600">{t("contactInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <address className="not-italic">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{t("address")}</h3>
                        <p className="text-gray-600">
                          {t("officeAddress")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{t("phone")}</h3>
                        <p className="text-gray-600">
                          <a href="tel:+359894818283" className="hover:text-blue-600 transition-colors">
                            +359 894 818 283
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{t("email")}</h3>
                        <p className="text-gray-600">
                          <a href="mailto:info@autorent.bg" className="hover:text-blue-600 transition-colors">
                            ivanrent11@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{t("workingHours")}</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>{t("mondayFriday")}</p>
                          <p>{t("saturday")}</p>
                          <p>{t("sunday")}</p>
                        </div>
                      </div>
                    </div>
                  </address>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">{t("place")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                      title="Слънчев бряг"
                      src="https://www.google.com/maps?q=Sunny+Beach,Bulgaria&output=embed"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Contact Form */}
            <section aria-label="Contact Form">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-600">{t("sendMessage")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{t("name")} *</Label>
                        <Input id="firstName" name="firstName" placeholder={t("firstName")} required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{t("last")} *</Label>
                        <Input id="lastName" name="lastName" placeholder={t("lastName")} required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex justify-between">
                        {t("emailContact")} *
                        {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t("emailContactPlaceholder")}
                        required
                        className={emailError ? "border-red-500" : ""}
                        onChange={() => setEmailError("")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex justify-between">
                        {t("phone")}
                        {phoneError && <span className="text-red-500 text-sm">{phoneError}</span>}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={t("phoneContactPlaceholder")}
                        className={phoneError ? "border-red-500" : ""}
                        onChange={() => setPhoneError("")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">{t("subject")}</Label>
                      <Input id="subject" name="subject" placeholder={t("subjectPlaceholder")} />
                    </div>

                    <div>
                      <Label htmlFor="message">{t("message")} *</Label>
                      <Textarea id="message" name="message" placeholder={t("message")} rows={5} required />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold"
                      disabled={isSubmitting || !!emailError || !!phoneError}
                    >
                      {isSubmitting ? "Изпращане..." : t("sendMessageBtn")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Additional Information */}
          <section aria-label="Why Choose Us" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-blue-600">{t("whyChooseDLRent")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 text-center">
                  <article>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Car">🚗</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("newCars")}</h3>
                    <p className="text-gray-600 text-sm">{t("modern")}</p>
                  </article>
                  <article>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Money">💰</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("competitivePrices")}</h3>
                    <p className="text-gray-600 text-sm">{t("bestPrices")}</p>
                  </article>
                  <article>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Shield">🛡️</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("fullInsurance")}</h3>
                    <p className="text-gray-600 text-sm">{t("fullInsuranceEn")}</p>
                  </article>
                  <article>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Phone">📞</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("support24_7")}</h3>
                    <p className="text-gray-600 text-sm">{t("support24_7En")}</p>
                  </article>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  )
}
