"use client";

import { useEffect, useState } from "react";
import { Globe, GlobeOff, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

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
  createdAt: string;
  hospital: { name: string };
}

const urgencyColor: Record<string, string> = {
  CRITICAL: "text-red-600",
  URGENT: "text-orange-600",
  NORMAL: "text-blue-600",
};

const urgencyLabel: Record<string, string> = {
  CRITICAL: "Critique",
  URGENT: "Urgent",
  NORMAL: "Normal",
};

export default function HopitalAppelsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = () => {
    fetch("/api/blood-requests?limit=100")
      .then((r) => r.json())
      .then((d) => {
        const all: BloodRequest[] = d.requests || [];
        setRequests(all.filter((r) => r.isPublic));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePublic = async (request: BloodRequest) => {
    setTogglingId(request.id);
    try {
      await fetch(`/api/blood-requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !request.isPublic }),
      });
      fetchData();
    } finally {
      setTogglingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appels aux dons</h1>
        <p className="text-gray-500 mt-1">
          Gerez vos demandes publiees publiquement
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Globe size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">
            Aucun appel public en cours
          </p>
          <p className="text-sm text-gray-400">
            Activez l&apos;option &quot;Publier comme appel public&quot; lors de
            la creation d&apos;une demande
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-600">
                      {getBloodGroupLabel(r.bloodGroup, r.rhFactor)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">
                        {r.quantity} ml
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          urgencyColor[r.urgency]
                        )}
                      >
                        {urgencyLabel[r.urgency] || r.urgency}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    {r.reason && (
                      <p className="text-sm text-gray-600 mb-1">{r.reason}</p>
                    )}
                    {r.patientInfo && (
                      <p className="text-sm text-gray-500">
                        Patient : {r.patientInfo}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Publie le {formatDate(r.createdAt)}
                      {r.contactName && ` - Contact : ${r.contactName}`}
                      {r.contactPhone && ` (${r.contactPhone})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {r.status === "PENDING" || r.status === "APPROVED" ? (
                    <button
                      onClick={() => togglePublic(r)}
                      disabled={togglingId === r.id}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50",
                        r.isPublic
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-red-600 text-white hover:bg-red-700"
                      )}
                    >
                      {r.isPublic ? (
                        <>
                          <GlobeOff size={16} /> Depublier
                        </>
                      ) : (
                        <>
                          <Globe size={16} /> Publier
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <AlertTriangle size={14} /> Cloturee
                    </span>
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
