export async function POST() {
  const response = Response.json({ message: "Déconnexion réussie" });
  response.headers.set(
    "Set-Cookie",
    "auth-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  return response;
}
