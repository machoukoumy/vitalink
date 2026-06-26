import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    if (body.action === "sign") {
      if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        return Response.json({ error: "Seul l'admin peut signer" }, { status: 403 });
      }

      const cert = await prisma.certificate.update({
        where: { id },
        data: {
          status: "SIGNED",
          signedBy: user.id,
          signedByName: user.name,
          signedAt: new Date(),
        },
      });

      // Notifier le donneur
      await prisma.notification.create({
        data: {
          userId: cert.donorId,
          title: "Certificat de don signé",
          message: `Votre certificat de don a été signé par ${user.name}. Vous pouvez le consulter dans votre espace.`,
          type: "INFO",
        },
      }).catch(() => {});

      return Response.json({ certificate: cert });
    }

    if (body.action === "reject") {
      if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
        return Response.json({ error: "Seul l'admin peut rejeter" }, { status: 403 });
      }

      const cert = await prisma.certificate.update({
        where: { id },
        data: { status: "REJECTED", rejectedReason: body.reason || null },
      });

      return Response.json({ certificate: cert });
    }

    return Response.json({ error: "Action inconnue" }, { status: 400 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
