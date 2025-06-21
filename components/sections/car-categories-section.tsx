import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function CarCategoriesSection() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Light Cars */}
          <div className="text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg p-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("lightCars")}</h3>
            <p className="text-gray-600 mb-6">{t("carsPageDescription")}</p>
            <Link href="/cars">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-2 mb-6"
              >
                {t("seeAll")}
              </Button>
            </Link>
            <div className="flex justify-center">
              <Image
                src="/images/bmw-3.png?height=120&width=200"
                alt="Blue sedan car"
                width={200}
                height={120}
                className="object-contain"
              />
            </div>
          </div>

          {/* SUVs */}
          <div className="text-center hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg p-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("suvs")}</h3>
            <p className="text-gray-600 mb-6">{t("carsPageDescription")}</p>
            <Link href="/cars">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-2 mb-6"
              >
                {t("seeAll")}
              </Button>
            </Link>
            <div className="flex justify-center">
              <Image
                src="/images/range.png?height=120&width=200"
                alt="Gray SUV car"
                width={200}
                height={120}
                className="object-contain"
              />
            </div>
          </div>

          {/* Vans */}
          {/* <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t("vans")}</h3>
            <p className="text-gray-600 mb-6">{t("carsPageDescription")}</p>
            <Link href="/cars">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-2 mb-6"
              >
                {t("seeAll")}
              </Button>
            </Link>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=120&width=200"
                alt="Gray van"
                width={200}
                height={120}
                className="object-contain"
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
} 