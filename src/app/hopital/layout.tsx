import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export default async function HopitalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "HOSPITAL"].includes(user.role)) redirect("/login");
  return <AppShell role="HOSPITAL" userName={user.name}>{children}</AppShell>;
}
