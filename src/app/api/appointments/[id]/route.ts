import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return Response.json({ error: "Rendez-vous non trouvé" }, { status: 404 });

    if (user.role === "DONOR" && user.donor?.id !== appointment.donorId) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: body.status,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        notes: body.notes,
      },
    });

    return Response.json({ appointment: updated });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    await prisma.appointment.delete({ where: { id } });

    return Response.json({ message: "Rendez-vous supprimé" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
