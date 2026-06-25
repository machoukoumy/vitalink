"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/donor/badges")
      .then((r) => r.json())
      .then((data) => setBadges(data.badges || data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.length || 10;
  const progressPercent = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Badges</h1>
          <p className="text-gray-500 mt-1">
            {earnedCount}/{totalCount} badges
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progression</span>
          <span className="text-sm font-bold text-[#E30613]">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E30613] to-[#003DA5] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative bg-white rounded-2xl border p-4 text-center transition-all ${
              badge.earned
                ? "border-gray-100 shadow-sm hover:shadow-md"
                : "border-gray-100 opacity-50 grayscale"
            }`}
          >
            {!badge.earned && (
              <div className="absolute top-2 right-2">
                <Lock size={12} className="text-gray-400" />
              </div>
            )}
            <div className="text-3xl md:text-4xl mb-2">{badge.icon}</div>
            <h3 className="text-xs md:text-sm font-bold text-gray-900 leading-tight">
              {badge.name}
            </h3>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1 leading-tight">
              {badge.description}
            </p>
          </div>
        ))}
      </div>

      {badges.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🏅</p>
          <p className="text-sm">
            Aucun badge disponible pour le moment. Continuez vos dons pour
            débloquer des badges !
          </p>
        </div>
      )}
    </div>
  );
}
