"use client";

import { useState } from "react";
import { Search, Heart, CheckCircle, CreditCard, Phone, User } from "lucide-react";
import { getBloodGroupLabel, formatDate } from "@/lib/utils";

interface DonorResult {
  id: string;
  matricule: string;
  bloodGroup: string;
  rhFactor: string;
  isEligible: boolean;
  lastDonation: string | null;
  weight: number | null;
  gender: string;
  nationalId: string;
  user: { name: string; email: string; phone: string | null; avatar: string | null };
}

export default function NouveauDonPage() {
  const [search, setSearch] = useState("");
  const [donors, setDonors] = useState<DonorResult[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<DonorResult | null>(null);
  const [form, setForm] = useState({ quantity: "450", hemoglobin: "", bloodPressure: "", temperature: "", notes: "", weight: "" });
  const [success, setSuccess] = useState<{ matricule: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const searchDonors = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const res = await fetch(`/api/donor/search?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setDonors(data.donors || []);
    setSelectedDonor(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonor) return;
    setLoading(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: selectedDonor.id, ...form }),
      });
      if (res.ok) {
        setSuccess({ matricule: selectedDonor.matricule, name: selectedDonor.user.name });
        setSelectedDonor(null);
        setDonors([]);
        setSearch("");
        setForm({ quantity: "450", hemoglobin: "", bloodPressure: "", temperature: "", notes: "", weight: "" });
      }
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enregistrer un Don</h1>
        <p className="text-gray-500 mt-1">Recherchez un donneur par matricule, t&eacute;l&eacute;phone ou nom</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
          <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <p className="font-bold text-emerald-800">Don enregistr&eacute; avec succ&egrave;s !</p>
            <p className="text-sm text-emerald-600 mt-1">Donneur: <strong>{success.name}</strong> (Matricule: <strong>{success.matricule}</strong>)</p>
            <p className="text-xs text-emerald-500 mt-1">Les informations ont &eacute;t&eacute; ajout&eacute;es automatiquement au dossier du donneur.</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#003DA5] rounded-xl flex items-center justify-center text-white"><Search size={18} /></div>
          <div>
            <h3 className="font-bold text-gray-900">Rechercher un Donneur</h3>
            <p className="text-xs text-gray-400">Par matricule (VL-2026-XXXXX), t&eacute;l&eacute;phone, nom ou N&deg; identit&eacute;</p>
          </div>
        </div>
        <form onSubmit={searchDonors} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Ex: VL-2026-00001 ou +235 66..."
              className="w-full pl-10 pr-4 py-3 bg-[#F5F7FA] border border-gray-200 rounded-xl text-sm" />
          </div>
          <button type="submit" className="btn-primary px-6 py-3 text-sm">Rechercher</button>
        </form>

        {donors.length > 0 && !selectedDonor && (
          <div className="mt-4 space-y-2">
            {donors.map(d => (
              <div key={d.id} onClick={() => d.isEligible && setSelectedDonor(d)}
                className={`p-4 border-2 rounded-xl flex items-center justify-between transition-all ${
                  d.isEligible ? "cursor-pointer hover:border-[#E30613]/30 hover:bg-red-50/50 border-gray-100" : "opacity-50 cursor-not-allowed border-gray-100"
                }`}>
                <div className="flex items-center gap-3">
                  {d.user.avatar ? (
                    <img src={d.user.avatar} alt="" className="w-11 h-11 rounded-xl object-cover" />
                  ) : (
                    <div className="w-11 h-11 bg-[#E30613] rounded-xl flex items-center justify-center text-white font-bold">{d.user.name.charAt(0)}</div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900">{d.user.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><CreditCard size={11} /> {d.matricule}</span>
                      {d.user.phone && <span className="flex items-center gap-1"><Phone size={11} /> {d.user.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#E30613]/10 text-[#E30613] rounded-lg text-sm font-extrabold">
                    {getBloodGroupLabel(d.bloodGroup, d.rhFactor)}
                  </span>
                  {!d.isEligible && <span className="text-xs text-[#E30613] font-semibold">Non &eacute;ligible</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected donor + form */}
      {selectedDonor && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
          {/* Donor card */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-[#003DA5]/5 rounded-xl border border-[#003DA5]/10">
            {selectedDonor.user.avatar ? (
              <img src={selectedDonor.user.avatar} alt="" className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 bg-[#E30613] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {selectedDonor.user.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{selectedDonor.user.name}</h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="font-mono font-bold text-[#003DA5]">{selectedDonor.matricule}</span>
                <span className="px-2 py-0.5 bg-[#E30613] text-white rounded-lg text-sm font-extrabold">
                  {getBloodGroupLabel(selectedDonor.bloodGroup, selectedDonor.rhFactor)}
                </span>
                {selectedDonor.weight && <span>{selectedDonor.weight} kg</span>}
                <span>{selectedDonor.gender === "M" ? "Homme" : "Femme"}</span>
                {selectedDonor.lastDonation && <span>Dernier don: {formatDate(selectedDonor.lastDonation)}</span>}
              </div>
            </div>
            <button onClick={() => setSelectedDonor(null)} className="text-sm text-gray-400 hover:text-gray-600 font-medium">Changer</button>
          </div>

          {/* Don form */}
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="text-[#E30613]" size={18} />
            Informations du don
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantit&eacute; (ml) *</label>
                <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">H&eacute;moglobine (g/dL) *</label>
                <input type="number" step="0.1" value={form.hemoglobin} onChange={e => setForm({ ...form, hemoglobin: e.target.value })} required className={inputClass} placeholder="12.5" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Poids actuel (kg) *</label>
                <input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required className={inputClass}
                  placeholder={selectedDonor.weight ? String(selectedDonor.weight) : "65"} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tension art&eacute;rielle *</label>
                <input value={form.bloodPressure} onChange={e => setForm({ ...form, bloodPressure: e.target.value })} required className={inputClass} placeholder="120/80" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temp&eacute;rature (&deg;C) *</label>
                <input type="number" step="0.1" value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} required className={inputClass} placeholder="37.0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes / Observations</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputClass + " h-20 resize-none"}
                placeholder="Observations médicales, réactions, remarques..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              <Heart size={16} />
              {loading ? "Enregistrement..." : "Enregistrer le don"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
