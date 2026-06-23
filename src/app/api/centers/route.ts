import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const centers = await prisma.center.findMany({
      include: {
        _count: { select: { users: true, donors: true, donations: true, bloodStock: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ centers });
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
    const { name, type, province, address, phone, email } = body;

    if (!name || !province || !address) {
      return Response.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const center = await prisma.center.create({
      data: { name, type: type || "PROVINCIAL", province, address, phone, email },
    });

    return Response.json({ center }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
