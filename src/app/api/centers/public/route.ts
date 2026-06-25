import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const centers = await prisma.center.findMany({
      where: { isActive: true },
      select: { id: true, name: true, type: true, province: true, address: true, phone: true, email: true },
      orderBy: { type: "asc" },
    });
    return Response.json({ centers });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
