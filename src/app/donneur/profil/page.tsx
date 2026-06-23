"use client";

import { useEffect, useState, useRef } from "react";
import { User, Heart, MapPin, Phone, Mail, CreditCard, Camera, Printer, Clock, CheckCircle, FileText } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { VitaLinkLogoFull } from "@/components/VitaLinkLogo";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ProfilPage() {
  const [me, setMe] = useState<any>(null);
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      setMe(d.user);
      if (d.user?.donor) {
        fetch(`/api/dossier/donneur/${d.user.donor.id}`).then(r => r.json()).then(setDossier);
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setMe((prev: any) => ({ ...prev, avatar: data.url }));
    }
    setUploading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  if (!me?.donor) return <div className="text-center py-12 text-gray-500">Profil non trouv&eacute;</div>;

  const donor = dossier?.donor || me.donor;
  const stats = dossier?.stats;
  const eligibility = dossier?.eligibility;

  return (
    <div className="space-y-6">
      {/* Header with print */}
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil & Dossier</h1>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Printer size={16} /> Imprimer
        </button>
      </div>

      {/* Profile card with photo */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start gap-5">
          {/* Avatar with upload */}
          <div className="relative flex-shrink-0">
            {me.avatar ? (
              <img src={me.avatar} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#E30613] rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold">
                {me.name.charAt(0)}
              </div>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#003DA5] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#002D7A] transition-colors print:hidden">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">{me.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-[#E30613] text-white text-lg font-extrabold rounded-lg">
                {getBloodGroupLabel(donor.bloodGroup, donor.rhFactor)}
              </span>
              <span className="px-3 py-1 bg-[#003DA5]/10 text-[#003DA5] text-sm font-bold rounded-lg font-mono">
                {donor.matricule}
              </span>
              {eligibility?.isEligible ? (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                  <CheckCircle size={12} /> &Eacute;ligible
                </span>
              ) : eligibility && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
                  <Clock size={12} /> {eligibility.daysUntilEligible}j restants
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: <Mail size={14} />, label: "Email", value: me.email },
            { icon: <Phone size={14} />, label: "Téléphone", value: me.phone || "Non renseigné" },
            { icon: <MapPin size={14} />, label: "Adresse", value: donor.address },
            { icon: <CreditCard size={14} />, label: "N° Identité", value: donor.nationalId },
            { icon: <User size={14} />, label: "Genre", value: donor.gender === "M" ? "Masculin" : "Féminin" },
            { icon: <User size={14} />, label: "Né(e) le", value: formatDate(donor.dateOfBirth) },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">{f.icon}</span>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{f.label}</p>
                <p className="text-sm font-semibold text-gray-900">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { val: stats.totalDonations, label: "Dons", color: "text-[#E30613]" },
            { val: `${stats.totalQuantity} ml`, label: "Sang donné", color: "text-[#003DA5]" },
            { val: stats.acceptedResponses, label: "Urgences aidées", color: "text-emerald-600" },
            { val: stats.totalAppointments, label: "Rendez-vous", color: "text-amber-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ============ DOSSIER MEDICAL ============ */}
      {dossier && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:rounded-none">
          {/* Dossier header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <VitaLinkLogoFull />
              <div className="text-right">
                <p className="text-xs text-gray-400">DOSSIER M&Eacute;DICAL</p>
                <p className="text-base font-extrabold text-[#003DA5]">N&deg; {donor.matricule}</p>
              </div>
            </div>
            {donor.center && (
              <p className="text-xs text-gray-500 mt-2">{donor.center.name} - {donor.center.province}</p>
            )}
          </div>

          {/* Donation history */}
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Heart size={14} /> Historique des dons ({donor.donations?.length || 0})
            </h3>
            {donor.donations?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100 text-xs text-gray-400">
                    <th className="text-left py-2 pr-3">Date</th>
                    <th className="text-left py-2 pr-3">Qt&eacute;</th>
                    <th className="text-left py-2 pr-3">Hb</th>
                    <th className="text-left py-2 pr-3">TA</th>
                    <th className="text-left py-2 pr-3">Temp</th>
                    <th className="text-left py-2 pr-3">Par</th>
                    <th className="text-left py-2">Statut</th>
                  </tr></thead>
                  <tbody>{donor.donations.map((d: any) => (
                    <tr key={d.id} className="border-b border-gray-50">
                      <td className="py-2.5 pr-3 font-medium">{formatDate(d.date)}</td>
                      <td className="py-2.5 pr-3">{d.quantity} ml</td>
                      <td className="py-2.5 pr-3">{d.hemoglobin ? `${Number(d.hemoglobin).toFixed(1)}` : "-"}</td>
                      <td className="py-2.5 pr-3">{d.bloodPressure || "-"}</td>
                      <td className="py-2.5 pr-3">{d.temperature ? `${Number(d.temperature).toFixed(1)}°` : "-"}</td>
                      <td className="py-2.5 pr-3 text-xs text-gray-500">{d.collectedBy || "-"}</td>
                      <td className="py-2.5"><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <p className="text-sm text-gray-400">Aucun don enregistr&eacute;</p>}
          </div>

          {/* Appointments */}
          {donor.appointments?.length > 0 && (
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">Rendez-vous ({donor.appointments.length})</h3>
              <div className="space-y-2">
                {donor.appointments.slice(0, 10).map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl text-sm">
                    <span className="font-medium">{formatDate(a.date)} &agrave; {a.time}</span>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Urgency responses */}
          {donor.donorResponses?.length > 0 && (
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">R&eacute;ponses urgences ({donor.donorResponses.length})</h3>
              <div className="space-y-2">
                {donor.donorResponses.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl text-sm">
                    <div>
                      <span className="font-medium">{r.bloodRequest?.hospital?.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{formatDate(r.createdAt)}</span>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical notes */}
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-2">Notes m&eacute;dicales</h3>
            <p className="text-sm text-gray-600">{donor.medicalNotes || "Aucune note."}</p>
          </div>

          {/* Footer */}
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FileText size={12} className="text-gray-300" />
              <p className="text-[10px] text-gray-400">G&eacute;n&eacute;r&eacute; le {formatDateTime(new Date().toISOString())}</p>
            </div>
            <p className="text-[9px] text-gray-300">VitaLink - D&eacute;velopp&eacute; par JIDICOM</p>
          </div>
        </div>
      )}
    </div>
  );
}
