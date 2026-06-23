/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: any };

const libsql = createClient({
  url: "libsql://vitalink-machoukoumy.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODIyMDgyODYsImlkIjoiMDE5ZWYzZTMtZGQwMS03NzA2LWEwNGItZDY3ZTQxZTNkYmY0IiwicmlkIjoiMGQxMGQxODEtZDE5YS00YWM3LWIyMmMtZjVhNGZkOGY3ZGI5In0.ImhSM3lBcy7dGfa4gKiJTywTX06NSlhRlS5HIuMWSghFWZKet8uJqFO-De5iOxe-ya5ySIl3v5a1L_FGLL57AA",
});

const adapter = new PrismaLibSql(libsql);
export const prisma: any = globalForPrisma.prisma || new PrismaClient({ adapter } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
