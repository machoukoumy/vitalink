"use client";

import { cn } from "@/lib/utils";

interface StockItem {
  bloodGroup: string;
  rhFactor: string;
  _sum: { quantity: number | null };
  _count: number;
}

export default function BloodStockChart({ data }: { data: StockItem[] }) {
  const allGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const maxQuantity = Math.max(...data.map((d) => d._sum.quantity || 0), 1);

  const stockMap: Record<string, number> = {};
  data.forEach((d) => { stockMap[`${d.bloodGroup}${d.rhFactor}`] = d._sum.quantity || 0; });

  const getLevel = (qty: number) => {
    const ratio = qty / maxQuantity;
    if (ratio >= 0.7) return { bar: "bg-emerald-500", text: "text-emerald-600", label: "Bon", bg: "bg-emerald-50" };
    if (ratio >= 0.3) return { bar: "bg-amber-500", text: "text-amber-600", label: "Moyen", bg: "bg-amber-50" };
    if (qty > 0) return { bar: "bg-[#E30613]", text: "text-[#E30613]", label: "Bas", bg: "bg-red-50" };
    return { bar: "bg-gray-300", text: "text-[#E30613]", label: "Rupture", bg: "bg-red-50" };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">Stock par Groupe Sanguin</h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
        {allGroups.map((group) => {
          const qty = stockMap[group] || 0;
          const level = getLevel(qty);
          return (
            <div key={group} className={cn("text-center p-3 md:p-4 rounded-xl border border-gray-100 card-hover", level.bg)}>
              <div className="text-lg md:text-xl font-bold text-gray-900">{group}</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", level.bar)}
                  style={{ width: `${maxQuantity > 0 ? (qty / maxQuantity) * 100 : 0}%` }}
                />
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1.5 font-semibold">{qty} <span className="text-gray-400 font-normal">ml</span></div>
              <div className={cn("text-[10px] mt-0.5 font-bold", level.text)}>{level.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
