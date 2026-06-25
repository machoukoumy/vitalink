import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const where: Record<string, unknown> = {};

    if (user.role === "DONOR") {
      where.isActive = true;
      where.status = { in: ["PLANNED", "ONGOING"] };
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        center: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "desc" },
    });

    return Response.json({ campaigns });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, startDate, endDate, location, centerId, targetBloodGroups, goalQuantity } = body;

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        centerId,
        targetBloodGroups,
        goalQuantity: goalQuantity ? parseFloat(goalQuantity) : null,
        createdBy: user.id,
      },
      include: {
        center: { select: { name: true } },
      },
    });

    return Response.json({ campaign }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
