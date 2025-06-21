"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { useLanguage } from "@/lib/language-context"

export default function ServicesPage() {
  const { t, formatPrice } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-12">{t("servicesTitle")}</h1>

        {/* Services List */}
        <div className="space-y-12">
          {/* Service 1 - Delivery to Address */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <Image
                src="/placeholder.svg?height=250&width=400"
                alt="Man driving a car"
                width={400}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("homeDelivery")}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{t("homeDeliveryText")}</p>
            </div>
          </div>

          {/* Service 2 - Airport Delivery */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <Image
                src="/placeholder.svg?height=250&width=400"
                alt="People walking near airplane at airport"
                width={400}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("airportDelivery")}</h2>
              <div className="text-gray-700 text-lg leading-relaxed space-y-4">{t("airportDeliveryText")}</div>
            </div>
          </div>

          {/* Service 3 - Countrywide Delivery */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <Image
                src="/placeholder.svg?height=250&width=400"
                alt="Car on road with emergency triangle"
                width={400}
                height={250}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("countryDelivery")}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{t("countryDeliveryText")}</p>
            </div>
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Допълнителни услуги и цени</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Услуги за удобство</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Доставка в рамките на Пловдив</span>
                  <span className="font-semibold text-gray-800">{formatPrice(20)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Доставка извън Пловдив</span>
                  <span className="font-semibold text-gray-800">0.50 лв./км</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Доставка на летище</span>
                  <span className="font-semibold text-gray-800">{formatPrice(30)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Връщане извън работно време</span>
                  <span className="font-semibold text-gray-800">{formatPrice(20)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Допълнително оборудване</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Детско столче</span>
                  <span className="font-semibold text-gray-800">{formatPrice(5)}/ден</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">GPS навигация</span>
                  <span className="font-semibold text-gray-800">{formatPrice(5)}/ден</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Допълнителен водач</span>
                  <span className="font-semibold text-gray-800">{formatPrice(10)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-700">Зимни гуми (дек-март)</span>
                  <span className="font-semibold text-green-600">Включени</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Как да поръчате услуга</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-blue-700 mb-4">
                За да поръчате някоя от нашите услуги, моля свържете се с нас по телефона или изпратете заявка по email.
              </p>
              <div className="space-y-2">
                <p className="text-blue-700">
                  <strong>{t("phone")}:</strong> +359 898 636 246
                </p>
                <p className="text-blue-700">
                  <strong>{t("email")}:</strong> info@dlrent.bg
                </p>
                <p className="text-blue-700">
                  <strong>{t("workingHours")}:</strong> Пн-Пт 08:00-18:00, Сб 09:00-17:00
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Важни бележки:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Доставката се извършва в рамките на 2-4 часа</li>
                <li>• За спешни случаи - 24/7 обслужване</li>
                <li>• Предварително резервиране препоръчително</li>
                <li>• Плащането се извършва при получаване</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
