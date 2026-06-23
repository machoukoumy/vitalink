"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Droplets, Calendar, Package, BarChart3,
  Bell, Settings, UserCog, Heart, LogOut, Menu, X, Building2,
  Hospital, AlertTriangle, Globe, Shield, FileText,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const superAdminNav: NavItem[] = [
  { label: "Tableau de bord", href: "/superadmin", icon: <LayoutDashboard size={20} /> },
  { label: "Centres", href: "/superadmin/centres", icon: <Building2 size={20} /> },
  { label: "Hôpitaux", href: "/superadmin/hopitaux", icon: <Hospital size={20} /> },
  { label: "Administrateurs", href: "/superadmin/admins", icon: <Shield size={20} /> },
  { label: "Demandes de sang", href: "/superadmin/demandes", icon: <AlertTriangle size={20} /> },
  { label: "Stock global", href: "/superadmin/stock", icon: <Package size={20} /> },
  { label: "Tous les donneurs", href: "/superadmin/donneurs", icon: <Users size={20} /> },
  { label: "Statistiques", href: "/superadmin/statistiques", icon: <BarChart3 size={20} /> },
  { label: "Paramètres", href: "/superadmin/parametres", icon: <Settings size={20} /> },
];

const adminNav: NavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { label: "Centres", href: "/admin/centres", icon: <Building2 size={20} /> },
  { label: "Hôpitaux", href: "/admin/hopitaux", icon: <Hospital size={20} /> },
  { label: "Personnel", href: "/admin/personnel", icon: <UserCog size={20} /> },
  { label: "Donneurs", href: "/admin/donneurs", icon: <Users size={20} /> },
  { label: "Dons", href: "/admin/dons", icon: <Droplets size={20} /> },
  { label: "Stock Sanguin", href: "/admin/stock", icon: <Package size={20} /> },
  { label: "Demandes", href: "/admin/demandes", icon: <AlertTriangle size={20} /> },
  { label: "Rendez-vous", href: "/admin/rendez-vous", icon: <Calendar size={20} /> },
  { label: "Statistiques", href: "/admin/statistiques", icon: <BarChart3 size={20} /> },
  { label: "Notifications", href: "/admin/notifications", icon: <Bell size={20} /> },
  { label: "Paramètres", href: "/admin/parametres", icon: <Settings size={20} /> },
];

const personnelNav: NavItem[] = [
  { label: "Tableau de bord", href: "/personnel", icon: <LayoutDashboard size={20} /> },
  { label: "Donneurs", href: "/personnel/donneurs", icon: <Users size={20} /> },
  { label: "Nouveau Don", href: "/personnel/nouveau-don", icon: <Heart size={20} /> },
  { label: "Dons", href: "/personnel/dons", icon: <Droplets size={20} /> },
  { label: "Stock Sanguin", href: "/personnel/stock", icon: <Package size={20} /> },
  { label: "Rendez-vous", href: "/personnel/rendez-vous", icon: <Calendar size={20} /> },
  { label: "Notifications", href: "/personnel/notifications", icon: <Bell size={20} /> },
];

const hospitalNav: NavItem[] = [
  { label: "Tableau de bord", href: "/hopital", icon: <LayoutDashboard size={20} /> },
  { label: "Nouvelle demande", href: "/hopital/nouvelle-demande", icon: <FileText size={20} /> },
  { label: "Mes demandes", href: "/hopital/demandes", icon: <Droplets size={20} /> },
  { label: "Urgences publiques", href: "/hopital/urgences", icon: <AlertTriangle size={20} /> },
  { label: "Appels aux dons", href: "/hopital/appels", icon: <Globe size={20} /> },
  { label: "Notifications", href: "/hopital/notifications", icon: <Bell size={20} /> },
];

const donorNav: NavItem[] = [
  { label: "Tableau de bord", href: "/donneur", icon: <LayoutDashboard size={20} /> },
  { label: "Mon Profil", href: "/donneur/profil", icon: <Users size={20} /> },
  { label: "Mes Dons", href: "/donneur/dons", icon: <Droplets size={20} /> },
  { label: "Rendez-vous", href: "/donneur/rendez-vous", icon: <Calendar size={20} /> },
  { label: "Urgences", href: "/donneur/urgences", icon: <AlertTriangle size={20} /> },
  { label: "Notifications", href: "/donneur/notifications", icon: <Bell size={20} /> },
];

const navMap: Record<string, NavItem[]> = {
  SUPER_ADMIN: superAdminNav,
  ADMIN: adminNav,
  PERSONNEL: personnelNav,
  HOSPITAL: hospitalNav,
  DONOR: donorNav,
};

const roleLabelMap: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrateur",
  PERSONNEL: "Personnel",
  HOSPITAL: "Hôpital",
  DONOR: "Donneur",
};

const roleColorMap: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-600",
  ADMIN: "bg-red-600",
  PERSONNEL: "bg-blue-600",
  HOSPITAL: "bg-teal-600",
  DONOR: "bg-green-600",
};

export default function Sidebar({ role, userName }: { role: string; userName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = navMap[role] || donorNav;
  const roleLabel = roleLabelMap[role] || "Utilisateur";
  const roleColor = roleColorMap[role] || "bg-gray-600";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md">
        <Menu size={24} />
      </button>

      {open && <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-gray-200">
          <button onClick={() => setOpen(false)} className="lg:hidden absolute top-4 right-4"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Droplets className="text-red-600" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">CNTS</h1>
              <p className="text-xs text-gray-500">Transfusion Sanguine</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <span className={cn("text-xs text-white px-2 py-0.5 rounded-full", roleColor)}>{roleLabel}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-red-50 text-red-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
