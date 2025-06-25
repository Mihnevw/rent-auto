import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'Car Rental Prices | AUTO Rent Bulgaria'
      : 'Цени за Коли под Наем | AUTO Rent България',
    description: isEnglish
      ? 'View our transparent car rental rates in Bulgaria. Daily rates, long-term discounts, and all-inclusive packages. Compare prices and find the best deal for your needs.'
      : 'Разгледайте нашите прозрачни цени за коли под наем в България. Дневни тарифи, отстъпки за дългосрочен наем и пакети всичко включено. Сравнете цените и намерете най-добрата оферта за вашите нужди.',
    keywords: isEnglish
      ? 'car rental prices Bulgaria, rent a car rates, AUTO Rent pricing, car hire costs, vehicle rental prices'
      : 'цени коли под наем България, тарифи автомобили под наем, AUTO Rent цени, разходи наем на кола, цени наем на превозни средства',
    alternates: {
      canonical: 'https://autorent.bg/prices',
      languages: {
        'en': 'https://autorent.bg/en/prices',
        'bg': 'https://autorent.bg/bg/prices',
        'x-default': 'https://autorent.bg/prices'
      }
    }
  }
}

export default function PricesLayout({
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
            "@type": "PriceSpecification",
            "name": isEnglish ? "Car Rental Pricing" : "Цени за Коли под Наем",
            "description": isEnglish
              ? "Detailed pricing for car rentals at AUTO Rent Bulgaria"
              : "Подробни цени за наем на автомобили в AUTO Rent България",
            "provider": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": isEnglish
                ? "Premium car rental service in Bulgaria"
                : "Премиум услуги за коли под наем в България"
            },
            "priceSpecification": [
              {
                "@type": "UnitPriceSpecification",
                "name": isEnglish ? "Daily Rate" : "Дневна Тарифа",
                "description": isEnglish
                  ? "Standard daily rental rate"
                  : "Стандартна дневна тарифа за наем",
                "price": "from 40.00",
                "priceCurrency": "EUR",
                "unitText": isEnglish ? "per day" : "на ден"
              },
              {
                "@type": "UnitPriceSpecification",
                "name": isEnglish ? "Weekly Rate" : "Седмична Тарифа",
                "description": isEnglish
                  ? "Discounted weekly rental rate"
                  : "Намалена седмична тарифа за наем",
                "price": "from 35.00",
                "priceCurrency": "EUR",
                "unitText": isEnglish ? "per day" : "на ден"
              },
              {
                "@type": "UnitPriceSpecification",
                "name": isEnglish ? "Monthly Rate" : "Месечна Тарифа",
                "description": isEnglish
                  ? "Discounted monthly rental rate"
                  : "Намалена месечна тарифа за наем",
                "price": "from 30.00",
                "priceCurrency": "EUR",
                "unitText": isEnglish ? "per day" : "на ден"
              }
            ]
          })
        }}
      />
      {children}
    </>
  )
} 