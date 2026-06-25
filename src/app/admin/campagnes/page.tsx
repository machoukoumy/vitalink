"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, BLOOD_GROUPS, RH_FACTORS, cn } from "@/lib/utils";

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
  registrations: { id: string }[];
  status: string;
}

const CAMPAIGN_STATUSES = ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"] as const;
const statusLabels: Record<string, string> = {
  PLANNED: "Planifiee",
  ACTIVE: "Active",
  COMPLETED: "Terminee",
  CANCELLED: "Annulee",
};

export default function AdminCampagnesPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    targetBloodGroups: [] as string[],
    goalQuantity: 0,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        setForm({ title: "", description: "", startDate: "", endDate: "", location: "", targetBloodGroups: [], goalQuantity: 0 });
        fetchCampaigns();
      }
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/campaigns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchCampaigns();
    } catch {
      /* ignore */
    }
  };

  const toggleBloodGroup = (group: string) => {
    setForm((prev) => ({
      ...prev,
      targetBloodGroups: prev.targetBloodGroups.includes(group)
        ? prev.targetBloodGroups.filter((g) => g !== group)
        : [...prev.targetBloodGroups, group],
    }));
  };

  const allBloodGroups = BLOOD_GROUPS.flatMap((g) => RH_FACTORS.map((r) => `${g}${r}`));

  const columns = [
    { key: "title", label: "Titre" },
    { key: "location", label: "Lieu", hideOnMobile: true },
    {
      key: "dates",
      label: "Dates",
      hideOnMobile: true,
      render: (item: Campaign) => `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
    },
    { key: "goalQuantity", label: "Objectif", hideOnMobile: true },
    { key: "collectedQuantity", label: "Collecte" },
    {
      key: "registrations",
      label: "Inscrits",
      render: (item: Campaign) => item.registrations?.length ?? 0,
    },
    {
      key: "status",
      label: "Statut",
      render: (item: Campaign) => (
        <select
          value={item.status}
          onChange={(e) => changeStatus(item.id, e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
        >
          {CAMPAIGN_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Campagnes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion des campagnes de collecte de sang</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#E30613] text-white hover:bg-[#c9050f] transition-colors shadow-sm"
        >
          Nouvelle campagne
        </button>
      </div>

      <DataTable columns={columns} data={campaigns} emptyMessage="Aucune campagne" />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle campagne">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de debut</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Groupes sanguins cibles</label>
            <div className="flex flex-wrap gap-2">
              {allBloodGroups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleBloodGroup(g)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors",
                    form.targetBloodGroups.includes(g)
                      ? "bg-[#E30613] text-white border-[#E30613]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objectif (poches)</label>
            <input
              type="number"
              required
              min={1}
              value={form.goalQuantity || ""}
              onChange={(e) => setForm({ ...form, goalQuantity: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#E30613] text-white hover:bg-[#c9050f] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Creer la campagne"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
