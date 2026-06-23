"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Heart,
  Droplets,
  Calendar,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  HandHeart,
  ChevronRight,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DashboardData {
  donor: {
    id: string;
    bloodGroup: string;
    rhFactor: string;
    lastDonation: string | null;
    user: { name: string; email: string };
  };
  stats: {
    totalDonations: number;
    upcomingAppointments: number;
    activeResponses: number;
    unreadNotifications: number;
  };
  eligibility: {
    isEligible: boolean;
    daysUntilEligible: number;
    daysSinceLast: number | null;
    minInterval: number;
    progressPercent: number;
  };
  recentDonations: Array<{
    id: string;
    date: string;
    status: string;
    quantity: number;
  }>;
  upcomingAppointments: Array<{
    id: string;
    date: string;
    time: string;
    status: string;
  }>;
  matchingUrgentRequests: Array<UrgentRequest>;
}

interface UrgentRequest {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  urgency: string;
  reason: string | null;
  hospital: { name: string; province: string };
  alreadyResponded: boolean;
  myResponse: string | null;
}

interface EligibilityData {
  isEligible: boolean;
  daysUntilEligible: number;
  daysSinceLast: number | null;
  minInterval: number;
  progressPercent: number;
  reminderMessage: string | null;
}

/* ------------------------------------------------------------------ */
/*  Urgency color config                                               */
/* ------------------------------------------------------------------ */

const urgencyColors: Record<string, { border: string; bg: string; badge: string; label: string }> = {
  CRITICAL: { border: "border-red-400", bg: "bg-red-50", badge: "bg-red-600 text-white", label: "CRITIQUE" },
  URGENT:   { border: "border-orange-400", bg: "bg-orange-50", badge: "bg-orange-500 text-white", label: "URGENT" },
  NORMAL:   { border: "border-blue-300", bg: "bg-blue-50", badge: "bg-blue-500 text-white", label: "NORMAL" },
};

/* ------------------------------------------------------------------ */
/*  Circular progress ring                                             */
/* ------------------------------------------------------------------ */

