import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

async function generateMatricule(): Promise<string> {
  const year = new Date().getFullYear();
  const lastDonor = await prisma.donor.findFirst({
    where: { matricule: { startsWith: `VL-${year}-` } },
    orderBy: { matricule: "desc" },
  });

  let nextNum = 1;
  if (lastDonor) {
    const parts = lastDonor.matricule.split("-");
    nextNum = parseInt(parts[2]) + 1;
  }

  return `VL-${year}-${String(nextNum).padStart(5, "0")}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone, bloodGroup, rhFactor, dateOfBirth, gender, address, nationalId, weight } = body;

    if (!email || !password || !name || !bloodGroup || !rhFactor || !dateOfBirth || !gender || !address || !nationalId) {
      return Response.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    const existingNationalId = await prisma.donor.findUnique({ where: { nationalId } });
    if (existingNationalId) {
      return Response.json({ error: "Ce numéro d'identité nationale est déjà utilisé" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const matricule = await generateMatricule();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: "DONOR",
        donor: {
          create: {
            matricule,
            bloodGroup,
            rhFactor,
            dateOfBirth: new Date(dateOfBirth),
            gender,
            address,
            nationalId,
            weight: weight ? parseFloat(weight) : null,
          },
        },
      },
      include: { donor: true },
    });

    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = Response.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, matricule },
    });

    response.headers.set(
      "Set-Cookie",
      `auth-token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
