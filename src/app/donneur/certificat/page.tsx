"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Printer } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function CertificatDonneurPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<any>(null);

  useEffect(() => {
    fetch("/api/certificates").then(r => r.json()).then(d => setCerts(d.certificates || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes Certificats</h1>
        <p className="text-gray-500 mt-1">Certificats de don sign&eacute;s par l&apos;administration</p>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-medium">Aucun certificat disponible</p>
          <p className="text-xs text-gray-300 mt-1">Les certificats appara&icirc;tront ici apr&egrave;s signature par l&apos;admin</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Certificat de Don</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-[#E30613]/10 text-[#E30613] rounded font-bold">{getBloodGroupLabel(c.bloodGroup, c.rhFactor)}</span>
                      {c.donationDate && <span>{formatDate(c.donationDate)}</span>}
                      {c.quantity && <span>{c.quantity} ml</span>}
                    </div>
                    <p className="text-xs text-emerald-600 mt-0.5">Sign&eacute; par {c.signedByName}</p>
                  </div>
                </div>
                <button onClick={() => setViewCert(c)} className="btn-secondary px-3 py-2 text-xs flex items-center gap-1">
                  <FileText size={14} /> Voir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewCert && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50" onClick={() => setViewCert(null)}>
          <div className="bg-white max-w-lg w-full mx-4 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-2 border-black m-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2"><VitaLinkIcon size={32} /><div><span className="font-extrabold text-lg text-[#E30613]">Vita</span><span className="font-extrabold text-lg text-[#003DA5]">Link</span></div></div>
                {viewCert.centerName && <p className="text-[9px] text-gray-500">{viewCert.centerName}</p>}
              </div>
              <div className="text-center border-y-2 border-black py-3 mb-4">
                <h2 className="text-xl font-extrabold text-[#003DA5]">CERTIFICAT DE DON DE SANG</h2>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Ce certificat atteste que <strong>{viewCert.donorName}</strong> (Matricule: <strong className="text-[#003DA5]">{viewCert.donorMatricule}</strong>),
                groupe sanguin <strong className="text-[#E30613]">{getBloodGroupLabel(viewCert.bloodGroup, viewCert.rhFactor)}</strong>,
                a effectu&eacute; un don de sang{viewCert.quantity ? ` de ${viewCert.quantity} ml` : ""}
                {viewCert.donationDate ? ` le ${formatDate(viewCert.donationDate)}` : ""}
                {viewCert.centerName ? ` au ${viewCert.centerName}` : ""}.
              </p>
              <div className="border-t-2 border-black pt-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-gray-500">Sign&eacute; par :</p><p className="text-sm font-bold">{viewCert.signedByName}</p><p className="text-xs text-gray-400">{viewCert.signedAt ? formatDateTime(viewCert.signedAt) : ""}</p></div>
                  <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-extrabold border border-emerald-300">CERTIFI&Eacute; &#10003;</div>
                </div>
              </div>
              <p className="text-[7px] text-gray-300 mt-4 text-center">VitaLink - D&eacute;velopp&eacute; par JIDICOM</p>
            </div>
            <div className="p-4 flex gap-2">
              <button onClick={() => window.print()} className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2"><Printer size={16} /> Imprimer</button>
              <button onClick={() => setViewCert(null)} className="flex-1 py-3 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
