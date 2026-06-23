import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    if (!user) {
      where.isPublic = true;
      where.status = { in: ["PENDING", "APPROVED"] };
    } else if (user.role === "DONOR" && user.donor) {
      where.donorId = user.donor.id;
    }

    const [requests, total] = await Promise.all([
      prisma.donorRequest.findMany({
        where,
        include: { donor: { include: { user: { select: { name: true, phone: true } } } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      }),
      prisma.donorRequest.count({ where }),
    ]);

    return Response.json({ requests, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const body = await request.json();
    const dr = await prisma.donorRequest.create({
      data: {
        donorId: user.donor.id,
        bloodGroup: body.bloodGroup || user.donor.bloodGroup,
        rhFactor: body.rhFactor || user.donor.rhFactor,
        quantity: parseFloat(body.quantity),
        urgency: body.urgency || "NORMAL",
        reason: body.reason,
        city: body.city,
        nearestCenter: body.nearestCenter,
        contactPhone: body.contactPhone || user.phone,
        notes: body.notes,
        isPublic: body.isPublic !== false,
      },
    });

    return Response.json({ request: dr }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
