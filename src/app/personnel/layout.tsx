"use client";
import AuthLayout from "@/components/AuthLayout";
export default function PersonnelLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={["SUPER_ADMIN", "ADMIN", "PERSONNEL"]} displayRole="PERSONNEL">{children}</AuthLayout>;
}
