import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const bloodGroup = searchParams.get("bloodGroup") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (bloodGroup) where.bloodGroup = bloodGroup;
    if (status) where.status = status;

    const [stocks, total] = await Promise.all([
      prisma.bloodStock.findMany({
        where,
        include: {
          donation: { include: { donor: { include: { user: { select: { name: true } } } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bloodStock.count({ where }),
    ]);

    const summary = await prisma.bloodStock.groupBy({
      by: ["bloodGroup", "rhFactor"],
      where: { status: "AVAILABLE" },
      _sum: { quantity: true },
      _count: true,
    });

    return Response.json({ stocks, total, page, totalPages: Math.ceil(total / limit), summary });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status: newStatus } = body;

    const stock = await prisma.bloodStock.update({
      where: { id },
      data: { status: newStatus },
    });

    return Response.json({ stock });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
