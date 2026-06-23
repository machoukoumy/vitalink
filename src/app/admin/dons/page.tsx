"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDateTime, getBloodGroupLabel } from "@/lib/utils";

interface DonationRecord {
  id: string;
  date: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  status: string;
  hemoglobin: number | null;
  collectedBy: string | null;
  donor: { user: { name: string; email: string } };
}

const STATUSES = ["", "PENDING", "COLLECTED", "TESTED", "STORED", "REJECTED"];

export default function AdminDonsPage() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonations = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (status) params.set("status", status);
    fetch(`/api/donations?${params}`)
      .then(r => r.json())
      .then(d => { setDonations(d.donations || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonations(); }, [page, status]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/donations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchDonations();
  };

  const columns = [
    { key: "donor", label: "Donneur", render: (d: DonationRecord) => (
      <div><p className="font-medium">{d.donor.user.name}</p><p className="text-xs text-gray-500">{d.donor.user.email}</p></div>
    )},
    { key: "bloodGroup", label: "Groupe", render: (d: DonationRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        {getBloodGroupLabel(d.bloodGroup, d.rhFactor)}
      </span>
    )},
    { key: "quantity", label: "Quantité", render: (d: DonationRecord) => `${d.quantity} ml` },
    { key: "date", label: "Date", render: (d: DonationRecord) => formatDateTime(d.date) },
    { key: "hemoglobin", label: "Hémoglobine", render: (d: DonationRecord) => d.hemoglobin ? `${d.hemoglobin} g/dL` : "-" },
    { key: "collectedBy", label: "Collecté par", render: (d: DonationRecord) => d.collectedBy || "-" },
    { key: "status", label: "Statut", render: (d: DonationRecord) => <StatusBadge status={d.status} /> },
    { key: "actions", label: "Actions", render: (d: DonationRecord) => (
      <select value={d.status} onChange={e => handleStatusChange(d.id, e.target.value)}
        className="text-xs px-2 py-1 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
        {STATUSES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Dons</h1>
          <p className="text-gray-500 mt-1">Suivi de tous les dons de sang</p>
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Tous les statuts</option>
          {STATUSES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <>
          <DataTable columns={columns} data={donations} emptyMessage="Aucun don enregistré" />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Précédent</button>
              <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Suivant</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
