import { Inter } from "next/font/google"
import { Metadata } from "next"
import { LanguageProvider } from "@/lib/language-context"
import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

type LayoutParams = {
  params: {
    lang?: string;
  };
};

export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const lang = params?.lang || 'en'
  
  return {
    title: lang === 'bg' 
      ? "AUTO RENT | Коли под наем в България"
      : "AUTO RENT | Car Rental in Bulgaria",
    description: lang === 'bg'
      ? "Професионални услуги за автомобили под наем в Слънчев бряг, България. Широк избор от превозни средства на конкурентни цени."
      : "Professional car rental services in Sunny Beach, Bulgaria. Wide selection of vehicles with competitive prices.",
    generator: 'v0.dev',
    icons: {
      icon: '/images/logo-auto.png',
      shortcut: '/images/logo-auto.png',
      apple: '/images/logo-auto.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/images/logo-auto.png',
      },
    },
    alternates: {
      canonical: 'https://autorent.bg',
      languages: {
        'en': 'https://autorent.bg/en',
        'bg': 'https://autorent.bg/bg',
        'x-default': 'https://autorent.bg'
      }
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo-auto.png" />
        <link rel="apple-touch-icon" href="/images/logo-auto.png" />
      </head>
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
