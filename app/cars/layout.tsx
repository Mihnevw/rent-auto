import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'Our Fleet | AUTO Rent Car Rental Bulgaria'
      : 'Нашият Автопарк | AUTO Rent Коли под Наем България',
    description: isEnglish
      ? 'Explore our diverse fleet of rental cars in Bulgaria. From economy to luxury vehicles, find the perfect car for your needs. Modern vehicles and competitive rates.'
      : 'Разгледайте нашия разнообразен автопарк от автомобили под наем в България. От икономични до луксозни автомобили, намерете перфектната кола за вашите нужди. Модерни превозни средства и конкурентни цени.',
    keywords: isEnglish
      ? 'car rental fleet Bulgaria, AUTO Rent cars, rent a car models, vehicle selection Bulgaria, car hire options'
      : 'автопарк коли под наем България, AUTO Rent автомобили, модели коли под наем, избор на автомобили България, опции за наем на коли',
    alternates: {
      canonical: 'https://autorent.bg/cars',
      languages: {
        'en': 'https://autorent.bg/en/cars',
        'bg': 'https://autorent.bg/bg/cars',
        'x-default': 'https://autorent.bg/cars'
      }
    }
  }
}

export default function CarsLayout({
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
            "@type": "ItemList",
            "name": isEnglish ? "AUTO Rent Car Fleet" : "AUTO Rent Автопарк",
            "description": isEnglish
              ? "Available rental vehicles at AUTO Rent Bulgaria"
              : "Налични автомобили под наем в AUTO Rent България",
            "availableLanguage": ["English", "Bulgarian"],
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Car",
                  "name": isEnglish ? "Economy Cars" : "Икономикачни Автомобили",
                  "description": isEnglish
                    ? "Fuel-efficient vehicles for budget-conscious travelers"
                    : "Икономикачни автомобили за пътници с ограничен бюджет"
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Car",
                  "name": isEnglish ? "Business Class" : "Бизнес Клас",
                  "description": isEnglish
                    ? "Comfortable vehicles for business travel"
                    : "Комфортни автомобили за бизнес пътувания"
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Car",
                  "name": isEnglish ? "Luxury Vehicles" : "Луксозни Автомобили",
                  "description": isEnglish
                    ? "Premium cars for special occasions"
                    : "Премиум автомобили за специални поводи"
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  )
} 