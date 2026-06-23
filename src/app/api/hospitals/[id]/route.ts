import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, role: true, isActive: true } },
        bloodRequests: { orderBy: { createdAt: "desc" }, take: 20 },
        _count: { select: { bloodRequests: true } },
      },
    });

    if (!hospital) return Response.json({ error: "Hôpital non trouvé" }, { status: 404 });
    return Response.json({ hospital });
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

    if (body.createUser) {
      const hashedPassword = await hashPassword(body.createUser.password);
      await prisma.user.create({
        data: {
          email: body.createUser.email,
          password: hashedPassword,
          name: body.createUser.name,
          phone: body.createUser.phone,
          role: "HOSPITAL",
          hospitalId: id,
        },
      });
      return Response.json({ message: "Utilisateur hôpital créé" });
    }

    const hospital = await prisma.hospital.update({
      where: { id },
      data: { name: body.name, province: body.province, address: body.address, phone: body.phone, email: body.email, type: body.type, isActive: body.isActive },
    });

    return Response.json({ hospital });
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
    await prisma.hospital.delete({ where: { id } });
    return Response.json({ message: "Hôpital supprimé" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
