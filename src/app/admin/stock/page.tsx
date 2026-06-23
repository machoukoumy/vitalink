"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import BloodStockChart from "@/components/BloodStockChart";
import { formatDate, BLOOD_GROUPS, getBloodGroupLabel, daysUntilExpiry } from "@/lib/utils";

interface StockRecord {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  status: string;
  collectedAt: string;
  expiresAt: string;
  storageLocation: string | null;
  donation: { donor: { user: { name: string } } } | null;
}

interface StockSummary {
  bloodGroup: string;
  rhFactor: string;
  _sum: { quantity: number | null };
  _count: number;
}

const STOCK_STATUSES = ["", "AVAILABLE", "RESERVED", "USED", "EXPIRED", "QUARANTINE"];

export default function AdminStockPage() {
  const [stocks, setStocks] = useState<StockRecord[]>([]);
  const [summary, setSummary] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStocks = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (bloodGroup) params.set("bloodGroup", bloodGroup);
    if (status) params.set("status", status);
    fetch(`/api/blood-stock?${params}`)
      .then(r => r.json())
      .then(d => { setStocks(d.stocks || []); setSummary(d.summary || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStocks(); }, [page, bloodGroup, status]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch("/api/blood-stock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchStocks();
  };

  const columns = [
    { key: "bloodGroup", label: "Groupe", render: (s: StockRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        {getBloodGroupLabel(s.bloodGroup, s.rhFactor)}
      </span>
    )},
    { key: "quantity", label: "Quantité", render: (s: StockRecord) => `${s.quantity} ml` },
    { key: "donor", label: "Donneur", render: (s: StockRecord) => s.donation?.donor?.user?.name || "-" },
    { key: "collectedAt", label: "Collecté le", render: (s: StockRecord) => formatDate(s.collectedAt) },
    { key: "expiresAt", label: "Expire le", render: (s: StockRecord) => {
      const days = daysUntilExpiry(s.expiresAt);
      return (
        <span className={days <= 7 ? "text-red-600 font-medium" : ""}>
          {formatDate(s.expiresAt)} {days <= 7 && days > 0 ? `(${days}j)` : days <= 0 ? "(Expiré)" : ""}
        </span>
      );
    }},
    { key: "status", label: "Statut", render: (s: StockRecord) => <StatusBadge status={s.status} /> },
    { key: "actions", label: "Actions", render: (s: StockRecord) => (
      <select value={s.status} onChange={e => handleStatusChange(s.id, e.target.value)}
        className="text-xs px-2 py-1 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
        {STOCK_STATUSES.filter(st => st).map(st => <option key={st} value={st}>{st}</option>)}
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Sanguin</h1>
        <p className="text-gray-500 mt-1">Gestion et suivi des stocks de sang</p>
      </div>

      <BloodStockChart data={summary} />

      <div className="flex gap-4">
        <select value={bloodGroup} onChange={e => { setBloodGroup(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Tous les groupes</option>
          {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Tous les statuts</option>
          {STOCK_STATUSES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <>
          <DataTable columns={columns} data={stocks} emptyMessage="Aucun stock enregistré" />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Précédent</button>
              <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Suivant</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
