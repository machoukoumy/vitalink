"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "./AppShell";

interface AuthLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
  displayRole: string;
}

export default function AuthLayout({ children, allowedRoles, displayRole }: AuthLayoutProps) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => {
        if (!r.ok) throw new Error("Not authenticated");
        return r.json();
      })
      .then(d => {
        if (!d.user || !allowedRoles.includes(d.user.role)) {
          router.replace("/login");
          return;
        }
        setUser(d.user);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#F1F4F9]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <AppShell role={displayRole} userName={user.name}>{children}</AppShell>;
}
