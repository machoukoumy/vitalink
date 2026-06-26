"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function AdminDonorDetailPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/dossier/donneur/${params.id}`).then(r => r.json()).then(setData).finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  if (!data?.donor) return <div className="text-center py-12 text-gray-500">Donneur non trouv&eacute;</div>;

  const { donor, stats, eligibility } = data;
  const today = formatDateTime(new Date().toISOString());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/personnel/donneurs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft size={16} /> Retour &agrave; la liste
        </Link>
        <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Printer size={16} /> Imprimer la fiche
        </button>
      </div>

      {/* FICHE OFFICIELLE - même structure que la fiche donneur */}
      <div className="bg-white max-w-[800px] mx-auto border-2 border-black print:border print:shadow-none" style={{ fontFamily: "system-ui, Arial, sans-serif" }}>

        <div className="border-b-2 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VitaLinkIcon size={40} />
            <div>
              <div className="flex items-baseline"><span className="font-extrabold text-xl text-[#E30613]">Vita</span><span className="font-extrabold text-xl text-[#003DA5]">Link</span></div>
              <p className="text-[8px] text-gray-500">Plateforme Nationale de Transfusion Sanguine</p>
            </div>
          </div>
          <div className="text-right text-[9px] text-gray-500">
            {donor.center && (<><p className="font-bold text-gray-700">{donor.center.name}</p><p>{donor.center.province}, Tchad</p>{donor.center.phone && <p>T&eacute;l: {donor.center.phone}</p>}</>)}
          </div>
        </div>

        <div className="bg-[#003DA5] text-white text-center py-2.5 font-bold text-lg tracking-wide">FICHE DONNEUR DE SANG</div>

        <div className="border-b-2 border-black px-4 py-2 flex items-center justify-between bg-gray-50">
          <span className="text-xs text-gray-500">R&eacute;f :</span>
          <span className="font-mono font-bold text-[#003DA5] text-lg">{donor.matricule}</span>
          <span className="text-xs text-gray-500">Inscrit le : {formatDate(donor.createdAt)}</span>
        </div>

        {/* SECTION 1 */}
        <div className="border-b-2 border-black">
          <div className="bg-[#E30613] text-white px-4 py-1 text-xs font-bold uppercase">Identification</div>
          <div className="p-4 flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-[100px] h-[120px] border-2 border-black flex items-center justify-center bg-gray-50">
                <div className="text-center"><p className="text-3xl font-extrabold text-gray-300">{donor.user.name.charAt(0)}</p><p className="text-[7px] text-gray-400 mt-1">PHOTO 4x4</p></div>
              </div>
              <div className="text-center mt-1">
                <span className="inline-block px-3 py-1 bg-[#E30613] text-white text-xl font-extrabold rounded">{getBloodGroupLabel(donor.bloodGroup, donor.rhFactor)}</span>
              </div>
            </div>
            <div className="flex-1">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200"><td className="py-1.5 text-gray-500 text-xs font-bold w-[120px]">NOM :</td><td className="py-1.5 font-semibold">{donor.user.name.split(" ").slice(-1)[0].toUpperCase()}</td><td className="py-1.5 text-gray-500 text-xs font-bold w-[100px]">PR&Eacute;NOM :</td><td className="py-1.5 font-semibold">{donor.user.name.split(" ").slice(0, -1).join(" ")}</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1.5 text-gray-500 text-xs font-bold">N&deg; ID :</td><td className="py-1.5 font-semibold">{donor.nationalId}</td><td className="py-1.5 text-gray-500 text-xs font-bold">GENRE :</td><td className="py-1.5 font-semibold">{donor.gender === "M" ? "Masculin" : "Féminin"}</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1.5 text-gray-500 text-xs font-bold">N&Eacute;(E) LE :</td><td className="py-1.5 font-semibold">{formatDate(donor.dateOfBirth)}</td><td className="py-1.5 text-gray-500 text-xs font-bold">POIDS :</td><td className="py-1.5 font-semibold">{donor.weight ? `${donor.weight} kg` : "-"}</td></tr>
                  <tr className="border-b border-gray-200"><td className="py-1.5 text-gray-500 text-xs font-bold">ADRESSE :</td><td colSpan={3} className="py-1.5 font-semibold">{donor.address}</td></tr>
                  <tr><td className="py-1.5 text-gray-500 text-xs font-bold">T&Eacute;L :</td><td className="py-1.5 font-semibold">{donor.user.phone || "-"}</td><td className="py-1.5 text-gray-500 text-xs font-bold">EMAIL :</td><td className="py-1.5 font-semibold text-xs">{donor.user.email}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="border-b-2 border-black">
          <div className="bg-[#003DA5] text-white px-4 py-1 text-xs font-bold uppercase">R&eacute;sum&eacute;</div>
          <div className="p-4">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100 text-xs font-bold text-gray-600"><th className="border border-gray-300 px-3 py-2 text-left">Total Dons</th><th className="border border-gray-300 px-3 py-2 text-left">Qt&eacute; Totale</th><th className="border border-gray-300 px-3 py-2 text-left">Dernier Don</th><th className="border border-gray-300 px-3 py-2 text-left">&Eacute;ligibilit&eacute;</th></tr></thead>
              <tbody><tr>
                <td className="border border-gray-300 px-3 py-2 font-bold text-[#E30613]">{stats.totalDonations}</td>
                <td className="border border-gray-300 px-3 py-2 font-bold">{stats.totalQuantity} ml</td>
                <td className="border border-gray-300 px-3 py-2">{donor.lastDonation ? formatDate(donor.lastDonation) : "Aucun"}</td>
                <td className="border border-gray-300 px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${eligibility.isEligible ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{eligibility.isEligible ? "ÉLIGIBLE" : `${eligibility.daysUntilEligible}j`}</span></td>
              </tr></tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3 */}
        <div className="border-b-2 border-black">
          <div className="bg-[#E30613] text-white px-4 py-1 text-xs font-bold uppercase">Historique des Dons ({donor.donations.length})</div>
          <div className="p-4">
            {donor.donations.length === 0 ? <p className="text-sm text-gray-400 text-center py-4">Aucun don</p> : (
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead><tr className="bg-gray-100 font-bold text-gray-600">
                  <th className="border border-gray-300 px-2 py-1.5 text-left">N&deg;</th><th className="border border-gray-300 px-2 py-1.5 text-left">Date</th><th className="border border-gray-300 px-2 py-1.5 text-left">Qt&eacute;</th><th className="border border-gray-300 px-2 py-1.5 text-left">Hb</th><th className="border border-gray-300 px-2 py-1.5 text-left">TA</th><th className="border border-gray-300 px-2 py-1.5 text-left">T&deg;</th><th className="border border-gray-300 px-2 py-1.5 text-left">Par</th><th className="border border-gray-300 px-2 py-1.5 text-left">Statut</th>
                </tr></thead>
                <tbody>{donor.donations.map((d: any, i: number) => (
                  <tr key={d.id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="border border-gray-300 px-2 py-1.5 font-bold">{i + 1}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{formatDate(d.date)}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{d.quantity} ml</td>
                    <td className="border border-gray-300 px-2 py-1.5">{d.hemoglobin ? Number(d.hemoglobin).toFixed(1) : "-"}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{d.bloodPressure || "-"}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{d.temperature ? Number(d.temperature).toFixed(1) : "-"}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{d.collectedBy || "-"}</td>
                    <td className="border border-gray-300 px-2 py-1.5 font-semibold">{d.status}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>

        {/* SECTION 4 */}
        <div className="border-b-2 border-black">
          <div className="bg-[#003DA5] text-white px-4 py-1 text-xs font-bold uppercase">Notes M&eacute;dicales</div>
          <div className="p-4"><div className="border border-gray-300 rounded p-3 min-h-[60px] text-sm text-gray-600">{donor.medicalNotes || "Aucune note."}</div></div>
        </div>

        {/* SIGNATURE */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-gray-500 font-bold mb-1">Fait &agrave; : ____________________</p>
              <p className="text-xs text-gray-500 font-bold mb-6">Le : {today}</p>
              <div className="border-b border-black w-48 mb-1" />
              <p className="text-xs text-gray-600 font-bold">Signature de l&apos;agent</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold mb-7">Visa du responsable :</p>
              <div className="border-b border-black w-48 ml-auto mb-1" />
              <p className="text-xs text-gray-600 font-bold">Signature et cachet</p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black px-4 py-2 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2"><VitaLinkIcon size={16} /><span className="text-[9px] text-gray-400"><span className="font-bold text-[#E30613]">Vita</span><span className="font-bold text-[#003DA5]">Link</span></span></div>
          <span className="text-[8px] text-gray-400">D&eacute;velopp&eacute; par <a href="https://jidicom.lovable.app" className="font-bold">JIDICOM</a> &middot; {today}</span>
        </div>
      </div>

      <style jsx>{`@media print { @page { margin: 10mm; size: A4; } }`}</style>
    </div>
  );
}
