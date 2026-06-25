import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();
    if (!email || !code || !newPassword) return Response.json({ error: "Tous les champs sont requis" }, { status: 400 });
    if (newPassword.length < 6) return Response.json({ error: "Minimum 6 caractères" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Response.json({ error: "Email non trouvé" }, { status: 404 });

    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);
    const log = await prisma.activityLog.findFirst({
      where: { userId: user.id, action: "RESET_REQUEST", details: code.toUpperCase(), createdAt: { gte: fifteenMinAgo } },
      orderBy: { createdAt: "desc" },
    });

    if (!log) return Response.json({ error: "Code invalide ou expiré" }, { status: 400 });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    await prisma.activityLog.deleteMany({ where: { userId: user.id, action: "RESET_REQUEST" } });

    return Response.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
