import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    const message = await prisma.message.update({
      where: { id },
      data: {
        isRead: body.isRead ?? true,
      },
    });

    return Response.json({ message });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
