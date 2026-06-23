"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getBloodGroupLabel } from "@/lib/utils";

interface DonorRequestRecord { id: string; bloodGroup: string; rhFactor: string; quantity: number; urgency: string; status: string; reason: string | null; city: string; createdAt: string; }

const URGENCY_COLORS: Record<string, string> = { CRITICAL: "bg-[#E30613] text-white", URGENT: "bg-orange-500 text-white", NORMAL: "bg-[#003DA5] text-white" };

export default function MesDemandesPage() {
  const [requests, setRequests] = useState<DonorRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { fetch("/api/donor-requests").then(r => r.json()).then(d => setRequests(d.requests || [])).finally(() => setLoading(false)); };
  useEffect(() => { fetchData(); }, []);

  const handleCancel = async (id: string) => {
    await fetch(`/api/donor-requests/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "CANCELLED" }) });
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  const columns = [
    { key: "bloodGroup", label: "Groupe", render: (r: DonorRequestRecord) => <span className="px-2 py-1 bg-[#E30613]/10 text-[#E30613] rounded-lg text-sm font-bold">{getBloodGroupLabel(r.bloodGroup, r.rhFactor)}</span> },
    { key: "quantity", label: "Quantité", render: (r: DonorRequestRecord) => `${r.quantity} ml` },
    { key: "urgency", label: "Urgence", render: (r: DonorRequestRecord) => <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${URGENCY_COLORS[r.urgency]}`}>{r.urgency}</span> },
    { key: "city", label: "Ville" },
    { key: "reason", label: "Motif", render: (r: DonorRequestRecord) => <span className="text-xs text-gray-500 line-clamp-1">{r.reason || "-"}</span> },
    { key: "status", label: "Statut", render: (r: DonorRequestRecord) => <StatusBadge status={r.status} /> },
    { key: "date", label: "Date", render: (r: DonorRequestRecord) => formatDate(r.createdAt) },
    { key: "actions", label: "", render: (r: DonorRequestRecord) => r.status === "PENDING" ? <button onClick={() => handleCancel(r.id)} className="text-xs text-[#E30613] font-semibold hover:underline">Annuler</button> : null },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Mes Demandes</h1><p className="text-gray-500 mt-1">{requests.length} demande(s)</p></div>
        <Link href="/donneur/demande-don" className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"><Plus size={16} /> Nouvelle demande</Link>
      </div>
      <DataTable columns={columns} data={requests} emptyMessage="Aucune demande publiée" />
    </div>
  );
}
