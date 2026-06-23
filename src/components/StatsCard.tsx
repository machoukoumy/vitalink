"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: "red" | "blue" | "green" | "yellow" | "purple" | "teal";
  trend?: { value: number; label: string };
}

const colorConfig = {
  red:    { icon: "bg-[#E30613] text-white shadow-[#E30613]/20" },
  blue:   { icon: "bg-[#003DA5] text-white shadow-[#003DA5]/20" },
  green:  { icon: "bg-emerald-500 text-white shadow-emerald-200" },
  yellow: { icon: "bg-amber-500 text-white shadow-amber-200" },
  purple: { icon: "bg-purple-500 text-white shadow-purple-200" },
  teal:   { icon: "bg-teal-500 text-white shadow-teal-200" },
};

export default function StatsCard({ title, value, subtitle, icon, color = "red", trend }: StatsCardProps) {
  const c = colorConfig[color];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 card-hover shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] md:text-[13px] font-medium text-gray-500 truncate">{title}</p>
          <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-[11px] md:text-[12px] text-gray-400 mt-0.5 truncate">{subtitle}</p>}
          {trend && (
            <p className={cn("text-[11px] mt-1.5 font-semibold", trend.value >= 0 ? "text-emerald-600" : "text-[#E30613]")}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 md:p-3 rounded-xl flex-shrink-0", c.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
