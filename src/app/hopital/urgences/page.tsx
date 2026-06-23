"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Phone, Droplets } from "lucide-react";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

interface UrgentRequest {
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
  createdAt: string;
  hospital: { name: string; province: string; phone: string | null };
}

const urgencyConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: string }> = {
  CRITICAL: {
    label: "Critique",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "text-red-600",
  },
  URGENT: {
    label: "Urgent",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    icon: "text-orange-600",
  },
  NORMAL: {
    label: "Normal",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: "text-blue-600",
  },
};

export default function HopitalUrgencesPage() {
  const [requests, setRequests] = useState<UrgentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/urgences")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Urgences publiques
        </h1>
        <p className="text-gray-500 mt-1">
          Appels aux dons de tous les hopitaux
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune urgence publique en cours</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((r) => {
            const config = urgencyConfig[r.urgency] || urgencyConfig.NORMAL;
            return (
              <div
                key={r.id}
                className={cn(
                  "rounded-xl border-2 p-5 transition-shadow hover:shadow-md",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Droplets size={20} className={config.icon} />
                    <span className="text-2xl font-bold text-gray-900">
                      {getBloodGroupLabel(r.bloodGroup, r.rhFactor)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      config.text,
                      config.bg === "bg-red-50"
                        ? "bg-red-100"
                        : config.bg === "bg-orange-50"
                          ? "bg-orange-100"
                          : "bg-blue-100"
                    )}
                  >
                    {config.label}
                  </span>
                </div>

                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {r.quantity} ml requis
                </p>

                {r.reason && (
                  <p className="text-sm text-gray-600 mb-3">{r.reason}</p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium">{r.hospital.name}</span>
                    <span className="text-gray-500">
                      - {r.hospital.province}
                    </span>
                  </div>

                  {(r.contactName || r.contactPhone || r.hospital.phone) && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={14} className="text-gray-400" />
                      <span>
                        {r.contactName && `${r.contactName} - `}
                        {r.contactPhone || r.hospital.phone || ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200/50">
                  <p className="text-xs text-gray-500">
                    Publie le {formatDate(r.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
