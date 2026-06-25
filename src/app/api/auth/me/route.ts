import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { queryOne } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Token invalide" }, { status: 401 });

    const user = await queryOne(
      `SELECT u.id, u.name, u.email, u.role, u.phone, u.avatar, u."centerId", u."hospitalId",
       d.id as "donorId", d.matricule, d."bloodGroup", d."rhFactor", d."lastDonation", d."isEligible", d.gender, d.address, d."nationalId", d.weight, d."dateOfBirth"
       FROM "User" u LEFT JOIN "Donor" d ON d."userId" = u.id WHERE u.id = $1`,
      [payload.userId]
    );

    if (!user) return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    const result: Record<string, unknown> = {
      id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone,
      avatar: user.avatar, centerId: user.centerId, hospitalId: user.hospitalId,
      donor: user.donorId ? {
        id: user.donorId, matricule: user.matricule, bloodGroup: user.bloodGroup,
        rhFactor: user.rhFactor, lastDonation: user.lastDonation, isEligible: user.isEligible,
        gender: user.gender, address: user.address, nationalId: user.nationalId,
        weight: user.weight, dateOfBirth: user.dateOfBirth,
      } : null,
    };

    return new Response(JSON.stringify({ user: result }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "private, max-age=30" },
    });
  } catch (e) {
    console.error("Me error:", e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
