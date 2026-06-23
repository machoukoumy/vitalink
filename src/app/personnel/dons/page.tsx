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
  donor: { user: { name: string } };
}

export default function PersonnelDonsPage() {
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
    { key: "donor", label: "Donneur", render: (d: DonationRecord) => d.donor.user.name },
    { key: "bloodGroup", label: "Groupe", render: (d: DonationRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{getBloodGroupLabel(d.bloodGroup, d.rhFactor)}</span>
    )},
    { key: "quantity", label: "Quantité", render: (d: DonationRecord) => `${d.quantity} ml` },
    { key: "date", label: "Date", render: (d: DonationRecord) => formatDateTime(d.date) },
    { key: "status", label: "Statut", render: (d: DonationRecord) => <StatusBadge status={d.status} /> },
    { key: "actions", label: "Statut", render: (d: DonationRecord) => (
      <select value={d.status} onChange={e => handleStatusChange(d.id, e.target.value)}
        className="text-xs px-2 py-1 border rounded-lg outline-none">
        <option value="PENDING">PENDING</option>
        <option value="COLLECTED">COLLECTED</option>
        <option value="TESTED">TESTED</option>
        <option value="STORED">STORED</option>
        <option value="REJECTED">REJECTED</option>
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Dons</h1><p className="text-gray-500 mt-1">Suivi des dons</p></div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border rounded-lg outline-none">
          <option value="">Tous</option>
          <option value="PENDING">En attente</option>
          <option value="COLLECTED">Collecté</option>
          <option value="TESTED">Testé</option>
          <option value="STORED">Stocké</option>
          <option value="REJECTED">Rejeté</option>
        </select>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Chargement...</div> : (
        <DataTable columns={columns} data={donations} emptyMessage="Aucun don" />
      )}
    </div>
  );
}
