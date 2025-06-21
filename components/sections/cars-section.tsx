import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, Car, Fuel, DoorOpen } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { type TranslationKey } from "@/lib/translations"

interface CarData {
  _id: string
  name: string
  image: string
  transmission: TranslationKey
  category: TranslationKey
  doors?: string
  price: number
  fuel: string
}

const carsList: CarData[] = [
  {
    _id: "65f85a300000000000000001",
    name: "SHKODA RAPID 2016",
    image: "/images/rapid.png",
    transmission: "manual",
    category: "sedan",
    doors: "4/5",
    fuel: "petrol",
    price: 40
  },
  {
    _id: "65f85a300000000000000002",
    name: "MERCEDES-BENZ GLC 2021",
    image: "/images/glc.png",
    transmission: "automatic",
    category: "suv",
    doors: "4/5",
    fuel: "petrol",
    price: 90
  },
  {
    _id: "65f85a300000000000000003",
    name: "BMW 3-SERIES 2021",
    image: "/images/bmw-3.png",
    transmission: "automatic",
    category: "sedan",
    doors: "4/5",
    fuel: "petrol",
    price: 65
  },
  {
    _id: "65f85a300000000000000004",
    name: "BMW 5-SERIES 2020",
    image: "/images/bmw-5.png",
    transmission: "automatic",
    category: "sedan",
    doors: "4/5",
    fuel: "petrol",
    price: 75
  },
  {
    _id: "65f85a300000000000000005",
    name: "MASERATI GHIBLI 2017",
    image: "/images/maserati.png",
    transmission: "automatic",
    category: "sedan",
    doors: "4/5",
    fuel: "petrol",
    price: 90
  },
  {
    _id: "65f85a300000000000000006",
    name: "JAGUAR F-TYPE 2019",
    image: "/images/jaguar-f.png",
    transmission: "automatic",
    category: "sedan",
    doors: "4/5",
    fuel: "petrol",
    price: 150
  },
  {
    _id: "65f85a300000000000000007",
    name: "SHKODA OCTAVIA 2020",
    image: "/images/shkoda.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 60
  },
  {
    _id: "65f85a300000000000000008",
    name: "RANGE ROVER 2014",
    image: "/images/range.png",
    transmission: "automatic",
    category: "suv",
    fuel: "petrol",
    price: 75
  },
  {
    _id: "65f85a300000000000000009",
    name: "OPEL INSIGNIA 2019",
    image: "/images/opel.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 60
  },
  {
    _id: "65f85a300000000000000010",
    name: "MERCEDES C220 2021",
    image: "/images/mercedes.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 75
  },
  {
    _id: "65f85a300000000000000011",
    name: "FORD FOCUS 2021",
    image: "/images/ford-focus.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 55
  },
  {
    _id: "65f85a300000000000000012",
    name: "FORD MONDEO 2021",
    image: "/images/ford-mondeo.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 60
  },
  {
    _id: "65f85a300000000000000013",
    name: "VOLKSWAGEN PASSAT 2021",
    image: "/images/passat.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 60
  },
  {
    _id: "65f85a300000000000000014",
    name: "CITROEN GRAND C4 PICASSO 2016",
    image: "/images/citroen.png",
    transmission: "manual",
    category: "suv",
    fuel: "petrol",
    price: 60
  },
  {
    _id: "65f85a300000000000000015",
    name: "SHKODA OCTAVIA 2012",
    image: "/images/shkoda-octavia.png",
    transmission: "manual",
    category: "sedan",
    fuel: "petrol",
    price: 35
  },
  {
    _id: "65f85a300000000000000016",
    name: "MERCEDES-BENZ E-CLASS 2020",
    image: "/images/mercedes-e.png",
    transmission: "manual",
    category: "sedan",
    fuel: "petrol",
    price: 70
  },
  {
    _id: "65f85a300000000000000017",
    name: "SHKODA SUPERB 2021",
    image: "/images/superb.png",
    transmission: "automatic",
    category: "sedan",
    fuel: "petrol",
    price: 65
  }
]

export function CarsSection() {
  const { t, formatPrice } = useLanguage()
  const [currentPage, setCurrentPage] = useState(1)
  const carsPerPage = 9

  // Изчисляване на показваните коли за текущата страница
  const indexOfLastCar = currentPage * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = carsList.slice(indexOfFirstCar, indexOfLastCar)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">{t("ourCars")}</h2>

        {/* Мрежа с коли */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentCars.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-blue-600 mb-4">{car.name}</h3>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex-grow">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Settings className="w-4 h-4 text-blue-500" />
                    <span>{t(car.transmission)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DoorOpen className="w-4 h-4 text-blue-500" />
                    <span>{car.doors ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span>{t(car.category)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Fuel className="w-4 h-4 text-blue-500" />
                    <span>{car.fuel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">{formatPrice(car.price)}</div>
                  <div className="text-sm text-gray-500">{t("perDay")}</div>
                </div>

                <Link href={`/cars/${car._id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold">
                    {t("seeMore")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Контроли за страници */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentPage === 1 ? 'bg-orange-400 scale-110' : 'bg-gray-300 hover:bg-orange-400/70'}`}
            aria-label="Go to page 1"
          />
          <button
            onClick={() => setCurrentPage(2)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentPage === 2 ? 'bg-orange-400 scale-110' : 'bg-gray-300 hover:bg-orange-400/70'}`}
            aria-label="Go to page 2"
          />
        </div>

        {/* Индикатор на страницата */}
        <div className="text-center text-sm text-gray-500 mt-4">
          {`${currentPage}/2`}
        </div>
      </div>
    </section>
  )
}