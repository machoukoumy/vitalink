"use client";

import { useState, useEffect, useCallback } from "react";
import StatsCard from "@/components/StatsCard";
import { Users, Droplets, Package, AlertTriangle, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  donors: number;
  donations: number;
  stock: number;
  requests: number;
}

type ExportType = "donors" | "donations" | "stock" | "requests";

interface ExportItem {
  type: ExportType;
  label: string;
  filename: string;
  icon: React.ReactNode;
  color: "red" | "blue" | "green" | "yellow";
}

const EXPORTS: ExportItem[] = [
  { type: "donors", label: "Donneurs", filename: "donneurs.csv", icon: <Users size={20} />, color: "blue" },
  { type: "donations", label: "Dons", filename: "dons.csv", icon: <Droplets size={20} />, color: "red" },
  { type: "stock", label: "Stock", filename: "stock.csv", icon: <Package size={20} />, color: "green" },
  { type: "requests", label: "Demandes", filename: "demandes.csv", icon: <AlertTriangle size={20} />, color: "yellow" },
];

export default function AdminExportPage() {
  const [stats, setStats] = useState<Stats>({ donors: 0, donations: 0, stock: 0, requests: 0 });
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<ExportType | null>(null);
  const [downloaded, setDownloaded] = useState<ExportType[]>([]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats({
          donors: data.totalDonors ?? data.donors ?? 0,
          donations: data.totalDonations ?? data.donations ?? 0,
          stock: data.totalStock ?? data.stock ?? 0,
          requests: data.totalRequests ?? data.requests ?? 0,
        });
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleExport = async (item: ExportItem) => {
    setDownloading(item.type);
    try {
      const res = await fetch(`/api/export?type=${item.type}`);
      if (res.ok) {
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = item.filename;
        a.click();
        URL.revokeObjectURL(a.href);
        setDownloaded((prev) => [...prev, item.type]);
      }
    } catch {
      /* ignore */
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Export de donnees</h1>
        <p className="text-sm text-gray-500 mt-1">Exportez les donnees du systeme au format CSV</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard title="Donneurs" value={stats.donors} icon={<Users size={20} />} color="blue" />
        <StatsCard title="Dons" value={stats.donations} icon={<Droplets size={20} />} color="red" />
        <StatsCard title="Stock" value={stats.stock} icon={<Package size={20} />} color="green" />
        <StatsCard title="Demandes" value={stats.requests} icon={<AlertTriangle size={20} />} color="yellow" />
      </div>

      {/* Export buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORTS.map((item) => {
          const isDownloading = downloading === item.type;
          const isDone = downloaded.includes(item.type);
          const count = stats[item.type];

          return (
            <div
              key={item.type}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm card-hover"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl text-white",
                  item.color === "red" ? "bg-[#E30613]" :
                  item.color === "blue" ? "bg-[#003DA5]" :
                  item.color === "green" ? "bg-emerald-500" :
                  "bg-amber-500"
                )}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-500">{count} enregistrements</p>
                </div>
                <button
                  onClick={() => handleExport(item)}
                  disabled={isDownloading}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50",
                    isDone
                      ? "bg-emerald-500 text-white"
                      : "bg-[#E30613] text-white hover:bg-[#c9050f]"
                  )}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Export...
                    </>
                  ) : isDone ? (
                    <>
                      <Check size={16} />
                      Telecharge
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Exporter
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
