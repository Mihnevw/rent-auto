"use client";

import { useEffect, useState } from "react";
import CrudTable from "@/components/ui/crud-table";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: "name", label: "Name", type: "text" as const },
    { key: "email", label: "Email", type: "text" as const },
    {
      key: "role",
      label: "Role",
      type: "select" as const,
      options: ["user", "admin"],
    },
    { key: "phone", label: "Phone", type: "text" as const },
    { key: "createdAt", label: "Created At", type: "date" as const },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <CrudTable
      title="Users"
      columns={columns}
      data={users}
      apiEndpoint="/api/admin/users"
      onRefresh={fetchUsers}
    />
  );
} 