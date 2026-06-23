import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.bloodRequest.findMany({
      where: { isPublic: true, status: { in: ["PENDING", "APPROVED"] } },
      include: { hospital: { select: { name: true, province: true, phone: true } } },
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    return Response.json({ requests });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
