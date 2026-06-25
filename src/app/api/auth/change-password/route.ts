import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ error: "Les deux mots de passe sont requis" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return Response.json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!fullUser) return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    const valid = await verifyPassword(currentPassword, fullUser.password);
    if (!valid) return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return Response.json({ message: "Mot de passe modifié avec succès" });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
