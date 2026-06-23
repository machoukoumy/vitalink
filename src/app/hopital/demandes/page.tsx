"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { formatDate, getBloodGroupLabel, cn, REQUEST_STATUS, REQUEST_URGENCY } from "@/lib/utils";

interface BloodRequest {
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
  notes: string | null;
  createdAt: string;
  hospital: { name: string };
}

export default function HopitalDemandesPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [cancelModal, setCancelModal] = useState<BloodRequest | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchData = () => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (filterStatus) params.set("status", filterStatus);
    if (filterUrgency) params.set("urgency", filterUrgency);

    fetch(`/api/blood-requests?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterUrgency]);

  const handleCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      await fetch(`/api/blood-requests/${cancelModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      setCancelModal(null);
      fetchData();
    } finally {
      setCancelling(false);
    }
  };

  const urgencyColor: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-800",
    URGENT: "bg-orange-100 text-orange-800",
    NORMAL: "bg-blue-100 text-blue-800",
  };

  const urgencyLabel: Record<string, string> = {
    CRITICAL: "Critique",
    URGENT: "Urgent",
    NORMAL: "Normal",
  };

  const columns = [
    {
      key: "bloodGroup",
      label: "Groupe",
      render: (item: BloodRequest) => (
        <span className="font-semibold text-red-600">
          {getBloodGroupLabel(item.bloodGroup, item.rhFactor)}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Quantite",
      render: (item: BloodRequest) => `${item.quantity} ml`,
    },
    {
      key: "urgency",
      label: "Urgence",
      render: (item: BloodRequest) => (
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            urgencyColor[item.urgency] || "bg-gray-100 text-gray-800"
          )}
        >
          {urgencyLabel[item.urgency] || item.urgency}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (item: BloodRequest) => <StatusBadge status={item.status} />,
    },
    {
      key: "patientInfo",
      label: "Patient",
      render: (item: BloodRequest) => (
        <span className="text-gray-600">
          {item.patientInfo || "-"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (item: BloodRequest) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: BloodRequest) =>
        item.status === "PENDING" ? (
          <button
            onClick={() => setCancelModal(item)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Annuler
          </button>
        ) : null,
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes demandes</h1>
          <p className="text-gray-500 mt-1">
            {requests.length} demande(s) au total
          </p>
        </div>
        <Link
          href="/hopital/nouvelle-demande"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Nouvelle demande
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">Filtrer :</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(REQUEST_STATUS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Toutes les urgences</option>
          {Object.entries(REQUEST_URGENCY).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        emptyMessage="Aucune demande trouvee"
      />

      <Modal
        isOpen={!!cancelModal}
        onClose={() => setCancelModal(null)}
        title="Annuler la demande"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Voulez-vous vraiment annuler cette demande de{" "}
            <span className="font-semibold">
              {cancelModal?.quantity} ml de{" "}
              {cancelModal
                ? getBloodGroupLabel(cancelModal.bloodGroup, cancelModal.rhFactor)
                : ""}
            </span>{" "}
            ?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setCancelModal(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Non, garder
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
            >
              {cancelling ? "Annulation..." : "Oui, annuler"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
