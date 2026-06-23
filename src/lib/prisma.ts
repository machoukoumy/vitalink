/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: any };

const TURSO_URL = "libsql://vitalink-machoukoumy.aws-us-east-1.turso.io";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODIyMDgyODYsImlkIjoiMDE5ZWYzZTMtZGQwMS03NzA2LWEwNGItZDY3ZTQxZTNkYmY0IiwicmlkIjoiMGQxMGQxODEtZDE5YS00YWM3LWIyMmMtZjVhNGZkOGY3ZGI5In0.ImhSM3lBcy7dGfa4gKiJTywTX06NSlhRlS5HIuMWSghFWZKet8uJqFO-De5iOxe-ya5ySIl3v5a1L_FGLL57AA";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL || TURSO_URL;
  const token = process.env.TURSO_AUTH_TOKEN || TURSO_TOKEN;

  if (url.startsWith("libsql://")) {
    const libsql = createClient({ url, authToken: token });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter } as any);
  }

  return new PrismaClient();
}

export const prisma: any = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) globalForPrisma.prisma = prisma;
