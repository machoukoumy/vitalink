"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Building2, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapLocation } from "@/components/LeafletMap";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 rounded-2xl" style={{ minHeight: "400px" }}>
      <p className="text-gray-400 font-medium">Chargement de la carte...</p>
    </div>
  ),
});

interface CenterInfo {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
}

export default function CartePage() {
  const [centers, setCenters] = useState<CenterInfo[]>([]);
  const [hospitals, setHospitals] = useState<CenterInfo[]>([]);
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/centers/public").then(r => r.json()),
      fetch("/api/hospitals/public").then(r => r.json()).catch(() => ({ hospitals: [] })),
    ])
      .then(([cData, hData]) => {
        setCenters(cData.centers || []);
        setHospitals(hData.hospitals || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  /* Merge centers and hospitals into a single location list for the map */
  const mapLocations: MapLocation[] = [
    ...centers.map(c => ({ ...c, category: "center" as const })),
    ...hospitals.map(h => ({ ...h, category: "hospital" as const })),
  ];

  const handleSelect = (loc: MapLocation) => setSelected(loc);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Carte des Centres</h1>
        <p className="text-gray-500 mt-1">Trouvez le centre ou l&apos;h&ocirc;pital le plus proche</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full bg-[#E30613]" /> Si&egrave;ge (CNTS)
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full bg-[#003DA5]" /> Centre Provincial
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-3 h-3 rounded-full bg-green-600" /> H&ocirc;pital
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "450px" }}>
        <LeafletMap locations={mapLocations} onSelect={handleSelect} />
      </div>

      {/* Selected detail */}
      {selected && (
        <div className="bg-white rounded-2xl border-2 border-[#003DA5]/20 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0",
              selected.category === "hospital" ? "bg-green-600" : selected.type === "HEADQUARTERS" ? "bg-[#E30613]" : "bg-[#003DA5]"
            )}>
              {selected.category === "hospital" ? <Building2 size={22} /> : selected.type === "HEADQUARTERS" ? <Building2 size={22} /> : <MapPin size={22} />}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{selected.name}</h3>
              <span className={cn("inline-block mt-1 px-2 py-0.5 rounded-lg text-[10px] font-bold",
                selected.category === "hospital"
                  ? "bg-green-100 text-green-700"
                  : selected.type === "HEADQUARTERS"
                  ? "bg-[#E30613]/10 text-[#E30613]"
                  : "bg-[#003DA5]/10 text-[#003DA5]"
              )}>
                {selected.category === "hospital" ? "H&ocirc;pital" : selected.type === "HEADQUARTERS" ? "Si&egrave;ge National" : "Centre Provincial"}
              </span>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={14} className="text-gray-400" /> {selected.address}, {selected.province}</div>
                {selected.phone && <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" /> <a href={`tel:${selected.phone}`} className="text-[#003DA5] font-medium">{selected.phone}</a></div>}
                {selected.email && <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400" /> {selected.email}</div>}
              </div>
              {selected.latitude && selected.longitude && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#003DA5] text-white text-sm font-semibold rounded-xl"
                >
                  <Navigation size={14} /> Itin&eacute;raire
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Centers list */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Centres de transfusion</h2>
        <div className="space-y-2">
          {centers.map(c => (
            <button key={c.id} onClick={() => setSelected({ ...c, category: "center" })}
              className={cn("w-full text-left bg-white rounded-xl border p-4 transition-all",
                selected?.id === c.id && selected?.category === "center" ? "border-[#003DA5] bg-[#003DA5]/5" : "border-gray-100 hover:border-gray-200"
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

      {/* Hospitals list */}
      {hospitals.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">H&ocirc;pitaux</h2>
          <div className="space-y-2">
            {hospitals.map(h => (
              <button key={h.id} onClick={() => setSelected({ ...h, category: "hospital" })}
                className={cn("w-full text-left bg-white rounded-xl border p-4 transition-all",
                  selected?.id === h.id && selected?.category === "hospital" ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-gray-200"
                )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-green-600">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{h.name}</p>
                      <p className="text-xs text-gray-400">{h.province}</p>
                    </div>
                  </div>
                  {h.phone && <a href={`tel:${h.phone}`} onClick={e => e.stopPropagation()} className="p-2 bg-green-100 rounded-lg"><Phone size={16} className="text-green-600" /></a>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
