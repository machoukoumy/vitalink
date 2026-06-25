import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { query } from "@/lib/db";

const supabase = createClient(
  "https://fbvaucsobwtjlgqgikzp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidmF1Y3NvYnd0amxncWdpa3pwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM1ODM3NSwiZXhwIjoyMDk3OTM0Mzc1fQ.pTesajMq9il8hVz1ab3VEUd_Aev66VpadLGCu23ZMxo"
);

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const payload = await verifyToken(token);
    if (!payload) return Response.json({ error: "Non autorisé" }, { status: 403 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return Response.json({ error: "Aucun fichier" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${payload.userId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filename, buffer, { contentType: file.type, upsert: true });

    if (error) {
      console.error("Upload error:", error);
      return Response.json({ error: "Erreur upload" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filename);
    const url = urlData.publicUrl;

    await query('UPDATE "User" SET avatar = $1 WHERE id = $2', [url, payload.userId]);

    return Response.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
