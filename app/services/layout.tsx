import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Нашите Услуги | AUTO Rent България',
  description: 'Открийте нашите цялостни услуги за автомобили под наем в България. Трансфер до летище, 24/7 поддръжка, доставка на автомобили и допълнително оборудване. Гарантирано професионално обслужване.',
  keywords: 'коли под наем България, AUTO Rent услуги, наем на автомобил с доставка, трансфер летище България, екстри коли под наем',
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
            "name": {
              "@language": "bg",
              "@value": "AUTO Rent Услуги за автомобили под наем"
            },
            "description": {
              "@language": "bg",
              "@value": "Цялостни услуги за автомобили под наем в България"
            },
            "provider": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": {
                "@language": "bg",
                "@value": "Премиум услуги за автомобили под наем в България"
              }
            },
            "areaServed": {
              "@type": "Country",
              "name": "България"
            },
            "availableLanguage": ["Български", "English"],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": {
                "@language": "bg",
                "@value": "Услуги за автомобили под наем"
              },
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": {
                      "@language": "bg",
                      "@value": "Трансфер до летище"
                    },
                    "description": {
                      "@language": "bg",
                      "@value": "Доставка на автомобили до всички основни летища в България"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": {
                      "@language": "bg",
                      "@value": "24/7 Поддръжка"
                    },
                    "description": {
                      "@language": "bg",
                      "@value": "Денонощна поддръжка на клиенти"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": {
                      "@language": "bg",
                      "@value": "Допълнително оборудване"
                    },
                    "description": {
                      "@language": "bg",
                      "@value": "GPS, детски столчета и други екстри"
                    }
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