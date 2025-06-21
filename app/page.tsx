"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/sections/hero-section"
import { CarsSection } from "@/components/sections/cars-section"
import { CarCategoriesSection } from "@/components/sections/car-categories-section"
import { DeliverySection } from "@/components/sections/delivery-section"
//import { GoogleReviewsSection } from "@/components/sections/google-reviews-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function DLRentHomepage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CarsSection />
      <CarCategoriesSection />
      <DeliverySection />
      {/* <GoogleReviewsSection /> */}
      <FooterSection />
    </div>
  )
}
