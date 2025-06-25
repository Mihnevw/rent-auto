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

export default function ContactsPage() {
  const { t, formatPrice } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
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

      // Reset form
      e.currentTarget.reset()
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
                          гр. Слънчев бряг
                          <br />
                          8230 Слънчев бряг
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
                            sales@autorent.com
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
                  <CardTitle className="text-xl text-blue-600">Местоположение</CardTitle>
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
                      <Label htmlFor="email">{t("emailContact")} *</Label>
                      <Input id="email" name="email" type="email" placeholder={t("emailContactPlaceholder")} required />
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input id="phone" name="phone" type="tel" placeholder={t("phoneContactPlaceholder")} />
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
                      disabled={isSubmitting}
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
                    <p className="text-gray-600 text-sm">Модерни и добре поддържани автомобили</p>
                  </article>
                  <article>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Money">💰</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("competitivePrices")}</h3>
                    <p className="text-gray-600 text-sm">Най-добрите цени в региона</p>
                  </article>
                  <article>
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Shield">🛡️</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("fullInsurance")}</h3>
                    <p className="text-gray-600 text-sm">Каско и ГО застраховка включени</p>
                  </article>
                  <article>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl" role="img" aria-label="Phone">📞</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t("support24_7")}</h3>
                    <p className="text-gray-600 text-sm">Винаги на разположение за помощ</p>
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
