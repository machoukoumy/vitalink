import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Token invalide" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true, name: true, email: true, role: true, phone: true, avatar: true,
        centerId: true, hospitalId: true,
        donor: { select: { id: true, matricule: true, bloodGroup: true, rhFactor: true, lastDonation: true, isEligible: true, gender: true, address: true, nationalId: true, weight: true, dateOfBirth: true } },
      },
    });

    if (!user) return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
