import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    let where = {};

    if (user.role === "DONOR" && user.donor) {
      where = { donorId: user.donor.id, status: "SIGNED" };
    } else if (user.role === "PERSONNEL") {
      where = { createdBy: user.id };
    } else if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      // admin voit tout
    } else {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const certificates = await prisma.certificate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ certificates });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["PERSONNEL", "ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();

    const cert = await prisma.certificate.create({
      data: {
        donorId: body.donorId,
        donationId: body.donationId || null,
        donorName: body.donorName,
        donorMatricule: body.donorMatricule,
        bloodGroup: body.bloodGroup,
        rhFactor: body.rhFactor,
        donationDate: body.donationDate ? new Date(body.donationDate) : null,
        quantity: body.quantity ? parseFloat(body.quantity) : null,
        centerName: body.centerName || null,
        status: "PENDING",
        createdBy: user.id,
        createdByName: user.name,
      },
    });

    return Response.json({ certificate: cert }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
