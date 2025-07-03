"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { buildApiUrl, config } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<any | null>(null)
  const [form, setForm] = useState<any>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: ""
  })

  const token = typeof window !== 'undefined' ? localStorage.getItem("admin-token") : null

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(buildApiUrl(config.api.endpoints.users), {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setError("Error loading users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return
    await fetch(buildApiUrl(config.api.endpoints.users) + `/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchUsers()
  }

  const handleEdit = (user: any) => {
    setEditUser(user)
    setForm({ ...user, password: "" })
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditUser(null)
    setForm({ email: "", password: "", firstName: "", lastName: "", phone: "" })
    setShowForm(true)
  }

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    setForm((f: any) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const method = editUser ? "PUT" : "POST"
    const url = editUser ? buildApiUrl(config.api.endpoints.users) + `/${editUser._id}` : buildApiUrl(config.api.endpoints.users)
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    fetchUsers()
  }

  return (
    <AdminLayout title="Users">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Users</h2>
        <Button onClick={handleAdd}>Add User</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.firstName}</td>
                <td className="p-2">{user.lastName}</td>
                <td className="p-2">{user.phone}</td>
                <td className="p-2 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">{editUser ? "Edit User" : "Add User"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Email</label>
                <Input name="email" value={form.email} onChange={handleFormChange} required />
              </div>
              <div>
                <label>Password</label>
                <Input name="password" value={form.password} onChange={handleFormChange} type="password" required={!editUser} />
              </div>
              <div>
                <label>First Name</label>
                <Input name="firstName" value={form.firstName} onChange={handleFormChange} />
              </div>
              <div>
                <label>Last Name</label>
                <Input name="lastName" value={form.lastName} onChange={handleFormChange} />
              </div>
              <div>
                <label>Phone</label>
                <Input name="phone" value={form.phone} onChange={handleFormChange} />
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