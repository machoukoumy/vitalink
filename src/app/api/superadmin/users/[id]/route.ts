import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.role !== undefined) data.role = body.role;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.centerId !== undefined) data.centerId = body.centerId || null;
    if (body.hospitalId !== undefined) data.hospitalId = body.hospitalId || null;
    if (body.password) data.password = await hashPassword(body.password);

    const updated = await prisma.user.update({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true },
    data,
    });

    return Response.json({ user: updated });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;

    if (id === user.id) {
      return Response.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return Response.json({ message: "Utilisateur supprimé" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
