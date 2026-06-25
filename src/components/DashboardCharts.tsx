"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

interface ChartsData {
  donationsParMois: Array<{ mois: string; dons: number }>;
  stockParGroupe: Array<{ groupe: string; quantite: number }>;
  demandesParUrgence: Array<{ urgence: string; count: number }>;
}

const GROUPE_COLORS: Record<string, string> = {
  A: "#E30613",
  B: "#003DA5",
  AB: "#7C3AED",
  O: "#059669",
};

const URGENCE_COLORS: Record<string, string> = {
  CRITICAL: "#E30613",
  URGENT: "#F59E0B",
  NORMAL: "#003DA5",
};

const URGENCE_LABELS: Record<string, string> = {
  CRITICAL: "Critique",
  URGENT: "Urgent",
  NORMAL: "Normal",
};

export default function DashboardCharts() {
  const [data, setData] = useState<ChartsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/charts")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-[320px] animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
            <div className="h-[250px] bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Dons par mois */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Dons par mois (6 derniers mois)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.donationsParMois}>
            <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="dons" fill="#E30613" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock par groupe sanguin */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Stock par groupe sanguin
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data.stockParGroupe}
              dataKey="quantite"
              nameKey="groupe"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ groupe, quantite }) => `${groupe}: ${quantite}`}
            >
              {data.stockParGroupe.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GROUPE_COLORS[entry.groupe] || "#6B7280"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Demandes par urgence */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Demandes par niveau d&apos;urgence
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.demandesParUrgence.map((d) => ({ ...d, label: URGENCE_LABELS[d.urgence] || d.urgence }))}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.demandesParUrgence.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={URGENCE_COLORS[entry.urgence] || "#6B7280"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
