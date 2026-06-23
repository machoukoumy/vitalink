import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const donor = user.donor;

    const matchingRequests = await prisma.bloodRequest.findMany({
      where: {
        status: { in: ["PENDING", "APPROVED"] },
        isPublic: true,
        OR: [
          { bloodGroup: donor.bloodGroup, rhFactor: donor.rhFactor },
          { bloodGroup: "O", rhFactor: "-" },
          ...(donor.bloodGroup === "O" ? [{ bloodGroup: { in: ["A", "B", "AB", "O"] } }] : []),
        ],
      },
      include: {
        hospital: { select: { name: true, province: true, phone: true } },
        donorResponses: {
          where: { donorId: donor.id },
          select: { id: true, status: true },
        },
      },
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
    });

    const requests = matchingRequests.map(r => ({
      ...r,
      alreadyResponded: r.donorResponses.length > 0,
      myResponse: r.donorResponses[0] || null,
    }));

    return Response.json({ requests });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
