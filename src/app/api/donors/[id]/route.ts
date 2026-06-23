import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const donor = await prisma.donor.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, isActive: true } },
        donations: { orderBy: { date: "desc" }, take: 10 },
        appointments: { orderBy: { date: "desc" }, take: 10 },
      },
    });

    if (!donor) return Response.json({ error: "Donneur non trouvé" }, { status: 404 });

    if (user.role === "DONOR" && donor.userId !== user.id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    return Response.json({ donor });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const donor = await prisma.donor.update({
      where: { id },
      data: {
        bloodGroup: body.bloodGroup,
        rhFactor: body.rhFactor,
        address: body.address,
        weight: body.weight ? parseFloat(body.weight) : undefined,
        isEligible: body.isEligible,
        medicalNotes: body.medicalNotes,
      },
      include: { user: { select: { id: true, name: true, email: true, phone: true } } },
    });

    return Response.json({ donor });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
