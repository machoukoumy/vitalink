"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, XCircle, Clock, Printer } from "lucide-react";
import Modal from "@/components/Modal";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AdminCertificatsPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState<string | null>(null);

  const fetchCerts = () => {
    fetch("/api/certificates").then(r => r.json()).then(d => setCerts(d.certificates || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleSign = async (id: string) => {
    await fetch(`/api/certificates/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sign" }) });
    fetchCerts();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/certificates/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject", reason: rejectReason }) });
    setShowReject(null);
    setRejectReason("");
    fetchCerts();
  };

  const pending = certs.filter(c => c.status === "PENDING");
  const signed = certs.filter(c => c.status === "SIGNED");
  const rejected = certs.filter(c => c.status === "REJECTED");

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Certificats &agrave; Signer</h1>
        <p className="text-gray-500 mt-1">{pending.length} en attente de signature</p>
      </div>

      {/* En attente */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2"><Clock size={14} /> En attente ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{c.donorName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="font-mono">{c.donorMatricule}</span>
                      <span className="px-1.5 py-0.5 bg-[#E30613]/10 text-[#E30613] rounded font-bold">{getBloodGroupLabel(c.bloodGroup, c.rhFactor)}</span>
                      {c.donationDate && <span>Don du {formatDate(c.donationDate)}</span>}
                      {c.quantity && <span>{c.quantity} ml</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Propos&eacute; par: {c.createdByName} le {formatDate(c.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleSign(c.id)} className="px-3 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 flex items-center gap-1">
                      <CheckCircle size={14} /> Signer
                    </button>
                    <button onClick={() => setShowReject(c.id)} className="px-3 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 flex items-center gap-1">
                      <XCircle size={14} /> Rejeter
                    </button>
                    <button onClick={() => setViewCert(c)} className="px-3 py-2 bg-[#003DA5]/10 text-[#003DA5] text-xs font-bold rounded-xl flex items-center gap-1">
                      <FileText size={14} /> Voir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signés */}
      {signed.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-2"><CheckCircle size={14} /> Sign&eacute;s ({signed.length})</h2>
          <div className="space-y-2">
            {signed.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{c.donorName} <span className="text-xs text-gray-400 font-mono">({c.donorMatricule})</span></p>
                  <p className="text-xs text-gray-400">Sign&eacute; par {c.signedByName} le {c.signedAt ? formatDate(c.signedAt) : ""}</p>
                </div>
                <button onClick={() => setViewCert(c)} className="text-xs text-[#003DA5] font-semibold">Voir</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejetés */}
      {rejected.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2"><XCircle size={14} /> Rejet&eacute;s ({rejected.length})</h2>
          <div className="space-y-2">
            {rejected.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                <p className="font-semibold text-sm text-gray-600">{c.donorName} <span className="text-xs text-gray-400 font-mono">({c.donorMatricule})</span></p>
                {c.rejectedReason && <p className="text-xs text-red-500 mt-1">Motif: {c.rejectedReason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && signed.length === 0 && rejected.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">Aucun certificat</p>
        </div>
      )}

      {/* Reject Modal */}
      <Modal isOpen={!!showReject} onClose={() => setShowReject(null)} title="Rejeter le certificat">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Motif du rejet</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm h-24 resize-none" placeholder="Raison du rejet..." />
          </div>
          <button onClick={() => showReject && handleReject(showReject)} className="btn-primary w-full py-3 text-sm">Confirmer le rejet</button>
        </div>
      </Modal>

      {/* View Certificate Modal */}
      <Modal isOpen={!!viewCert} onClose={() => setViewCert(null)} title="Certificat de Don">
        {viewCert && (
          <div>
            <div className="border-2 border-black p-5" style={{ fontFamily: "system-ui, Arial, sans-serif" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <VitaLinkIcon size={28} />
                  <div><span className="font-extrabold text-[#E30613]">Vita</span><span className="font-extrabold text-[#003DA5]">Link</span></div>
                </div>
                <p className="text-xs text-gray-400">CERTIFICAT DE DON</p>
              </div>
              <div className="text-center border-y border-gray-300 py-3 mb-4">
                <h2 className="text-lg font-bold">CERTIFICAT DE DON DE SANG</h2>
              </div>
              <p className="text-sm mb-3">
                Ce certificat atteste que <strong>{viewCert.donorName}</strong> (Matricule: <strong>{viewCert.donorMatricule}</strong>),
                groupe sanguin <strong>{getBloodGroupLabel(viewCert.bloodGroup, viewCert.rhFactor)}</strong>,
                a effectu&eacute; un don de sang{viewCert.quantity ? ` de ${viewCert.quantity} ml` : ""}
                {viewCert.donationDate ? ` le ${formatDate(viewCert.donationDate)}` : ""}
                {viewCert.centerName ? ` au ${viewCert.centerName}` : ""}.
              </p>
              {viewCert.status === "SIGNED" && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Sign&eacute; par: <strong>{viewCert.signedByName}</strong></p>
                  <p className="text-xs text-gray-500">Date: <strong>{viewCert.signedAt ? formatDateTime(viewCert.signedAt) : ""}</strong></p>
                  <div className="mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold inline-block">CERTIFI&Eacute; ET SIGN&Eacute;</div>
                </div>
              )}
              <p className="text-[8px] text-gray-300 mt-4 text-center">VitaLink - D&eacute;velopp&eacute; par JIDICOM</p>
            </div>
            {viewCert.status === "SIGNED" && (
              <button onClick={() => window.print()} className="btn-secondary w-full py-3 text-sm mt-3 flex items-center justify-center gap-2">
                <Printer size={16} /> Imprimer
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
