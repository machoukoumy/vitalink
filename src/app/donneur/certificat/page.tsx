"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Printer, X } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

function CertificateDocument({ cert }: { cert: any }) {
  const donNum = cert.donationNumber || "1er";

  return (
    <div className="bg-white p-6 md:p-10 text-[13px] leading-relaxed" style={{ fontFamily: "'Times New Roman', Georgia, serif", color: "#1a1a1a" }}>

      {/* EN-TÊTE OFFICIEL */}
      <div className="flex items-start justify-between mb-2">
        <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center text-[7px] text-gray-400 text-center">
          Armoiries<br/>R&eacute;publique<br/>du Tchad
        </div>
        <div className="text-center flex-1 px-4">
          <p className="text-[11px] font-bold tracking-wider uppercase">R&eacute;publique du Tchad</p>
          <p className="text-[10px] text-gray-600">Minist&egrave;re de la Sant&eacute; Publique et de la Solidarit&eacute; Nationale</p>
          <p className="text-[10px] text-gray-600">Centre National de Transfusion Sanguine &mdash; CNTS</p>
        </div>
        <div className="w-16 h-16 flex items-center justify-center">
          <VitaLinkIcon size={48} />
        </div>
      </div>

      {/* Ligne séparatrice */}
      <div className="border-t-2 border-b border-gray-800 py-3 my-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">Certificat de Don de Sang</h1>
      </div>

      {/* Corps */}
      <div className="space-y-4 my-6">
        <p>Le Directeur G&eacute;n&eacute;ral du Centre National de Transfusion Sanguine,</p>

        <p className="font-bold text-base uppercase tracking-wider">Certifie que :</p>

        <p className="text-lg">
          M. / Mme <span className="font-bold text-xl border-b-2 border-gray-800 px-2">{cert.donorName}</span>
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <p>N&eacute;(e) le : <span className="border-b border-gray-400 px-1">{cert.dateOfBirth ? formatDate(cert.dateOfBirth) : "_______________"}</span></p>
          <p>&agrave; : <span className="border-b border-gray-400 px-1">{cert.city || "_______________"}</span></p>
          <p>Pi&egrave;ce d&apos;identit&eacute; N&deg; : <span className="border-b border-gray-400 px-1">{cert.nationalId || "_______________"}</span></p>
          <p>&nbsp;</p>
          <p>Groupe sanguin : <span className="font-bold text-lg text-[#E30613] border-b-2 border-[#E30613] px-1">{cert.bloodGroup}</span></p>
          <p>Rh&eacute;sus : <span className="font-bold text-lg text-[#003DA5] border-b-2 border-[#003DA5] px-1">{cert.rhFactor}</span></p>
        </div>

        <p className="mt-4">
          A effectu&eacute; son <span className="font-bold">{donNum}</span> don de sang b&eacute;n&eacute;vole<br/>
          au Centre CNTS de <span className="font-bold border-b border-gray-400 px-1">{cert.centerName || "N'Djaména"}</span><br/>
          en date du : <span className="font-bold border-b border-gray-400 px-1">{cert.donationDate ? formatDate(cert.donationDate) : "_______________"}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <p>Volume pr&eacute;lev&eacute; : <span className="font-bold">{cert.quantity ? `${cert.quantity} ml` : "___ ml"}</span></p>
          <p>Nature du don : <span className="font-bold">Sang total</span></p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 mt-4 text-[12px]">
          <p>Ce don a &eacute;t&eacute; r&eacute;alis&eacute; dans le cadre du Programme National de Transfusion Sanguine S&eacute;curis&eacute;e du Tchad.</p>
          <p className="mt-1">Le donneur a satisfait &agrave; toutes les conditions m&eacute;dicales requises pour un don de sang b&eacute;n&eacute;vole et volontaire.</p>
        </div>

        <p className="text-[11px] text-gray-500 mt-2">
          Num&eacute;ro d&apos;attestation : <span className="font-mono font-bold text-[#003DA5]">VL-CNTS-{new Date().getFullYear()}-{cert.id?.slice(-5).toUpperCase() || "XXXXX"}</span>
        </p>
      </div>

      {/* Signature */}
      <div className="mt-8 text-right pr-8">
        <p>Fait &agrave; N&apos;Djam&eacute;na, le <span className="font-bold">{cert.signedAt ? formatDate(cert.signedAt) : "_______________"}</span></p>

        <div className="mt-6">
          <p className="text-[11px] text-gray-500">Le Directeur G&eacute;n&eacute;ral du CNTS</p>
          <div className="h-16 flex items-center justify-end">
            {cert.status === "SIGNED" && (
              <div className="px-4 py-1.5 border-2 border-emerald-600 text-emerald-700 rounded text-[10px] font-bold tracking-wider uppercase rotate-[-5deg]">
                Sign&eacute; &amp; Certifi&eacute;
              </div>
            )}
          </div>
          <p className="font-bold text-base">Dr. {cert.signedByName || "_______________"}</p>
          <p className="text-[11px] text-gray-500">Directeur G&eacute;n&eacute;ral</p>
        </div>
      </div>

      {/* Pied de page vérification */}
      <div className="border-t-2 border-gray-800 mt-8 pt-3 text-[10px] text-gray-500 text-center">
        <p>Ce certificat est d&eacute;livr&eacute; par le Centre National de Transfusion Sanguine du Tchad.</p>
        <p className="mt-1">
          <span className="font-bold text-[#E30613]">Vita</span><span className="font-bold text-[#003DA5]">Link</span> &mdash;
          Plateforme Nationale de Transfusion Sanguine &middot; D&eacute;velopp&eacute; par <a href="https://jidicom.lovable.app" className="font-bold text-gray-700">JIDICOM</a>
        </p>
      </div>
    </div>
  );
}

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
        <p className="text-gray-500 mt-1">Certificats sign&eacute;s par la direction du CNTS</p>
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
                    <p className="font-semibold text-gray-900">Certificat de Don de Sang</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span className="px-1.5 py-0.5 bg-[#E30613]/10 text-[#E30613] rounded font-bold">{getBloodGroupLabel(c.bloodGroup, c.rhFactor)}</span>
                      {c.donationDate && <span>{formatDate(c.donationDate)}</span>}
                      {c.quantity && <span>{c.quantity} ml</span>}
                    </div>
                    <p className="text-xs text-emerald-600 mt-0.5">Sign&eacute; par Dr. {c.signedByName}</p>
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

      {/* Certificat plein écran */}
      {viewCert && (
        <div className="fixed inset-0 z-[70] bg-gray-100 overflow-y-auto print:bg-white">
          {/* Barre d'actions */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between print:hidden">
            <button onClick={() => setViewCert(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <X size={18} /> Fermer
            </button>
            <button onClick={() => window.print()} className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
              <Printer size={16} /> Imprimer
            </button>
          </div>

          {/* Document */}
          <div className="max-w-[800px] mx-auto my-6 bg-white shadow-lg border border-gray-200 print:shadow-none print:border-none print:my-0">
            <CertificateDocument cert={viewCert} />
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body > *:not(.fixed) { display: none !important; }
          .fixed { position: static !important; background: white !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </div>
  );
}
