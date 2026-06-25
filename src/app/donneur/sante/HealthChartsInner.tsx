"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Heart, Activity, Thermometer } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HealthChartsInner({ data }: { data: any[] }) {
  const fmt = (v: string) => { try { return formatDate(v); } catch { return v; } };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><Heart size={16} className="text-[#E30613]" />H&eacute;moglobine (g/dL)</h3>
        <ResponsiveContainer width="100%" height={220}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip labelFormatter={fmt} /><Line type="monotone" dataKey="hemoglobin" stroke="#E30613" strokeWidth={2} dot={{ fill: "#E30613", r: 3 }} connectNulls /></LineChart></ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={16} className="text-[#003DA5]" />Tension (mmHg)</h3>
        <ResponsiveContainer width="100%" height={220}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip labelFormatter={fmt} /><Line type="monotone" dataKey="systolic" stroke="#E30613" strokeWidth={2} dot={{ fill: "#E30613", r: 3 }} connectNulls /><Line type="monotone" dataKey="diastolic" stroke="#003DA5" strokeWidth={2} dot={{ fill: "#003DA5", r: 3 }} connectNulls /></LineChart></ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><Thermometer size={16} className="text-amber-500" />Temp&eacute;rature (&deg;C)</h3>
        <ResponsiveContainer width="100%" height={220}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="date" tickFormatter={fmt} tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip labelFormatter={fmt} /><Line type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} dot={{ fill: "#F59E0B", r: 3 }} connectNulls /></LineChart></ResponsiveContainer>
      </div>
    </div>
  );
}
