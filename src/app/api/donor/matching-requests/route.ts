import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* Haversine distance in km */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MAX_DISTANCE_KM = 50;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const donor = user.donor;

    const matchingRequests = await prisma.bloodRequest.findMany({
      where: {
        status: { in: ["PENDING", "APPROVED"] },
        isPublic: true,
        OR: [
          { bloodGroup: donor.bloodGroup, rhFactor: donor.rhFactor },
          { bloodGroup: "O", rhFactor: "-" },
          ...(donor.bloodGroup === "O" ? [{ bloodGroup: { in: ["A", "B", "AB", "O"] } }] : []),
        ],
      },
      include: {
        hospital: { select: { name: true, province: true, phone: true, latitude: true, longitude: true } },
        donorResponses: {
          where: { donorId: donor.id },
          select: { id: true, status: true },
        },
      },
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
    });

    /* Filter by distance if donor has GPS coordinates */
    const donorLat = donor.latitude;
    const donorLon = donor.longitude;
    const hasGps = donorLat != null && donorLon != null;

    const filtered = hasGps
      ? matchingRequests.filter(r => {
          const hLat = r.hospital.latitude;
          const hLon = r.hospital.longitude;
          if (hLat == null || hLon == null) return true; /* No GPS on hospital -> include anyway */
          return distanceKm(donorLat!, donorLon!, hLat, hLon) <= MAX_DISTANCE_KM;
        })
      : matchingRequests;

    const requests = filtered.map(r => ({
      ...r,
      alreadyResponded: r.donorResponses.length > 0,
      myResponse: r.donorResponses[0] || null,
    }));

    return Response.json({ requests });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
