import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'Terms & Conditions | AUTO Rent Car Rental Bulgaria'
      : 'Общи Условия | AUTO Rent Коли под Наем България',
    description: isEnglish
      ? 'Read our terms and conditions for car rental services in Bulgaria. Clear information about rental policies, insurance coverage, and customer responsibilities.'
      : 'Прочетете нашите общи условия за услуги за коли под наем в България. Ясна информация за политиките за наем, застрахователно покритие и отговорности на клиентите.',
    keywords: isEnglish
      ? 'car rental terms Bulgaria, AUTO Rent conditions, rental agreement, car hire policy, vehicle rental terms'
      : 'общи условия коли под наем България, AUTO Rent условия, договор за наем, политика за наем на автомобили, условия за наем на превозни средства',
    alternates: {
      canonical: 'https://autorent.bg/terms',
      languages: {
        'en': 'https://autorent.bg/en/terms',
        'bg': 'https://autorent.bg/bg/terms',
        'x-default': 'https://autorent.bg/terms'
      }
    }
  }
}

export default function TermsLayout({
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
            "@type": "WebPage",
            "name": isEnglish ? "Terms and Conditions" : "Общи Условия",
            "description": isEnglish
              ? "Terms and conditions for AUTO Rent car rental services"
              : "Общи условия за услуги за коли под наем на AUTO Rent",
            "publisher": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": isEnglish
                ? "Premium car rental service in Bulgaria"
                : "Премиум услуги за коли под наем в България"
            },
            "availableLanguage": ["English", "Bulgarian"],
            "mainEntity": {
              "@type": "TermsAndConditions",
              "name": isEnglish ? "Car Rental Terms" : "Условия за Наем на Автомобили",
              "description": isEnglish
                ? "Terms and conditions for renting a vehicle"
                : "Общи условия за наем на превозно средство",
              "termsType": "http://purl.org/dc/dcmitype/Text",
              "dateModified": new Date().toISOString()
            }
          })
        }}
      />
      {children}
    </>
  )
} 