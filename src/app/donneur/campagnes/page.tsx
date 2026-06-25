"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDate, cn } from "@/lib/utils";
import { MapPin, CalendarDays, Droplets, Users, CheckCircle } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  targetBloodGroups: string[];
  goalQuantity: number;
  collectedQuantity: number;
  registrations: { id: string; donorId: string }[];
  status: string;
  isRegistered?: boolean;
}

export default function DonorCampagnesPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : data.campaigns || []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const register = async (campaignId: string) => {
    setActionLoading(campaignId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/register`, { method: "POST" });
      if (res.ok) fetchCampaigns();
    } catch {
      /* ignore */
    } finally {
      setActionLoading(null);
    }
  };

  const unregister = async (campaignId: string) => {
    setActionLoading(campaignId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/register`, { method: "DELETE" });
      if (res.ok) fetchCampaigns();
    } catch {
      /* ignore */
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE" || c.status === "PLANNED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Campagnes de collecte</h1>
        <p className="text-sm text-gray-500 mt-1">Participez aux campagnes de don de sang</p>
      </div>

      {activeCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium text-sm">Aucune campagne active pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {activeCampaigns.map((campaign) => {
            const progress = campaign.goalQuantity > 0
              ? Math.min(100, Math.round((campaign.collectedQuantity / campaign.goalQuantity) * 100))
              : 0;
            const isRegistered = campaign.isRegistered;

            return (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-900">{campaign.title}</h3>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold",
                      campaign.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    )}
                  >
                    {campaign.status === "ACTIVE" ? "Active" : "A venir"}
                  </span>
                </div>

                {campaign.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{campaign.location}</span>
                  </div>
                  {campaign.targetBloodGroups?.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Droplets size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {campaign.targetBloodGroups.map((g) => (
                          <span
                            key={g}
                            className="px-1.5 py-0.5 bg-red-50 text-[#E30613] rounded text-[11px] font-semibold"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{campaign.registrations?.length ?? 0} inscrits</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Progression</span>
                    <span className="font-semibold">
                      {campaign.collectedQuantity} / {campaign.goalQuantity} poches
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E30613] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{progress}% de l&apos;objectif atteint</p>
                </div>

                {/* Action */}
                {isRegistered ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-semibold">
                      <CheckCircle size={14} />
                      Inscrit
                    </span>
                    <button
                      onClick={() => unregister(campaign.id)}
                      disabled={actionLoading === campaign.id}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-[#E30613] hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {actionLoading === campaign.id ? "..." : "Se desinscrire"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => register(campaign.id)}
                    disabled={actionLoading === campaign.id}
                    className="w-full btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#E30613] text-white hover:bg-[#c9050f] transition-colors shadow-sm disabled:opacity-50"
                  >
                    {actionLoading === campaign.id ? "Inscription..." : "S'inscrire"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
