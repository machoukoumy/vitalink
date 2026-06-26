"use client";

import { useEffect, useState } from "react";
import { Plus, Search, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PersonnelCertificatsPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [donors, setDonors] = useState<any[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCerts = () => {
    fetch("/api/certificates").then(r => r.json()).then(d => setCerts(d.certificates || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCerts(); }, []);

  const searchDonors = async () => {
    if (!search.trim()) return;
    const res = await fetch(`/api/donor/search?q=${encodeURIComponent(search)}`);
    const data = await res.json();
    setDonors(data.donors || []);
  };

  const selectDonor = async (d: any) => {
    setSelectedDonor(d);
    setDonors([]);
    const res = await fetch(`/api/donations?donorId=${d.id}&limit=20`);
    const data = await res.json();
    setDonations(data.donations || []);
  };

  const handleSubmit = async () => {
    if (!selectedDonor) return;
    setSubmitting(true);

    await fetch("/api/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorId: selectedDonor.userId || selectedDonor.id,
        donationId: selectedDonation?.id || null,
        donorName: selectedDonor.user?.name || selectedDonor.name,
        donorMatricule: selectedDonor.matricule,
        bloodGroup: selectedDonor.bloodGroup,
        rhFactor: selectedDonor.rhFactor,
        donationDate: selectedDonation?.date || null,
        quantity: selectedDonation?.quantity || null,
        centerName: selectedDonor.center?.name || null,
      }),
    });

    setShowModal(false);
    setSelectedDonor(null);
    setSelectedDonation(null);
    setSearch("");
    setSubmitting(false);
    fetchCerts();
  };

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    PENDING: { icon: Clock, color: "text-amber-500", label: "En attente de signature" },
    SIGNED: { icon: CheckCircle, color: "text-emerald-500", label: "Signé par l'admin" },
    REJECTED: { icon: XCircle, color: "text-red-500", label: "Rejeté" },
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificats de Don</h1>
          <p className="text-gray-500 mt-1">Proposer des certificats &agrave; l&apos;admin pour signature</p>
        </div>
        <button onClick={() => { setShowModal(true); setSelectedDonor(null); setDonations([]); setSearch(""); }}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Plus size={16} /> Nouveau certificat
        </button>
      </div>

      {/* Liste des certificats */}
      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Aucun certificat cr&eacute;&eacute;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map(c => {
            const sc = statusConfig[c.status] || statusConfig.PENDING;
            const Icon = sc.icon;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#003DA5]/10 rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-[#003DA5]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{c.donorName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className="font-mono">{c.donorMatricule}</span>
                        <span className="px-1.5 py-0.5 bg-[#E30613]/10 text-[#E30613] rounded font-bold">{getBloodGroupLabel(c.bloodGroup, c.rhFactor)}</span>
                        {c.donationDate && <span>{formatDate(c.donationDate)}</span>}
                        {c.quantity && <span>{c.quantity} ml</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={sc.color} />
                    <span className={`text-xs font-semibold ${sc.color}`}>{sc.label}</span>
                  </div>
                </div>
                {c.signedByName && <p className="text-xs text-gray-400 mt-2">Sign&eacute; par: {c.signedByName} le {c.signedAt ? formatDate(c.signedAt) : ""}</p>}
                {c.rejectedReason && <p className="text-xs text-red-500 mt-2">Motif: {c.rejectedReason}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal création */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau certificat de don">
        <div className="space-y-4">
          {!selectedDonor ? (
            <>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && searchDonors()}
                    placeholder="Matricule, nom ou téléphone..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
                </div>
                <button onClick={searchDonors} className="btn-secondary px-4 py-2.5 text-sm">Chercher</button>
              </div>
              {donors.map(d => (
                <button key={d.id} onClick={() => selectDonor(d)}
                  className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{d.user.name}</p>
                    <p className="text-xs text-gray-400">{d.matricule}</p>
                  </div>
                  <span className="px-2 py-1 bg-[#E30613]/10 text-[#E30613] rounded text-sm font-bold">{getBloodGroupLabel(d.bloodGroup, d.rhFactor)}</span>
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="p-3 bg-[#003DA5]/5 rounded-xl border border-[#003DA5]/10">
                <p className="font-bold text-gray-900">{selectedDonor.user?.name}</p>
                <p className="text-xs text-gray-500">{selectedDonor.matricule} &middot; {getBloodGroupLabel(selectedDonor.bloodGroup, selectedDonor.rhFactor)}</p>
                <button onClick={() => { setSelectedDonor(null); setDonations([]); }} className="text-xs text-[#003DA5] mt-1">Changer</button>
              </div>

              {donations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">S&eacute;lectionner un don (optionnel) :</p>
                  {donations.slice(0, 5).map(d => (
                    <button key={d.id} onClick={() => setSelectedDonation(selectedDonation?.id === d.id ? null : d)}
                      className={`w-full text-left p-2 rounded-lg mb-1 text-sm transition-colors ${selectedDonation?.id === d.id ? "bg-[#E30613]/10 border border-[#E30613]/20" : "bg-gray-50 hover:bg-gray-100"}`}>
                      {formatDate(d.date)} &middot; {d.quantity} ml &middot; <StatusBadge status={d.status} />
                    </button>
                  ))}
                </div>
              )}

              <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full py-3 text-sm disabled:opacity-50">
                {submitting ? "Création..." : "Proposer le certificat à l'admin"}
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
