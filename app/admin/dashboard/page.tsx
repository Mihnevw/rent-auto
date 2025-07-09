"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Car, Users, CalendarRange, MapPin } from "lucide-react";

interface Stats {
  totalCars: number;
  totalUsers: number;
  totalReservations: number;
  totalLocations: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCars: 0,
    totalUsers: 0,
    totalReservations: 0,
    totalLocations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: Car,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Reservations",
      value: stats.totalReservations,
      icon: CalendarRange,
      color: "text-purple-600",
    },
    {
      title: "Total Locations",
      value: stats.totalLocations,
      icon: MapPin,
      color: "text-red-600",
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
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 