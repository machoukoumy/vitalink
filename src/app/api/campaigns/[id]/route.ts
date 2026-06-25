import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        center: { select: { name: true } },
        registrations: {
          include: {
            donor: {
              include: { user: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!campaign) return Response.json({ error: "Campagne non trouvée" }, { status: 404 });

    return Response.json({ campaign });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.collectedQuantity !== undefined) data.collectedQuantity = parseFloat(body.collectedQuantity);
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) data.endDate = new Date(body.endDate);
    if (body.location !== undefined) data.location = body.location;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const campaign = await prisma.campaign.update({
      where: { id },
      data,
      include: {
        center: { select: { name: true } },
      },
    });

    return Response.json({ campaign });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.campaign.delete({ where: { id } });

    return Response.json({ message: "Campagne supprimée" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
