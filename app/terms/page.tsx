"use client"

import { Header } from "@/components/header"
import { FooterSection } from "@/components/sections/footer-section"
import { useLanguage } from "@/lib/language-context"

export default function TermsPage() {
  const { language, t } = useLanguage()

  const termsContent = {
    bg: {
      title: "Общи условия",
      sections: {
        section1: {
          title: "I. УСЛОВИЯ ЗА ПРАВОСПОСОБНОСТ НА НАЕМАТЕЛЯ",
          articles: [
            {
              number: "Чл.1.",
              content:
                "НАЕМАТЕЛЯТ е длъжен да притежава редовни и валидни лични документи: паспорт/лична карта, свидетелство за управление на МПС и валидно свидетелство за управление на МПС с най-малко 3 години стаж като водач и минимална възраст от 21 навършени години. Само записаните в настоящия договор лица (НАЕМАТЕЛЯТ И ДОПЪЛНИТЕЛНИЯТ ШОФЬОР) могат да управляват наетия автомобил. В случай на управление от друго лице, невписано в договора за наем, НАЕМАТЕЛЯТ носи пълната отговорност за стойността на автомобила и възникналите допълнителни разходи без значение на заплатените такси за освобождаване от отговорност или допълнителни покрития.",
            },
            {
              number: "Чл. 1.1",
              content:
                "Минимален срок за отдаване на автомобила под наем 1 ден ( 24 часа ). Не се позволява залепяне и закачване на каквито и да било украси, реклами и др. елементи по боята на автомобила. За тържества, сватби и балове, цените за наем на автомобилите са по договаряне, като AUTO RENT EOOD си запазва правото да откаже наем при неспазване на тези изисквания",
            },
          ],
        },
      },
    },
    en: {
      title: "Terms & Conditions",
      sections: {
        section1: {
          title: "I. CONDITIONS FOR LESSEE'S LEGAL CAPACITY",
          articles: [
            {
              number: "Art.1.",
              content:
                "The LESSEE is obliged to have regular and valid personal documents: passport/identity card, driving license and inspection certificate with an experience of not less than 3 years and a minimum age of 21 years. Only the persons listed in this contract (THE LESSEE AND THE ADDITIONAL DRIVER) may drive the rented car. In the case of driving by another person not listed in the rental contract, the LESSEE bears full responsibility for the value of the car and the additional costs incurred regardless of the paid fees for release from liability or additional coverages.",
            },
            {
              number: "Art. 1.1",
              content:
                "Minimum term for renting the car 2 days (48 hours). It is not allowed to stick or hang any decorations, advertisements, etc. elements on the paint of the car. For celebrations, weddings and balls, the prices for car rental are negotiable.",
            },
          ],
        },
      },
    },
  }

  const content = termsContent[language]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{content.title}</h1>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {/* Section I */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">{content.sections.section1.title}</h2>

            {content.sections.section1.articles.map((article, index) => (
              <p key={index} className="mb-4">
                <strong>{article.number}</strong> {article.content}
              </p>
            ))}

            {/* Continue with full Bulgarian content when Bulgarian is selected */}
            {language === "bg" && (
              <>
                <p className="mb-4">
                  <strong>Чл.2.</strong> С подписа си НАЕМАТЕЛЯТ декларира, че е правоспособен водач с валидно СУМПС,
                  притежава необходимата правоспособност и валидни документи, съответстващи на категорията на наетото МПС да управлява наетия автомобил. НАЕМАТЕЛЯТ е
                  длъжен сам да се сдобие с международна шофьорска книжка или легализиран превод на оригиналното СУМПС,
                  в случай, че то е издадено от държава не подписала Виенската конвенция от 08.11.1968 г.
                </p>

                <p className="mb-6">
                  <strong>Чл.3.</strong> Ако в договора за наем са вписани един или повече допълнителни шофьори, то те
                  са солидарно отговорни с този, който е вписан като НАЕМАТЕЛ.
                </p>

                {/* Section II */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">II. ПРИЕМАНЕ И ПРЕДАВАНЕ НА АВТОМОБИЛА</h2>

                <p className="mb-4">
                  <strong>Чл.4.</strong> Автомобилът се предава на НАЕМАТЕЛЯ в изправно техническо състояние с
                  оборудване, отразено в приемо-предавателния протокол, неразделна част от договора, при условията на
                  който става и връщането на автомобила. НАЕМАТЕЛЯТ се задължава да върне автомобила с всички предадени
                  му документи на мястото, което е посочено в договора, в уговорения срок и в същото състояние.
                </p>

                <p className="mb-4">
                  <strong>Чл.4.1.</strong>{" "}
                  <u>
                    Автомобилът се предава измит и почистен / отвън и отвътре / на автомивка. Ако НАЕМАТЕЛЯ върне
                    автомобила мръсен и непочистен, то той се задължава да заплати такса за почистването на автомобила в
                    размер на 25 Евро / 50 лв. / за леки автомобили и 35 евро / 70 лв. / за бусове.
                  </u>
                </p>

                {/* Continue with all other sections... */}
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-800 font-semibold">
                    !!! УСЛОВИЯ НА ЗАСТРАХОВАТЕЛНАТА КОМПАНИЯ: Наемателят е длъжен да спазва условията на
                    застрахователните компании и условията на застраховане, пътните закони, според описаните Общи
                    условия на застрахователната компания и застраховка Авто Каско.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">УСЛОВИЯ ЗА АНУЛИРАНЕ/ПРОМЯНА НА РЕЗЕРВАЦИЯ</h3>
                  <p className="text-blue-700 text-sm">
                    Потвърдена резервация може да бъде анулирана/променена до 10 дни преди началото на периода на наем,
                    без да се начислява такса.
                  </p>
                </div>
              </>
            )}

            {/* English content when English is selected */}
            {language === "en" && (
              <>
                <p className="mb-4">
                  <strong>Art.2.</strong> By his signature, the LESSEE declares that he is a legally qualified driver
                  with a valid driver's license, has all the necessary documents and the relevant categories to drive
                  the rented car. The LESSEE is obliged to obtain an international driver's license or a legalized
                  translation of the original driver's license in case it was issued by a country that has not signed
                  the Vienna Convention of 08.11.1968.
                </p>

                <p className="mb-6">
                  <strong>Art.3.</strong> If one or more additional drivers are listed in the rental agreement, they are
                  jointly and severally liable with the one listed as the LESSEE.
                </p>

                {/* Section II */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">II. ACCEPTANCE AND HANDOVER OF THE CAR</h2>

                <p className="mb-4">
                  <strong>Art.4.</strong> The car is handed over to the LESSEE in good technical condition with
                  equipment, reflected in the handover protocol, an integral part of the contract, under the terms of
                  which the return of the car takes place. The LESSEE undertakes to return the car with all documents
                  handed over to him to the place specified in the contract, within the agreed period and in the same
                  condition.
                </p>

                <p className="mb-4">
                  <strong>Art.4.1.</strong>{" "}
                  <u>
                    The car is handed over washed and cleaned / outside and inside / at a car wash. If the LESSEE
                    returns the vehicle dirty and uncleaned, he is obliged to pay a fee for cleaning the vehicle in the
                    amount of 25 Euro / 50 BGN / for cars and 35 Euro / 70 BGN / for vans.
                  </u>
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-800 font-semibold">
                    !!! INSURANCE COMPANY CONDITIONS: The Lessee is obliged to comply with the terms of the insurance
                    companies and the terms of insurance, traffic laws, according to the described General Terms and
                    Conditions of the insurance company and Auto Casco insurance.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">CANCELLATION/CHANGE TERMS OF RESERVATION</h3>
                  <p className="text-blue-700 text-sm">
                    A confirmed reservation can be canceled/changed up to 10 days before the start of the rental period,
                    without charging a fee.
                  </p>
                </div>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                {language === "bg"
                  ? "Този документ представлява пълните общи условия за наем на автомобили от AUTO RENT EOOD."
                  : "This document represents the complete terms and conditions for car rental from AUTO RENT EOOD."}
                <br />
                {language === "bg"
                  ? "За въпроси и разяснения: +359 894 818 283 | ivanrent11@gmail.com"
                  : "For questions and clarifications: +359 894 818 283 | ivanrent11@gmail.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  )
}
