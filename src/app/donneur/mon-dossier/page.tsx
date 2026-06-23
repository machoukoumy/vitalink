"use client";

import { useEffect, useState } from "react";
import { Printer, CheckCircle, Clock, FileText } from "lucide-react";
import { VitaLinkLogoFull } from "@/components/VitaLinkLogo";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function MonDossierPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user?.donor) {
        fetch(`/api/dossier/donneur/${d.user.donor.id}`).then(r => r.json()).then(setData);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement du dossier...</div>;

  const { donor, stats, eligibility } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Mon Dossier M&eacute;dical</h1>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Printer size={16} /> Imprimer
        </button>
      </div>

      {/* Printable document */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm print:shadow-none print:border print:rounded-none max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div className="print:flex print:items-center print:gap-4">
              <VitaLinkLogoFull />
              {donor.center && (
                <div className="mt-2 print:mt-0 text-xs text-gray-500">
                  <p className="font-semibold text-gray-700">{donor.center.name}</p>
                  <p>{donor.center.address}</p>
                  {donor.center.phone && <p>T&eacute;l: {donor.center.phone}</p>}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">DOSSIER M&Eacute;DICAL</p>
              <p className="text-lg font-extrabold text-[#003DA5]">DONNEUR</p>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#E30613] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold">
              {donor.user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{donor.user.name}</h2>
              <span className="inline-block mt-1 px-3 py-1 bg-[#E30613] text-white text-lg font-extrabold rounded-lg">
                {getBloodGroupLabel(donor.bloodGroup, donor.rhFactor)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">N&deg; Identit&eacute;</span><p className="font-semibold text-gray-900">{donor.nationalId}</p></div>
            <div><span className="text-gray-400 text-xs">Genre</span><p className="font-semibold text-gray-900">{donor.gender === "M" ? "Masculin" : "Féminin"}</p></div>
            <div><span className="text-gray-400 text-xs">Date de naissance</span><p className="font-semibold text-gray-900">{formatDate(donor.dateOfBirth)}</p></div>
            <div><span className="text-gray-400 text-xs">Poids</span><p className="font-semibold text-gray-900">{donor.weight ? `${donor.weight} kg` : "Non renseigné"}</p></div>
            <div><span className="text-gray-400 text-xs">T&eacute;l&eacute;phone</span><p className="font-semibold text-gray-900">{donor.user.phone || "-"}</p></div>
            <div><span className="text-gray-400 text-xs">Adresse</span><p className="font-semibold text-gray-900">{donor.address}</p></div>
            <div><span className="text-gray-400 text-xs">Email</span><p className="font-semibold text-gray-900">{donor.user.email}</p></div>
            <div><span className="text-gray-400 text-xs">Inscrit le</span><p className="font-semibold text-gray-900">{formatDate(donor.user.createdAt)}</p></div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">R&eacute;sum&eacute;</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-[#E30613]">{stats.totalDonations}</p>
              <p className="text-xs text-gray-500">Dons</p>
            </div>
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-[#003DA5]">{stats.totalQuantity} ml</p>
              <p className="text-xs text-gray-500">Quantit&eacute; totale</p>
            </div>
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-emerald-600">{stats.acceptedResponses}</p>
              <p className="text-xs text-gray-500">R&eacute;ponses urgences</p>
            </div>
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center flex flex-col items-center justify-center">
              {eligibility.isEligible ? (
                <><CheckCircle className="text-emerald-500 mb-1" size={24} /><p className="text-xs text-emerald-600 font-bold">&Eacute;ligible</p></>
              ) : (
                <><Clock className="text-orange-500 mb-1" size={24} /><p className="text-xs text-orange-600 font-bold">{eligibility.daysUntilEligible}j restants</p></>
              )}
            </div>
          </div>
        </div>

        {/* Donation history */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">Historique des dons ({donor.donations.length})</h3>
          {donor.donations.length === 0 ? <p className="text-sm text-gray-400">Aucun don enregistr&eacute;</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="text-left py-2 pr-3">Date</th><th className="text-left py-2 pr-3">Quantit&eacute;</th>
                  <th className="text-left py-2 pr-3">H&eacute;moglobine</th><th className="text-left py-2 pr-3">Tension</th>
                  <th className="text-left py-2 pr-3">Temp.</th><th className="text-left py-2 pr-3">Collect&eacute; par</th><th className="text-left py-2">Statut</th>
                </tr></thead>
                <tbody>{donor.donations.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-50">
                    <td className="py-2 pr-3 font-medium">{formatDate(d.date)}</td>
                    <td className="py-2 pr-3">{d.quantity} ml</td>
                    <td className="py-2 pr-3">{d.hemoglobin ? `${Number(d.hemoglobin).toFixed(1)} g/dL` : "-"}</td>
                    <td className="py-2 pr-3">{d.bloodPressure || "-"}</td>
                    <td className="py-2 pr-3">{d.temperature ? `${Number(d.temperature).toFixed(1)}°C` : "-"}</td>
                    <td className="py-2 pr-3">{d.collectedBy || "-"}</td>
                    <td className="py-2"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">Rendez-vous ({donor.appointments.length})</h3>
          {donor.appointments.length === 0 ? <p className="text-sm text-gray-400">Aucun rendez-vous</p> : (
            <div className="space-y-2">
              {donor.appointments.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl">
                  <div><p className="text-sm font-medium">{formatDate(a.date)} &agrave; {a.time}</p><p className="text-xs text-gray-400">{a.type === "DONATION" ? "Don de sang" : "Consultation"}</p></div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Responses to urgencies */}
        {donor.donorResponses.length > 0 && (
          <div className="border-b border-gray-200 p-6 md:p-8">
            <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">R&eacute;ponses aux urgences ({donor.donorResponses.length})</h3>
            <div className="space-y-2">
              {donor.donorResponses.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl">
                  <div>
                    <p className="text-sm font-medium">{r.bloodRequest.hospital.name}</p>
                    <p className="text-xs text-gray-400">{getBloodGroupLabel(r.bloodRequest.bloodGroup, r.bloodRequest.rhFactor)} - {formatDate(r.createdAt)}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical notes */}
        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">Notes m&eacute;dicales</h3>
          <p className="text-sm text-gray-600">{donor.medicalNotes || "Aucune note médicale enregistrée."}</p>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileText size={14} className="text-gray-300" />
            <p className="text-xs text-gray-400">Document g&eacute;n&eacute;r&eacute; le {formatDateTime(new Date().toISOString())}</p>
          </div>
          <p className="text-[10px] text-gray-300">VitaLink - Plateforme Nationale de Transfusion Sanguine du Tchad - D&eacute;velopp&eacute; par JIDICOM</p>
        </div>
      </div>
    </div>
  );
}
