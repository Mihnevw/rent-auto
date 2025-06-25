import { Metadata } from 'next'

type Props = {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isEnglish = params.lang === 'en'

  return {
    title: isEnglish
      ? 'Book Your Car | AUTO Rent Car Rental Bulgaria'
      : 'Резервирайте Автомобил | AUTO Rent Коли под Наем България',
    description: isEnglish
      ? 'Book your preferred rental car with AUTO Rent in Bulgaria. Easy online booking process, flexible terms, and competitive rates. Reserve your car today.'
      : 'Резервирайте предпочитания от вас автомобил под наем с AUTO Rent в България. Лесен процес на онлайн резервация, гъвкави условия и конкурентни цени. Резервирайте вашия автомобил днес.',
    keywords: isEnglish
      ? 'car rental booking Bulgaria, AUTO Rent reservation, rent a car online, car hire booking, vehicle rental Bulgaria'
      : 'резервация на коли под наем България, AUTO Rent резервация, наемане на кола онлайн, резервация на автомобил, наем на превозни средства България',
    alternates: {
      canonical: 'https://autorent.bg/booking',
      languages: {
        'en': 'https://autorent.bg/en/booking',
        'bg': 'https://autorent.bg/bg/booking',
        'x-default': 'https://autorent.bg/booking'
      }
    }
  }
}

export default function BookingLayout({
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
            "@type": "ReservationPage",
            "name": isEnglish ? "Car Rental Booking" : "Резервация на Автомобил",
            "description": isEnglish 
              ? "Book your rental car with AUTO Rent"
              : "Резервирайте вашия автомобил под наем с AUTO Rent",
            "provider": {
              "@type": "Organization",
              "name": "AUTO Rent",
              "description": isEnglish
                ? "Premium car rental service in Bulgaria"
                : "Премиум услуги за коли под наем в България"
            },
            "availableLanguage": ["English", "Bulgarian"],
            "potentialAction": {
              "@type": "ReserveAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://autorent.bg/booking/{car_id}",
                "actionPlatform": [
                  "http://schema.org/DesktopWebPlatform",
                  "http://schema.org/MobileWebPlatform"
                ]
              },
              "result": {
                "@type": "RentalCarReservation",
                "reservationFor": {
                  "@type": "Car",
                  "name": isEnglish ? "Rental Vehicle" : "Автомобил под наем"
                }
              }
            }
          })
        }}
      />
      {children}
    </>
  )
} 