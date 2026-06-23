/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client/web";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import config from "./turso-config.json";

const globalForPrisma = globalThis as unknown as { prisma: any };

function makePrisma() {
  const libsql = createClient({
    url: config.url,
    authToken: config.authToken,
  });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter } as any);
}

export const prisma: any = globalForPrisma.prisma || makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
