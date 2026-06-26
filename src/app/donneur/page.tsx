"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Droplets, Calendar, Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { formatDate, getBloodGroupLabel, cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DonneurDashboard() {
  const [data, setData] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/donor/dashboard").then(r => r.json()).catch(() => null),
      fetch("/api/donor/eligibility").then(r => r.json()).catch(() => null),
    ]).then(([d, e]) => {
      setData(d);
      setEligibility(e);
    }).finally(() => setLoading(false));
  }, []);

  const handleRespond = async (requestId: string, status: string) => {
    await fetch("/api/donor-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bloodRequestId: requestId, status }),
    });
    const d = await fetch("/api/donor/dashboard").then(r => r.json()).catch(() => null);
    setData(d);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center"><Heart className="text-[#E30613] animate-bounce mx-auto mb-2" size={28} /><p className="text-sm text-gray-400">Chargement...</p></div>
    </div>
  );

  if (!data?.donor) return <div className="text-center py-12 text-gray-500">Profil donneur non trouv&eacute;</div>;

  const donor = data.donor;
  const stats = data.stats;
  const elig = data.eligibility || eligibility;
  const urgents = data.matchingUrgentRequests || [];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-[#E30613] rounded-2xl p-5 text-white">
        <p className="text-white/70 text-sm">Bienvenue,</p>
        <h1 className="text-xl font-bold">{donor.user?.name || "Donneur"}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="px-3 py-1 bg-white/20 rounded-lg text-lg font-extrabold">{getBloodGroupLabel(donor.bloodGroup, donor.rhFactor)}</span>
          {elig?.isEligible ? (
            <span className="flex items-center gap-1 text-sm"><CheckCircle size={16} /> &Eacute;ligible au don</span>
          ) : elig && (
            <span className="flex items-center gap-1 text-sm"><Clock size={16} /> {elig.daysUntilEligible}j avant prochain don</span>
          )}
        </div>
      </div>

      {/* Eligibility reminder */}
      {eligibility?.reminderMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-semibold">{eligibility.reminderMessage}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard title="Mes Dons" value={stats?.totalDonations || 0} icon={<Droplets size={20} />} color="red" />
        <StatsCard title="RDV" value={stats?.upcomingAppointments || 0} icon={<Calendar size={20} />} color="blue" />
        <StatsCard title="R&eacute;ponses" value={stats?.activeResponses || 0} icon={<Heart size={20} />} color="green" />
        <StatsCard title="Notifications" value={stats?.unreadNotifications || 0} icon={<Bell size={20} />} color="yellow" />
      </div>

      {/* Urgent requests matching blood group */}
      {urgents.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-[#E30613]" /> Urgences pour votre groupe
          </h2>
          <div className="space-y-3">
            {urgents.map((r: any) => (
              <div key={r.id} className={cn("bg-white rounded-xl border-2 p-4 shadow-sm",
                r.urgency === "CRITICAL" ? "border-red-300" : r.urgency === "URGENT" ? "border-orange-300" : "border-blue-200"
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 text-white text-[10px] font-bold rounded-full",
                        r.urgency === "CRITICAL" ? "bg-[#E30613]" : r.urgency === "URGENT" ? "bg-orange-500" : "bg-[#003DA5]"
                      )}>{r.urgency === "CRITICAL" ? "CRITIQUE" : r.urgency === "URGENT" ? "URGENT" : "NORMAL"}</span>
                      <span className="text-sm font-bold text-[#E30613]">{getBloodGroupLabel(r.bloodGroup, r.rhFactor)}</span>
                      <span className="text-xs text-gray-400">{r.quantity} ml</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{r.hospital?.name}</p>
                    {r.reason && <p className="text-xs text-gray-500">{r.reason}</p>}
                  </div>
                  <div className="flex-shrink-0">
                    {r.alreadyResponded ? (
                      <span className="text-xs text-emerald-600 font-semibold">R&eacute;pondu</span>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleRespond(r.id, "ACCEPTED")}
                          className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg">Je donne</button>
                        <button onClick={() => handleRespond(r.id, "REFUSED")}
                          className="px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg">Non</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent donations */}
      {data.recentDonations?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Derniers Dons</h3>
            <Link href="/donneur/dons" className="text-xs text-[#003DA5] font-semibold">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {data.recentDonations.slice(0, 3).map((d: any) => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium">{formatDate(d.date)}</p>
                  <p className="text-xs text-gray-400">{d.quantity} ml</p>
                </div>
                <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold",
                  d.status === "STORED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming appointments */}
      {data.upcomingAppointments?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Prochains RDV</h3>
            <Link href="/donneur/rendez-vous" className="text-xs text-[#003DA5] font-semibold">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {data.upcomingAppointments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium">{formatDate(a.date)} &agrave; {a.time}</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
