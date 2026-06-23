import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "Aucun fichier" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `avatar-${user.id}-${Date.now()}.${ext}`;
    const path = join(process.cwd(), "public", "uploads", filename);

    await writeFile(path, buffer);
    const url = `/uploads/${filename}`;

    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: url },
    });

    return Response.json({ url });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
