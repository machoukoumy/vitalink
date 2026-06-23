import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.donorResponse.update({
      where: { id },
      data: { status: body.status, message: body.message },
    });

    return Response.json({ response: updated });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
