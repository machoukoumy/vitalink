"use client";
import AuthLayout from "@/components/AuthLayout";
export default function DonneurLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout allowedRoles={["SUPER_ADMIN", "ADMIN", "PERSONNEL", "DONOR"]} displayRole="DONOR">{children}</AuthLayout>;
}
