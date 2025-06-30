"use client"

import { Phone, ChevronDown, Check, Menu, X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { type TranslationKey } from "@/lib/translations"

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY

      // Show navbar at the top
      if (currentScrollY < 20) {
        setVisible(true)
        setLastScrollY(currentScrollY)
        return
      }

      // Determine scroll direction and update visibility
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false)
      } else {
        // Scrolling up
        setVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlNavbar)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlNavbar)
    }
  }, [lastScrollY])

  const navigationLinks: Array<{ href: string; label: TranslationKey }> = [
    { href: "/", label: "home" },
    { href: "/about", label: "about" },
    { href: "/cars", label: "cars" },
    { href: "/prices", label: "prices" },
    { href: "/monthly-offers", label: "monthlyOffers" },
    { href: "/services", label: "services" },
    { href: "/contacts", label: "contacts" },
  ]

  return (
    <header
      className={`fixed w-full top-0 left-0 right-0 bg-white shadow-sm z-50 transition-transform duration-200 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-[72px] sm:h-[80px]">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <div className="relative w-28 h-20 sm:w-40 sm:h-52">
              <Image
                src="/rent-logo.png"
                alt="AUTO RENT Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center flex-1 justify-center gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-800 hover:text-orange-400 font-medium text-base transition-colors whitespace-nowrap"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            <a
              href="tel:+359894818283"
              className="font-semibold hover:text-orange-400 transition-colors"
            >
              +359 894818283
            </a>
          </div>

          {/* Language Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded cursor-pointer hover:bg-green-200 transition-colors">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage("bg")}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                    <div className="absolute top-1 left-0 w-full h-1 bg-green-500"></div>
                    <div className="absolute top-2 left-0 w-full h-1 bg-red-500"></div>
                  </div>
                  <span>Български</span>
                </div>
                {language === "bg" && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                    <div className="absolute top-1 left-0 w-full h-1 bg-white"></div>
                    <div className="absolute top-2 left-0 w-full h-1 bg-blue-500"></div>
                  </div>
                  <span>English</span>
                </div>
                {language === "en" && <Check className="w-4 h-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">€</span>
          </div>

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0" title={t("navigation")}>
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <div className="relative w-28 h-20">
                      <Image
                        src="/rent-logo.png"
                        alt="AUTO RENT Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center py-3 px-6 text-base font-medium text-gray-800 hover:text-orange-400 hover:bg-orange-50 transition-colors border-b border-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(link.label)}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-3 justify-center">
                    <Phone className="w-5 h-5 text-green-500" />
                    <a
                      href="tel:+359894818283"
                      className="font-semibold hover:text-green-500 transition-colors"
                    >
                      +359 894818283
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
