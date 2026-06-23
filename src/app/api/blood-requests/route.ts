import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const urgency = searchParams.get("urgency") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;

    if (user.role === "HOSPITAL") {
      where.hospitalId = user.hospitalId;
    }

    const [requests, total] = await Promise.all([
      prisma.bloodRequest.findMany({
        where,
        include: { hospital: { select: { id: true, name: true, province: true, phone: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      }),
      prisma.bloodRequest.count({ where }),
    ]);

    return Response.json({ requests, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN", "HOSPITAL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    let hospitalId = body.hospitalId;

    if (user.role === "HOSPITAL") {
      hospitalId = user.hospitalId;
    }

    if (!hospitalId || !body.bloodGroup || !body.rhFactor || !body.quantity) {
      return Response.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const bloodRequest = await prisma.bloodRequest.create({
      data: {
        hospitalId,
        bloodGroup: body.bloodGroup,
        rhFactor: body.rhFactor,
        quantity: parseFloat(body.quantity),
        urgency: body.urgency || "NORMAL",
        patientInfo: body.patientInfo,
        reason: body.reason,
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        isPublic: body.isPublic || false,
        notes: body.notes,
      },
      include: { hospital: { select: { name: true } } },
    });

    return Response.json({ request: bloodRequest }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
