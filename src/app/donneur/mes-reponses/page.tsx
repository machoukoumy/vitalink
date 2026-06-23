"use client";

import { useEffect, useState } from "react";
import { Heart, Phone, MapPin, CheckCircle, XCircle } from "lucide-react";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

interface DonorResponseRecord {
  id: string;
  status: string;
  message: string | null;
  availableDate: string | null;
  createdAt: string;
  bloodRequest: {
    id: string;
    bloodGroup: string;
    rhFactor: string;
    quantity: number;
    urgency: string;
    status: string;
    reason: string | null;
    contactPhone: string | null;
    hospital: { name: string; province: string; phone: string | null };
  };
}

const urgencyColors: Record<string, string> = {
  CRITICAL: "border-[#E30613]/30 bg-[#E30613]/5",
  URGENT: "border-orange-300 bg-orange-50",
  NORMAL: "border-[#003DA5]/20 bg-[#003DA5]/5",
};

export default function MesReponsesPage() {
  const [responses, setResponses] = useState<DonorResponseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACCEPTED" | "REFUSED">("ALL");

  useEffect(() => {
    fetch("/api/donor-responses")
      .then(r => r.json())
      .then(d => setResponses(d.responses || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? responses : responses.filter(r => r.status === filter);
  const accepted = responses.filter(r => r.status === "ACCEPTED").length;
  const refused = responses.filter(r => r.status === "REFUSED").length;

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes R&eacute;ponses</h1>
        <p className="text-gray-500 mt-1">Historique de vos engagements aux demandes de sang</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{accepted}</p>
          <p className="text-xs text-gray-400 mt-1">Accept&eacute;s</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-400">{refused}</p>
          <p className="text-xs text-gray-400 mt-1">Refus&eacute;s</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["ALL", "ACCEPTED", "REFUSED"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === f ? "bg-[#003DA5] text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
            )}>
            {f === "ALL" ? "Tous" : f === "ACCEPTED" ? "Acceptés" : "Refusés"}
          </button>
        ))}
      </div>

      {/* Responses list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400">Aucune r&eacute;ponse pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={cn("bg-white rounded-2xl border-2 p-4 md:p-5 shadow-sm", urgencyColors[r.bloodRequest.urgency] || "border-gray-100")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {r.status === "ACCEPTED" ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                        <CheckCircle size={14} /> Accept&eacute;
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold">
                        <XCircle size={14} /> Refus&eacute;
                      </span>
                    )}
                    <span className="px-2.5 py-1 bg-[#E30613]/10 text-[#E30613] rounded-lg text-sm font-bold">
                      {getBloodGroupLabel(r.bloodRequest.bloodGroup, r.bloodRequest.rhFactor)}
                    </span>
                    <span className="text-xs text-gray-400">{r.bloodRequest.quantity} ml</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{r.bloodRequest.hospital.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin size={12} /> {r.bloodRequest.hospital.province}
                  </div>
                  {r.bloodRequest.reason && (
                    <p className="text-sm text-gray-500 mt-2">{r.bloodRequest.reason}</p>
                  )}
                  {r.message && (
                    <p className="text-sm text-gray-600 mt-2 italic">&quot;{r.message}&quot;</p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-400 flex-shrink-0">
                  <p>{formatDate(r.createdAt)}</p>
                  {r.status === "ACCEPTED" && r.bloodRequest.contactPhone && (
                    <a href={`tel:${r.bloodRequest.contactPhone}`}
                      className="flex items-center gap-1 text-[#003DA5] font-medium mt-2 justify-end">
                      <Phone size={12} /> Appeler
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
