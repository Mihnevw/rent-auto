"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { buildApiUrl, config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editCar, setEditCar] = useState<any | null>(null)
  const [form, setForm] = useState<any>({
    make: "",
    model: "",
    name: "",
    mainImage: "",
    engine: "",
    fuel: "",
    transmission: "manual",
    seats: "",
    doors: "",
    year: "",
    consumption: "",
    bodyType: "",
    priceIncludes: [],
    features: [],
    pricing: { "1_3": 0, "4_7": 0, "8_14": 0, "15_plus": 0 },
  })

  const token = typeof window !== 'undefined' ? localStorage.getItem("admin-token") : null

  const fetchCars = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(buildApiUrl(config.api.endpoints.cars), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch cars")
      const data = await res.json()
      setCars(data)
    } catch (err) {
      setError("Error loading cars")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCars() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this car?")) return
    await fetch(buildApiUrl(config.api.endpoints.cars) + `/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchCars()
  }

  const handleEdit = (car: any) => {
    setEditCar(car)
    setForm({ ...car })
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditCar(null)
    setForm({
      make: "",
      model: "",
      name: "",
      mainImage: "",
      engine: "",
      fuel: "",
      transmission: "manual",
      seats: "",
      doors: "",
      year: "",
      consumption: "",
      bodyType: "",
      priceIncludes: [],
      features: [],
      pricing: { "1_3": 0, "4_7": 0, "8_14": 0, "15_plus": 0 },
    })
    setShowForm(true)
  }

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    if (name.startsWith("pricing.")) {
      const key = name.split(".")[1]
      setForm((f: any) => ({ ...f, pricing: { ...f.pricing, [key]: value } }))
    } else {
      setForm((f: any) => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const method = editCar ? "PUT" : "POST"
    const url = editCar ? buildApiUrl(config.api.endpoints.cars) + `/${editCar._id}` : buildApiUrl(config.api.endpoints.cars)
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    fetchCars()
  }

  return (
    <AdminLayout title="Cars">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Cars</h2>
        <Button onClick={handleAdd}>Add Car</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Make</th>
              <th className="p-2">Model</th>
              <th className="p-2">Year</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id} className="border-t">
                <td className="p-2">{car.name}</td>
                <td className="p-2">{car.make}</td>
                <td className="p-2">{car.model}</td>
                <td className="p-2">{car.year}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(car)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(car._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">{editCar ? "Edit Car" : "Add Car"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Make</label>
                <Input name="make" value={form.make} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Model</label>
                <Input name="model" value={form.model} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Name</label>
                <Input name="name" value={form.name} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Year</label>
                <Input name="year" value={form.year} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Engine</label>
                <Input name="engine" value={form.engine} onChange={handleFormChange} />
              </div>
              <div>
                <label>Fuel</label>
                <Input name="fuel" value={form.fuel} onChange={handleFormChange} />
              </div>
              <div>
                <label>Transmission</label>
                <Input name="transmission" value={form.transmission} onChange={handleFormChange} />
              </div>
              <div>
                <label>Seats</label>
                <Input name="seats" value={form.seats} onChange={handleFormChange} />
              </div>
              <div>
                <label>Doors</label>
                <Input name="doors" value={form.doors} onChange={handleFormChange} />
              </div>
              <div>
                <label>Consumption</label>
                <Input name="consumption" value={form.consumption} onChange={handleFormChange} />
              </div>
              <div>
                <label>Body Type</label>
                <Input name="bodyType" value={form.bodyType} onChange={handleFormChange} />
              </div>
              <div>
                <label>Pricing 1-3</label>
                <Input name="pricing.1_3" value={form.pricing["1_3"]} onChange={handleFormChange} />
              </div>
              <div>
                <label>Pricing 4-7</label>
                <Input name="pricing.4_7" value={form.pricing["4_7"]} onChange={handleFormChange} />
              </div>
              <div>
                <label>Pricing 8-14</label>
                <Input name="pricing.8_14" value={form.pricing["8_14"]} onChange={handleFormChange} />
              </div>
              <div>
                <label>Pricing 15+</label>
                <Input name="pricing.15_plus" value={form.pricing["15_plus"]} onChange={handleFormChange} />
              </div>
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