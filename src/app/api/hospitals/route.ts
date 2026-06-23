import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const hospitals = await prisma.hospital.findMany({
      include: {
        _count: { select: { users: true, bloodRequests: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ hospitals });
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
    const { name, province, address, phone, email, type } = body;

    if (!name || !province || !address) {
      return Response.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const hospital = await prisma.hospital.create({
      data: { name, province, address, phone, email, type: type || "PUBLIC" },
    });

    return Response.json({ hospital }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
