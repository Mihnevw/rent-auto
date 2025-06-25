import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function CarCategoriesSection() {
  const { t } = useLanguage()

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
          {t("ourCars")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Light Cars */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{t("lightCars")}</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3">{t("carsPageDescription")}</p>
              <Link href="/cars" className="block">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
                >
                  {t("seeAll")}
                </Button>
              </Link>
              <div className="mt-6 sm:mt-8 flex justify-center transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/bmw-3.png"
                  alt="Blue sedan car"
                  width={240}
                  height={140}
                  className="object-contain w-auto h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* SUVs */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
            <div className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{t("suvs")}</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6 line-clamp-3">{t("carsPageDescription")}</p>
              <Link href="/cars" className="block">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-4 sm:px-6 py-2 text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
                >
                  {t("seeAll")}
                </Button>
              </Link>
              <div className="mt-6 sm:mt-8 flex justify-center transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/images/range.png"
                  alt="Gray SUV car"
                  width={240}
                  height={140}
                  className="object-contain w-auto h-auto"
                />
              </div>
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