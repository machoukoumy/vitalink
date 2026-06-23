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

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    if (user.role === "DONOR") {
      if (!user.donor) return Response.json({ error: "Profil donneur non trouvé" }, { status: 404 });
      where.donorId = user.donor.id;
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          donor: { include: { user: { select: { name: true, email: true, phone: true } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.appointment.count({ where }),
    ]);

    return Response.json({ appointments, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const body = await request.json();
    let donorId = body.donorId;

    if (user.role === "DONOR") {
      if (!user.donor) return Response.json({ error: "Profil donneur non trouvé" }, { status: 404 });
      donorId = user.donor.id;
    }

    if (!donorId || !body.date || !body.time) {
      return Response.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        donorId,
        date: new Date(body.date),
        time: body.time,
        type: body.type || "DONATION",
        notes: body.notes,
        status: user.role === "DONOR" ? "SCHEDULED" : "CONFIRMED",
      },
      include: { donor: { include: { user: { select: { name: true } } } } },
    });

    return Response.json({ appointment }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
