"use client";

import { useEffect, useState } from "react";
import { Users, Droplets, Package, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import BloodStockChart from "@/components/BloodStockChart";

interface Stats {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  recentDonations: number;
  totalStock: number;
  availableStock: number;
  pendingAppointments: number;
  todayAppointments: number;
  stockByGroup: Array<{ bloodGroup: string; rhFactor: string; _sum: { quantity: number | null }; _count: number }>;
  donationsByMonth: Array<{ bloodGroup: string; _count: number; _sum: { quantity: number | null } }>;
  expiringStock: number;
  personnelCount: number;
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  if (!stats) return null;

  const totalCollectedMl = stats.donationsByMonth.reduce((acc, d) => acc + (d._sum.quantity || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-500 mt-1">Analyse compl&egrave;te de l&apos;activit&eacute; du CNTS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Donneurs" value={stats.totalDonors} subtitle={`${stats.activeDonors} éligibles`} icon={<Users size={24} />} color="blue" />
        <StatsCard title="Dons (30 jours)" value={stats.recentDonations} subtitle={`${totalCollectedMl} ml collectés`} icon={<Droplets size={24} />} color="red" />
        <StatsCard title="Stock Disponible" value={stats.availableStock} subtitle="poches disponibles" icon={<Package size={24} />} color="green" />
        <StatsCard title="RDV en attente" value={stats.pendingAppointments} subtitle={`${stats.todayAppointments} aujourd'hui`} icon={<Calendar size={24} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsCard title="Total Dons" value={stats.totalDonations} subtitle="depuis le début" icon={<TrendingUp size={24} />} color="purple" />
        <StatsCard title="Stock Expirant" value={stats.expiringStock} subtitle="dans les 7 prochains jours" icon={<AlertTriangle size={24} />} color="red" />
      </div>

      <BloodStockChart data={stats.stockByGroup} />

      {stats.donationsByMonth.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dons par Groupe Sanguin (30 derniers jours)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.donationsByMonth.map((d, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl font-bold text-red-600">{d.bloodGroup}</span>
                <p className="text-sm text-gray-600 mt-1">{d._count} dons</p>
                <p className="text-xs text-gray-500">{d._sum.quantity || 0} ml</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
