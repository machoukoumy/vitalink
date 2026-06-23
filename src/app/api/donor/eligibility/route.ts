import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const donor = await prisma.donor.findUnique({
      where: { id: user.donor.id },
      include: {
        donations: { orderBy: { date: "desc" }, take: 5 },
        _count: { select: { donations: true } },
      },
    });

    if (!donor) return Response.json({ error: "Donneur non trouvé" }, { status: 404 });

    const now = new Date();
    const lastDonation = donor.lastDonation ? new Date(donor.lastDonation) : null;

    const minIntervalDays = donor.gender === "F" ? 90 : 56;
    let daysSinceLastDonation = null;
    let daysUntilEligible = 0;
    let isEligibleNow = true;
    let nextEligibleDate = null;

    if (lastDonation) {
      daysSinceLastDonation = Math.floor((now.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
      daysUntilEligible = Math.max(0, minIntervalDays - daysSinceLastDonation);
      isEligibleNow = daysUntilEligible === 0;
      if (!isEligibleNow) {
        nextEligibleDate = new Date(lastDonation.getTime() + minIntervalDays * 24 * 60 * 60 * 1000).toISOString();
      }
    }

    const donationsThisYear = await prisma.donation.count({
      where: {
        donorId: donor.id,
        date: { gte: new Date(now.getFullYear(), 0, 1) },
      },
    });

    const maxDonationsPerYear = donor.gender === "F" ? 3 : 4;
    const canDonateThisYear = donationsThisYear < maxDonationsPerYear;

    let reminderMessage = null;
    if (isEligibleNow && canDonateThisYear) {
      if (!lastDonation) {
        reminderMessage = "Vous n'avez jamais donné votre sang. C'est le moment de faire votre premier don !";
      } else if (daysSinceLastDonation && daysSinceLastDonation > minIntervalDays + 30) {
        reminderMessage = `Votre dernier don remonte à ${daysSinceLastDonation} jours. Il est temps de redonner !`;
      } else if (daysSinceLastDonation && daysSinceLastDonation >= minIntervalDays) {
        reminderMessage = "Vous êtes à nouveau éligible au don de sang. Prenez rendez-vous !";
      }
    } else if (!canDonateThisYear) {
      reminderMessage = `Vous avez atteint le maximum de ${maxDonationsPerYear} dons cette année. Merci pour votre générosité !`;
    }

    return Response.json({
      isEligibleNow,
      canDonateThisYear,
      daysSinceLastDonation,
      daysUntilEligible,
      nextEligibleDate,
      minIntervalDays,
      maxDonationsPerYear,
      donationsThisYear,
      totalDonations: donor._count.donations,
      lastDonationDate: donor.lastDonation,
      gender: donor.gender,
      bloodGroup: donor.bloodGroup,
      rhFactor: donor.rhFactor,
      reminderMessage,
      recentDonations: donor.donations,
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
