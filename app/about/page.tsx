"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"
import { Heart, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const { language } = useLanguage()

  const aboutContent = {
    bg: {
      title: "Кои сме ние ?",
      registrationInfo: "DLrent е фирма регистрирана в търговския регистър като:",
      companyName: "ДЛ РЕНТ ЕООД",
      eik: "ЕИК 208110013",
      address: 'Адрес: гр. Стара Загора, бул. "Цар Симеон Велики" 83,',
      mainDescription:
        "DL Rent е водеща компания за автомобили под наем, предлагаща надеждни, удобни и прозрачни услуги за клиенти в България. Нашата основна мисия е да осигурим комфортно, сигурно и безпроблемно пътуване с качествени автомобили, без скрити такси и с включено пълно автокаско.",
      officesTitle: "Нашите офиси:",
      offices: [
        {
          icon: <Heart className="w-4 h-4 text-pink-500" />,
          text: "Летище Пловдив — офис, удобно разположен за всички пристигащи пътници.",
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: `Град Пловдив, бул. „Куклянско шосе" 20 — за тези, които търсят удобен и бърз начин да наемат автомобил в рамките на града.`,
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: `Град Стара Загора, бул "Цар Симеон Велики" 83 — за клиенти от региона, които се нуждаят от качествен автомобил под наем.`,
        },
      ],
      deliveryInfo: `В останалите градове автомобилите се доставят до адрес, директно до дома Ви или до летището. Тази екстра Ви спестява ходене до офиса с такси или градски транспорт, за да получите автомобила, който искате да наемете.`,
      fleetInfo:
        "Компанията развива своята дейност с отдаване на автомобили под наем от началото на 2022г. Предлагаме нови коли от висок клас предимно на марките Volkswagen и Hyundai. Цели ни е да осигурим максимален комфорт при избирането, ситуирност на пътя, приятна атмосфера при дълги пътувания и всякакъв вид автомобилно удобство с множеството екстри, с които са снабдени автомобилите ни. Всички автомобили се обслужват само в оторизиран сервиз на Volkswagen, с което гарантираме безупречното техническо състояние на всички наши автомобили.",
      finalNote:
        "За кратките ни опит в бранша можем да бъдем горди с това, че нямаме разочарован или недоволен клиент от нашите услуги. Отличаваме се да удовлетворим всички изисквания и желания на нашите клиенти, и мислим, че успяваме.",
    },
    en: {
      title: "Who are we?",
      registrationInfo: "DLrent is a company registered in the commercial register as:",
      companyName: "DL RENT EOOD",
      eik: "UIC 208110013",
      address: 'Address: Stara Zagora, "Tsar Simeon Veliki" Blvd. 83,',
      mainDescription:
        "DL Rent is a leading car rental company, offering reliable, convenient and transparent services for clients in Bulgaria. Our main mission is to provide comfortable, safe and hassle-free travel with quality vehicles, without hidden fees and with full comprehensive insurance included.",
      officesTitle: "Our offices:",
      offices: [
        {
          icon: <Heart className="w-4 h-4 text-pink-500" />,
          text: "Plovdiv Airport — office, conveniently located for all arriving passengers.",
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: 'Plovdiv city, "Kuklyansko Shose" Blvd. 20 — for those looking for a convenient and fast way to rent a car within the city.',
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: 'Stara Zagora city, "Tsar Simeon Veliki" Blvd. 83 — for clients from the region who need a quality rental car.',
        },
      ],
      deliveryInfo:
        "In other cities, cars are delivered to your address, directly to your home or to the airport. This extra service saves you from going to the office by taxi or public transport to get the car you want to rent.",
      fleetInfo:
        "The company has been developing its car rental business since the beginning of 2022. We offer new high-class cars mainly of Volkswagen and Hyundai brands. Our goal is to provide maximum comfort in choosing, road safety, pleasant atmosphere during long trips and all kinds of automotive convenience with the many extras our cars are equipped with. All cars are serviced only at authorized Volkswagen service centers, which guarantees the impeccable technical condition of all our vehicles.",
      finalNote:
        "For our short experience in the industry, we can be proud that we have no disappointed or dissatisfied clients with our services. We excel at satisfying all requirements and wishes of our clients, and we think we succeed.",
    },
  }

  const content = aboutContent[language]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">{content.title}</h1>

            {/* Registration Information */}
            <div className="space-y-2">
              <p className="text-gray-700">{content.registrationInfo}</p>
              <p className="font-bold text-gray-800">{content.companyName}</p>
              <p className="font-bold text-gray-800">{content.eik}</p>
              <p className="text-gray-700">{content.address}</p>
            </div>

            {/* Main Description */}
            <p className="text-gray-700 leading-relaxed">{content.mainDescription}</p>

            {/* Offices Section */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                {content.officesTitle}
              </h3>
              <div className="space-y-3">
                {content.offices.map((office, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {office.icon}
                    <p className="text-gray-700 text-sm leading-relaxed">{office.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <p className="text-gray-700 leading-relaxed">{content.deliveryInfo}</p>

            {/* Fleet Information */}
            <p className="text-gray-700 leading-relaxed">{content.fleetInfo}</p>

            {/* Final Note */}
            <p className="text-gray-700 leading-relaxed">{content.finalNote}</p>
          </div>

          {/* Right Column - Office Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Image
                src="/images/dlrent-office.png"
                alt="DL RENT Office in Stara Zagora"
                width={600}
                height={800}
                className="w-full h-auto rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
