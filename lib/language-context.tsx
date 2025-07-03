"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { translations } from "./translations"
import type { Language, TranslationKey } from "./translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
  formatPrice: (price: number | string) => string
  isLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// BGN to EUR conversion rate (approximate)
const BGN_TO_EUR_RATE = 0.511292

const LANGUAGE_STORAGE_KEY = "preferred-language"

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("bg")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load language preference after initial render
  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === "en" || stored === "bg") {
      setLanguage(stored)
    } else {
      const browserLang = navigator.language.toLowerCase()
      setLanguage(browserLang.startsWith("en") ? "en" : "bg")
    }
    setIsLoaded(true)
  }, [])

  // Save language preference
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    }
  }, [language, isLoaded])

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang)
  }

  const t = (key: TranslationKey): string => {
    // Cast to any first to bypass type checking, then to the desired type
    const currentTranslations = translations[language] as any as Record<string, string>
    const fallbackTranslations = translations.bg as any as Record<string, string>
    
    const translation = currentTranslations?.[key] ?? fallbackTranslations[key]
    return translation || key
  }

  const formatPrice = (price: number | string): string => {
    if (price === null || price === undefined) {
      return "€0.00"
    }

    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price

    if (Number.isNaN(numPrice)) {
      return "€0.00"
    }

    return `€${numPrice.toFixed(2)}`
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        formatPrice,
        isLoaded
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export type { Language, TranslationKey }
