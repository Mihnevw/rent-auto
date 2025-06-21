import { useLanguage } from "@/lib/language-context"

export function FooterSection() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-400 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-4 bg-green-500 rounded-sm relative">
                  <div className="absolute inset-1 bg-white rounded-sm"></div>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold">
                  <span className="text-white">DL</span>
                  <span className="text-white">RENT</span>
                </div>
                <div className="text-xs text-white/80">
                  {t("carRental")}
                </div>
              </div>
            </div>
            <p className="text-white/90 text-sm">{t("footerDescription")}</p>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("aboutUs")}</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="/about" className="hover:text-white">
                  {t("whoAreWe")}
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white">
                  {t("generalTerms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("faq")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("privacyPolicyFooter")}
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("servicesFooter")}</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="/cars" className="hover:text-white">
                  {t("carRental")}
                </a>
              </li>
              <li>
                <a href="/monthly-offers" className="hover:text-white">
                  {t("monthlyOffers")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("businessOffers")}
                </a>
              </li>
              <li>
                <a href="/prices" className="hover:text-white">
                  {t("prices")}
                </a>
              </li>
            </ul>
          </div>

          {/* Fleet */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("fleet")}</h3>
            <ul className="space-y-2 text-sm text-white/90">
              <li>
                <a href="#" className="hover:text-white">
                  {t("lightCars")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("suvs")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t("vans")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("contactsFooter")}</h3>
            <div className="space-y-2 text-sm text-white/90">
              <p>{t("officeStaraZagora")}</p>
              <p>ул. Цар Симеон Велики 83</p>
              <p>+359 898636246</p>
              <p>starazagora@dlrent.bg</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 