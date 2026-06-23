import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN", "PERSONNEL"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const q = request.nextUrl.searchParams.get("q") || "";
    if (q.length < 2) return Response.json({ donors: [] });

    const donors = await prisma.donor.findMany({
      where: {
        OR: [
          { matricule: { contains: q } },
          { nationalId: { contains: q } },
          { user: { phone: { contains: q } } },
          { user: { name: { contains: q } } },
        ],
      },
      include: {
        user: { select: { name: true, phone: true, email: true, avatar: true } },
      },
      take: 10,
    });

    return Response.json({ donors });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
