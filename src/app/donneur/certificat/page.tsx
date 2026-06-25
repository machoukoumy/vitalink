"use client";

import { useState, useEffect, useCallback } from "react";
import { VitaLinkLogoFull } from "@/components/VitaLinkLogo";
import { formatDate, cn } from "@/lib/utils";
import { FileText, Printer, ArrowLeft } from "lucide-react";

interface Donation {
  id: string;
  donationDate: string;
  quantity: number;
  status: string;
  center?: { name: string };
}

interface CertificateData {
  donorName: string;
  matricule: string;
  bloodGroup: string;
  donationDate: string;
  quantity: number;
  centerName: string;
}

export default function DonorCertificatPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [certLoading, setCertLoading] = useState(false);

  const fetchDonations = useCallback(async () => {
    try {
      const res = await fetch("/api/donations");
      if (res.ok) {
        const data = await res.json();
        const all: Donation[] = Array.isArray(data) ? data : data.donations || [];
        setDonations(all.filter((d) => d.status === "COLLECTED" || d.status === "TESTED" || d.status === "STORED"));
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const viewCertificate = async (donationId: string) => {
    setCertLoading(true);
    try {
      const res = await fetch(`/api/certificate/${donationId}`);
      if (res.ok) {
        const data = await res.json();
        setCertificate(data);
      }
    } catch {
      /* ignore */
    } finally {
      setCertLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Certificate view
  if (certificate) {
    return (
      <div className="space-y-4">
        {/* Controls - hidden when printing */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={() => setCertificate(null)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 btn-primary px-4 py-2 rounded-xl text-sm font-semibold bg-[#E30613] text-white hover:bg-[#c9050f] transition-colors shadow-sm ml-auto"
          >
            <Printer size={16} />
            Imprimer
          </button>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12 shadow-sm max-w-2xl mx-auto print:border-none print:shadow-none print:rounded-none print:p-0 print:max-w-none">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <VitaLinkLogoFull />
            </div>
            <div className="w-24 h-0.5 bg-[#E30613] mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#003DA5] tracking-wide">
              CERTIFICAT DE DON DE SANG
            </h1>
            <div className="w-24 h-0.5 bg-[#E30613] mx-auto mt-6" />
          </div>

          {/* Body */}
          <div className="space-y-6 text-center">
            <p className="text-base text-gray-700 leading-relaxed">
              Ce certificat atteste que
            </p>

            <div className="py-3">
              <p className="text-xl font-bold text-gray-900">{certificate.donorName}</p>
              <p className="text-sm text-gray-500 mt-1">Matricule : {certificate.matricule}</p>
              <p className="text-sm text-gray-500">Groupe sanguin : {certificate.bloodGroup}</p>
            </div>

            <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto">
              a effectue un don de sang en date du{" "}
              <span className="font-semibold">{formatDate(certificate.donationDate)}</span>,
              d&apos;une quantite de{" "}
              <span className="font-semibold">{certificate.quantity} ml</span>,
              au centre de transfusion sanguine{" "}
              <span className="font-semibold">{certificate.centerName}</span>.
            </p>

            <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto mt-4">
              Ce certificat atteste que{" "}
              <span className="font-semibold">{certificate.donorName}</span>{" "}
              a effectue un don de sang volontaire et non remunere, contribuant ainsi a sauver des vies.
            </p>
          </div>

          {/* Date */}
          <div className="text-right mt-10">
            <p className="text-sm text-gray-500">
              Fait le {formatDate(new Date().toISOString())}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              VitaLink - Connecter les donneurs. Sauver des vies.
            </p>
            <p className="text-[10px] text-gray-300 mt-1">
              Developpe par JIDICOM
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Donations list
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Certificats de don</h1>
        <p className="text-sm text-gray-500 mt-1">Consultez et imprimez vos certificats de don de sang</p>
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium text-sm">Aucun don termine pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3 card-hover"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold",
                    donation.status === "STORED" ? "bg-green-100 text-green-800" :
                    donation.status === "TESTED" ? "bg-purple-100 text-purple-800" :
                    "bg-indigo-100 text-indigo-800"
                  )}>
                    {donation.status === "STORED" ? "Stocke" :
                     donation.status === "TESTED" ? "Teste" : "Collecte"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Don du {formatDate(donation.donationDate)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {donation.quantity} ml {donation.center?.name ? `- ${donation.center.name}` : ""}
                </p>
              </div>
              <button
                onClick={() => viewCertificate(donation.id)}
                disabled={certLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#003DA5] text-white hover:bg-[#002d7a] transition-colors shadow-sm flex-shrink-0 disabled:opacity-50"
              >
                <FileText size={14} />
                Voir certificat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
