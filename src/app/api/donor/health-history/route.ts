import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.donor) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const donations = await prisma.donation.findMany({
      where: { donorId: user.donor.id },
      orderBy: { date: "asc" },
      select: { date: true, hemoglobin: true, bloodPressure: true, temperature: true, quantity: true },
    });

    const history = donations.map(d => ({
      date: d.date,
      hemoglobin: d.hemoglobin,
      systolic: d.bloodPressure ? parseInt(d.bloodPressure.split("/")[0]) : null,
      diastolic: d.bloodPressure ? parseInt(d.bloodPressure.split("/")[1]) : null,
      temperature: d.temperature,
      quantity: d.quantity,
    }));

    return Response.json({ history });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
