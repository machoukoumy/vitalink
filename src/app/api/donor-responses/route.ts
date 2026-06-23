import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const searchParams = request.nextUrl.searchParams;
    const donorId = searchParams.get("donorId") || "";
    const bloodRequestId = searchParams.get("bloodRequestId") || "";

    const where: Record<string, unknown> = {};

    if (user.role === "DONOR" && user.donor) {
      where.donorId = user.donor.id;
    } else if (user.role === "HOSPITAL" && user.hospitalId) {
      // For hospital users, return responses for their hospital's blood requests
      where.bloodRequest = { hospitalId: user.hospitalId };
    } else if (donorId) {
      where.donorId = donorId;
    }
    if (bloodRequestId) where.bloodRequestId = bloodRequestId;

    const responses = await prisma.donorResponse.findMany({
      where,
      include: {
        donor: { include: { user: { select: { name: true, phone: true, email: true } } } },
        bloodRequest: { include: { hospital: { select: { name: true, province: true, phone: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ responses });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const body = await request.json();
    const { bloodRequestId, status, message, availableDate } = body;

    if (!bloodRequestId) return Response.json({ error: "ID demande requis" }, { status: 400 });

    const existing = await prisma.donorResponse.findUnique({
      where: { donorId_bloodRequestId: { donorId: user.donor.id, bloodRequestId } },
    });

    if (existing) {
      const updated = await prisma.donorResponse.update({
        where: { id: existing.id },
        data: { status: status || existing.status, message, availableDate },
      });
      return Response.json({ response: updated });
    }

    const donorResponse = await prisma.donorResponse.create({
      data: {
        donorId: user.donor.id,
        bloodRequestId,
        status: status || "ACCEPTED",
        message,
        availableDate,
      },
    });

    return Response.json({ response: donorResponse }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
