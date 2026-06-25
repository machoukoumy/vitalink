import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const q = request.nextUrl.searchParams.get("q") || "";
    if (q.length < 2) return Response.json({ results: [] });

    const [donors, users, hospitals, centers] = await Promise.all([
      prisma.donor.findMany({
        where: { OR: [{ matricule: { contains: q } }, { nationalId: { contains: q } }, { user: { name: { contains: q } } }, { user: { phone: { contains: q } } }] },
        include: { user: { select: { name: true, phone: true } } },
        take: 5,
      }),
      ["SUPER_ADMIN", "ADMIN", "PERSONNEL"].includes(user.role) ? prisma.user.findMany({
        where: { OR: [{ name: { contains: q } }, { email: { contains: q } }] },
        select: { id: true, name: true, email: true, role: true },
        take: 5,
      }) : Promise.resolve([]),
      ["SUPER_ADMIN", "ADMIN"].includes(user.role) ? prisma.hospital.findMany({
        where: { OR: [{ name: { contains: q } }, { province: { contains: q } }] },
        select: { id: true, name: true, province: true },
        take: 3,
      }) : Promise.resolve([]),
      ["SUPER_ADMIN", "ADMIN"].includes(user.role) ? prisma.center.findMany({
        where: { OR: [{ name: { contains: q } }, { province: { contains: q } }] },
        select: { id: true, name: true, province: true },
        take: 3,
      }) : Promise.resolve([]),
    ]);

    return Response.json({
      results: [
        ...donors.map(d => ({ type: "donor", id: d.id, label: d.user.name, sub: `${d.matricule} · ${d.bloodGroup}${d.rhFactor}` })),
        ...users.map(u => ({ type: "user", id: u.id, label: u.name, sub: `${u.role} · ${u.email}` })),
        ...hospitals.map(h => ({ type: "hospital", id: h.id, label: h.name, sub: h.province })),
        ...centers.map(c => ({ type: "center", id: c.id, label: c.name, sub: c.province })),
      ],
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
