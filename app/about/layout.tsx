import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'About Us | AUTO Rent Car Rental Bulgaria'
      : 'За Нас | AUTO Rent Коли под Наем България',
    description: isEnglish
      ? 'Learn about AUTO Rent, your trusted car rental service in Bulgaria. Professional team, quality vehicles, and exceptional customer service since our establishment.'
      : 'Научете повече за AUTO Rent, вашата надеждна компания за коли под наем в България. Професионален екип, качествени автомобили и изключително обслужване от създаването ни.',
    keywords: isEnglish
      ? 'about AUTO Rent, car rental company Bulgaria, rent a car history, AUTO Rent team, car hire company'
      : 'за AUTO Rent, фирма за коли под наем България, история на AUTO Rent, екип на AUTO Rent, компания за автомобили под наем',
    alternates: {
      canonical: 'https://autorent.bg/about',
      languages: {
        'en': 'https://autorent.bg/en/about',
        'bg': 'https://autorent.bg/bg/about',
        'x-default': 'https://autorent.bg/about'
      }
    }
  }
}

export default function AboutLayout({
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
            "@type": "AboutPage",
            "name": isEnglish ? "About AUTO Rent" : "За AUTO Rent",
            "description": isEnglish 
              ? "Learn about AUTO Rent car rental services in Bulgaria"
              : "Научете повече за услугите за коли под наем на AUTO Rent в България",
            "publisher": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": isEnglish
                ? "Premium car rental service in Bulgaria"
                : "Премиум услуги за коли под наем в България",
              "foundingDate": "2015",
              "areaServed": {
                "@type": "Country",
                "name": isEnglish ? "Bulgaria" : "България"
              }
            }
          })
        }}
      />
      {children}
    </>
  )
} 