import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "PERSONNEL", "SUPER_ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorise" }, { status: 403 });
    }

    const now = new Date();
    const fiftyNineDaysAgo = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Count donors who are now eligible again:
    // - Men: 56+ days since last donation
    // - Women: 90+ days since last donation
    // - Or never donated (lastDonation is null)
    const eligibleCount = await prisma.donor.count({
      where: {
        OR: [
          { lastDonation: null },
          {
            gender: "M",
            lastDonation: { lte: fiftyNineDaysAgo },
          },
          {
            gender: "F",
            lastDonation: { lte: ninetyDaysAgo },
          },
        ],
      },
    });

    return Response.json({ eligibleCount });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
