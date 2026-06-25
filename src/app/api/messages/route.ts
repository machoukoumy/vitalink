import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const searchParams = request.nextUrl.searchParams;
    const withUserId = searchParams.get("with");

    const where: Record<string, unknown> = withUserId
      ? {
          OR: [
            { senderId: user.id, receiverId: withUserId },
            { senderId: withUserId, receiverId: user.id },
          ],
        }
      : {
          OR: [
            { senderId: user.id },
            { receiverId: user.id },
          ],
        };

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ messages });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const body = await request.json();
    const { receiverId, subject, content } = body;

    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        subject,
        content,
      },
    });

    return Response.json({ message }, { status: 201 });
  } catch {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
