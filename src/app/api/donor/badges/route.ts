import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedDate?: string;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const donor = user.donor;
    const donations = await prisma.donation.findMany({
      where: { donorId: donor.id },
      orderBy: { date: "asc" },
    });
    const responses = await prisma.donorResponse.count({
      where: { donorId: donor.id, status: "ACCEPTED" },
    });
    const campaigns = await prisma.campaignRegistration.count({
      where: { donorId: donor.id },
    });

    const totalDons = donations.length;
    const totalQty = donations.reduce((s, d) => s + d.quantity, 0);
    const firstDonDate = donations[0]?.date;

    const badges: Badge[] = [
      {
        id: "first_don", name: "Premier Don", description: "Vous avez fait votre premier don de sang",
        icon: "🩸", color: "bg-red-100 text-red-700", earned: totalDons >= 1,
        earnedDate: firstDonDate?.toISOString(),
      },
      {
        id: "don_3", name: "Donneur Régulier", description: "3 dons de sang effectués",
        icon: "💪", color: "bg-blue-100 text-blue-700", earned: totalDons >= 3,
        earnedDate: donations[2]?.date?.toISOString(),
      },
      {
        id: "don_5", name: "Donneur Fidèle", description: "5 dons de sang effectués",
        icon: "⭐", color: "bg-yellow-100 text-yellow-700", earned: totalDons >= 5,
        earnedDate: donations[4]?.date?.toISOString(),
      },
      {
        id: "don_10", name: "Héros du Sang", description: "10 dons de sang effectués",
        icon: "🏆", color: "bg-purple-100 text-purple-700", earned: totalDons >= 10,
        earnedDate: donations[9]?.date?.toISOString(),
      },
      {
        id: "litre", name: "1 Litre de Vie", description: "Plus d'un litre de sang donné au total",
        icon: "❤️", color: "bg-pink-100 text-pink-700", earned: totalQty >= 1000,
      },
      {
        id: "2litres", name: "2 Litres de Vie", description: "Plus de 2 litres de sang donné",
        icon: "💎", color: "bg-indigo-100 text-indigo-700", earned: totalQty >= 2000,
      },
      {
        id: "urgency_hero", name: "Héros d'Urgence", description: "Vous avez répondu à une demande urgente",
        icon: "🚑", color: "bg-orange-100 text-orange-700", earned: responses >= 1,
      },
      {
        id: "urgency_5", name: "Ange Gardien", description: "5 réponses aux urgences acceptées",
        icon: "👼", color: "bg-teal-100 text-teal-700", earned: responses >= 5,
      },
      {
        id: "campaign", name: "Esprit d'Équipe", description: "Participation à une campagne de don",
        icon: "🤝", color: "bg-green-100 text-green-700", earned: campaigns >= 1,
      },
      {
        id: "o_neg", name: "Donneur Universel", description: "Vous êtes du groupe O- (donneur universel)",
        icon: "🌍", color: "bg-emerald-100 text-emerald-700",
        earned: donor.bloodGroup === "O" && donor.rhFactor === "-",
      },
    ];

    const earned = badges.filter(b => b.earned).length;

    return Response.json({ badges, earned, total: badges.length });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
