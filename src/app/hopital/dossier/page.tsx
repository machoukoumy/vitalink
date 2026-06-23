"use client";

import { useEffect, useState } from "react";
import { Printer, FileText } from "lucide-react";
import { VitaLinkLogoFull } from "@/components/VitaLinkLogo";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DossierHopitalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user?.hospitalId) fetch(`/api/dossier/hopital/${d.user.hospitalId}`).then(r => r.json()).then(setData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  const { hospital, stats } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Dossier H&ocirc;pital</h1>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm"><Printer size={16} /> Imprimer</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto print:shadow-none print:rounded-none">
        <div className="border-b border-gray-200 p-6 md:p-8">
          <div className="flex items-start justify-between">
            <VitaLinkLogoFull />
            <div className="text-right"><p className="text-xs text-gray-400">DOSSIER</p><p className="text-lg font-extrabold text-[#003DA5]">H&Ocirc;PITAL</p></div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-3">{hospital.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">Province</span><p className="font-semibold">{hospital.province}</p></div>
            <div><span className="text-gray-400 text-xs">Type</span><p className="font-semibold">{hospital.type}</p></div>
            <div><span className="text-gray-400 text-xs">Adresse</span><p className="font-semibold">{hospital.address}</p></div>
            <div><span className="text-gray-400 text-xs">T&eacute;l&eacute;phone</span><p className="font-semibold">{hospital.phone || "-"}</p></div>
            <div><span className="text-gray-400 text-xs">Email</span><p className="font-semibold">{hospital.email || "-"}</p></div>
            <div><span className="text-gray-400 text-xs">Comptes utilisateurs</span><p className="font-semibold">{stats.totalUsers}</p></div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">R&eacute;capitulatif</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: stats.totalRequests, label: "Demandes totales", color: "text-[#003DA5]" },
              { val: stats.pendingRequests, label: "En attente", color: "text-orange-500" },
              { val: stats.fulfilledRequests, label: "Satisfaites", color: "text-emerald-600" },
              { val: stats.acceptedDonorResponses, label: "Donneurs acceptés", color: "text-[#E30613]" },
            ].map((s, i) => (
              <div key={i} className="bg-[#F5F7FA] rounded-xl p-4 text-center">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-[#F5F7FA] rounded-xl p-4 text-center">
            <p className="text-3xl font-extrabold text-[#003DA5]">{stats.totalQuantityRequested} ml</p>
            <p className="text-xs text-gray-500">Quantit&eacute; totale demand&eacute;e</p>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">Historique des demandes ({hospital.bloodRequests.length})</h3>
          {hospital.bloodRequests.length === 0 ? <p className="text-sm text-gray-400">Aucune demande</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="text-left py-2 pr-3">Date</th><th className="text-left py-2 pr-3">Groupe</th>
                  <th className="text-left py-2 pr-3">Quantit&eacute;</th><th className="text-left py-2 pr-3">Urgence</th>
                  <th className="text-left py-2 pr-3">Motif</th><th className="text-left py-2 pr-3">R&eacute;ponses</th><th className="text-left py-2">Statut</th>
                </tr></thead>
                <tbody>{hospital.bloodRequests.map((r: any) => (
                  <tr key={r.id} className="border-b border-gray-50">
                    <td className="py-2 pr-3">{formatDate(r.createdAt)}</td>
                    <td className="py-2 pr-3 font-bold text-[#E30613]">{getBloodGroupLabel(r.bloodGroup, r.rhFactor)}</td>
                    <td className="py-2 pr-3">{r.quantity} ml</td>
                    <td className="py-2 pr-3"><StatusBadge status={r.urgency} /></td>
                    <td className="py-2 pr-3 text-xs text-gray-500">{r.reason || "-"}</td>
                    <td className="py-2 pr-3 font-semibold">{r._count.donorResponses}</td>
                    <td className="py-2"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2"><FileText size={14} className="text-gray-300" /><p className="text-xs text-gray-400">Document g&eacute;n&eacute;r&eacute; le {formatDateTime(new Date().toISOString())}</p></div>
          <p className="text-[10px] text-gray-300">VitaLink - Plateforme Nationale de Transfusion Sanguine du Tchad - D&eacute;velopp&eacute; par JIDICOM</p>
        </div>
      </div>
    </div>
  );
}
