"use client"

import { Phone, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="bg-white px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-6 bg-white rounded-sm relative">
              <div className="absolute inset-1 bg-green-500 rounded-sm"></div>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              <span className="text-green-500">DL</span>
              <span className="text-gray-800">RENT</span>
            </div>
            <div className="text-xs text-gray-600">
              {language === "bg" ? "Коли под наем в България" : "Car rental in Bulgaria"}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <a href="/" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("home")}
          </a>
          <a href="/about" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("about")}
          </a>
          <a href="/cars" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("cars")}
          </a>
          <a href="/prices" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("prices")}
          </a>
          <a href="/monthly-offers" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("monthlyOffers")}
          </a>
          <a href="/services" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("services")}
          </a>
          <a href="/terms" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("terms")}
          </a>
          <a href="/contacts" className="text-gray-800 hover:text-orange-400 font-medium text-base">
            {t("contacts")}
          </a>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            <span className="font-semibold">+359 898636246</span>
          </div>

          {/* Language Selector */}
          <div
            className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded cursor-pointer"
            onClick={() => setLanguage(language === "bg" ? "en" : "bg")}
          >
            <div className="w-4 h-3 bg-white relative">
              {language === "bg" ? (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                  <div className="absolute top-1 left-0 w-full h-1 bg-green-500"></div>
                  <div className="absolute top-2 left-0 w-full h-1 bg-red-500"></div>
                </>
              ) : (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                  <div className="absolute top-1 left-0 w-full h-1 bg-white"></div>
                  <div className="absolute top-2 left-0 w-full h-1 bg-blue-500"></div>
                </>
              )}
            </div>
            <span className="text-sm font-medium">{language.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3" />
          </div>

          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">€</span>
          </div>
        </div>
      </div>
    </header>
  )
}
