import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return Response.json({ error: "Email requis" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ message: "Si cet email existe, un code de réinitialisation a été envoyé." });
    }

    const code = randomBytes(3).toString("hex").toUpperCase();

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Code de réinitialisation",
        message: `Votre code de réinitialisation est : ${code}. Ce code expire dans 15 minutes.`,
        type: "ALERT",
      },
    });

    await prisma.activityLog.create({
      data: { userId: user.id, action: "RESET_REQUEST", details: code },
    });

    return Response.json({ message: "Si cet email existe, un code de réinitialisation a été envoyé." });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
