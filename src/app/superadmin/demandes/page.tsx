"use client";

import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDateTime, getBloodGroupLabel, REQUEST_STATUS, REQUEST_URGENCY } from "@/lib/utils";

interface BloodRequestRecord {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  urgency: string;
  status: string;
  patientInfo: string | null;
  reason: string | null;
  contactName: string | null;
  contactPhone: string | null;
  notes: string | null;
  createdAt: string;
  fulfilledAt: string | null;
  fulfilledBy: string | null;
  hospital: { id: string; name: string; province: string; phone: string | null };
}

const urgencyColors: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  URGENT: "bg-orange-100 text-orange-800",
  NORMAL: "bg-blue-100 text-blue-800",
};

const STATUS_OPTIONS = ["PENDING", "APPROVED", "FULFILLED", "PARTIALLY_FULFILLED", "REJECTED", "CANCELLED"];

export default function SuperAdminDemandesPage() {
  const [requests, setRequests] = useState<BloodRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (statusFilter) params.set("status", statusFilter);
    if (urgencyFilter) params.set("urgency", urgencyFilter);

    fetch(`/api/blood-requests?${params}`)
      .then(r => r.json())
      .then(d => { setRequests(d.requests || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, [page, statusFilter, urgencyFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/blood-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchRequests();
  };

  const columns = [
    { key: "hospital", label: "Hôpital", render: (r: BloodRequestRecord) => (
      <div>
        <p className="font-medium text-gray-900">{r.hospital.name}</p>
        <p className="text-xs text-gray-500">{r.hospital.province}</p>
      </div>
    )},
    { key: "bloodGroup", label: "Groupe", render: (r: BloodRequestRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        {getBloodGroupLabel(r.bloodGroup, r.rhFactor)}
      </span>
    )},
    { key: "quantity", label: "Quantité", render: (r: BloodRequestRecord) => `${r.quantity} ml` },
    { key: "urgency", label: "Urgence", render: (r: BloodRequestRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[r.urgency] || "bg-gray-100 text-gray-800"}`}>
        {REQUEST_URGENCY[r.urgency as keyof typeof REQUEST_URGENCY] || r.urgency}
      </span>
    )},
    { key: "status", label: "Statut", render: (r: BloodRequestRecord) => <StatusBadge status={r.status} /> },
    { key: "patientInfo", label: "Patient", render: (r: BloodRequestRecord) => r.patientInfo || "-" },
    { key: "reason", label: "Motif", render: (r: BloodRequestRecord) => r.reason || "-" },
    { key: "createdAt", label: "Date", render: (r: BloodRequestRecord) => formatDateTime(r.createdAt) },
    { key: "actions", label: "Changer statut", render: (r: BloodRequestRecord) => (
      <select value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}
        className="text-xs px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
        {STATUS_OPTIONS.map(s => (
          <option key={s} value={s}>{REQUEST_STATUS[s as keyof typeof REQUEST_STATUS] || s}</option>
        ))}
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Toutes les Demandes de Sang</h1>
        <p className="text-gray-500 mt-1">Vue globale de toutes les demandes de tous les h&ocirc;pitaux</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
          <option value="">Tous les statuts</option>
          {Object.entries(REQUEST_STATUS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={urgencyFilter} onChange={e => { setUrgencyFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
          <option value="">Toutes les urgences</option>
          {Object.entries(REQUEST_URGENCY).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <>
          <DataTable columns={columns} data={requests} emptyMessage="Aucune demande trouv&eacute;e" />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Pr&eacute;c&eacute;dent</button>
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
