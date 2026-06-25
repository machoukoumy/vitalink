"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Calendar,
  Droplets, Activity, Heart, Clock, FileText, Printer, Shield,
  Award, CheckCircle, XCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import StatusBadge from "@/components/StatusBadge";
import DataTable from "@/components/DataTable";
import { formatDate, formatDateTime, getBloodGroupLabel, cn } from "@/lib/utils";

interface DonorDetail {
  id: string;
  matricule: string;
  bloodGroup: string;
  rhFactor: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  nationalId: string;
  weight: number | null;
  latitude: number | null;
  longitude: number | null;
  isEligible: boolean;
  lastDonation: string | null;
  medicalNotes: string | null;
  createdAt: string;
  user: { name: string; email: string; phone: string | null; createdAt: string };
  center: { name: string; province: string; phone: string | null; address: string } | null;
  donations: Array<{
    id: string; date: string; quantity: number; hemoglobin: number | null;
    bloodPressure: string | null; temperature: number | null; status: string; notes: string | null;
  }>;
  appointments: Array<{ id: string; date: string; status: string; notes: string | null }>;
  donorResponses: Array<{
    id: string; status: string; createdAt: string; message: string | null;
    bloodRequest: { bloodGroup: string; rhFactor: string; urgency: string; hospital: { name: string } };
  }>;
  donorRequests: Array<{ id: string; bloodGroup: string; rhFactor: string; quantity: number; urgency: string; status: string; createdAt: string }>;
}

interface Stats {
  totalDonations: number;
  totalQuantity: number;
  totalAppointments: number;
  totalResponses: number;
  acceptedResponses: number;
  totalRequests: number;
}

interface Eligibility {
  isEligible: boolean;
  daysSinceLast: number | null;
  daysUntilEligible: number;
  interval: number;
  nextDate: string | null;
}

export default function AdminDonorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [donor, setDonor] = useState<DonorDetail | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/dossier/donneur/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d => { setDonor(d.donor); setStats(d.stats); setEligibility(d.eligibility); })
      .catch(() => setError("Donneur introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;
  if (error || !donor) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">{error || "Donneur introuvable"}</p>
      <Link href="/admin/donneurs" className="text-[#E30613] font-semibold hover:underline">Retour</Link>
    </div>
  );

  const donationColumns = [
    { key: "date", label: "Date", render: (d: DonorDetail["donations"][0]) => formatDate(d.date) },
    { key: "quantity", label: "Quantite", render: (d: DonorDetail["donations"][0]) => `${d.quantity} ml` },
    { key: "hemoglobin", label: "Hemoglobine", render: (d: DonorDetail["donations"][0]) => d.hemoglobin ? `${d.hemoglobin} g/dL` : "-" },
    { key: "bloodPressure", label: "Tension", render: (d: DonorDetail["donations"][0]) => d.bloodPressure || "-" },
    { key: "temperature", label: "Temp.", render: (d: DonorDetail["donations"][0]) => d.temperature ? `${d.temperature}°C` : "-" },
    { key: "status", label: "Statut", render: (d: DonorDetail["donations"][0]) => <StatusBadge status={d.status} /> },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Back + Print */}
      <div className="flex items-center justify-between">
        <Link href="/admin/donneurs" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#E30613] transition-colors">
          <ArrowLeft size={18} /> Retour aux donneurs
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
          <Printer size={16} /> Imprimer
        </button>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#E30613] to-[#003DA5] flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
            {donor.user.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{donor.user.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                {getBloodGroupLabel(donor.bloodGroup, donor.rhFactor)}
              </span>
              <span className="text-sm text-gray-500 font-mono">{donor.matricule}</span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold",
                eligibility?.isEligible ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              )}>
                {eligibility?.isEligible ? "Eligible" : `Eligible dans ${eligibility?.daysUntilEligible}j`}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex-shrink-0 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <QRCodeSVG value={`VITALINK-DONOR:${donor.matricule}`} size={100} level="M" />
            <p className="text-[10px] text-gray-400 text-center mt-1">{donor.matricule}</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: <Mail size={16} />, label: "Email", value: donor.user.email },
          { icon: <Phone size={16} />, label: "Telephone", value: donor.user.phone || "Non renseigne" },
          { icon: <MapPin size={16} />, label: "Adresse", value: donor.address },
          { icon: <CreditCard size={16} />, label: "N. Identite", value: donor.nationalId },
          { icon: <User size={16} />, label: "Genre", value: donor.gender === "M" ? "Masculin" : "Feminin" },
          { icon: <Calendar size={16} />, label: "Date de naissance", value: formatDate(donor.dateOfBirth) },
          { icon: <Activity size={16} />, label: "Poids", value: donor.weight ? `${donor.weight} kg` : "Non renseigne" },
          { icon: <Shield size={16} />, label: "Centre", value: donor.center?.name || "Non affecte" },
          { icon: <Clock size={16} />, label: "Inscrit le", value: formatDate(donor.user.createdAt) },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
            <span className="text-gray-400 mt-0.5">{item.icon}</span>
            <div>
              <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total dons", value: stats.totalDonations, icon: <Droplets size={20} />, color: "text-[#E30613]", bg: "bg-red-50" },
            { label: "Quantite totale", value: `${stats.totalQuantity} ml`, icon: <Activity size={20} />, color: "text-[#003DA5]", bg: "bg-blue-50" },
            { label: "Reponses", value: `${stats.acceptedResponses}/${stats.totalResponses}`, icon: <Heart size={20} />, color: "text-green-600", bg: "bg-green-50" },
            { label: "Rendez-vous", value: stats.totalAppointments, icon: <Calendar size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s, i) => (
            <div key={i} className={cn("rounded-2xl border border-gray-100 p-4 shadow-sm", s.bg)}>
              <div className={cn("mb-2", s.color)}>{s.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Donation history */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Droplets size={20} className="text-[#E30613]" /> Historique des Dons
          </h2>
        </div>
        <div className="p-5">
          <DataTable columns={donationColumns} data={donor.donations} emptyMessage="Aucun don enregistre" />
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={20} className="text-[#003DA5]" /> Rendez-vous
          </h2>
        </div>
        <div className="p-5">
          {donor.appointments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucun rendez-vous</p>
          ) : (
            <div className="space-y-3">
              {donor.appointments.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatDateTime(a.date)}</p>
                    {a.notes && <p className="text-xs text-gray-500 mt-0.5">{a.notes}</p>}
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Urgency responses */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart size={20} className="text-green-600" /> Reponses aux Urgences
          </h2>
        </div>
        <div className="p-5">
          {donor.donorResponses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucune reponse</p>
          ) : (
            <div className="space-y-3">
              {donor.donorResponses.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    {r.status === "ACCEPTED" ? <CheckCircle size={18} className="text-green-600" /> : <XCircle size={18} className="text-red-500" />}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.bloodRequest.hospital.name}</p>
                      <p className="text-xs text-gray-500">
                        {getBloodGroupLabel(r.bloodRequest.bloodGroup, r.bloodRequest.rhFactor)} - {r.bloodRequest.urgency} - {formatDate(r.createdAt)}
                      </p>
                      {r.message && <p className="text-xs text-gray-400 mt-0.5">{r.message}</p>}
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Medical notes */}
      {donor.medicalNotes && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-orange-500" /> Notes Medicales
            </h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{donor.medicalNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
