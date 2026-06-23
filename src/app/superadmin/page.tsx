"use client";

import { useEffect, useState } from "react";
import {
  Building2, Hospital, Users, Droplets, Package, AlertTriangle,
  Shield, UserCog, Clock,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import BloodStockChart from "@/components/BloodStockChart";
import StatusBadge from "@/components/StatusBadge";
import { formatDateTime, getBloodGroupLabel } from "@/lib/utils";

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

const urgencyColors: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  URGENT: "bg-orange-100 text-orange-800",
  NORMAL: "bg-blue-100 text-blue-800",
};

export default function SuperAdminDashboard() {
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Super Admin</h1>
        <p className="text-gray-500 mt-1">Vue globale du syst&egrave;me CNTS - Centre National de Transfusion Sanguine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard title="Centres" value={stats.totalCenters} icon={<Building2 size={24} />} color="blue" />
        <StatsCard title="H&ocirc;pitaux" value={stats.totalHospitals} icon={<Hospital size={24} />} color="green" />
        <StatsCard title="Donneurs" value={stats.totalDonors} icon={<Users size={24} />} color="purple" />
        <StatsCard title="Dons Totaux" value={stats.totalDonations} icon={<Droplets size={24} />} color="red" />
        <StatsCard title="Stock Disponible" value={stats.availableStock} subtitle={`${stats.totalStock} total`} icon={<Package size={24} />} color="green" />
        <StatsCard title="Demandes en attente" value={stats.pendingRequests} subtitle={`${stats.totalRequests} au total`} icon={<Clock size={24} />} color="yellow" />
        <StatsCard title="Demandes critiques" value={stats.criticalRequests} icon={<AlertTriangle size={24} />} color="red" />
        <StatsCard title="Administrateurs" value={stats.totalAdmins} subtitle={`${stats.totalPersonnel} personnel`} icon={<Shield size={24} />} color="purple" />
      </div>

      <BloodStockChart data={stats.stockByGroup} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demandes recentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            Demandes r&eacute;centes en attente
          </h3>
          {stats.recentRequests.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune demande en attente</p>
          ) : (
            <div className="space-y-3">
              {stats.recentRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      {getBloodGroupLabel(req.bloodGroup, req.rhFactor)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{req.hospital.name}</p>
                      <p className="text-xs text-gray-500">{req.quantity} ml - {req.hospital.province}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColors[req.urgency] || "bg-gray-100 text-gray-800"}`}>
                      {req.urgency === "CRITICAL" ? "Critique" : req.urgency === "URGENT" ? "Urgent" : "Normal"}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats par centre */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" />
            Performance par Centre
          </h3>
          {stats.centerStats.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun centre enregistr&eacute;</p>
          ) : (
            <div className="space-y-3">
              {stats.centerStats.map((center) => (
                <div key={center.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{center.name}</p>
                      <p className="text-xs text-gray-500">{center.province} - {center.type === "HEADQUARTERS" ? "Siège" : "Provincial"}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Users size={12} /> {center._count.donors} donneurs</span>
                    <span className="flex items-center gap-1"><Droplets size={12} /> {center._count.donations} dons</span>
                    <span className="flex items-center gap-1"><Package size={12} /> {center._count.bloodStock} stocks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
