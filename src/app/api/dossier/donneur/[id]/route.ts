import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;

    // Donneur: peut voir SON propre dossier uniquement
    // Admin, SuperAdmin, Personnel: peuvent voir le dossier de n'importe quel donneur
    // Hôpital: peut voir le dossier d'un donneur (pour les réponses aux demandes)
    if (user.role === "DONOR" && user.donor?.id !== id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const donor = await prisma.donor.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true, createdAt: true } },
        center: { select: { name: true, province: true, phone: true, address: true } },
        donations: { orderBy: { date: "desc" }, include: { bloodStock: true } },
        appointments: { orderBy: { date: "desc" } },
        donorResponses: { orderBy: { createdAt: "desc" }, include: { bloodRequest: { include: { hospital: { select: { name: true } } } } } },
        donorRequests: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!donor) return Response.json({ error: "Donneur non trouvé" }, { status: 404 });

    const now = new Date();
    const lastDon = donor.lastDonation ? new Date(donor.lastDonation) : null;
    const interval = donor.gender === "F" ? 90 : 56;
    const daysSince = lastDon ? Math.floor((now.getTime() - lastDon.getTime()) / 86400000) : null;
    const daysUntil = lastDon ? Math.max(0, interval - (daysSince || 0)) : 0;
    const totalQty = donor.donations.reduce((s, d) => s + d.quantity, 0);

    return Response.json({
      donor,
      stats: {
        totalDonations: donor.donations.length,
        totalQuantity: totalQty,
        totalAppointments: donor.appointments.length,
        totalResponses: donor.donorResponses.length,
        acceptedResponses: donor.donorResponses.filter(r => r.status === "ACCEPTED").length,
        totalRequests: donor.donorRequests?.length || 0,
      },
      eligibility: {
        isEligible: daysUntil === 0,
        daysSinceLast: daysSince,
        daysUntilEligible: daysUntil,
        interval,
        nextDate: lastDon && daysUntil > 0 ? new Date(lastDon.getTime() + interval * 86400000).toISOString() : null,
      },
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
