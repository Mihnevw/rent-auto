"use client";

import { useEffect, useState } from "react";
import CrudTable from "@/components/ui/crud-table";

interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: string;
  fuel: string;
  seats: number;
  available: boolean;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/admin/cars", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const columns = [
    { key: "brand", label: "Brand", type: "text" as const },
    { key: "model", label: "Model", type: "text" as const },
    { key: "year", label: "Year", type: "number" as const },
    { key: "price", label: "Price per Day", type: "number" as const },
    {
      key: "transmission",
      label: "Transmission",
      type: "select" as const,
      options: ["Automatic", "Manual"],
    },
    {
      key: "fuel",
      label: "Fuel Type",
      type: "select" as const,
      options: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    { key: "seats", label: "Seats", type: "number" as const },
    {
      key: "available",
      label: "Available",
      type: "select" as const,
      options: ["true", "false"],
    },
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
      title="Cars"
      columns={columns}
      data={cars}
      apiEndpoint="/api/admin/cars"
      onRefresh={fetchCars}
    />
  );
} 