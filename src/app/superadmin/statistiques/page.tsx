"use client";

import { useEffect, useState } from "react";
import {
  Building2, Hospital, Users, Droplets, Package, AlertTriangle,
  BarChart3, TrendingUp, CheckCircle2,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import BloodStockChart from "@/components/BloodStockChart";
import { getBloodGroupLabel } from "@/lib/utils";

interface Stats {
  totalCenters: number;
  totalHospitals: number;
  totalUsers: number;
  totalDonors: number;
  totalDonations: number;
  totalStock: number;
  availableStock: number;
  totalRequests: number;
  pendingRequests: number;
  criticalRequests: number;
  totalAdmins: number;
  totalPersonnel: number;
  totalHospitalUsers: number;
  stockByGroup: Array<{ bloodGroup: string; rhFactor: string; _sum: { quantity: number | null }; _count: number }>;
  centerStats: Array<{
    id: string; name: string; province: string; type: string;
    _count: { donors: number; donations: number; bloodStock: number };
  }>;
  recentRequests: Array<{
    id: string; bloodGroup: string; rhFactor: string; quantity: number;
    urgency: string; status: string; createdAt: string;
    hospital: { name: string; province: string };
  }>;
}

export default function SuperAdminStatistiquesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/superadmin/stats")
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Chargement...</div></div>;
  }

  if (!stats) return null;

  const fulfilledRequests = stats.recentRequests.filter(r => r.status === "FULFILLED").length;
  const fulfillmentRate = stats.totalRequests > 0
    ? Math.round((fulfilledRequests / stats.totalRequests) * 100)
    : 0;

  const totalStockQuantity = stats.stockByGroup.reduce((sum, s) => sum + (s._sum.quantity || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques Avanc&eacute;es</h1>
        <p className="text-gray-500 mt-1">Analyses d&eacute;taill&eacute;es du syst&egrave;me CNTS</p>
      </div>

      {/* Vue d'ensemble */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-600" />
          Vue d&apos;ensemble
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Utilisateurs" value={stats.totalUsers} subtitle={`${stats.totalAdmins} admins, ${stats.totalPersonnel} personnel`} icon={<Users size={24} />} color="blue" />
          <StatsCard title="Stock Total" value={`${totalStockQuantity} ml`} subtitle={`${stats.availableStock} poches disponibles`} icon={<Package size={24} />} color="green" />
          <StatsCard title="Demandes Totales" value={stats.totalRequests} subtitle={`${stats.pendingRequests} en attente`} icon={<AlertTriangle size={24} />} color="yellow" />
          <StatsCard title="Demandes Critiques" value={stats.criticalRequests} icon={<AlertTriangle size={24} />} color="red" />
        </div>
      </div>

      {/* Distribution du stock */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Droplets size={20} className="text-red-600" />
          Distribution du Stock par Groupe Sanguin
        </h2>
        <BloodStockChart data={stats.stockByGroup} />
      </div>

      {/* Stock détaillé par groupe */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">D&eacute;tail du Stock par Groupe</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.stockByGroup.map((s) => {
            const label = getBloodGroupLabel(s.bloodGroup, s.rhFactor);
            const qty = s._sum.quantity || 0;
            const pct = totalStockQuantity > 0 ? Math.round((qty / totalStockQuantity) * 100) : 0;
            return (
              <div key={label} className="p-4 rounded-lg border border-gray-100 text-center">
                <p className="text-lg font-bold text-red-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{qty} ml</p>
                <p className="text-sm text-gray-500">{s._count} poches</p>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{pct}% du total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance par centre */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-blue-600" />
          Performance par Centre
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Centre</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Province</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Donneurs</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dons</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.centerStats.map((center) => {
                  const totalCenterActivity = center._count.donors + center._count.donations + center._count.bloodStock;
                  return (
                    <tr key={center.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{center.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{center.province}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${center.type === "HEADQUARTERS" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                          {center.type === "HEADQUARTERS" ? "Siège" : "Provincial"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{center._count.donors}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{center._count.donations}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{center._count.bloodStock}</td>
                    </tr>
                  );
                })}
                {stats.centerStats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Aucun centre enregistr&eacute;</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Résumé des demandes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-600" />
          R&eacute;sum&eacute; des Demandes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="p-3 bg-yellow-50 rounded-lg inline-block mb-3">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingRequests}</p>
            <p className="text-sm text-gray-500 mt-1">Demandes en attente</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="p-3 bg-red-50 rounded-lg inline-block mb-3">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.criticalRequests}</p>
            <p className="text-sm text-gray-500 mt-1">Demandes critiques actives</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="p-3 bg-green-50 rounded-lg inline-block mb-3">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
            <p className="text-sm text-gray-500 mt-1">Demandes totales trait&eacute;es</p>
          </div>
        </div>
      </div>
    </div>
  );
}
