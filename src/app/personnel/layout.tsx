import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export default async function PersonnelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN", "PERSONNEL"].includes(user.role)) redirect("/login");
  return <AppShell role="PERSONNEL" userName={user.name}>{children}</AppShell>;
}
