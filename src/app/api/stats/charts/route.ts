import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = start.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

      const [donations, requests, newDonors] = await Promise.all([
        prisma.donation.count({ where: { date: { gte: start, lte: end } } }),
        prisma.bloodRequest.count({ where: { createdAt: { gte: start, lte: end } } }),
        prisma.donor.count({ where: { createdAt: { gte: start, lte: end } } }),
      ]);

      months.push({ month: label, donations, requests, newDonors });
    }

    const stockByGroup = await prisma.bloodStock.groupBy({
      by: ["bloodGroup", "rhFactor"],
      where: { status: "AVAILABLE" },
      _sum: { quantity: true },
      _count: true,
    });

    const donationsByGroup = await prisma.donation.groupBy({
      by: ["bloodGroup"],
      _count: true,
      _sum: { quantity: true },
    });

    const requestsByUrgency = await prisma.bloodRequest.groupBy({
      by: ["urgency"],
      _count: true,
    });

    const requestsByStatus = await prisma.bloodRequest.groupBy({
      by: ["status"],
      _count: true,
    });

    return Response.json({ months, stockByGroup, donationsByGroup, requestsByUrgency, requestsByStatus });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
