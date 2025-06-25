import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services | AUTO Rent Car Rental Bulgaria',
  description: 'Discover our comprehensive car rental services in Bulgaria. Airport transfers, 24/7 support, vehicle delivery, and additional equipment. Professional service guaranteed.',
  keywords: 'car rental services Bulgaria, AUTO Rent services, rent a car delivery, airport transfer Bulgaria, car hire extras',
  alternates: {
    canonical: 'https://autorent.bg/services',
    languages: {
      'en': 'https://autorent.bg/en/services',
      'bg': 'https://autorent.bg/bg/services',
      'x-default': 'https://autorent.bg/services'
    }
  }
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AUTO Rent Car Rental Services",
            "description": "Comprehensive car rental services in Bulgaria",
            "provider": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": "Premium car rental service in Bulgaria"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Bulgaria"
            },
            "availableLanguage": ["English", "Bulgarian"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Car Rental Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Airport Transfer",
                    "description": "Car delivery to all major airports in Bulgaria"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "24/7 Support",
                    "description": "Round-the-clock customer assistance"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Additional Equipment",
                    "description": "GPS, child seats, and other extras available"
                  }
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  )
} 