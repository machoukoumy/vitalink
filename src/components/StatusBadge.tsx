"use client";

import { cn } from "@/lib/utils";

const statusConfig: Record<string, { bg: string; label: string }> = {
  PENDING: { bg: "bg-amber-100 text-amber-800", label: "En attente" },
  APPROVED: { bg: "bg-blue-100 text-blue-800", label: "Approuvé" },
  COLLECTED: { bg: "bg-indigo-100 text-indigo-800", label: "Collecté" },
  TESTED: { bg: "bg-purple-100 text-purple-800", label: "Testé" },
  STORED: { bg: "bg-green-100 text-green-800", label: "Stocké" },
  REJECTED: { bg: "bg-red-100 text-red-800", label: "Rejeté" },
  AVAILABLE: { bg: "bg-green-100 text-green-800", label: "Disponible" },
  RESERVED: { bg: "bg-blue-100 text-blue-800", label: "Réservé" },
  USED: { bg: "bg-gray-100 text-gray-600", label: "Utilisé" },
  EXPIRED: { bg: "bg-red-100 text-red-800", label: "Expiré" },
  QUARANTINE: { bg: "bg-orange-100 text-orange-800", label: "Quarantaine" },
  SCHEDULED: { bg: "bg-blue-100 text-blue-800", label: "Planifié" },
  CONFIRMED: { bg: "bg-green-100 text-green-800", label: "Confirmé" },
  COMPLETED: { bg: "bg-gray-100 text-gray-600", label: "Terminé" },
  CANCELLED: { bg: "bg-red-100 text-red-800", label: "Annulé" },
  NO_SHOW: { bg: "bg-amber-100 text-amber-800", label: "Absent" },
  FULFILLED: { bg: "bg-green-100 text-green-800", label: "Satisfaite" },
  PARTIALLY_FULFILLED: { bg: "bg-teal-100 text-teal-800", label: "Partielle" },
  CRITICAL: { bg: "bg-red-100 text-red-800", label: "Critique" },
  URGENT: { bg: "bg-orange-100 text-orange-800", label: "Urgent" },
  NORMAL: { bg: "bg-blue-100 text-blue-800", label: "Normal" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { bg: "bg-gray-100 text-gray-600", label: status };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide", config.bg)}>
      {config.label}
    </span>
  );
}
