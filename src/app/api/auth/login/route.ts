import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return Response.json({ error: "Email et mot de passe requis" }, { status: 400 });

    const rows = await query('SELECT id, email, password, name, role, "isActive" FROM "User" WHERE email = $1 LIMIT 1', [email]);
    const user = rows[0];
    if (!user) return Response.json({ error: "Identifiants invalides" }, { status: 401 });
    if (!user.isActive) return Response.json({ error: "Compte désactivé" }, { status: 403 });

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return Response.json({ error: "Identifiants invalides" }, { status: 401 });

    const token = await generateToken({ userId: user.id, email: user.email, role: user.role, name: user.name });

    const response = Response.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    response.headers.set("Set-Cookie", `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
    return response;
  } catch (e) {
    console.error("Login error:", e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
