"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Printer, X } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

function OfficialCertificate({ cert }: { cert: any }) {
  const attestNum = `VL-CNTS-${new Date().getFullYear()}-${(cert.id || "").slice(-5).toUpperCase() || "XXXXX"}`;

  return (
    <div style={{ background: "#f0ede6", padding: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 780, background: "#fff", border: "1px solid #aaa", position: "relative", fontFamily: "Georgia, serif" }}>

        {/* Double border */}
        <div style={{ position: "absolute", inset: 8, border: "2px solid #2c2c2a", pointerEvents: "none", zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 13, border: "0.5px solid #999", pointerEvents: "none", zIndex: 2 }} />

        {/* Corner ornaments */}
        <svg style={{ position: "absolute", top: 4, left: 4, width: 44, height: 44, zIndex: 3 }} viewBox="0 0 44 44"><path d="M4 4 Q4 22 22 22 Q4 22 4 40" stroke="#444" strokeWidth="1" fill="none"/><circle cx="6" cy="6" r="3" fill="none" stroke="#444" strokeWidth="1"/><path d="M4 4 L14 4 M4 4 L4 14" stroke="#444" strokeWidth="1.5" fill="none"/></svg>
        <svg style={{ position: "absolute", top: 4, right: 4, width: 44, height: 44, zIndex: 3 }} viewBox="0 0 44 44"><path d="M40 4 Q40 22 22 22 Q40 22 40 40" stroke="#444" strokeWidth="1" fill="none"/><circle cx="38" cy="6" r="3" fill="none" stroke="#444" strokeWidth="1"/><path d="M40 4 L30 4 M40 4 L40 14" stroke="#444" strokeWidth="1.5" fill="none"/></svg>
        <svg style={{ position: "absolute", bottom: 4, left: 4, width: 44, height: 44, zIndex: 3 }} viewBox="0 0 44 44"><path d="M4 40 Q4 22 22 22 Q4 22 4 4" stroke="#444" strokeWidth="1" fill="none"/><circle cx="6" cy="38" r="3" fill="none" stroke="#444" strokeWidth="1"/><path d="M4 40 L14 40 M4 40 L4 30" stroke="#444" strokeWidth="1.5" fill="none"/></svg>
        <svg style={{ position: "absolute", bottom: 4, right: 4, width: 44, height: 44, zIndex: 3 }} viewBox="0 0 44 44"><path d="M40 40 Q40 22 22 22 Q40 22 40 4" stroke="#444" strokeWidth="1" fill="none"/><circle cx="38" cy="38" r="3" fill="none" stroke="#444" strokeWidth="1"/><path d="M40 40 L30 40 M40 40 L40 30" stroke="#444" strokeWidth="1.5" fill="none"/></svg>

        <div style={{ padding: "26px 40px 20px", position: "relative", zIndex: 1 }}>

          {/* EN-TÊTE */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 10 }}>
            <div style={{ flex: "0 0 72px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: 64, height: 64, border: "1px solid #ccc", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: "#999", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
                Armoiries<br/>R&eacute;publique<br/>du Tchad
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 9, fontWeight: 700, color: "#1a1a1a", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3 }}>R&eacute;publique du Tchad</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 7.5, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Minist&egrave;re de la Sant&eacute; Publique et de la Solidarit&eacute; Nationale</div>
              <div style={{ height: 0.5, background: "#b22222", margin: "4px auto", width: "60%" }} />
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 8, color: "#1a1a1a", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Centre National de Transfusion Sanguine</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 8, color: "#b22222", fontWeight: 700, letterSpacing: "0.16em" }}>C.N.T.S</div>
            </div>
            <div style={{ flex: "0 0 72px", display: "flex", justifyContent: "center" }}>
              <VitaLinkIcon size={64} />
            </div>
          </div>

          {/* Ligne rouge */}
          <div style={{ height: 1.5, background: "#b22222", marginBottom: 10 }} />

          {/* TITRE */}
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 40, fontWeight: 900, color: "#1a1a1a", letterSpacing: -0.5, lineHeight: 1 }}>CERTIFICAT</div>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#1a1a1a", letterSpacing: "0.38em", textTransform: "uppercase", marginTop: 2 }}>DE DON DE SANG B&Eacute;N&Eacute;VOLE</div>
          </div>

          {/* Intro */}
          <div style={{ textAlign: "center", margin: "8px 0 4px", fontFamily: "Arial, sans-serif", fontSize: 7.5, color: "#555", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Le Directeur G&eacute;n&eacute;ral du CNTS certifie que
          </div>

          {/* NOM */}
          <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 27, fontWeight: 700, color: "#1a1a1a", fontStyle: "italic" }}>{cert.donorName}</div>
          </div>

          {/* Infos donneur */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 28px", margin: "0 20px 8px", borderTop: "0.5px solid #ccc", borderBottom: "0.5px solid #ccc", padding: "7px 0", fontFamily: "Arial, sans-serif", fontSize: 9, color: "#333" }}>
            <div><span style={{ color: "#888", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>M./Mme : </span><strong>{cert.donorName}</strong></div>
            <div><span style={{ color: "#888", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Matricule : </span><strong>{cert.donorMatricule}</strong></div>
            <div><span style={{ color: "#888", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Groupe sanguin : </span><strong style={{ color: "#b22222" }}>{cert.bloodGroup}</strong><span style={{ color: "#888", fontSize: 8 }}> Rh&eacute;sus : </span><strong style={{ color: "#b22222" }}>{cert.rhFactor === "+" ? "Positif (+)" : "Négatif (-)"}</strong></div>
            <div><span style={{ color: "#888", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Centre : </span><strong>{cert.centerName || "CNTS N'Djaména"}</strong></div>
          </div>

          {/* Texte reconnaissance */}
          <div style={{ textAlign: "center", margin: "0 24px 12px", fontFamily: "Georgia, serif", fontSize: 9.5, color: "#333", lineHeight: 1.7 }}>
            Ce certificat est d&eacute;livr&eacute; en reconnaissance d&apos;un acte de solidarit&eacute; et de g&eacute;n&eacute;rosit&eacute; envers la Nation.<br/>
            Le titulaire a effectu&eacute; un don de sang b&eacute;n&eacute;vole{cert.quantity ? ` de ${cert.quantity} ml` : ""} au Centre CNTS{cert.centerName ? ` de ${cert.centerName}` : ""},<br/>
            {cert.donationDate ? <>le <strong>{formatDate(cert.donationDate)}</strong>, </> : ""}contribuant ainsi &agrave; sauver des vies humaines sur le territoire tchadien.<br/>
            Ce don a &eacute;t&eacute; r&eacute;alis&eacute; dans le cadre du <em>Programme National de Transfusion Sanguine S&eacute;curis&eacute;e du Tchad</em>.<br/>
            Le donneur a satisfait &agrave; toutes les conditions m&eacute;dicales requises pour un don de sang b&eacute;n&eacute;vole et volontaire.
          </div>

          {/* PIED : Date | Sceau | Signature */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "0 16px", gap: 12 }}>

            {/* Date gauche */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{ borderTop: "1px solid #333", paddingTop: 5, marginBottom: 2 }} />
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 9, fontWeight: 700, color: "#1a1a1a" }}>{cert.donationDate ? formatDate(cert.donationDate) : "_______________"}</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 7.5, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em" }}>Date du don</div>
            </div>

            {/* Sceau central */}
            <div style={{ textAlign: "center", flex: "0 0 auto" }}>
              <svg width="76" height="76" viewBox="0 0 80 80">
                <g stroke="#999" strokeWidth="1" fill="none">
                  <path d="M12 62 C8 52 6 44 8 36 C10 28 14 22 18 18"/>
                  <ellipse cx="11" cy="56" rx="4" ry="3" transform="rotate(-30 11 56)" strokeWidth="0.8"/>
                  <ellipse cx="9" cy="50" rx="4" ry="3" transform="rotate(-20 9 50)" strokeWidth="0.8"/>
                  <ellipse cx="9" cy="44" rx="4" ry="3" transform="rotate(-10 9 44)" strokeWidth="0.8"/>
                  <ellipse cx="11" cy="38" rx="4" ry="3" transform="rotate(5 11 38)" strokeWidth="0.8"/>
                  <ellipse cx="15" cy="32" rx="4" ry="3" transform="rotate(20 15 32)" strokeWidth="0.8"/>
                  <ellipse cx="19" cy="26" rx="4" ry="3" transform="rotate(35 19 26)" strokeWidth="0.8"/>
                  <path d="M68 62 C72 52 74 44 72 36 C70 28 66 22 62 18"/>
                  <ellipse cx="69" cy="56" rx="4" ry="3" transform="rotate(30 69 56)" strokeWidth="0.8"/>
                  <ellipse cx="71" cy="50" rx="4" ry="3" transform="rotate(20 71 50)" strokeWidth="0.8"/>
                  <ellipse cx="71" cy="44" rx="4" ry="3" transform="rotate(10 71 44)" strokeWidth="0.8"/>
                  <ellipse cx="69" cy="38" rx="4" ry="3" transform="rotate(-5 69 38)" strokeWidth="0.8"/>
                  <ellipse cx="65" cy="32" rx="4" ry="3" transform="rotate(-20 65 32)" strokeWidth="0.8"/>
                  <ellipse cx="61" cy="26" rx="4" ry="3" transform="rotate(-35 61 26)" strokeWidth="0.8"/>
                  <path d="M26 66 Q40 70 54 66"/>
                </g>
                <path d="M40 16 C40 16 51 30 51 38 C51 44 46 49 40 49 C34 49 29 44 29 38 C29 30 40 16 40 16Z" fill="#b22222" opacity="0.9"/>
                <path d="M33 37 L47 37 M40 30 L40 44" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 7, color: "#777", letterSpacing: "0.05em", marginTop: -4 }}>{attestNum}</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 7, color: "#b22222", fontWeight: 700 }}>Groupe {getBloodGroupLabel(cert.bloodGroup, cert.rhFactor)}</div>
            </div>

            {/* Signature droite */}
            <div style={{ textAlign: "center", flex: 1 }}>
              {cert.signedByName && (
                <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: 22, color: "#1a1a1a", lineHeight: 1.2 }}>Dr. {cert.signedByName.split(" ")[0]}</div>
              )}
              <div style={{ borderTop: "1px solid #333", paddingTop: 5, marginBottom: 2 }} />
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 8.5, fontWeight: 700, color: "#1a1a1a" }}>Dr. {cert.signedByName || "_______________"}</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 7.5, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em" }}>Directeur G&eacute;n&eacute;ral du CNTS</div>
            </div>
          </div>

          {/* Bas de page */}
          <div style={{ marginTop: 10, borderTop: "0.5px solid #ccc", paddingTop: 6, textAlign: "center" }}>
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 7, color: "#999", letterSpacing: "0.05em" }}>
              Certificat d&eacute;livr&eacute; par le Centre National de Transfusion Sanguine du Tchad &middot; <strong style={{ color: "#E30613" }}>Vita</strong><strong style={{ color: "#003DA5" }}>Link</strong> &middot; D&eacute;velopp&eacute; par <strong>JIDICOM</strong>
            </div>
          </div>

        </div>
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
        <div className="fixed inset-0 z-[70] bg-[#f0ede6] overflow-y-auto print:bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between print:hidden">
            <button onClick={() => setViewCert(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <X size={18} /> Fermer
            </button>
            <button onClick={() => window.print()} className="btn-secondary px-4 py-2 text-sm flex items-center gap-2">
              <Printer size={16} /> Imprimer
            </button>
          </div>
          <div className="max-w-[820px] mx-auto my-6 print:my-0">
            <OfficialCertificate cert={viewCert} />
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body > *:not(.fixed) { display: none !important; }
          .fixed { position: static !important; }
          @page { margin: 10mm; size: A4 landscape; }
        }
      `}</style>
    </div>
  );
}
