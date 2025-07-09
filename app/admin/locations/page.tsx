"use client";

import { useEffect, useState } from "react";
import CrudTable from "@/components/ui/crud-table";

interface Location {
  _id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  isActive: boolean;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/admin/locations", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const columns = [
    { key: "name", label: "Name", type: "text" as const },
    { key: "address", label: "Address", type: "text" as const },
    { key: "city", label: "City", type: "text" as const },
    { key: "country", label: "Country", type: "text" as const },
    {
      key: "isActive",
      label: "Active",
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
      title="Locations"
      columns={columns}
      data={locations}
      apiEndpoint="/api/admin/locations"
      onRefresh={fetchLocations}
    />
  );
} 