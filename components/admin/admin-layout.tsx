"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { buildApiUrl, config } from "@/lib/config"

export function AdminLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("admin-token") : null
    if (!token) {
      router.replace("/admin")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(buildApiUrl(config.api.endpoints.verify), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error('Invalid token')
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error(err)
        router.replace("/admin")
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Cars", href: "/admin/dashboard/cars" },
    { label: "Reservations", href: "/admin/dashboard/reservations" },
    { label: "Users", href: "/admin/dashboard/users" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    router.replace("/admin")
  }

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col">
        <div className="h-16 flex items-center justify-center text-xl font-semibold border-b border-gray-700">
          AUTO RENT Admin
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                typeof window !== 'undefined' && window.location.pathname === link.href
                  ? 'bg-gray-700'
                  : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <span className="text-sm text-gray-600">{user?.email}</span>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 