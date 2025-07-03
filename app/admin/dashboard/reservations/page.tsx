"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { buildApiUrl, config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editReservation, setEditReservation] = useState<any | null>(null)
  const [form, setForm] = useState<any>({})
  const [showTodayOnly, setShowTodayOnly] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem("admin-token") : null

  const fetchReservations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(buildApiUrl(config.api.endpoints.reservations), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch reservations")
      const data = await res.json()
      setReservations(data)
    } catch (err) {
      setError("Error loading reservations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReservations() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reservation?")) return
    await fetch(buildApiUrl(config.api.endpoints.reservations) + `/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchReservations()
  }

  const handleEdit = (reservation: any) => {
    setEditReservation(reservation)
    setForm({ ...reservation })
    setShowForm(true)
  }

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    setForm((f: any) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const url = buildApiUrl(config.api.endpoints.reservations) + `/${editReservation._id}`
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    fetchReservations()
  }

  // Sort by createdAt descending (newest first)
  const sortedReservations = [...reservations].sort((a, b) => {
    const aDate = new Date(a.createdAt || a._id?.toString().substring(0,8));
    const bDate = new Date(b.createdAt || b._id?.toString().substring(0,8));
    return bDate.getTime() - aDate.getTime();
  });

  // Get today's date in the same format as fromDate
  const todayStr = format(new Date(), "yyyy-MM-dd")

  // Filter for today's reservations if toggled
  const filteredReservations = showTodayOnly
    ? sortedReservations.filter(r => r.fromDate === todayStr)
    : sortedReservations

  return (
    <AdminLayout title="Reservations">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Reservations</h2>
        <Button
          variant={showTodayOnly ? "default" : "outline"}
          onClick={() => setShowTodayOnly(v => !v)}
        >
          {showTodayOnly ? "Show All" : "Show Today"}
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Email</th>
              <th className="p-2">Car</th>
              <th className="p-2">From</th>
              <th className="p-2">To</th>
              <th className="p-2">Pickup</th>
              <th className="p-2">Dropoff</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.code}</td>
                <td className="p-2">{r.customerName}</td>
                <td className="p-2">{r.phone}</td>
                <td className="p-2">{r.email}</td>
                <td className="p-2">{r.carId?.make} {r.carId?.model}</td>
                <td className="p-2 whitespace-nowrap">{r.fromDate} {r.fromTime}</td>
                <td className="p-2 whitespace-nowrap">{r.toDate} {r.toTime}</td>
                <td className="p-2">{r.fromPlace?.name} <br /> <span className="text-xs text-gray-500">{r.fromPlace?.address}</span></td>
                <td className="p-2">{r.toPlace?.name} <br /> <span className="text-xs text-gray-500">{r.toPlace?.address}</span></td>
                <td className="p-2">{r.paymentStatus}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(r._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">Edit Reservation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Customer Name</label>
                <Input name="customerName" value={form.customerName} onChange={handleFormChange} />
              </div>
              <div>
                <label>Status</label>
                <Input name="paymentStatus" value={form.paymentStatus} onChange={handleFormChange} />
              </div>
              {/* Add more fields as needed */}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  )
} 