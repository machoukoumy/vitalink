// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const donor = user.donor;
    const now = new Date();

    const [
      totalDonations,
      recentDonations,
      upcomingAppointments,
      notifications,
      myResponses,
    ] = await Promise.all([
      prisma.donation.count({ where: { donorId: donor.id } }),
      prisma.donation.findMany({
        where: { donorId: donor.id },
        orderBy: { date: "desc" },
        take: 5,
      }),
      prisma.appointment.findMany({
        where: { donorId: donor.id, date: { gte: now }, status: { in: ["SCHEDULED", "CONFIRMED"] } },
        orderBy: { date: "asc" },
        take: 3,
      }),
      prisma.notification.count({ where: { userId: user.id, isRead: false } }),
      prisma.donorResponse.count({ where: { donorId: donor.id, status: "ACCEPTED" } }),
    ]);

    const matchingUrgentRequests = await prisma.bloodRequest.findMany({
      where: {
        status: { in: ["PENDING", "APPROVED"] },
        isPublic: true,
        bloodGroup: donor.bloodGroup,
        rhFactor: donor.rhFactor,
        urgency: { in: ["CRITICAL", "URGENT"] },
      },
      include: {
        hospital: { select: { name: true, province: true } },
        donorResponses: { where: { donorId: donor.id }, select: { id: true, status: true } },
      },
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      take: 5,
    });

    const lastDonation = donor.lastDonation ? new Date(donor.lastDonation) : null;
    const minInterval = donor.gender === "F" ? 90 : 56;
    let daysUntilEligible = 0;
    let daysSinceLast = null;
    if (lastDonation) {
      daysSinceLast = Math.floor((now.getTime() - lastDonation.getTime()) / 86400000);
      daysUntilEligible = Math.max(0, minInterval - daysSinceLast);
    }

    const totalQuantity = recentDonations.reduce((s: number, d: { quantity: number }) => s + d.quantity, 0);

    return Response.json({
      donor: {
        id: donor.id,
        bloodGroup: donor.bloodGroup,
        rhFactor: donor.rhFactor,
        gender: donor.gender,
        lastDonation: donor.lastDonation,
        isEligible: daysUntilEligible === 0,
        user: { name: user.name, email: user.email },
      },
      stats: {
        totalDonations,
        totalQuantity,
        unreadNotifications: notifications,
        activeResponses: myResponses,
        upcomingAppointments: upcomingAppointments.length,
      },
      eligibility: {
        isEligible: daysUntilEligible === 0,
        daysUntilEligible,
        daysSinceLast,
        minInterval,
        progressPercent: lastDonation ? Math.min(100, Math.round((daysSinceLast! / minInterval) * 100)) : 100,
      },
      recentDonations,
      upcomingAppointments,
      matchingUrgentRequests: matchingUrgentRequests.map(r => ({
        ...r,
        alreadyResponded: r.donorResponses.length > 0,
        myResponse: r.donorResponses[0] || null,
      })),
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
