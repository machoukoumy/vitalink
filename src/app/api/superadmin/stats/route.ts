import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const [
      totalCenters, totalHospitals, totalUsers, totalDonors,
      totalDonations, totalStock, availableStock,
      totalRequests, pendingRequests, criticalRequests,
      totalAdmins, totalPersonnel, totalHospitalUsers,
    ] = await Promise.all([
      prisma.center.count(),
      prisma.hospital.count(),
      prisma.user.count(),
      prisma.donor.count(),
      prisma.donation.count(),
      prisma.bloodStock.count(),
      prisma.bloodStock.count({ where: { status: "AVAILABLE" } }),
      prisma.bloodRequest.count(),
      prisma.bloodRequest.count({ where: { status: "PENDING" } }),
      prisma.bloodRequest.count({ where: { urgency: "CRITICAL", status: { in: ["PENDING", "APPROVED"] } } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "PERSONNEL" } }),
      prisma.user.count({ where: { role: "HOSPITAL" } }),
    ]);

    const stockByGroup = await prisma.bloodStock.groupBy({
      by: ["bloodGroup", "rhFactor"],
      where: { status: "AVAILABLE" },
      _sum: { quantity: true },
      _count: true,
    });

    const centerStats = await prisma.center.findMany({
      select: {
        id: true, name: true, province: true, type: true,
        _count: { select: { donors: true, donations: true, bloodStock: true } },
      },
    });

    const recentRequests = await prisma.bloodRequest.findMany({
      where: { status: { in: ["PENDING", "APPROVED"] } },
      include: { hospital: { select: { name: true, province: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return Response.json({
      totalCenters, totalHospitals, totalUsers, totalDonors,
      totalDonations, totalStock, availableStock,
      totalRequests, pendingRequests, criticalRequests,
      totalAdmins, totalPersonnel, totalHospitalUsers,
      stockByGroup, centerStats, recentRequests,
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
