"use client";

import { useEffect, useState } from "react";
import { Users, Droplets, Package, Calendar } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import BloodStockChart from "@/components/BloodStockChart";

interface Stats {
  totalDonors: number;
  activeDonors: number;
  recentDonations: number;
  availableStock: number;
  pendingAppointments: number;
  todayAppointments: number;
  stockByGroup: Array<{ bloodGroup: string; rhFactor: string; _sum: { quantity: number | null }; _count: number }>;
}

export default function PersonnelDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Personnel</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans votre espace de travail</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Donneurs actifs" value={stats.activeDonors} subtitle={`${stats.totalDonors} total`} icon={<Users size={24} />} color="blue" />
        <StatsCard title="Dons (30j)" value={stats.recentDonations} icon={<Droplets size={24} />} color="red" />
        <StatsCard title="Stock Disponible" value={stats.availableStock} icon={<Package size={24} />} color="green" />
        <StatsCard title="RDV Aujourd'hui" value={stats.todayAppointments} subtitle={`${stats.pendingAppointments} en attente`} icon={<Calendar size={24} />} color="yellow" />
      </div>

      <BloodStockChart data={stats.stockByGroup} />
    </div>
  );
}
