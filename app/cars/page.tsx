"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Fuel, Users, Car, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isBefore, startOfToday } from "date-fns"
import { cn } from "@/lib/utils"

const rentalLocations = [
  { value: "burgas", labelKey: "burgas" },
  { value: "pomorie", labelKey: "pomorie" },
  { value: "nessebar", labelKey: "nessebar" },
  { value: "sunny-beach", labelKey: "sunnyBeach" },
  { value: "sveti-vlas", labelKey: "svetiVlas" },
  { value: "varna", labelKey: "varna" },
  { value: "golden-sands", labelKey: "goldenSands" },
]

const cars = [
  {
    id: 1,
    name: "SHKODA RAPID 2016",
    slug: "vw-up-move",
    image: "/images/rapid.png?height=200&width=300",
    price: "40.00",
    fuel: "Бензин",
    fuelType: "gasoline", // for filtering
    transmission: "Ръчни скорости",
    transmissionType: "manual", // for filtering
    seats: "5 места",
    doors: "4/5 врати",
        category: "Икономични",
      bodyType: "hatchback", // for filtering
      badges: ["ИКОНОМИЧНИ"],
  },
  {
    id: 2,
    name: "MERCEDES-BENZ GLC 2021",
    slug: "hyundai-i10-meta-blue",
    image: "/images/glc.png?height=200&width=300",
    price: "50.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "4/5 врати",
    doors: "4/5 врати",
        category: "Икономика",
      bodyType: "hatchback",
      badges: ["2024", "ИКОНОМИЧНИ"],
  },
  {
    id: 3,
    name: "BMW 3-SERIES 2021",
    slug: "hyundai-i10",
    image: "/images/bmw-3.png?height=200&width=300",
    price: "70.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "4/5 врати",
    doors: "4/5 врати",
        category: "Икономикачни",
      bodyType: "hatchback",
      badges: ["ИКОНОМИЧНИ"],
  },
  {
    id: 4,
    name: "BMW 5-SERIES 2020",
    slug: "vw-taigo-tsi-dsg",
    image: "/images/bmw-5.png?height=200&width=300",
    price: "85.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Компактни",
    bodyType: "suv",
    badges: ["2022", "КОМПАКТНИ"],
  },
  {
    id: 5,
    name: "MASERATI GHIBLI 2017",
    slug: "vw-passat-tdi",
    image: "/images/maserati.png?height=200&width=300",
    price: "95.00",
    fuel: "Дизел",
    fuelType: "diesel",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2023", "СЕДАН"],
  },
  {
    id: 6,
    name: "JAGUAR F-TYPE 2019",
    slug: "bmw-320d",
    image: "/images/jaguar-f.png?height=200&width=300",
    price: "120.00",
    fuel: "Дизел",
    fuelType: "diesel",
    transmission: "Ръчни скорости",
    transmissionType: "manual",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  {
    id: 7,
    name: "SHKODA OCTAVIA 2020",
    slug: "vw-passat-tdi",
    image: "/images/shkoda.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  {
    id: 8,
    name: "MERCEDES C220 2021",
    slug: "vw-passat-tdi",
    image: "/images/mercedes.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  {
    id: 9,
    name: "FORD FOCUS 2021",  
    slug: "vw-passat-tdi",
    image: "/images/ford-focus.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  {
    id: 10,
    name: "CITROEN GRAND C4 PICASSO 2016",
    slug: "vw-passat-tdi",
    image: "/images/citroen.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  {
    id: 11,
    name: "FORD MONDEO 2021",
    slug: "vw-passat-tdi",
    image: "/images/ford-mondeo.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  {
    id: 12,
    name: "VOLKSWAGEN PASSAT 2021", 
    slug: "vw-passat-tdi",
    image: "/images/passat.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },

  {
    id: 13,
    name: "CITROEN GRAND C4 PICASSO 2016", 
    slug: "vw-passat-tdi",
    image: "/images/citroen.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },

  {
    id: 14,
    name: "SHKODA OCTAVIA 2012", 
    slug: "vw-passat-tdi",
    image: "/images/shkoda-octavia.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },

  {
    id: 15,
    name: "MERCEDES-BENZ E-CLASS 2020",
    slug: "vw-passat-tdi",
    image: "/images/mercedes-e.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline",
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  },
  
  {
    id: 16,
    name: "SHKODA SUPERB 2021",
    slug: "vw-passat-tdi",
    image: "/images/superb.png?height=200&width=300",
    price: "100.00",
    fuel: "Бензин",
    fuelType: "gasoline", 
    transmission: "Автоматик",
    transmissionType: "automatic",
    seats: "5 места",
    doors: "4/5 врати",
    category: "Седан",
    bodyType: "sedan",
    badges: ["2022", "СЕДАН"],
  }
]

export default function CarsPage() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [returnLocation, setReturnLocation] = useState("")
  const [bodyType, setBodyType] = useState("all")
  const [pickupDate, setPickupDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()

  // Add filter states
  const [filters, setFilters] = useState({
    diesel: false,
    gasoline: false,
    automatic: false,
    manual: false,
  })

  const { t, formatPrice } = useLanguage()

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfToday())
  }

  const handlePickupDateChange = (date: Date | undefined) => {
    setPickupDate(date)
    // Reset return date if it's before the new pickup date
    if (date && returnDate && isBefore(returnDate, date)) {
      setReturnDate(undefined)
    }
  }

  // Filter cars based on selected criteria
  const filteredCars = cars.filter((car) => {
    // Fuel type filtering
    const fuelMatch =
      (!filters.diesel && !filters.gasoline) || // No fuel filter selected
      (filters.diesel && car.fuelType === "diesel") ||
      (filters.gasoline && car.fuelType === "gasoline")

    // Transmission filtering
    const transmissionMatch =
      (!filters.automatic && !filters.manual) || // No transmission filter selected
      (filters.automatic && car.transmissionType === "automatic") ||
      (filters.manual && car.transmissionType === "manual")

    // Body type filtering
    const bodyTypeMatch = bodyType === "all" || car.bodyType === bodyType

    return fuelMatch && transmissionMatch && bodyTypeMatch
  })

  const handleFilterChange = (filterType: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Rental Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("rental")}</h3>

                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-2 block">{t("pickupLocation")}</Label>
                  <Select value={pickupLocation} onValueChange={setPickupLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {t(location.labelKey as any)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickupDate ? format(pickupDate, "PPP") : <span>Изберете дата</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={pickupDate}
                          onSelect={handlePickupDateChange}
                          disabled={isDateDisabled}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("pickupTime")}</Label>
                    <div className="relative">
                      <Input type="text" defaultValue="10:00" className="pr-10" />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t("return")}</h3>

                <div className="mb-4">
                  <Label className="text-sm text-gray-600 mb-2 block">{t("returnLocation")}</Label>
                  <Select value={returnLocation} onValueChange={setReturnLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {rentalLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {t(location.labelKey as any)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {returnDate ? format(returnDate, "PPP") : <span>Изберете дата</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={setReturnDate}
                          disabled={(date) => isDateDisabled(date) || (pickupDate ? isBefore(date, pickupDate) : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">{t("returnTime")}</Label>
                    <div className="relative">
                      <Input type="text" defaultValue="10:00" className="pr-10" />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/search?pickup=${pickupLocation}&return=${returnLocation}&pickupDate=${
                  pickupDate ? format(pickupDate, "yyyy-MM-dd") : ""
                }&returnDate=${returnDate ? format(returnDate, "yyyy-MM-dd") : ""}&pickupTime=10:00&returnTime=10:00`}
              >
                <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 rounded-lg mb-6">
                  {t("search")}
                </Button>
              </Link>

              {/* Filters Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{t("filter")}</h3>
                  {(filters.diesel || filters.gasoline || filters.automatic || filters.manual || bodyType) && (
                    <button
                      onClick={() => {
                        setFilters({ diesel: false, gasoline: false, automatic: false, manual: false })
                        setBodyType("all")
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {t("clearAllFilters")}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="diesel"
                      className="rounded"
                      checked={filters.diesel}
                      onChange={(e) => handleFilterChange("diesel", e.target.checked)}
                    />
                    <label htmlFor="diesel" className="text-sm text-gray-600">
                      {t("diesel")} {filters.diesel && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="automatic"
                      className="rounded"
                      checked={filters.automatic}
                      onChange={(e) => handleFilterChange("automatic", e.target.checked)}
                    />
                    <label htmlFor="automatic" className="text-sm text-gray-600">
                      {t("automatic")} {filters.automatic && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gasoline"
                      className="rounded"
                      checked={filters.gasoline}
                      onChange={(e) => handleFilterChange("gasoline", e.target.checked)}
                    />
                    <label htmlFor="gasoline" className="text-sm text-gray-600">
                      {t("gasoline")} {filters.gasoline && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="manual"
                      className="rounded"
                      checked={filters.manual}
                      onChange={(e) => handleFilterChange("manual", e.target.checked)}
                    />
                    <label htmlFor="manual" className="text-sm text-gray-600">
                      {t("manual")} {filters.manual && <span className="text-blue-600">✓</span>}
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">{t("bodyType")}</Label>
                  <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Всички</SelectItem>
                      <SelectItem value="sedan">Седан</SelectItem>
                      <SelectItem value="hatchback">Хечбек</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="coupe">Купе</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header Text */}
            <div className="mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">{t("carsPageDescription")}</p>
              <div className="mt-4 text-sm text-gray-600">
                {t("showingCars")} {filteredCars.length} {t("ofCars")} {cars.length} {t("carsForPeriod")}
              </div>
            </div>

            {/* Cars List */}
            <div className="space-y-6">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid md:grid-cols-3 gap-6 items-center">
                      {/* Car Image */}
                      <div className="md:col-span-1">
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={car.name}
                          width={300}
                          height={200}
                          className="w-full h-40 object-contain"
                        />
                      </div>

                      {/* Car Details */}
                      <div className="md:col-span-1">
                        <div className="flex items-start gap-2 mb-4">
                          <h3 className="text-xl font-bold text-blue-600">{car.name}</h3>
                          <div className="flex flex-wrap gap-1">
                            {car.badges.map((badge, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-400 text-white"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Fuel className="w-4 h-4 text-blue-500" />
                            <span>{t("gasoline")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Settings className="w-4 h-4 text-blue-500" />
                            <span>{t("manual")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span>5 {t("seats")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Car className="w-4 h-4 text-blue-500" />
                            <span>4/5 {t("doors")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                            <span>{car.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="md:col-span-1 text-right">
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-blue-600">{formatPrice(car.price)}</div>
                          <div className="text-sm text-gray-500">{t("perDay")}</div>
                        </div>
                        <Link href={`/cars/${car.id}`}>
                          <Button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-2">
                            {t("seeMore")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">Няма автомобили, отговарящи на избраните критерии</div>
                  <p className="text-gray-400">Моля, променете филтрите или се свържете с нас за повече опции</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
