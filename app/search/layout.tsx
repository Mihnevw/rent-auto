import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'Search Cars | AUTO Rent Car Rental Bulgaria'
      : 'Търсене на Автомобили | AUTO Rent Коли под Наем България',
    description: isEnglish
      ? 'Search and filter our car rental fleet in Bulgaria. Find the perfect vehicle with our easy-to-use search system. Compare prices and features.'
      : 'Търсете и филтрирайте нашия автопарк от коли под наем в България. Намерете перфектния автомобил с нашата лесна система за търсене. Сравнете цени и характеристики.',
    keywords: isEnglish
      ? 'search rental cars Bulgaria, AUTO Rent search, find car rental, compare car hire, vehicle search Bulgaria'
      : 'търсене коли под наем България, AUTO Rent търсене, намери автомобил под наем, сравни наем на коли, търсене на превозни средства България',
    alternates: {
      canonical: 'https://autorent.bg/search',
      languages: {
        'en': 'https://autorent.bg/en/search',
        'bg': 'https://autorent.bg/bg/search',
        'x-default': 'https://autorent.bg/search'
      }
    }
  }
}

export default function SearchLayout({
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
            "@type": "SearchResultsPage",
            "name": isEnglish ? "Car Rental Search Results" : "Резултати от Търсене на Коли под Наем",
            "description": isEnglish
              ? "Search results for available rental cars"
              : "Резултати от търсене на налични автомобили под наем",
            "provider": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": isEnglish
                ? "Premium car rental service in Bulgaria"
                : "Премиум услуги за коли под наем в България"
            },
            "availableLanguage": ["English", "Bulgarian"],
            "about": {
              "@type": "Thing",
              "name": isEnglish ? "Car Rental Search" : "Търсене на Коли под Наем",
              "description": isEnglish
                ? "Search and filter system for rental vehicles"
                : "Система за търсене и филтриране на автомобили под наем"
            }
          })
        }}
      />
      {children}
    </>
  )
} 