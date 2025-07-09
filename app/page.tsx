"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero-section"
import { CarsSection } from "@/components/sections/cars-section"
import { CarCategoriesSection } from "@/components/sections/car-categories-section"
import { DeliverySection } from "@/components/sections/delivery-section"
//import { GoogleReviewsSection } from "@/components/sections/google-reviews-section"
import { FooterSection } from "@/components/sections/footer-section"
import Head from "next/head"
import { useLanguage } from "@/lib/language-context"

export default function DLRentHomepage() {
  const { t } = useLanguage()

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AUTO Rent",
    "description": t("siteDescription"),
    "url": "https://autorent-bg.com",
    "logo": "https://autorent-bg.com/images/placeholder-logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Bulgaria"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+359 894818283",
      "contactType": "customer service"
    }
  }

  return (
    <>
      <Head>
        <title>{t("siteTitle")}</title>
        <meta name="description" content={t("siteDescription")} />
        <meta property="og:title" content={t("ogTitle")} />
        <meta property="og:description" content={t("ogDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/dlrent-office.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://autorent-bg.com" />

        {/* Hreflang tags for language/region targeting */}
        <link rel="alternate" hrefLang="en" href="https://autorent-bg.com/en" />
        <link rel="alternate" hrefLang="bg" href="https://autorent-bg.com/bg" />
        <link rel="alternate" hrefLang="x-default" href="https://autorent-bg.com" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <HeroSection />
          <CarsSection />
          <CarCategoriesSection />
          <DeliverySection />
          {/* <GoogleReviewsSection /> */}
          <FooterSection />
        </main>
      </div>
    </>
  )
}
