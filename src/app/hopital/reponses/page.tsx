"use client";

import { useEffect, useState } from "react";
import { Phone, Users, Filter } from "lucide-react";
import DataTable from "@/components/DataTable";
import { formatDateTime, getBloodGroupLabel } from "@/lib/utils";

interface DonorResponse {
  id: string;
  status: string;
  message: string | null;
  availableDate: string | null;
  createdAt: string;
  donor: {
    bloodGroup: string;
    rhFactor: string;
    user: { name: string; phone: string | null; email: string | null };
  };
  bloodRequest: {
    bloodGroup: string;
    rhFactor: string;
    quantity: number;
    urgency: string;
    patientInfo?: string | null;
    hospital: { name: string };
  };
}

export default function HopitalReponsesPage() {
  const [responses, setResponses] = useState<DonorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/donor-responses")
      .then((r) => r.json())
      .then((data) => setResponses(data.responses || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );
  }

  const filtered =
    statusFilter === "ALL"
      ? responses
      : responses.filter((r) => r.status === statusFilter);

  const acceptedCount = responses.filter((r) => r.status === "ACCEPTED").length;
  const refusedCount = responses.filter((r) => r.status === "REFUSED").length;

  const columns = [
    {
      key: "donor",
      label: "Donneur",
      render: (item: DonorResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-red-600">
              {getBloodGroupLabel(item.donor.bloodGroup, item.donor.rhFactor)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.donor.user.name}</p>
            <p className="text-xs text-gray-500">
              {item.donor.user.phone || "Pas de telephone"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "bloodGroup",
      label: "Groupe sanguin",
      hideOnMobile: true,
      render: (item: DonorResponse) => (
        <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
          {getBloodGroupLabel(item.donor.bloodGroup, item.donor.rhFactor)}
        </span>
      ),
    },
    {
      key: "request",
      label: "Demande",
      render: (item: DonorResponse) => (
        <div>
          <p className="text-sm text-gray-900">
            {getBloodGroupLabel(
              item.bloodRequest.bloodGroup,
              item.bloodRequest.rhFactor
            )}{" "}
            - {item.bloodRequest.quantity} ml
          </p>
          <p className="text-xs text-gray-500">
            {item.bloodRequest.urgency === "CRITICAL"
              ? "Critique"
              : item.bloodRequest.urgency === "URGENT"
                ? "Urgent"
                : "Normal"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (item: DonorResponse) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
            item.status === "ACCEPTED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === "ACCEPTED" ? "Accepte" : "Refuse"}
        </span>
      ),
    },
    {
      key: "message",
      label: "Message",
      hideOnMobile: true,
      render: (item: DonorResponse) => (
        <span className="text-sm text-gray-600">
          {item.message || "-"}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      hideOnMobile: true,
      render: (item: DonorResponse) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(item.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: DonorResponse) =>
        item.status === "ACCEPTED" && item.donor.user.phone ? (
          <a
            href={`tel:${item.donor.user.phone}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
          >
            <Phone size={14} />
            Contacter
          </a>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Reponses des donneurs
        </h1>
        <p className="text-gray-500 mt-1">
          Suivi des reponses aux demandes de sang de votre hopital
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Users size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {responses.length}
            </p>
            <p className="text-xs text-gray-500">Total reponses</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Users size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{acceptedCount}</p>
            <p className="text-xs text-gray-500">Acceptees</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Users size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{refusedCount}</p>
            <p className="text-xs text-gray-500">Refusees</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">Filtrer par statut :</span>
        {[
          { value: "ALL", label: "Tous" },
          { value: "ACCEPTED", label: "Acceptes" },
          { value: "REFUSED", label: "Refuses" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="Aucune reponse de donneur"
      />
    </div>
  );
}
