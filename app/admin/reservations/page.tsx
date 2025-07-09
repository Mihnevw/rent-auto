"use client";

import { useEffect, useState } from "react";
import CrudTable from "@/components/ui/crud-table";

interface Reservation {
  _id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/reservations", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const columns = [
    { key: "carId", label: "Car ID", type: "text" as const },
    { key: "userId", label: "User ID", type: "text" as const },
    { key: "startDate", label: "Start Date", type: "date" as const },
    { key: "endDate", label: "End Date", type: "date" as const },
    { key: "totalPrice", label: "Total Price", type: "number" as const },
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: ["pending", "confirmed", "completed", "cancelled"],
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      type: "select" as const,
      options: ["pending", "paid", "refunded", "failed"],
    },
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
      title="Reservations"
      columns={columns}
      data={reservations}
      apiEndpoint="/api/admin/reservations"
      onRefresh={fetchReservations}
    />
  );
} 