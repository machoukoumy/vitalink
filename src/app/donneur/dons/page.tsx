"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Calendar, Droplets } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatDateTime, cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DonationRecord {
  id: string;
  date: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  status: string;
  hemoglobin: number | null;
  bloodPressure: string | null;
  collectedBy: string | null;
}

interface EligibilityData {
  isEligible: boolean;
  daysUntilEligible: number;
  daysSinceLast: number | null;
  minInterval: number;
  progressPercent: number;
  reminderMessage: string | null;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DonneurDonsPage() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/donations?limit=50").then((r) => r.json()),
      fetch("/api/donor/eligibility").then((r) => r.json()),
    ])
      .then(([d, e]) => {
        setDonations(d.donations || []);
        setTotal(d.total || 0);
        setEligibility(e);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Droplets className="text-[#E30613] animate-bounce" size={32} />
          <p className="text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  const totalQuantity = donations.reduce((acc, d) => acc + d.quantity, 0);

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (d: DonationRecord) => formatDateTime(d.date),
    },
    {
      key: "bloodGroup",
      label: "Groupe",
      render: (d: DonationRecord) => (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
          {d.bloodGroup}{d.rhFactor}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Quantité",
      render: (d: DonationRecord) => `${d.quantity} ml`,
    },
    {
      key: "hemoglobin",
      label: "Hémoglobine",
      render: (d: DonationRecord) => (d.hemoglobin ? `${d.hemoglobin} g/dL` : "-"),
    },
    {
      key: "bloodPressure",
      label: "Tension",
      render: (d: DonationRecord) => d.bloodPressure || "-",
    },
    {
      key: "collectedBy",
      label: "Collecté par",
      render: (d: DonationRecord) => d.collectedBy || "-",
    },
    {
      key: "status",
      label: "Statut",
      render: (d: DonationRecord) => <StatusBadge status={d.status} />,
    },
  ];

  /* Compute next eligible date for display */
  const nextEligibleDate = eligibility && !eligibility.isEligible && eligibility.daysUntilEligible > 0
    ? (() => {
        const d = new Date();
        d.setDate(d.getDate() + eligibility.daysUntilEligible);
        return formatDate(d);
      })()
    : null;

  return (
    <div className="space-y-6 pb-safe">
      {/* ---- Eligibility banner ---- */}
      {eligibility && (
        <div
          className={cn(
            "rounded-2xl border-2 p-5 flex items-start gap-4",
            eligibility.isEligible
              ? "bg-green-50 border-green-200"
              : "bg-orange-50 border-orange-200"
          )}
        >
          <div
            className={cn(
              "p-2.5 rounded-xl flex-shrink-0",
              eligibility.isEligible ? "bg-green-100" : "bg-orange-100"
            )}
          >
            {eligibility.isEligible ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <Clock className="text-orange-600" size={24} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {eligibility.isEligible ? (
              <>
                <h3 className="font-bold text-green-800 text-base">
                  Vous êtes éligible au don !
                </h3>
                <p className="text-sm text-green-700 mt-0.5">
                  {eligibility.daysSinceLast !== null
                    ? `Dernier don il y a ${eligibility.daysSinceLast} jours.`
                    : "Vous pouvez faire votre premier don."}
                </p>
                <a
                  href="/donneur/rendez-vous"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors touch-active"
                >
                  <Calendar size={14} />
                  Prendre rendez-vous
                </a>
              </>
            ) : (
              <>
                <h3 className="font-bold text-orange-800 text-base">
                  Prochain don possible dans {eligibility.daysUntilEligible} jours
                </h3>
                <p className="text-sm text-orange-700 mt-0.5">
                  {nextEligibleDate
                    ? `Date estimée : ${nextEligibleDate}`
                    : `Intervalle minimum : ${eligibility.minInterval} jours entre deux dons.`}
                </p>
                {/* Progress bar */}
                <div className="mt-3 w-full max-w-md">
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(eligibility.progressPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-orange-500 mt-1">
                    {Math.round(eligibility.progressPercent)}% du cycle de récupération
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---- Page header ---- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes Dons</h1>
        <p className="text-gray-500 mt-1">
          {total} don(s) au total &mdash; {totalQuantity} ml collectés
        </p>
      </div>

      {/* ---- Donations table ---- */}
      <DataTable
        columns={columns}
        data={donations}
        emptyMessage="Vous n'avez pas encore fait de don"
      />
    </div>
  );
}
