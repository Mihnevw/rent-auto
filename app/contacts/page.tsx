"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function ContactsPage() {
  const { t, formatPrice } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">{t("contactsTitle")}</h1>
          <p className="text-xl text-gray-600">Свържете се с нас за повече информация или резервация</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">{t("contactInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{t("address")}</h3>
                    <p className="text-gray-600">
                      гр. Пловдив, ул. Примерна 123
                      <br />
                      4000 Пловдив, България
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{t("phone")}</h3>
                    <p className="text-gray-600">+359 898 636 246</p>
                    <p className="text-sm text-gray-500">24/7 за спешни случаи</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{t("email")}</h3>
                    <p className="text-gray-600">info@dlrent.bg</p>
                    <p className="text-gray-600">reservations@dlrent.bg</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{t("workingHours")}</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>{t("mondayFriday")}</p>
                      <p>{t("saturday")}</p>
                      <p>{t("sunday")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Местоположение</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Карта на местоположението</p>
                    <p className="text-sm">гр. Пловдив, ул. Примерна 123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600">{t("sendMessage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("firstName")} *</Label>
                    <Input id="firstName" placeholder="Вашето име" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("lastName")} *</Label>
                    <Input id="lastName" placeholder="Вашата фамилия" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{t("email")} *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>

                <div>
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input id="phone" type="tel" placeholder="+359 ..." />
                </div>

                <div>
                  <Label htmlFor="subject">{t("subject")}</Label>
                  <Input id="subject" placeholder="Тема на съобщението" />
                </div>

                <div>
                  <Label htmlFor="message">{t("message")} *</Label>
                  <Textarea id="message" placeholder="Вашето съобщение..." rows={5} required />
                </div>

                <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold">
                  {t("sendMessageBtn")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-blue-600">{t("whyChooseDLRent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚗</span>
                </div>
                <h3 className="font-semibold mb-2">{t("newCars")}</h3>
                <p className="text-gray-600 text-sm">Модерни и добре поддържани автомобили</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">{t("competitivePrices")}</h3>
                <p className="text-gray-600 text-sm">Най-добрите цени в Пловдив</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">{t("fullInsurance")}</h3>
                <p className="text-gray-600 text-sm">Каско и ГО застраховка включени</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="font-semibold mb-2">{t("support24_7")}</h3>
                <p className="text-gray-600 text-sm">Винаги на разположение за помощ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
