import { Inter } from "next/font/google"
import { Metadata } from "next"
import { LanguageProvider } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AUTO RENT | Car Rental in Bulgaria",
  description: "Professional car rental services in Sunny Beach, Bulgaria. Wide selection of vehicles with competitive prices.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <LanguageProvider>
          <Header />
          <main className="pt-[72px] sm:pt-[80px]">
            {children}
          </main>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
