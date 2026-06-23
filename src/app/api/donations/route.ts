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
    const donorId = searchParams.get("donorId") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    if (user.role === "DONOR") {
      if (!user.donor) return Response.json({ error: "Profil donneur non trouvé" }, { status: 404 });
      where.donorId = user.donor.id;
    } else if (donorId) {
      where.donorId = donorId;
    }

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          donor: { include: { user: { select: { name: true, email: true } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.donation.count({ where }),
    ]);

    return Response.json({ donations, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const { donorId, quantity, hemoglobin, bloodPressure, temperature, notes } = body;

    const donor = await prisma.donor.findUnique({ where: { id: donorId } });
    if (!donor) return Response.json({ error: "Donneur non trouvé" }, { status: 404 });

    const donation = await prisma.donation.create({
      data: {
        donorId,
        bloodGroup: donor.bloodGroup,
        rhFactor: donor.rhFactor,
        quantity: quantity || 450,
        hemoglobin: hemoglobin ? parseFloat(hemoglobin) : null,
        bloodPressure,
        temperature: temperature ? parseFloat(temperature) : null,
        notes,
        collectedBy: user.name,
        status: "COLLECTED",
      },
      include: { donor: { include: { user: { select: { name: true } } } } },
    });

    await prisma.donor.update({
      where: { id: donorId },
      data: { lastDonation: new Date() },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 42);

    await prisma.bloodStock.create({
      data: {
        donationId: donation.id,
        bloodGroup: donor.bloodGroup,
        rhFactor: donor.rhFactor,
        quantity: quantity || 450,
        status: "QUARANTINE",
        expiresAt,
      },
    });

    return Response.json({ donation }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
