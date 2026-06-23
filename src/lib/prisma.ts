/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: any };

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken) {
    try {
      const { createClient } = require("@libsql/client");
      const { PrismaLibSql } = require("@prisma/adapter-libsql");
      const libsql = createClient({ url: tursoUrl, authToken: tursoToken });
      const adapter = new PrismaLibSql(libsql);
      return new PrismaClient({ adapter } as any);
    } catch {
      // Fallback silently during build
    }
  }

  try {
    return new PrismaClient();
  } catch {
    return null;
  }
}

export const prisma: any = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma;
