"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Phone, MapPin, ArrowLeft } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

interface UrgentRequest {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  urgency: string;
  reason: string | null;
  contactName: string | null;
  contactPhone: string | null;
  createdAt: string;
  hospital: { name: string; province: string; phone: string | null };
}

const urgencyConfig: Record<string, { color: string; label: string; border: string }> = {
  CRITICAL: { color: "bg-red-600", label: "CRITIQUE", border: "border-red-300 bg-red-50" },
  URGENT: { color: "bg-orange-500", label: "URGENT", border: "border-orange-300 bg-orange-50" },
  NORMAL: { color: "bg-blue-500", label: "NORMAL", border: "border-blue-200 bg-blue-50" },
};

export default function UrgencesPubliquesPage() {
  const [requests, setRequests] = useState<UrgentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/urgences").then(r => r.json()).then(d => setRequests(d.requests || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <VitaLinkIcon size={36} />
            <div>
              <h1 className="font-bold text-lg text-gray-900">Appels Urgents aux Dons</h1>
              <p className="text-xs text-gray-400">
                <span className="text-[#E30613] font-semibold">Vita</span><span className="text-[#003DA5] font-semibold">Link</span> - Transfusion Sanguine
              </p>
            </div>
          </div>
          <Link href="/register" className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            Devenir Donneur
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Chargement des urgences...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Aucun appel urgent en cours</p>
            <p className="text-gray-400 mt-1">Les demandes urgentes des h&ocirc;pitaux s&apos;afficheront ici</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map(r => {
              const config = urgencyConfig[r.urgency] || urgencyConfig.NORMAL;
              return (
                <div key={r.id} className={cn("rounded-xl border-2 p-6 transition-shadow hover:shadow-md", config.border)}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={cn("px-3 py-1 text-white text-xs font-bold rounded-full", config.color)}>
                          {config.label}
                        </span>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-lg font-bold">
                          {getBloodGroupLabel(r.bloodGroup, r.rhFactor)}
                        </span>
                        <span className="text-gray-600 font-medium">{r.quantity} ml</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{r.hospital.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin size={14} /> {r.hospital.province}
                      </div>
                      {r.reason && <p className="text-sm text-gray-600 mt-2">{r.reason}</p>}
                    </div>
                    <div className="text-right text-sm space-y-1">
                      <p className="text-gray-400">{formatDate(r.createdAt)}</p>
                      {r.contactPhone && (
                        <a href={`tel:${r.contactPhone}`} className="flex items-center gap-1 text-red-600 font-medium hover:text-red-700">
                          <Phone size={14} /> {r.contactPhone}
                        </a>
                      )}
                      {r.contactName && <p className="text-gray-500">Contact: {r.contactName}</p>}
                      {r.hospital.phone && (
                        <a href={`tel:${r.hospital.phone}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <Phone size={14} /> {r.hospital.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
