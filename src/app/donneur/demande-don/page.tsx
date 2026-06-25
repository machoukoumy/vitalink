"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { BLOOD_GROUPS, RH_FACTORS, PROVINCES, cn, formatDate, getBloodGroupLabel } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DonorRequestRecord {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  urgency: string;
  status: string;
  reason: string | null;
  city: string;
  createdAt: string;
}

const URGENCY_COLORS: Record<string, string> = {
  CRITICAL: "bg-[#E30613] text-white",
  URGENT: "bg-orange-500 text-white",
  NORMAL: "bg-[#003DA5] text-white",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MesDemandesPage() {
  const [form, setForm] = useState({ bloodGroup: "", rhFactor: "", quantity: "450", urgency: "NORMAL", reason: "", city: "", nearestCenter: "", contactPhone: "", notes: "", isPublic: true });
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [requests, setRequests] = useState<DonorRequestRecord[]>([]);
  const [listLoading, setListLoading] = useState(true);

  /* Fetch existing requests */
  const fetchRequests = () => {
    fetch("/api/donor-requests")
      .then(r => r.json())
      .then(d => setRequests(d.requests || []))
      .finally(() => setListLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user?.donor) {
        setForm(f => ({ ...f, bloodGroup: d.user.donor.bloodGroup, rhFactor: d.user.donor.rhFactor, contactPhone: d.user.phone || "" }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const res = await fetch("/api/donor-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      setSuccess(true);
      setForm(f => ({ ...f, quantity: "450", urgency: "NORMAL", reason: "", city: "", nearestCenter: "", notes: "" }));
      setListLoading(true);
      fetchRequests();
      setTimeout(() => setSuccess(false), 4000);
    }
    setFormLoading(false);
  };

  const handleCancel = async (id: string) => {
    await fetch(`/api/donor-requests/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "CANCELLED" }) });
    fetchRequests();
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes Demandes de Sang</h1>
        <p className="text-gray-500 mt-1">Consultez vos demandes et publiez un nouveau besoin</p>
      </div>

      {/* ---- Existing requests list ---- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Mes demandes ({requests.length})</h2>
        </div>
        <div className="p-5">
          {listLoading ? (
            <p className="text-center text-gray-400 py-6">Chargement...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Aucune demande publi&eacute;e</p>
          ) : (
            <div className="space-y-3">
              {requests.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-2 py-1 bg-[#E30613]/10 text-[#E30613] rounded-lg text-sm font-bold">
                      {getBloodGroupLabel(r.bloodGroup, r.rhFactor)}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{r.quantity} ml</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", URGENCY_COLORS[r.urgency])}>
                      {r.urgency}
                    </span>
                    <span className="text-xs text-gray-400">{r.city}</span>
                    {r.reason && <span className="text-xs text-gray-500 line-clamp-1">{r.reason}</span>}
                    <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={r.status} />
                    {r.status === "PENDING" && (
                      <button onClick={() => handleCancel(r.id)} className="text-xs text-[#E30613] font-semibold hover:underline flex items-center gap-1">
                        <XCircle size={14} /> Annuler
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---- Creation form ---- */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="text-emerald-600 flex-shrink-0" size={22} />
          <div><p className="font-semibold text-emerald-800">Demande publi&eacute;e !</p><p className="text-sm text-emerald-600">Votre demande est visible par la communaut&eacute;.</p></div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-7 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Nouvelle demande</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Groupe sanguin *</label>
              <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} required className={inputClass}>
                <option value="">Choisir</option>
                {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rh&eacute;sus *</label>
              <select value={form.rhFactor} onChange={e => setForm({ ...form, rhFactor: e.target.value })} required className={inputClass}>
                <option value="">Choisir</option>
                {RH_FACTORS.map(r => <option key={r} value={r}>{r === "+" ? "Positif (+)" : "Négatif (-)"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantit&eacute; (ml) *</label>
              <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau d&apos;urgence *</label>
            <div className="flex gap-2">
              {([["NORMAL", "Normal", "bg-[#003DA5]"], ["URGENT", "Urgent", "bg-orange-500"], ["CRITICAL", "Critique", "bg-[#E30613]"]] as const).map(([val, label, color]) => (
                <button key={val} type="button" onClick={() => setForm({ ...form, urgency: val })}
                  className={cn("flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2",
                    form.urgency === val ? `${color} text-white border-transparent` : "bg-white text-gray-500 border-gray-200"
                  )}>{label}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Motif / Raison *</label>
            <input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required className={inputClass} placeholder="Ex: Besoin urgent pour un membre de ma famille" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville *</label>
              <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required className={inputClass}>
                <option value="">S&eacute;lectionner</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Centre le plus proche</label>
              <input value={form.nearestCenter} onChange={e => setForm({ ...form, nearestCenter: e.target.value })} className={inputClass} placeholder="Ex: CNTS N'Djaména" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">T&eacute;l&eacute;phone de contact</label>
            <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputClass + " h-20 resize-none"} placeholder="Informations complémentaires..." />
          </div>

          <label className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-xl cursor-pointer">
            <input type="checkbox" checked={form.isPublic} onChange={e => setForm({ ...form, isPublic: e.target.checked })} className="w-5 h-5 rounded accent-[#E30613]" />
            <div>
              <p className="text-sm font-semibold text-gray-700">Publier publiquement</p>
              <p className="text-xs text-gray-400">Visible par tous les donneurs de la plateforme</p>
            </div>
          </label>

          <button type="submit" disabled={formLoading} className="btn-primary w-full py-3.5 text-sm disabled:opacity-50">
            {formLoading ? "Publication..." : "Publier ma demande"}
          </button>
        </form>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-orange-700">Cette fonctionnalit&eacute; est destin&eacute;e aux situations o&ugrave; vous ou un proche avez besoin de sang. Les demandes abusives seront supprim&eacute;es.</p>
      </div>
    </div>
  );
}
