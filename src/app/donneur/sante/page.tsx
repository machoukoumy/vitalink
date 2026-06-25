"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Activity, Thermometer, Heart } from "lucide-react";
import { formatDate } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface HealthRecord {
  date: string;
  hemoglobin: number | null;
  systolic: number | null;
  diastolic: number | null;
  temperature: number | null;
}

export default function SantePage() {
  const [data, setData] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donor/health-history")
      .then((r) => r.json())
      .then((d) => setData(d.records || d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );
  }

  const formatXDate = (val: string) => {
    try {
      return formatDate(val);
    } catch {
      return val;
    }
  };

  const hasData = data.length > 0;

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <Activity size={40} className="mb-3 text-gray-300" />
      <p className="text-sm text-center">
        Aucune donn&eacute;e. Vos constantes appara&icirc;tront apr&egrave;s votre premier don.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">&Eacute;volution Sant&eacute;</h1>
        <p className="text-gray-500 mt-1">
          Suivi de vos constantes m&eacute;dicales au fil des dons
        </p>
      </div>

      {/* Hemoglobine */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Heart size={16} className="text-[#E30613]" />
          H&eacute;moglobine (g/dL)
        </h3>
        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXDate}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={formatXDate}
                formatter={(value: any) => [`${value} g/dL`, "Hémoglobine"]}
              />
              <Line
                type="monotone"
                dataKey="hemoglobin"
                stroke="#E30613"
                strokeWidth={2}
                dot={{ fill: "#E30613", r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          emptyState
        )}
      </div>

      {/* Tension arterielle */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} className="text-[#003DA5]" />
          Tension art&eacute;rielle (mmHg)
        </h3>
        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXDate}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={formatXDate}
                formatter={(value: any, name: string) => [
                  `${value} mmHg`,
                  name === "systolic" ? "Systolique" : "Diastolique",
                ]}
              />
              <Line
                type="monotone"
                dataKey="systolic"
                stroke="#E30613"
                strokeWidth={2}
                dot={{ fill: "#E30613", r: 4 }}
                connectNulls
                name="systolic"
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                stroke="#003DA5"
                strokeWidth={2}
                dot={{ fill: "#003DA5", r: 4 }}
                connectNulls
                name="diastolic"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          emptyState
        )}
      </div>

      {/* Temperature */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Thermometer size={16} className="text-amber-500" />
          Temp&eacute;rature (&deg;C)
        </h3>
        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXDate}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={formatXDate}
                formatter={(value: any) => [`${value}°C`, "Température"]}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          emptyState
        )}
      </div>
    </div>
  );
}
