"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { buildApiUrl, config } from "@/lib/config"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>({})

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

        if (!res.ok) {
          throw new Error('Invalid token')
        }

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

  const token = typeof window !== 'undefined' ? localStorage.getItem("admin-token") : null
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await fetch(buildApiUrl(config.api.endpoints.dashboardStats), {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Failed to fetch stats")
        const data = await res.json()
        setStats(data)
      } catch {
        setStats({})
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [token])

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total Cars</p>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : stats.totalCars ?? 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Pending Payments</p>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : stats.pendingPayments ?? 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Completed Payments</p>
          <p className="mt-2 text-3xl font-bold">{loading ? "..." : stats.completedPayments ?? 0}</p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Reservations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 font-medium tracking-wider">Code</th>
                <th className="px-6 py-3 font-medium tracking-wider">Customer</th>
                <th className="px-6 py-3 font-medium tracking-wider">Car</th>
                <th className="px-6 py-3 font-medium tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Array.isArray(stats.recentReservations) && stats.recentReservations.length > 0 ? (
                stats.recentReservations.map((r: any) => (
                  <tr key={r._id}>
                    <td className="px-6 py-4">{r.code}</td>
                    <td className="px-6 py-4">{r.customerName}</td>
                    <td className="px-6 py-4">{r.carId?.make} {r.carId?.model}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${r.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : r.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{r.paymentStatus}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-400">No recent reservations</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}