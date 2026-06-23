import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const donation = await prisma.donation.update({
      where: { id },
      data: { status: body.status, notes: body.notes },
    });

    if (body.status === "STORED") {
      await prisma.bloodStock.updateMany({
        where: { donationId: id },
        data: { status: "AVAILABLE" },
      });
    }
    if (body.status === "REJECTED") {
      await prisma.bloodStock.updateMany({
        where: { donationId: id },
        data: { status: "EXPIRED" },
      });
    }

    return Response.json({ donation });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
