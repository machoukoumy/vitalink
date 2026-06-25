"use client";
import AuthLayout from "@/components/AuthLayout";
export default function HopitalLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={["SUPER_ADMIN", "HOSPITAL"]} displayRole="HOSPITAL">{children}</AuthLayout>;
}
