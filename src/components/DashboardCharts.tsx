"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const LazyCharts = dynamic(() => import("./DashboardChartsInner"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-[320px]">
          <div className="h-4 bg-gray-200 rounded w-48 mb-6 skeleton" />
          <div className="h-[250px] bg-gray-100 rounded-xl skeleton" />
        </div>
      ))}
    </div>
  ),
});

export default function DashboardCharts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/charts").then(r => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-[320px]">
          <div className="h-4 bg-gray-200 rounded w-48 mb-6 skeleton" />
          <div className="h-[250px] bg-gray-100 rounded-xl skeleton" />
        </div>
      ))}
    </div>
  );

  return <LazyCharts data={data} />;
}