function ProgressRing({ percent, size = 120, stroke = 8, children }: {
  percent: number; size?: number; stroke?: number; children?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;
  const isComplete = percent >= 100;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={isComplete ? "#16a34a" : "#E30613"} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DonneurDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/donor/dashboard").then((r) => r.json()),
      fetch("/api/donor/eligibility").then((r) => r.json()),
    ])
      .then(([d, e]) => {
        setDashboard(d);
        setEligibility(e);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRespond = useCallback(
    async (requestId: string, status: "ACCEPTED" | "REFUSED") => {
      setRespondingTo(requestId);
      try {
        const res = await fetch("/api/donor-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bloodRequestId: requestId, status }),
        });
        if (res.ok && dashboard) {
          setDashboard({
            ...dashboard,
            matchingUrgentRequests: dashboard.matchingUrgentRequests.map((r) =>
              r.id === requestId
                ? { ...r, alreadyResponded: true, myResponse: status }
                : r
            ),
            stats: {
              ...dashboard.stats,
              activeResponses: dashboard.stats.activeResponses + (status === "ACCEPTED" ? 1 : 0),
            },
          });
        }
      } finally {
        setRespondingTo(null);
      }
    },
    [dashboard]
  );

  /* Loading state */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Heart className="text-[#E30613] animate-bounce" size={32} />
          <p className="text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!dashboard?.donor) {
    return (
      <div className="text-center py-12 text-gray-500">
        Profil donneur non trouvé
      </div>
    );
  }

  const { donor, stats, eligibility: elig, recentDonations, upcomingAppointments, matchingUrgentRequests } = dashboard;

  return (
    <div className="space-y-6 pb-safe">
      {/* ---- Welcome banner ---- */}
      <div className="bg-vl-gradient rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-black tracking-tight">
              {getBloodGroupLabel(donor.bloodGroup, donor.rhFactor)}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Bienvenue, {donor.user.name}
            </h1>
            <p className="text-white/80 text-sm mt-0.5">
              Votre espace donneur VitaLink
            </p>
          </div>
        </div>
      </div>

      {/* ---- Eligibility card ---- */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm card-hover">
        <div className="flex items-center gap-6 flex-wrap">
          <ProgressRing percent={elig.progressPercent} size={110} stroke={8}>
            {elig.isEligible ? (
              <CheckCircle className="text-green-600" size={36} />
            ) : (
              <div className="text-center">
                <span className="text-2xl font-bold text-[#E30613]">
                  {elig.daysUntilEligible}
                </span>
                <br />
                <span className="text-[10px] text-gray-400 font-medium">jours</span>
              </div>
            )}
          </ProgressRing>
          <div className="flex-1 min-w-0">
            {elig.isEligible ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="text-green-600" size={20} />
                  <h3 className="text-lg font-bold text-green-700">
                    Vous êtes éligible !
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {elig.daysSinceLast !== null
                    ? `Dernier don il y a ${elig.daysSinceLast} jours`
                    : "Vous pouvez faire votre premier don"}
                </p>
                <Link
                  href="/donneur/rendez-vous"
                  className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white touch-active"
                >
                  <Calendar size={16} />
                  Prendre RDV
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {elig.daysUntilEligible} jours restants
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Intervalle minimum entre deux dons : {elig.minInterval} jours
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-[#E30613] to-[#003DA5] h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(elig.progressPercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {Math.round(elig.progressPercent)}% du cycle de récupération
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---- Matching urgent requests ---- */}
      {matchingUrgentRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-[#E30613]" size={20} />
            <h2 className="text-lg font-bold text-gray-900">
              Appels urgents compatibles
            </h2>
          </div>
          <div className="space-y-3">
            {matchingUrgentRequests.map((req) => {
              const uc = urgencyColors[req.urgency] || urgencyColors.NORMAL;
              return (
                <div
                  key={req.id}
                  className={cn(
                    "rounded-2xl border-2 p-5 transition-shadow hover:shadow-md",
                    uc.border,
                    uc.bg
                  )}
                >
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={cn("px-2 py-0.5 text-xs font-bold rounded-full", uc.badge)}>
                          {uc.label}
                        </span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                          {getBloodGroupLabel(req.bloodGroup, req.rhFactor)}
                        </span>
                        <span className="text-sm text-gray-600">{req.quantity} ml</span>
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {req.hospital.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {req.hospital.province}
                      </p>
                      {req.reason && (
                        <p className="text-sm text-gray-600 mt-1">{req.reason}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {req.alreadyResponded ? (
                        <StatusBadge status={req.myResponse || "PENDING"} />
                      ) : (
                        <>
                          <button
                            onClick={() => handleRespond(req.id, "ACCEPTED")}
                            disabled={respondingTo === req.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors touch-active disabled:opacity-50"
                          >
                            <HandHeart size={16} />
                            Je peux donner
                          </button>
                          <button
                            onClick={() => handleRespond(req.id, "REFUSED")}
                            disabled={respondingTo === req.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors touch-active disabled:opacity-50"
                          >
                            Pas disponible
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---- Stats row ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Mes Dons"
          value={stats.totalDonations}
          icon={<Droplets size={22} />}
          color="red"
        />
        <StatsCard
          title="Prochains RDV"
          value={stats.upcomingAppointments}
          icon={<Calendar size={22} />}
          color="blue"
        />
        <StatsCard
          title="Réponses actives"
          value={stats.activeResponses}
          icon={<HandHeart size={22} />}
          color="green"
        />
        <StatsCard
          title="Notifications"
          value={stats.unreadNotifications}
          subtitle="non lues"
          icon={<Bell size={22} />}
          color="yellow"
        />
      </div>

      {/* ---- Recent donations + Upcoming appointments ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent donations */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Derniers Dons</h3>
            <Link
              href="/donneur/dons"
              className="text-sm text-[#E30613] hover:text-[#C00510] font-medium flex items-center gap-0.5"
            >
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          {recentDonations.length > 0 ? (
            <div className="space-y-2">
              {recentDonations.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(d.date)}
                    </p>
                    <p className="text-xs text-gray-500">{d.quantity} ml</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">
              Aucun don enregistré
            </p>
          )}
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Prochains Rendez-vous</h3>
            <Link
              href="/donneur/rendez-vous"
              className="text-sm text-[#E30613] hover:text-[#C00510] font-medium flex items-center gap-0.5"
            >
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-2">
              {upcomingAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(a.date)}
                    </p>
                    <p className="text-xs text-gray-500">{a.time}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400 text-sm mb-3">Aucun rendez-vous</p>
              <Link
                href="/donneur/rendez-vous"
                className="inline-flex items-center gap-1.5 text-sm text-[#E30613] hover:text-[#C00510] font-semibold"
              >
                <Calendar size={14} />
                Prendre rendez-vous
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ---- Eligibility reminder banner ---- */}
      {eligibility?.reminderMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Clock className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-amber-800">Rappel</p>
            <p className="text-sm text-amber-700 mt-0.5">
              {eligibility.reminderMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
