import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "DONOR") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (!user.donor) {
      return Response.json({ error: "Profil donneur non trouvé" }, { status: 404 });
    }

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({ where: { id } });
    if (!campaign) return Response.json({ error: "Campagne non trouvée" }, { status: 404 });

    const registration = await prisma.campaignRegistration.create({
      data: {
        campaignId: id,
        donorId: user.donor.id,
      },
    });

    return Response.json({ registration }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "DONOR") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (!user.donor) {
      return Response.json({ error: "Profil donneur non trouvé" }, { status: 404 });
    }

    const { id } = await params;

    await prisma.campaignRegistration.delete({
      where: {
        campaignId_donorId: {
          campaignId: id,
          donorId: user.donor.id,
        },
      },
    });

    return Response.json({ message: "Inscription annulée" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
