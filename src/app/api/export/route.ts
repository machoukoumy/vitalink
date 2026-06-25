import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(values: unknown[]): string {
  return values.map(escapeCsv).join(",");
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      return Response.json({ error: "Non autorisé" }, { status: 403 });
    }

    const type = request.nextUrl.searchParams.get("type");

    let csv = "";
    let filename = "export.csv";

    switch (type) {
      case "donors": {
        const donors = await prisma.donor.findMany({
          include: {
            user: { select: { name: true, email: true, phone: true } },
            _count: { select: { donations: true } },
          },
        });

        csv = toCsvRow(["name", "email", "phone", "bloodGroup", "rhFactor", "matricule", "nationalId", "address", "totalDonations", "lastDonation"]) + "\n";
        for (const d of donors) {
          csv += toCsvRow([
            d.user.name,
            d.user.email,
            d.user.phone,
            d.bloodGroup,
            d.rhFactor,
            d.matricule,
            d.nationalId,
            d.address,
            d._count.donations,
            d.lastDonation ? d.lastDonation.toISOString() : "",
          ]) + "\n";
        }
        filename = "donneurs.csv";
        break;
      }

      case "donations": {
        const donations = await prisma.donation.findMany({
          include: {
            donor: { include: { user: { select: { name: true } } } },
          },
          orderBy: { date: "desc" },
        });

        csv = toCsvRow(["date", "donorName", "bloodGroup", "quantity", "hemoglobin", "bloodPressure", "temperature", "status"]) + "\n";
        for (const d of donations) {
          csv += toCsvRow([
            d.date.toISOString(),
            d.donor.user.name,
            d.bloodGroup,
            d.quantity,
            d.hemoglobin,
            d.bloodPressure,
            d.temperature,
            d.status,
          ]) + "\n";
        }
        filename = "donations.csv";
        break;
      }

      case "stock": {
        const stock = await prisma.bloodStock.findMany({
          orderBy: { collectedAt: "desc" },
        });

        csv = toCsvRow(["bloodGroup", "rhFactor", "quantity", "status", "collectedAt", "expiresAt"]) + "\n";
        for (const s of stock) {
          csv += toCsvRow([
            s.bloodGroup,
            s.rhFactor,
            s.quantity,
            s.status,
            s.collectedAt.toISOString(),
            s.expiresAt.toISOString(),
          ]) + "\n";
        }
        filename = "stock.csv";
        break;
      }

      case "requests": {
        const requests = await prisma.bloodRequest.findMany({
          include: {
            hospital: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        });

        csv = toCsvRow(["hospital", "bloodGroup", "quantity", "urgency", "status", "createdAt"]) + "\n";
        for (const r of requests) {
          csv += toCsvRow([
            r.hospital.name,
            r.bloodGroup,
            r.quantity,
            r.urgency,
            r.status,
            r.createdAt.toISOString(),
          ]) + "\n";
        }
        filename = "demandes.csv";
        break;
      }

      case "campaigns": {
        const campaigns = await prisma.campaign.findMany({
          include: {
            center: { select: { name: true } },
            _count: { select: { registrations: true } },
          },
          orderBy: { startDate: "desc" },
        });

        csv = toCsvRow(["title", "startDate", "endDate", "location", "center", "status", "goalQuantity", "collectedQuantity", "registrations"]) + "\n";
        for (const c of campaigns) {
          csv += toCsvRow([
            c.title,
            c.startDate.toISOString(),
            c.endDate.toISOString(),
            c.location,
            c.center?.name,
            c.status,
            c.goalQuantity,
            c.collectedQuantity,
            c._count.registrations,
          ]) + "\n";
        }
        filename = "campagnes.csv";
        break;
      }

      default:
        return Response.json({ error: "Type d'export invalide" }, { status: 400 });
    }

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
