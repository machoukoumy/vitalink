"use client";

import { useEffect, useState } from "react";
import { Printer, FileText } from "lucide-react";
import { VitaLinkLogoFull } from "@/components/VitaLinkLogo";
import { formatDate, formatDateTime } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function DossierPersonnelPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) fetch(`/api/dossier/personnel/${d.user.id}`).then(r => r.json()).then(setData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  const { user, stats, activityLogs } = data;
  const roleLabels: Record<string, string> = { ADMIN: "Administrateur", PERSONNEL: "Personnel Médical", SUPER_ADMIN: "Super Admin" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Mon Dossier</h1>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm"><Printer size={16} /> Imprimer</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto print:shadow-none print:rounded-none">
        <div className="border-b border-gray-200 p-6 md:p-8">
          <div className="flex items-start justify-between">
            <VitaLinkLogoFull />
            <div className="text-right"><p className="text-xs text-gray-400">FICHE</p><p className="text-lg font-extrabold text-[#003DA5]">PERSONNEL</p></div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#003DA5] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold">{user.name.charAt(0)}</div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{user.name}</h2>
              <span className="inline-block mt-1 px-3 py-1 bg-[#003DA5] text-white text-sm font-bold rounded-lg">{roleLabels[user.role] || user.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs">Email</span><p className="font-semibold">{user.email}</p></div>
            <div><span className="text-gray-400 text-xs">T&eacute;l&eacute;phone</span><p className="font-semibold">{user.phone || "-"}</p></div>
            <div><span className="text-gray-400 text-xs">Statut</span><p className="font-semibold">{user.isActive ? "Actif" : "Inactif"}</p></div>
            {user.center && <div><span className="text-gray-400 text-xs">Centre</span><p className="font-semibold">{user.center.name}</p></div>}
            {user.center && <div><span className="text-gray-400 text-xs">Province</span><p className="font-semibold">{user.center.province}</p></div>}
            <div><span className="text-gray-400 text-xs">Inscrit le</span><p className="font-semibold">{formatDate(user.createdAt)}</p></div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">R&eacute;capitulatif d&apos;activit&eacute;</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-[#E30613]">{stats.donationsRegistered}</p>
              <p className="text-xs text-gray-500">Dons enregistr&eacute;s</p>
            </div>
            <div className="bg-[#F5F7FA] rounded-xl p-4 text-center">
              <p className="text-2xl font-extrabold text-[#003DA5]">{stats.totalLogs}</p>
              <p className="text-xs text-gray-500">Actions enregistr&eacute;es</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 md:p-8">
          <h3 className="text-sm font-bold text-[#003DA5] uppercase tracking-wider mb-4">Journal d&apos;activit&eacute;</h3>
          {activityLogs.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune activit&eacute; enregistr&eacute;e pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {activityLogs.slice(0, 20).map((log: any) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-[#F5F7FA] rounded-xl">
                  <div><p className="text-sm font-medium text-gray-900">{log.action}</p>{log.details && <p className="text-xs text-gray-500">{log.details}</p>}</div>
                  <p className="text-xs text-gray-400">{formatDateTime(log.createdAt)}</p>
                </div>
              ))}
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
