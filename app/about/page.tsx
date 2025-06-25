"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import type { TranslationKey } from "@/lib/language-context"
import { Heart, CheckCircle, MapPin, Award, Shield, Car, Clock, Users } from "lucide-react"
import { FooterSection } from "@/components/sections/footer-section"
import Head from "next/head"

export default function AboutPage() {
  const { t } = useLanguage()

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "AUTO RENT EOOD",
      "description": t("aboutPageDescription"),
      "foundingDate": "2023",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tsar Simeon Veliki Blvd. 83",
        "addressLocality": "Stara Zagora",
        "addressCountry": "Bulgaria"
      },
      "areaServed": [
        "Sunny Beach",
        "Burgas",
        "Nessebar",
        "Varna",
        "Pomorie",
        "St. Vlas",
        "Golden Sands"
      ]
    }
  }

  const locations: Array<{ icon: React.ReactElement; key: TranslationKey }> = [
    {
      icon: <Heart className="w-5 h-5 text-pink-500" />,
      key: "sunnyBeach"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      key: "burgas"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      key: "nessebar"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      key: "varna"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      key: "pomorie"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      key: "svetiVlas"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
      key: "goldenSands"
    }
  ]

  return (
    <>
      <Head>
        <title>{t("aboutPageTitle")}</title>
        <meta name="description" content={t("aboutPageDescription")} />
        <meta name="keywords" content="auto rent bulgaria, car rental company, rent a car bulgaria, car hire stara zagora, premium car rental" />
        <meta property="og:title" content={t("aboutPageOgTitle")} />
        <meta property="og:description" content={t("aboutPageOgDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/dlrent-office.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://autorent.bg/about" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-green-500 text-white" aria-label="Company Introduction">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-24">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  {t("aboutTitle")}
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                  {t("aboutMainDescription")}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </section>

          {/* Main Content */}
          <section className="max-w-7xl mx-auto px-4 py-16" aria-label="Company Details">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Company Info */}
              <div className="lg:col-span-2 space-y-8">

                {/* Registration Card */}
                <article className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-4">{t("officialRegistration")}</h2>
                      <div className="space-y-2 text-slate-600">
                        <p>{t("registrationInfo")}</p>
                        <p className="font-bold text-slate-800 text-lg">{t("companyName")}</p>
                        <address className="flex items-center gap-2 not-italic">
                          <MapPin className="w-4 h-4 text-red-500" />
                          {t("companyAddress")}
                        </address>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Locations Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-pink-100 rounded-full">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{t("ourLocations")}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {locations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                      >
                        <div className="group-hover:scale-110 transition-transform duration-200">
                          {location.icon}
                        </div>
                        <p className="text-slate-700 font-medium">{t(location.key)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Service Card */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl text-white p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{t("deliveryToAddress")}</h3>
                      <p className="text-emerald-50 leading-relaxed text-lg">
                        {t("deliveryDescription")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fleet Information Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">{t("ourFleet")}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg mb-6">
                        {t("fleetDescription")}
                      </p>
                      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {t("finalNote")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image and Stats */}
              <div className="lg:col-span-1 space-y-8">
                {/* Office Image */}
                <div className="sticky top-8">
                  {/* <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                    <Image
                      src="/images/dlrent-office.png"
                      alt="AUTO RENT Office"
                      width={600}
                      height={800}
                      className="w-full h-80 lg:h-96 object-cover"
                      priority
                    />
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{t("ourOffice")}</h4>
                      <p className="text-slate-600">{t("sunnyBeachBulgaria")}</p>
                    </div>
                  </div> */}

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                      <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-800">2023</p>
                      <p className="text-sm text-slate-600">{t("experienceSince2023")}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                      <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-800">100%</p>
                      <p className="text-sm text-slate-600">{t("satisfiedClients")}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                      <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                        <Car className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-800">NEW</p>
                      <p className="text-sm text-slate-600">{t("newVehicles")}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                      <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3">
                        <Award className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-slate-800">PRO</p>
                      <p className="text-sm text-slate-600">{t("professionalService")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <FooterSection />
      </div>
    </>
  )
}