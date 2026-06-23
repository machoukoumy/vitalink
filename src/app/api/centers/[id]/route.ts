import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const center = await prisma.center.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true, isActive: true } },
        _count: { select: { donors: true, donations: true, bloodStock: true } },
      },
    });

    if (!center) return Response.json({ error: "Centre non trouvé" }, { status: 404 });
    return Response.json({ center });
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

    const center = await prisma.center.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        province: body.province,
        address: body.address,
        phone: body.phone,
        email: body.email,
        isActive: body.isActive,
      },
    });

    return Response.json({ center });
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
    await prisma.center.delete({ where: { id } });
    return Response.json({ message: "Centre supprimé" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
