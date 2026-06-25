import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: { isActive: true },
      select: { id: true, name: true, type: true, province: true, address: true, phone: true, email: true, latitude: true, longitude: true },
      orderBy: { name: "asc" },
    });
    return Response.json({ hospitals });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
