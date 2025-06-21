"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type Language, translations, type TranslationKey } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  formatPrice: (price: number | string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// BGN to EUR conversion rate (approximate)
const BGN_TO_EUR_RATE = 0.51

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("bg")

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.bg[key] || key
  }

  const formatPrice = (price: number | string): string => {
    if (price === null || price === undefined) {
      return language === "en" ? "€0" : "0лв."
    }

    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    
    if (Number.isNaN(numPrice)) {
      return language === "en" ? "€0" : "0лв."
    }

    if (language === "en") {
      const eurPrice = (numPrice * BGN_TO_EUR_RATE).toFixed(0)
      return `€${eurPrice}`
    } else {
      return `${numPrice.toFixed(0)}лв.`
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatPrice }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
