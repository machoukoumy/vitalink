import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Demande non trouvée" }, { status: 404 });

    if (user.role === "HOSPITAL" && existing.hospitalId !== user.hospitalId) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const data: Record<string, unknown> = {};
    if (body.status) data.status = body.status;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.isPublic !== undefined) data.isPublic = body.isPublic;
    if (body.status === "FULFILLED") {
      data.fulfilledAt = new Date();
      data.fulfilledBy = user.name;
    }

    const updated = await prisma.bloodRequest.update({ where: { id }, data });
    return Response.json({ request: updated });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    await prisma.bloodRequest.delete({ where: { id } });
    return Response.json({ message: "Demande supprimée" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
