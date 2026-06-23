import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;

    // SuperAdmin et Admin: peuvent voir le dossier de n'importe quel hôpital
    // Hôpital: peut voir uniquement SON propre dossier
    // Personnel et Donneur: pas d'accès
    if (user.role === "HOSPITAL" && user.hospitalId !== id) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }
    if (user.role === "DONOR" || user.role === "PERSONNEL") {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
        bloodRequests: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { donorResponses: true } } },
        },
      },
    });

    if (!hospital) return Response.json({ error: "Hôpital non trouvé" }, { status: 404 });

    const totalResponses = await prisma.donorResponse.count({
      where: { bloodRequest: { hospitalId: id } },
    });
    const acceptedResponses = await prisma.donorResponse.count({
      where: { bloodRequest: { hospitalId: id }, status: "ACCEPTED" },
    });

    return Response.json({
      hospital,
      stats: {
        totalRequests: hospital.bloodRequests.length,
        pendingRequests: hospital.bloodRequests.filter(r => r.status === "PENDING").length,
        fulfilledRequests: hospital.bloodRequests.filter(r => r.status === "FULFILLED").length,
        totalQuantityRequested: hospital.bloodRequests.reduce((s, r) => s + r.quantity, 0),
        totalUsers: hospital.users.length,
        totalDonorResponses: totalResponses,
        acceptedDonorResponses: acceptedResponses,
      },
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
