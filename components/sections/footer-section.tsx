import { useLanguage } from "@/lib/language-context"
import { MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export function FooterSection() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="px-4 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo and Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-6 h-4 bg-green-500 rounded-sm relative">
                    <div className="absolute inset-1 bg-white rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold tracking-wide">
                    <span className="text-white">AUTO</span>
                    <span className="text-white">RENT</span>
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    {t("carRental")}
                  </div>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{t("footerDescription")}</p>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">{t("aboutUs")}</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    href="/about" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("whoAreWe")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("generalTerms")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("faq")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("privacyPolicyFooter")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">{t("servicesFooter")}</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    href="/cars" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("carRental")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/monthly-offers" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("monthlyOffers")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("businessOffers")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/prices" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("prices")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Fleet */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">{t("fleet")}</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    href="/cars" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("lightCars")}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cars" 
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("suvs")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white/90">{t("contactsFooter")}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-white/80">
                  <MapPin className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white/90">{t("officeStaraZagora")}</p>
                    <p>{t("officeAddress")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Phone className="w-5 h-5 text-white/90 flex-shrink-0" />
                  <a href="tel:+359894818283" className="hover:text-white transition-colors">
                    +359 894818283
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <Mail className="w-5 h-5 text-white/90 flex-shrink-0" />
                  <a href={`mailto:${t("officeEmail")}`} className="hover:text-white transition-colors">
                    {t("officeEmail")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="px-4 py-6 text-center text-sm text-white/60">
            © {new Date().getFullYear()} AUTO RENT. {t("allRightsReserved")}
          </div>
        </div>
      </div>
    </footer>
  )
} 