"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import BloodStockChart from "@/components/BloodStockChart";
import { formatDate, getBloodGroupLabel, daysUntilExpiry, BLOOD_GROUPS } from "@/lib/utils";

interface StockRecord {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  status: string;
  collectedAt: string;
  expiresAt: string;
  donation: { donor: { user: { name: string } } } | null;
}

interface StockSummary {
  bloodGroup: string;
  rhFactor: string;
  _sum: { quantity: number | null };
  _count: number;
}

export default function PersonnelStockPage() {
  const [stocks, setStocks] = useState<StockRecord[]>([]);
  const [summary, setSummary] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "20" });
    if (bloodGroup) params.set("bloodGroup", bloodGroup);
    fetch(`/api/blood-stock?${params}`)
      .then(r => r.json())
      .then(d => { setStocks(d.stocks || []); setSummary(d.summary || []); })
      .finally(() => setLoading(false));
  }, [bloodGroup]);

  const columns = [
    { key: "bloodGroup", label: "Groupe", render: (s: StockRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{getBloodGroupLabel(s.bloodGroup, s.rhFactor)}</span>
    )},
    { key: "quantity", label: "Quantité", render: (s: StockRecord) => `${s.quantity} ml` },
    { key: "donor", label: "Donneur", render: (s: StockRecord) => s.donation?.donor?.user?.name || "-" },
    { key: "collectedAt", label: "Collecté", render: (s: StockRecord) => formatDate(s.collectedAt) },
    { key: "expiresAt", label: "Expiration", render: (s: StockRecord) => {
      const days = daysUntilExpiry(s.expiresAt);
      return <span className={days <= 7 ? "text-red-600 font-medium" : ""}>{formatDate(s.expiresAt)}</span>;
    }},
    { key: "status", label: "Statut", render: (s: StockRecord) => <StatusBadge status={s.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Stock Sanguin</h1></div>
        <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="px-4 py-2.5 border rounded-lg outline-none">
          <option value="">Tous les groupes</option>
          {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <BloodStockChart data={summary} />
      {loading ? <div className="text-center py-12 text-gray-500">Chargement...</div> : (
        <DataTable columns={columns} data={stocks} emptyMessage="Aucun stock" />
      )}
    </div>
  );
}
