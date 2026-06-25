"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix default marker icons for webpack/next */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* Custom colored markers */
function createColoredIcon(color: string) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

const redIcon = createColoredIcon("red");
const blueIcon = createColoredIcon("blue");
const greenIcon = createColoredIcon("green");

export interface MapLocation {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  category: "center" | "hospital";
}

interface LeafletMapProps {
  locations: MapLocation[];
  onSelect?: (loc: MapLocation) => void;
}

export default function LeafletMap({ locations, onSelect }: LeafletMapProps) {
  const validLocations = locations.filter(l => l.latitude && l.longitude);

  return (
    <MapContainer
      center={[12.1, 15.05]}
      zoom={6}
      style={{ height: "100%", width: "100%", minHeight: "400px", borderRadius: "16px" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validLocations.map((loc) => {
        const icon =
          loc.category === "hospital"
            ? greenIcon
            : loc.type === "HEADQUARTERS"
            ? redIcon
            : blueIcon;

        return (
          <Marker
            key={`${loc.category}-${loc.id}`}
            position={[loc.latitude!, loc.longitude!]}
            icon={icon}
            eventHandlers={{
              click: () => onSelect?.(loc),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{loc.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{loc.province}</p>
                <p className="text-xs text-gray-600 mb-2">{loc.address}</p>
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="text-xs text-blue-600 font-medium block mb-2">
                    {loc.phone}
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 bg-[#003DA5] text-white text-xs font-semibold rounded-lg"
                >
                  Itin&eacute;raire
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
