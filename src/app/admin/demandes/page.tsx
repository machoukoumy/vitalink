"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDateTime, getBloodGroupLabel } from "@/lib/utils";

interface RequestRecord {
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
  isPublic: boolean;
  createdAt: string;
  hospital: { name: string; province: string; phone: string | null };
}

const URGENCY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  URGENT: "bg-orange-100 text-orange-800",
  NORMAL: "bg-blue-100 text-blue-800",
};

export default function AdminDemandesPage() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [urgency, setUrgency] = useState("");

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "30" });
    if (status) params.set("status", status);
    if (urgency) params.set("urgency", urgency);
    fetch(`/api/blood-requests?${params}`)
      .then(r => r.json())
      .then(d => setRequests(d.requests || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [status, urgency]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/blood-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const columns = [
    { key: "hospital", label: "Hôpital", render: (r: RequestRecord) => (
      <div><p className="font-medium">{r.hospital.name}</p><p className="text-xs text-gray-500">{r.hospital.province}</p></div>
    )},
    { key: "bloodGroup", label: "Groupe", render: (r: RequestRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{getBloodGroupLabel(r.bloodGroup, r.rhFactor)}</span>
    )},
    { key: "quantity", label: "Quantité", render: (r: RequestRecord) => `${r.quantity} ml` },
    { key: "urgency", label: "Urgence", render: (r: RequestRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${URGENCY_COLORS[r.urgency] || ""}`}>
        {r.urgency === "CRITICAL" ? "Critique" : r.urgency === "URGENT" ? "Urgent" : "Normal"}
      </span>
    )},
    { key: "reason", label: "Motif", render: (r: RequestRecord) => r.reason || "-" },
    { key: "date", label: "Date", render: (r: RequestRecord) => formatDateTime(r.createdAt) },
    { key: "isPublic", label: "Public", render: (r: RequestRecord) => r.isPublic ? "Oui" : "Non" },
    { key: "status", label: "Statut", render: (r: RequestRecord) => <StatusBadge status={r.status} /> },
    { key: "actions", label: "Action", render: (r: RequestRecord) => (
      <select value={r.status} onChange={e => handleStatusChange(r.id, e.target.value)}
        className="text-xs px-2 py-1 border rounded-lg outline-none">
        <option value="PENDING">En attente</option>
        <option value="APPROVED">Approuv&eacute;e</option>
        <option value="FULFILLED">Satisfaite</option>
        <option value="PARTIALLY_FULFILLED">Partielle</option>
        <option value="REJECTED">Rejet&eacute;e</option>
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes de Sang</h1>
          <p className="text-gray-500 mt-1">Demandes re&ccedil;ues des h&ocirc;pitaux</p>
        </div>
        <div className="flex gap-3">
          <select value={urgency} onChange={e => setUrgency(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none">
            <option value="">Toutes urgences</option>
            <option value="CRITICAL">Critique</option>
            <option value="URGENT">Urgent</option>
            <option value="NORMAL">Normal</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm outline-none">
            <option value="">Tous statuts</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuv&eacute;e</option>
            <option value="FULFILLED">Satisfaite</option>
            <option value="REJECTED">Rejet&eacute;e</option>
          </select>
        </div>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Chargement...</div> : (
        <DataTable columns={columns} data={requests} emptyMessage="Aucune demande" />
      )}
    </div>
  );
}
