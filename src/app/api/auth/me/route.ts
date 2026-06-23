import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Non authentifié" }, { status: 401 });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        centerId: user.centerId,
        hospitalId: user.hospitalId,
        donor: user.donor,
      },
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
