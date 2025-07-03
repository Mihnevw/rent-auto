"use client"

import { usePathname } from "next/navigation"
import React from "react"

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hasHeader = !pathname.startsWith("/admin")

  return (
    <main className={hasHeader ? "pt-[72px] sm:pt-[80px]" : ""}>
      {children}
    </main>
  )
} 