import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'Contact Us | AUTO Rent Car Rental Bulgaria'
      : 'Контакти | AUTO Rent Коли под Наем България',
    description: isEnglish
      ? 'Contact AUTO Rent for car rental services in Bulgaria. 24/7 support, multiple locations, and professional assistance. Get in touch for reservations and inquiries.'
      : 'Свържете се с AUTO Rent за услуги за коли под наем в България. 24/7 поддръжка, множество локации и професионално съдействие. Свържете се с нас за резервации и запитвания.',
    keywords: isEnglish
      ? 'contact AUTO Rent, car rental contact, rent a car Bulgaria contact, AUTO Rent phone, car hire support'
      : 'контакти AUTO Rent, контакт коли под наем, контакти наем на автомобили България, телефон AUTO Rent, поддръжка автомобили под наем',
    alternates: {
      canonical: 'https://autorent.bg/contacts',
      languages: {
        'en': 'https://autorent.bg/en/contacts',
        'bg': 'https://autorent.bg/bg/contacts',
        'x-default': 'https://autorent.bg/contacts'
      }
    }
  }
}

export default function ContactsLayout({
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
            "@type": "ContactPage",
            "name": isEnglish ? "Contact AUTO Rent" : "Контакти AUTO Rent",
            "description": isEnglish
              ? "Contact information for AUTO Rent car rental services"
              : "Информация за контакт с AUTO Rent услуги за коли под наем",
            "mainEntity": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": isEnglish
                ? "Premium car rental service in Bulgaria"
                : "Премиум услуги за коли под наем в България",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": isEnglish ? "Sunny Beach" : "Слънчев Бряг",
                "addressRegion": isEnglish ? "Burgas" : "Бургас",
                "addressCountry": isEnglish ? "Bulgaria" : "България"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+359 894818283",
                "email": "info@autorent.bg",
                "contactType": isEnglish ? "customer service" : "обслужване на клиенти",
                "availableLanguage": ["English", "Bulgarian"],
                "hoursAvailable": isEnglish ? "Mo-Fr 09:00-18:00" : "Пн-Пт 09:00-18:00"
              }
            }
          })
        }}
      />
      {children}
    </>
  )
} 