import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ donationId: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { donationId } = await params;

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donor: {
          include: {
            user: { select: { name: true } },
          },
        },
        center: { select: { name: true } },
      },
    });

    if (!donation) return Response.json({ error: "Donation non trouvée" }, { status: 404 });

    if (user.role === "DONOR") {
      if (!user.donor || user.donor.id !== donation.donorId) {
        return Response.json({ error: "Non autorisé" }, { status: 403 });
      }
    } else if (!["ADMIN", "PERSONNEL", "SUPER_ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const certificate = {
      donorName: donation.donor.user.name,
      matricule: donation.donor.matricule,
      bloodGroup: `${donation.bloodGroup}${donation.rhFactor}`,
      donationDate: donation.date,
      quantity: donation.quantity,
      centerName: donation.center?.name || "Non spécifié",
      donationId: donation.id,
      status: donation.status,
    };

    return Response.json({ certificate });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
