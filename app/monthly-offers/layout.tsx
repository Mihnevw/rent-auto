import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

// This is a dynamic metadata function that will be called for each request
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish 
      ? 'Monthly Car Rental Offers | AUTO Rent Bulgaria'
      : 'Месечни Оферти за Коли под Наем | AUTO Rent България',
    description: isEnglish
      ? 'Discover our monthly car rental deals in Bulgaria. Flexible long-term car rental options with premium vehicles like BMW, Mercedes, and Range Rover. Competitive monthly rates.'
      : 'Разгледайте нашите месечни оферти за коли под наем в България. Гъвкави опции за дългосрочен наем на премиум автомобили като BMW, Mercedes и Range Rover. Конкурентни месечни цени.',
    keywords: isEnglish
      ? 'monthly car rental Bulgaria, long term car hire, AUTO Rent monthly deals, car lease Bulgaria'
      : 'месечен наем на автомобили България, дългосрочен наем на коли, AUTO Rent месечни оферти, лизинг на автомобили България',
    openGraph: {
      title: isEnglish
        ? 'Monthly Car Rental Offers | AUTO Rent Bulgaria'
        : 'Месечни Оферти за Коли под Наем | AUTO Rent България',
      description: isEnglish
        ? 'Discover our monthly car rental deals in Bulgaria. Flexible long-term car rental options with premium vehicles.'
        : 'Разгледайте нашите месечни оферти за коли под наем в България. Гъвкави опции за дългосрочен наем на премиум автомобили.',
      type: 'website',
      locale: isEnglish ? 'en_US' : 'bg_BG',
      images: [
        {
          url: '/images/bmw-3.png',
          width: 1200,
          height: 630,
          alt: isEnglish ? 'AUTO Rent Monthly Offers' : 'AUTO Rent Месечни Оферти'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: isEnglish
        ? 'Monthly Car Rental Offers | AUTO Rent Bulgaria'
        : 'Месечни Оферти за Коли под Наем | AUTO Rent България',
      description: isEnglish
        ? 'Discover our monthly car rental deals in Bulgaria. Premium vehicles for long-term rental.'
        : 'Разгледайте нашите месечни оферти за коли под наем в България. Премиум автомобили за дългосрочен наем.',
      images: ['/images/bmw-3.png']
    },
    alternates: {
      canonical: 'https://autorent.bg/monthly-offers',
      languages: {
        'en': 'https://autorent.bg/en/monthly-offers',
        'bg': 'https://autorent.bg/bg/monthly-offers',
        'x-default': 'https://autorent.bg/monthly-offers'
      }
    }
  }
}

export default function MonthlyOffersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const isEnglish = params.lang === 'en'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": isEnglish ? "Monthly Car Rental Services" : "Месечни Услуги за Коли под Наем",
            "description": isEnglish 
              ? "Long-term car rental services in Bulgaria with premium vehicles"
              : "Дългосрочни услуги за наем на автомобили в България с премиум превозни средства",
            "provider": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "url": "https://autorent.eu"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "EUR",
              "lowPrice": "1050",
              "highPrice": "1800",
              "offerCount": "5",
              "offers": [
                {
                  "@type": "Offer",
                  "name": isEnglish ? "BMW 3 Series Monthly Rental" : "BMW Серия 3 Месечен Наем",
                  "price": "1050",
                  "priceCurrency": "EUR",
                  "priceValidUntil": "2024-12-31",
                  "itemOffered": {
                    "@type": "Car",
                    "name": "BMW 3 Series 2021",
                    "vehicleModelDate": "2021",
                    "vehicleTransmission": isEnglish ? "Automatic" : "Автоматична"
                  }
                },
                {
                  "@type": "Offer",
                  "name": isEnglish ? "Mercedes GLC Monthly Rental" : "Mercedes GLC Месечен Наем",
                  "price": "1300",
                  "priceCurrency": "EUR",
                  "priceValidUntil": "2024-12-31",
                  "itemOffered": {
                    "@type": "Car",
                    "name": "Mercedes GLC 2021",
                    "vehicleModelDate": "2021",
                    "vehicleTransmission": isEnglish ? "Automatic" : "Автоматична"
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