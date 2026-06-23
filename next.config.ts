import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", ".prisma/client", "bcryptjs"],
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL || "",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || "",
    JWT_SECRET: process.env.JWT_SECRET || "vitalink-jwt-secret-production-2026-jidicom",
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  },
};

export default nextConfig;
