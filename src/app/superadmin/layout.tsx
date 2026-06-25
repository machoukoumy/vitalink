"use client";
import AuthLayout from "@/components/AuthLayout";
export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={["SUPER_ADMIN"]} displayRole="SUPER_ADMIN">{children}</AuthLayout>;
}
