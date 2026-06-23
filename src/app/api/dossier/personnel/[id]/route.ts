import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;

    // SuperAdmin et Admin: peuvent voir le dossier de n'importe quel utilisateur
    // Personnel: peut voir uniquement SON propre dossier
    // Hôpital: peut voir uniquement SON propre dossier
    // Donneur: pas d'accès aux dossiers personnel/admin/hôpital
    if (user.role === "DONOR") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }
    if (user.role === "PERSONNEL" && user.id !== id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }
    if (user.role === "HOSPITAL" && user.id !== id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { center: { select: { name: true, province: true, phone: true, address: true } } },
    });

    if (!targetUser) return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    const logs = await prisma.activityLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const donationsRegistered = await prisma.donation.count({ where: { collectedBy: targetUser.name } });

    return Response.json({
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        role: targetUser.role,
        isActive: targetUser.isActive,
        createdAt: targetUser.createdAt,
        center: targetUser.center,
      },
      stats: { donationsRegistered, totalLogs: logs.length },
      activityLogs: logs,
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
