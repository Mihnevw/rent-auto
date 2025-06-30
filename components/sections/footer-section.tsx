import { useLanguage } from "@/lib/language-context"
import { MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
              <div className="space-y-1">
                <Link href="/" className="inline-block">
                  <div className="relative w-48 h-48 -mb-16 -mt-16">
                    <Image
                      src="/rent-logo.png"
                      alt="AUTO RENT Logo"
                      fill
                      className="object-contain brightness-0 invert"
                      priority
                    />
                  </div>
                </Link>
                <p className="text-white/80 text-sm leading-relaxed">{t("footerDescription")}</p>
              </div>
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
                    href="/privacy"
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
                    href="/services"
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block"
                  >
                    {t("servicesFooterEn")}
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