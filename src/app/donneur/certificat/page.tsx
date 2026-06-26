"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Printer, X } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, getBloodGroupLabel } from "@/lib/utils";

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
        <p className="text-gray-500 mt-1">Certificats sign&eacute;s par l&apos;administration</p>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-medium">Aucun certificat disponible</p>
          <p className="text-xs text-gray-300 mt-1">Vos certificats appara&icirc;tront ici apr&egrave;s signature</p>
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

      {/* ===== CERTIFICAT STYLE DIPLOME ===== */}
      {viewCert && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4" onClick={() => setViewCert(null)}>
          <div className="bg-white max-w-[700px] w-full rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>

            {/* Le certificat imprimable */}
            <div className="relative p-3 print:p-0">
              <div className="border-[3px] border-gray-800 p-2">
                <div className="border border-gray-400 p-8 md:p-12 text-center" style={{ fontFamily: "Georgia, 'Times New Roman', serif", minHeight: "500px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                  {/* Coins décoratifs */}
                  <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-gray-400 rounded-tl-lg" />
                  <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-gray-400 rounded-tr-lg" />
                  <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-gray-400 rounded-bl-lg" />
                  <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-gray-400 rounded-br-lg" />

                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <VitaLinkIcon size={36} />
                      <div>
                        <span className="font-extrabold text-xl text-[#E30613]" style={{ fontFamily: "system-ui, sans-serif" }}>Vita</span>
                        <span className="font-extrabold text-xl text-[#003DA5]" style={{ fontFamily: "system-ui, sans-serif" }}>Link</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mb-6">Plateforme Nationale de Transfusion Sanguine du Tchad</p>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                      CERTIFICAT
                    </h1>
                    <p className="text-lg tracking-[0.3em] uppercase text-gray-500 mb-8">de don de sang</p>
                  </div>

                  {/* Corps */}
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Ce certificat est fièrement décerné à</p>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                      {viewCert.donorName}
                    </h2>

                    <div className="max-w-md mx-auto mb-6">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        En reconnaissance de son acte g&eacute;n&eacute;reux de don de sang
                        <span className="font-bold text-[#E30613]"> {getBloodGroupLabel(viewCert.bloodGroup, viewCert.rhFactor)}</span>
                        {viewCert.quantity ? ` (${viewCert.quantity} ml)` : ""}
                        {viewCert.donationDate ? `, effectué le ${formatDate(viewCert.donationDate)}` : ""}
                        {viewCert.centerName ? ` au ${viewCert.centerName}` : ""}.
                        Votre don contribue &agrave; sauver des vies.
                      </p>
                    </div>

                    <p className="text-xs text-gray-400 mb-2">Matricule: <span className="font-mono font-bold text-[#003DA5]">{viewCert.donorMatricule}</span></p>
                  </div>

                  {/* Signature */}
                  <div>
                    {/* Laurier / séparateur */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="w-16 h-px bg-gray-300" />
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-gray-300">
                        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M14 26C14 26 16 20 20 16C24 20 26 26 26 26" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <circle cx="20" cy="14" r="2" fill="currentColor" />
                      </svg>
                      <div className="w-16 h-px bg-gray-300" />
                    </div>

                    <div className="flex items-end justify-between px-4 md:px-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-700 mb-1">{viewCert.signedAt ? formatDate(viewCert.signedAt) : "_______________"}</p>
                        <div className="w-40 border-t border-gray-400 pt-1">
                          <p className="text-xs text-gray-500">Date</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 mb-1">{viewCert.signedByName || "_______________"}</p>
                        <div className="w-40 border-t border-gray-400 pt-1">
                          <p className="text-xs text-gray-500">Signature de l&apos;Admin</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Boutons hors certificat */}
            <div className="p-4 flex gap-2 print:hidden border-t border-gray-100">
              <button onClick={() => window.print()} className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2">
                <Printer size={16} /> Imprimer
              </button>
              <button onClick={() => setViewCert(null)} className="flex-1 py-3 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl flex items-center justify-center gap-1">
                <X size={16} /> Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
