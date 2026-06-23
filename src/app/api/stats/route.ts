import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalDonors,
      activeDonors,
      totalDonations,
      recentDonations,
      totalStock,
      availableStock,
      pendingAppointments,
      todayAppointments,
    ] = await Promise.all([
      prisma.donor.count(),
      prisma.donor.count({ where: { isEligible: true } }),
      prisma.donation.count(),
      prisma.donation.count({ where: { date: { gte: thirtyDaysAgo } } }),
      prisma.bloodStock.count(),
      prisma.bloodStock.count({ where: { status: "AVAILABLE" } }),
      prisma.appointment.count({ where: { status: "SCHEDULED" } }),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          },
        },
      }),
    ]);

    const stockByGroup = await prisma.bloodStock.groupBy({
      by: ["bloodGroup", "rhFactor"],
      where: { status: "AVAILABLE" },
      _sum: { quantity: true },
      _count: true,
    });

    const donationsByMonth = await prisma.donation.groupBy({
      by: ["bloodGroup"],
      where: { date: { gte: thirtyDaysAgo } },
      _count: true,
      _sum: { quantity: true },
    });

    const expiringStock = await prisma.bloodStock.count({
      where: {
        status: "AVAILABLE",
        expiresAt: {
          lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          gte: now,
        },
      },
    });

    const personnelCount = await prisma.user.count({ where: { role: "PERSONNEL" } });

    return Response.json({
      totalDonors,
      activeDonors,
      totalDonations,
      recentDonations,
      totalStock,
      availableStock,
      pendingAppointments,
      todayAppointments,
      stockByGroup,
      donationsByMonth,
      expiringStock,
      personnelCount,
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
