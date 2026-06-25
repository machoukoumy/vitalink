"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  Phone,
  MapPin,
  HandHeart,
  Filter,
  CheckCircle,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  alreadyResponded?: boolean;
  myResponse?: string | null;
}

type TabKey = "matching" | "all";

/* ------------------------------------------------------------------ */
/*  Urgency config                                                     */
/* ------------------------------------------------------------------ */

const urgencyColors: Record<string, { border: string; bg: string; badge: string; label: string }> = {
  CRITICAL: { border: "border-red-400", bg: "bg-red-50", badge: "bg-red-600 text-white", label: "CRITIQUE" },
  URGENT:   { border: "border-orange-400", bg: "bg-orange-50", badge: "bg-orange-500 text-white", label: "URGENT" },
  NORMAL:   { border: "border-blue-300", bg: "bg-blue-50", badge: "bg-blue-500 text-white", label: "NORMAL" },
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DonneurUrgencesPage() {
  const [matchingRequests, setMatchingRequests] = useState<UrgentRequest[]>([]);
  const [allRequests, setAllRequests] = useState<UrgentRequest[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("matching");
  const [loading, setLoading] = useState(true);

  /* Track which request is currently being submitted */
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  /* Flash confirmation */
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  /* Fetch data */
  useEffect(() => {
    Promise.all([
      fetch("/api/donor/matching-requests").then((r) => r.json()),
      fetch("/api/urgences").then((r) => r.json()),
    ])
      .then(([m, a]) => {
        setMatchingRequests(m.requests || []);
        setAllRequests(a.requests || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Direct response - no modal */
  const submitResponse = useCallback(async (req: UrgentRequest, status: "ACCEPTED" | "REFUSED") => {
    setSubmittingId(req.id);
    try {
      const res = await fetch("/api/donor-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bloodRequestId: req.id, status }),
      });

      if (res.ok) {
        const update = (prev: UrgentRequest[]) =>
          prev.map((r) =>
            r.id === req.id ? { ...r, alreadyResponded: true, myResponse: status } : r
          );
        setMatchingRequests(update);
        setAllRequests(update);

        /* Flash confirmation for 2 seconds */
        setConfirmedId(req.id);
        setTimeout(() => setConfirmedId(null), 2000);
      }
    } finally {
      setSubmittingId(null);
    }
  }, []);

  /* Which list to show */
  const displayList = activeTab === "matching" ? matchingRequests : allRequests;

  /* Loading */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <AlertTriangle className="text-[#E30613] animate-bounce" size={32} />
          <p className="text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-safe">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appels Urgents aux Dons</h1>
        <p className="text-gray-500 mt-1">Les h&ocirc;pitaux ont besoin de votre aide</p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("matching")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "matching"
              ? "bg-white text-[#E30613] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Filter size={15} />
          Pour moi
          {matchingRequests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-[11px] font-bold rounded-full">
              {matchingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
            activeTab === "all"
              ? "bg-white text-[#003DA5] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Tous
          {allRequests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-full">
              {allRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Request cards */}
      {displayList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-400 font-medium">
            {activeTab === "matching"
              ? "Aucun appel urgent correspondant à votre groupe sanguin"
              : "Aucun appel urgent en cours"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((req) => {
            const uc = urgencyColors[req.urgency] || urgencyColors.NORMAL;
            const phone = req.contactPhone || req.hospital.phone;
            const isSubmitting = submittingId === req.id;
            const justConfirmed = confirmedId === req.id;

            return (
              <div
                key={req.id}
                className={cn(
                  "rounded-2xl border-2 p-5 transition-shadow hover:shadow-md card-hover",
                  uc.border,
                  uc.bg
                )}
              >
                {/* Flash confirmation */}
                {justConfirmed && (
                  <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold animate-pulse">
                    <CheckCircle size={16} /> R&eacute;ponse enregistr&eacute;e !
                  </div>
                )}

                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Badges row */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={cn("px-2.5 py-0.5 text-xs font-bold rounded-full", uc.badge)}>
                        {uc.label}
                      </span>
                      <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                        {getBloodGroupLabel(req.bloodGroup, req.rhFactor)}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">{req.quantity} ml</span>
                    </div>

                    {/* Hospital info */}
                    <h3 className="font-semibold text-gray-900 text-base">{req.hospital.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                      <MapPin size={14} className="flex-shrink-0" />
                      {req.hospital.province}
                    </div>

                    {/* Reason */}
                    {req.reason && (
                      <p className="text-sm text-gray-600 mt-2 bg-white/60 rounded-lg px-3 py-2">
                        {req.reason}
                      </p>
                    )}

                    {/* Contact + date */}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-1.5 text-sm text-[#E30613] font-medium hover:underline"
                        >
                          <Phone size={14} />
                          {phone}
                        </a>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(req.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons - direct, no modal */}
                  <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                    {req.alreadyResponded ? (
                      <StatusBadge status={req.myResponse || "PENDING"} />
                    ) : (
                      <>
                        <button
                          onClick={() => submitResponse(req, "ACCEPTED")}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors touch-active disabled:opacity-50"
                        >
                          <HandHeart size={16} />
                          {isSubmitting ? "..." : "Je peux donner"}
                        </button>
                        <button
                          onClick={() => submitResponse(req, "REFUSED")}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors touch-active disabled:opacity-50"
                        >
                          {isSubmitting ? "..." : "Pas disponible"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
