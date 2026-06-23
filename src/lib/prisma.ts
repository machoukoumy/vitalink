/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: any };

const TURSO_URL = process.env.TURSO_DATABASE_URL || "libsql://vitalink-machoukoumy.aws-us-east-1.turso.io";
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODIyMDgyODYsImlkIjoiMDE5ZWYzZTMtZGQwMS03NzA2LWEwNGItZDY3ZTQxZTNkYmY0IiwicmlkIjoiMGQxMGQxODEtZDE5YS00YWM3LWIyMmMtZjVhNGZkOGY3ZGI5In0.ImhSM3lBcy7dGfa4gKiJTywTX06NSlhRlS5HIuMWSghFWZKet8uJqFO-De5iOxe-ya5ySIl3v5a1L_FGLL57AA";

function createPrismaClient() {
  // In production or when Turso URL starts with libsql://, use Turso
  if (TURSO_URL.startsWith("libsql://")) {
    try {
      const { createClient } = require("@libsql/client");
      const { PrismaLibSql } = require("@prisma/adapter-libsql");
      const libsql = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
      const adapter = new PrismaLibSql(libsql);
      return new PrismaClient({ adapter } as any);
    } catch {
      // During build, adapter may not work - fall through
    }
  }

  // Local dev with SQLite file
  return new PrismaClient();
}

export const prisma: any = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma;
