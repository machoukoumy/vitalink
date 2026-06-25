"use client";
import AuthLayout from "@/components/AuthLayout";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={["SUPER_ADMIN", "ADMIN"]} displayRole="ADMIN">{children}</AuthLayout>;
}
