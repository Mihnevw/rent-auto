"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import Head from "next/head"
import { FooterSection } from "@/components/sections/footer-section"

export default function ServicesPage() {
  const { t, formatPrice } = useLanguage()

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "provider": {
      "@type": "Organization",
      "name": "AUTO Rent",
      "description": "Premium car rental services in Bulgaria"
    },
    "serviceType": "Car Rental Services",
    "areaServed": "Bulgaria",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Car Rental Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Home Delivery",
            "description": "Car delivery to your address"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Airport Delivery",
            "description": "Car delivery to airports"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Countrywide Delivery",
            "description": "Car delivery anywhere in Bulgaria"
          }
        }
      ]
    }
  }

  return (
    <>
      <Head>
        <title>Services | AUTO Rent - Premium Car Rental Services in Bulgaria</title>
        <meta name="description" content="Discover AUTO Rent's premium car rental services: home delivery, airport pickup, countrywide delivery, and additional equipment. 24/7 support available." />
        <meta name="keywords" content="car rental services, car delivery bulgaria, airport car rental, car hire services, auto rent services" />
        <meta property="og:title" content="Car Rental Services - AUTO Rent Bulgaria" />
        <meta property="og:description" content="Premium car rental services including home delivery, airport pickup, and countrywide delivery. Professional service and 24/7 support." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/dlrent-office.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://autorent.bg/services" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-12">{t("servicesTitle")}</h1>

          {/* Services List */}
          <section className="space-y-12" aria-label="Our Services">
            {/* Service 1 - Delivery to Address */}
            <article className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <Image
                  src="/images/adress.webp?height=250&width=400"
                  alt="Car delivery service - bringing your rental car to your doorstep"
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("homeDelivery")}</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{t("homeDeliveryText")}</p>
              </div>
            </article>

            {/* Service 2 - Airport Delivery */}
            <article className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <Image
                  src="/images/airport.jpg?height=250&width=400"
                  alt="Airport car rental delivery service - convenient pickup at Bulgarian airports"
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("airportDelivery")}</h2>
                <div className="text-gray-700 text-lg leading-relaxed space-y-4">{t("airportDeliveryText")}</div>
              </div>
            </article>

            {/* Service 3 - Countrywide Delivery */}
            <article className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <Image
                  src="/images/crash.jpg?height=250&width=400"
                  alt="24/7 nationwide car delivery service across Bulgaria"
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("countryDelivery")}</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{t("countryDeliveryText")}</p>
              </div>
            </article>
          </section>

          {/* Additional Services Section */}
          <section className="mt-16 bg-white rounded-lg p-8 shadow-sm" aria-label="Additional Services and Pricing">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t("additionalFeesInsurance")}</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t("servicesTitle")}</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <dt className="text-gray-700">{t("deliveryBlackSea")}</dt>
                    <dd className="font-semibold text-gray-800">{formatPrice(20)}</dd>
                  </div>
                  {/* <div className="flex justify-between items-center border-b pb-2">
                    <dt className="text-gray-700">{t("deliveryOutsideBlackSea")}</dt>
                    <dd className="font-semibold text-gray-800">0.50 {t("perKm")}</dd>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <dt className="text-gray-700">{t("airportDelivery")}</dt>
                    <dd className="font-semibold text-gray-800">{formatPrice(30)}</dd>
                  </div> */}
                </dl>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t("additionalEquipment")}</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <dt className="text-gray-700">{t("childSeat")}</dt>
                    <dd className="font-semibold text-gray-800">{formatPrice(0)}/{t("perDay")}</dd>
                  </div>
                  {/* <div className="flex justify-between items-center border-b pb-2">
                    <dt className="text-gray-700">{t("gps")}</dt>
                    <dd className="font-semibold text-gray-800">{formatPrice(5)}/{t("perDay")}</dd>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <dt className="text-gray-700">{t("additionalDriver")}</dt>
                    <dd className="font-semibold text-gray-800">{formatPrice(10)}</dd>
                  </div> */}
                </dl>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg" aria-label="How to Order">
            <h3 className="text-xl font-bold text-blue-800 mb-4">{t("howToOrderService")}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-blue-700 mb-4">
                  {t("howToOrderDescription")}
                </p>
                <address className="space-y-2 not-italic">
                  <p className="text-blue-700">
                    <strong>{t("phone")}:</strong>{" "}
                    <a href="tel:+359894818283" className="hover:text-blue-600 transition-colors">
                      +359 894 818 283
                    </a>
                  </p>
                  <p className="text-blue-700">
                    <strong>{t("email")}:</strong>{" "}
                    <a href="mailto:info@autorent.bg" className="hover:text-blue-600 transition-colors">
                      info@autorent.bg
                    </a>
                  </p>
                  <p className="text-blue-700">
                    <strong>{t("workingHours")}:</strong> {t("workingHoursDetailed")}
                  </p>
                </address>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">{t("importantNotes")}</h4>
                <ul className="text-blue-700 text-sm space-y-1 list-disc pl-4">
                  <li>{t("deliveryTime")}</li>
                  <li>{t("emergencyService")}</li>
                  <li>{t("advanceBooking")}</li>
                  <li>{t("paymentOnDelivery")}</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  )
}
