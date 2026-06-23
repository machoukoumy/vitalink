export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getBloodGroupLabel(group: string, rh: string): string {
  return `${group}${rh}`;
}

export const BLOOD_GROUPS = ["A", "B", "AB", "O"] as const;
export const RH_FACTORS = ["+", "-"] as const;

export const DONATION_STATUS = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  COLLECTED: "Collecté",
  TESTED: "Testé",
  STORED: "Stocké",
  REJECTED: "Rejeté",
} as const;

export const STOCK_STATUS = {
  AVAILABLE: "Disponible",
  RESERVED: "Réservé",
  USED: "Utilisé",
  EXPIRED: "Expiré",
  QUARANTINE: "En quarantaine",
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: "Planifié",
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  NO_SHOW: "Absent",
} as const;

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PERSONNEL: "PERSONNEL",
  HOSPITAL: "HOSPITAL",
  DONOR: "DONOR",
} as const;

export const REQUEST_URGENCY = {
  NORMAL: "Normal",
  URGENT: "Urgent",
  CRITICAL: "Critique",
} as const;

export const REQUEST_STATUS = {
  PENDING: "En attente",
  APPROVED: "Approuvée",
  FULFILLED: "Satisfaite",
  PARTIALLY_FULFILLED: "Partiellement satisfaite",
  REJECTED: "Rejetée",
  CANCELLED: "Annulée",
} as const;

export const CENTER_TYPES = {
  HEADQUARTERS: "Siège",
  PROVINCIAL: "Provincial",
} as const;

export const HOSPITAL_TYPES = {
  PUBLIC: "Public",
  PRIVATE: "Privé",
  MILITARY: "Militaire",
  UNIVERSITY: "Universitaire",
} as const;

export const PROVINCES = [
  "N'Djaména", "Batha", "Borkou", "Chari-Baguirmi", "Ennedi-Est",
  "Ennedi-Ouest", "Guéra", "Hadjer-Lamis", "Kanem", "Lac",
  "Logone Occidental", "Logone Oriental", "Mandoul", "Mayo-Kebbi Est",
  "Mayo-Kebbi Ouest", "Moyen-Chari", "Ouaddaï", "Salamat",
  "Sila", "Tandjilé", "Tibesti", "Wadi Fira",
] as const;

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function daysUntilExpiry(expiresAt: Date | string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isEligibleForDonation(lastDonation: Date | string | null): boolean {
  if (!lastDonation) return true;
  const last = new Date(lastDonation);
  const now = new Date();
  const diffDays = Math.ceil((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 56;
}
