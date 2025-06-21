"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"

export default function MonthlyOffersPage() {
  const { t, formatPrice } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{t("monthlyOffersTitle")}</h1>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("monthlyOffersSubtitle")}</h2>
          <p className="text-lg text-gray-700 mb-2">
            {/* ЗА ПЕРИОДИ 3 МЕСЕЦА+ МОЛЯ ДА СЕ СВЪРЖЕТЕ С НАС ЗА ИНДИВИДУАЛНА ОФЕРТА* */}
            {t("contactForOffer")}*
          </p>
          <p className="text-sm text-gray-500">*Посочените цени не важат за периода от 01.09 до 31.05.</p>
        </div>

        {/* Car Offer Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Car Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">VW UP move</h3>

              {/* Car Specifications */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{t("year")}: 2021 г.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{t("transmission")}: ръчна</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{t("fuel")}: бензин</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{t("doorsCount")}: 5</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 font-semibold mb-2">{t("priceForRental")}</p>
                  <p className="text-2xl font-bold text-gray-800">{formatPrice(1050)}/МЕСЕЦ</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {formatPrice(400)} {t("deposit")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">{t("mileageLimit")}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Car Image */}
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=300&width=500"
                alt="VW UP move white car"
                width={500}
                height={300}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("longTermAdvantages")}</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Значителни отстъпки при дългосрочни договори</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Гъвкави условия за плащане</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Пълна поддръжка и сервиз включени</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Възможност за смяна на автомобила</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>24/7 техническа поддръжка</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("longTermConditions")}</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Минимален период - 3 месеца</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Депозит се заплаща при подписване на договора</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Месечното плащане се извършва авансово</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>При надвишаване на пробега - 0.30 лв/км</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Възможност за предсрочно прекратяване</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-4">{t("contactForPersonalOffer")}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-blue-700 mb-2">
                <strong>Телефон:</strong> +359 898 636 246
              </p>
              <p className="text-blue-700 mb-2">
                <strong>Email:</strong> info@dlrent.bg
              </p>
              <p className="text-blue-700">
                <strong>Работно време:</strong> Пн-Пт 08:00-18:00
              </p>
            </div>
            <div>
              <p className="text-blue-700 text-sm">
                Нашият екип ще подготви персонализирана оферта според вашите нужди и изисквания. Предлагаме различни
                модели автомобили и гъвкави условия за дългосрочен наем.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
