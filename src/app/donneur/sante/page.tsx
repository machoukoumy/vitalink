"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

const HealthCharts = dynamic(() => import("./HealthChartsInner"), { ssr: false, loading: () => <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-[320px] skeleton" />)}</div> });

export default function SantePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donor/health-history").then(r => r.json()).then(d => setData(d.history || d.records || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">&Eacute;volution Sant&eacute;</h1>
        <p className="text-gray-500 mt-1">Suivi de vos constantes au fil des dons</p>
      </div>
      {!data || (Array.isArray(data) && data.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Activity size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Aucune donn&eacute;e. Vos constantes appara&icirc;tront apr&egrave;s votre premier don.</p>
        </div>
      ) : <HealthCharts data={data} />}
    </div>
  );
}
