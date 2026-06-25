"use client";

import { useEffect, useState } from "react";
import { Building2, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface CenterInfo {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
}

const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  "N'Djaména": { lat: 12.1348, lng: 15.0557 },
  "Logone Occidental": { lat: 8.6167, lng: 15.8500 },
  "Ouaddaï": { lat: 13.8333, lng: 20.8333 },
  "Moyen-Chari": { lat: 9.1500, lng: 18.3833 },
  "Batha": { lat: 13.4500, lng: 18.4167 },
  "Borkou": { lat: 18.0000, lng: 18.0000 },
  "Chari-Baguirmi": { lat: 11.7667, lng: 15.0500 },
  "Guéra": { lat: 11.3833, lng: 18.5667 },
  "Hadjer-Lamis": { lat: 12.4500, lng: 15.2833 },
  "Kanem": { lat: 14.1167, lng: 15.3000 },
  "Lac": { lat: 13.5000, lng: 14.7333 },
  "Logone Oriental": { lat: 8.4000, lng: 16.3667 },
  "Mandoul": { lat: 8.6167, lng: 17.5000 },
  "Mayo-Kebbi Est": { lat: 9.3333, lng: 14.9500 },
  "Mayo-Kebbi Ouest": { lat: 9.9500, lng: 15.2167 },
  "Salamat": { lat: 10.6333, lng: 20.5333 },
  "Sila": { lat: 12.0833, lng: 21.2833 },
  "Tandjilé": { lat: 9.0500, lng: 16.4333 },
  "Tibesti": { lat: 21.3333, lng: 17.0000 },
  "Wadi Fira": { lat: 14.4667, lng: 22.0000 },
  "Ennedi-Est": { lat: 17.0000, lng: 22.5000 },
  "Ennedi-Ouest": { lat: 17.5000, lng: 20.5000 },
};

export default function CartePage() {
  const [centers, setCenters] = useState<CenterInfo[]>([]);
  const [selected, setSelected] = useState<CenterInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/centers/public").then(r => r.json()).then(d => setCenters(d.centers || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centres de Don</h1>
        <p className="text-gray-500 mt-1">Trouvez le centre le plus proche de chez vous</p>
      </div>

      {/* Visual map of Chad with center markers */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="relative bg-[#F5F7FA] p-4" style={{ minHeight: "300px" }}>
          {/* Simplified Chad map shape */}
          <svg viewBox="0 0 400 450" className="w-full h-auto max-h-[50vh]">
            {/* Chad outline (simplified) */}
            <path d="M120,30 L280,30 L320,80 L340,160 L330,240 L300,300 L260,350 L220,400 L180,420 L140,400 L100,350 L80,280 L70,200 L80,120 L100,60 Z"
              fill="#E8ECF1" stroke="#CBD5E1" strokeWidth="2"/>

            {/* Province labels + center dots */}
            {centers.map((c) => {
              const coords = PROVINCE_COORDS[c.province];
              if (!coords) return null;
              const x = ((coords.lng - 13) / 12) * 300 + 50;
              const y = 420 - ((coords.lat - 7) / 16) * 400 + 10;
              const isHQ = c.type === "HEADQUARTERS";
              return (
                <g key={c.id} onClick={() => setSelected(c)} className="cursor-pointer">
                  <circle cx={x} cy={y} r={isHQ ? 12 : 8} fill={isHQ ? "#E30613" : "#003DA5"} opacity={selected?.id === c.id ? 1 : 0.8} stroke="white" strokeWidth="2"/>
                  <text x={x} y={y - 16} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#374151">{c.province}</text>
                  {isHQ && <text x={x} y={y + 4} textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">HQ</text>}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-4 justify-center mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-[#E30613]" /> Si&egrave;ge
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-full bg-[#003DA5]" /> Provincial
            </div>
          </div>
        </div>
      </div>

      {/* Selected center detail */}
      {selected && (
        <div className="bg-white rounded-2xl border-2 border-[#003DA5]/20 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0",
              selected.type === "HEADQUARTERS" ? "bg-[#E30613]" : "bg-[#003DA5]"
            )}>
              <Building2 size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{selected.name}</h3>
              <span className={cn("inline-block mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold",
                selected.type === "HEADQUARTERS" ? "bg-[#E30613]/10 text-[#E30613]" : "bg-[#003DA5]/10 text-[#003DA5]"
              )}>{selected.type === "HEADQUARTERS" ? "Siège National" : "Centre Provincial"}</span>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={14} className="text-gray-400" /> {selected.address}, {selected.province}</div>
                {selected.phone && <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" /> <a href={`tel:${selected.phone}`} className="text-[#003DA5] font-medium">{selected.phone}</a></div>}
                {selected.email && <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400" /> {selected.email}</div>}
              </div>
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + " " + selected.province + " Tchad")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#003DA5] text-white text-sm font-semibold rounded-xl">
                <Navigation size={14} /> Itin&eacute;raire
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Center list */}
      <div className="space-y-2">
        {centers.map(c => (
          <button key={c.id} onClick={() => setSelected(c)}
            className={cn("w-full text-left bg-white rounded-xl border p-4 transition-all",
              selected?.id === c.id ? "border-[#003DA5] bg-[#003DA5]/5" : "border-gray-100 hover:border-gray-200"
            )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white",
                  c.type === "HEADQUARTERS" ? "bg-[#E30613]" : "bg-[#003DA5]"
                )}>
                  {c.type === "HEADQUARTERS" ? <Building2 size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.province}</p>
                </div>
              </div>
              {c.phone && <a href={`tel:${c.phone}`} onClick={e => e.stopPropagation()} className="p-2 bg-[#003DA5]/10 rounded-lg"><Phone size={16} className="text-[#003DA5]" /></a>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
