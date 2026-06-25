"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { VitaLinkLogoFull, VitaLinkLogoCompact } from "./VitaLinkLogo";
import GlobalSearch from "./GlobalSearch";
import {
  LayoutDashboard, Users, Droplets, Calendar, Package, BarChart3,
  Bell, Settings, UserCog, Heart, LogOut, Building2,
  Hospital, AlertTriangle, Globe, Shield, FileText, ChevronRight, Mail, MapPin,
  Award, Activity,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ReactNode;
  mobileTab?: boolean;
}

const superAdminNav: NavItem[] = [
  { label: "Tableau de bord", shortLabel: "Accueil", href: "/superadmin", icon: <LayoutDashboard size={20} />, mobileTab: true },
  { label: "Utilisateurs", shortLabel: "Comptes", href: "/superadmin/utilisateurs", icon: <Users size={20} />, mobileTab: true },
  { label: "Centres", shortLabel: "Centres", href: "/superadmin/centres", icon: <Building2 size={20} />, mobileTab: true },
  { label: "Hôpitaux", shortLabel: "Hôpitaux", href: "/superadmin/hopitaux", icon: <Hospital size={20} />, mobileTab: true },
  { label: "Administrateurs", shortLabel: "Admins", href: "/superadmin/admins", icon: <Shield size={20} /> },
  { label: "Demandes de sang", shortLabel: "Demandes", href: "/superadmin/demandes", icon: <AlertTriangle size={20} /> },
  { label: "Stock global", shortLabel: "Stock", href: "/superadmin/stock", icon: <Package size={20} /> },
  { label: "Tous les donneurs", shortLabel: "Donneurs", href: "/superadmin/donneurs", icon: <Users size={20} /> },
  { label: "Statistiques", shortLabel: "Stats", href: "/superadmin/statistiques", icon: <BarChart3 size={20} />, mobileTab: true },
  { label: "Paramètres", shortLabel: "Config", href: "/superadmin/parametres", icon: <Settings size={20} /> },
];

const adminNav: NavItem[] = [
  { label: "Tableau de bord", shortLabel: "Accueil", href: "/admin", icon: <LayoutDashboard size={20} />, mobileTab: true },
  { label: "Centres", shortLabel: "Centres", href: "/admin/centres", icon: <Building2 size={20} /> },
  { label: "Hôpitaux", shortLabel: "Hôpitaux", href: "/admin/hopitaux", icon: <Hospital size={20} /> },
  { label: "Personnel", shortLabel: "Équipe", href: "/admin/personnel", icon: <UserCog size={20} />, mobileTab: true },
  { label: "Donneurs", shortLabel: "Donneurs", href: "/admin/donneurs", icon: <Users size={20} />, mobileTab: true },
  { label: "Dons", shortLabel: "Dons", href: "/admin/dons", icon: <Droplets size={20} /> },
  { label: "Stock Sanguin", shortLabel: "Stock", href: "/admin/stock", icon: <Package size={20} />, mobileTab: true },
  { label: "Demandes", shortLabel: "Demandes", href: "/admin/demandes", icon: <AlertTriangle size={20} />, mobileTab: true },
  { label: "Rendez-vous", shortLabel: "RDV", href: "/admin/rendez-vous", icon: <Calendar size={20} /> },
  { label: "Statistiques", shortLabel: "Stats", href: "/admin/statistiques", icon: <BarChart3 size={20} /> },
  { label: "Campagnes", shortLabel: "Campagnes", href: "/admin/campagnes", icon: <Calendar size={20} /> },
  { label: "Export", shortLabel: "Export", href: "/admin/export", icon: <FileText size={20} /> },
  { label: "Messages", shortLabel: "Messages", href: "/admin/messages", icon: <Mail size={20} /> },
  { label: "Notifications", shortLabel: "Notifs", href: "/admin/notifications", icon: <Bell size={20} /> },
  { label: "Paramètres", shortLabel: "Config", href: "/admin/parametres", icon: <Settings size={20} /> },
];

const personnelNav: NavItem[] = [
  { label: "Tableau de bord", shortLabel: "Accueil", href: "/personnel", icon: <LayoutDashboard size={20} />, mobileTab: true },
  { label: "Donneurs", shortLabel: "Donneurs", href: "/personnel/donneurs", icon: <Users size={20} />, mobileTab: true },
  { label: "Nouveau Don", shortLabel: "Don", href: "/personnel/nouveau-don", icon: <Heart size={20} />, mobileTab: true },
  { label: "Dons", shortLabel: "Dons", href: "/personnel/dons", icon: <Droplets size={20} /> },
  { label: "Stock Sanguin", shortLabel: "Stock", href: "/personnel/stock", icon: <Package size={20} />, mobileTab: true },
  { label: "Rendez-vous", shortLabel: "RDV", href: "/personnel/rendez-vous", icon: <Calendar size={20} />, mobileTab: true },
  { label: "Mon Dossier", shortLabel: "Dossier", href: "/personnel/mon-dossier", icon: <FileText size={20} /> },
  { label: "Messages", shortLabel: "Messages", href: "/personnel/messages", icon: <Mail size={20} /> },
  { label: "Notifications", shortLabel: "Notifs", href: "/personnel/notifications", icon: <Bell size={20} /> },
];

const hospitalNav: NavItem[] = [
  { label: "Tableau de bord", shortLabel: "Accueil", href: "/hopital", icon: <LayoutDashboard size={20} />, mobileTab: true },
  { label: "Nouvelle demande", shortLabel: "Demande", href: "/hopital/nouvelle-demande", icon: <FileText size={20} />, mobileTab: true },
  { label: "Mes demandes", shortLabel: "Suivi", href: "/hopital/demandes", icon: <Droplets size={20} />, mobileTab: true },
  { label: "Réponses donneurs", shortLabel: "Réponses", href: "/hopital/reponses", icon: <Users size={20} /> },
  { label: "Urgences publiques", shortLabel: "Urgences", href: "/hopital/urgences", icon: <AlertTriangle size={20} />, mobileTab: true },
  { label: "Appels aux dons", shortLabel: "Appels", href: "/hopital/appels", icon: <Globe size={20} />, mobileTab: true },
  { label: "Dossier Hôpital", shortLabel: "Dossier", href: "/hopital/dossier", icon: <FileText size={20} /> },
  { label: "Messages", shortLabel: "Messages", href: "/hopital/messages", icon: <Mail size={20} /> },
  { label: "Notifications", shortLabel: "Notifs", href: "/hopital/notifications", icon: <Bell size={20} /> },
];

const donorNav: NavItem[] = [
  { label: "Tableau de bord", shortLabel: "Accueil", href: "/donneur", icon: <LayoutDashboard size={20} />, mobileTab: true },
  { label: "Urgences", shortLabel: "Urgences", href: "/donneur/urgences", icon: <AlertTriangle size={20} />, mobileTab: true },
  { label: "Mes Dons", shortLabel: "Dons", href: "/donneur/dons", icon: <Droplets size={20} />, mobileTab: true },
  { label: "Mes Réponses", shortLabel: "Réponses", href: "/donneur/mes-reponses", icon: <Heart size={20} />, mobileTab: true },
  { label: "Mes Demandes", shortLabel: "Demandes", href: "/donneur/demande-don", icon: <FileText size={20} /> },
  { label: "Rendez-vous", shortLabel: "RDV", href: "/donneur/rendez-vous", icon: <Calendar size={20} /> },
  { label: "Mon Dossier", shortLabel: "Dossier", href: "/donneur/mon-dossier", icon: <FileText size={20} /> },
  { label: "Campagnes", shortLabel: "Campagnes", href: "/donneur/campagnes", icon: <Calendar size={20} /> },
  { label: "Certificats", shortLabel: "Certifs", href: "/donneur/certificat", icon: <FileText size={20} /> },
  { label: "Messages", shortLabel: "Messages", href: "/donneur/messages", icon: <Mail size={20} /> },
  { label: "Carte des centres", shortLabel: "Carte", href: "/donneur/carte", icon: <MapPin size={20} /> },
  { label: "Badges", shortLabel: "Badges", href: "/donneur/badges", icon: <Award size={20} /> },
  { label: "Ma Santé", shortLabel: "Santé", href: "/donneur/sante", icon: <Activity size={20} /> },
  { label: "Mon Profil", shortLabel: "Profil", href: "/donneur/profil", icon: <Users size={20} /> },
  { label: "Paramètres", shortLabel: "Config", href: "/donneur/parametres", icon: <Settings size={20} /> },
  { label: "Notifications", shortLabel: "Notifs", href: "/donneur/notifications", icon: <Bell size={20} /> },
];

const navMap: Record<string, NavItem[]> = { SUPER_ADMIN: superAdminNav, ADMIN: adminNav, PERSONNEL: personnelNav, HOSPITAL: hospitalNav, DONOR: donorNav };
const roleLabelMap: Record<string, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Administrateur", PERSONNEL: "Personnel", HOSPITAL: "Hôpital", DONOR: "Donneur" };
const roleBgMap: Record<string, string> = { SUPER_ADMIN: "bg-[#003DA5]", ADMIN: "bg-[#E30613]", PERSONNEL: "bg-[#003DA5]", HOSPITAL: "bg-[#003DA5]", DONOR: "bg-[#E30613]" };

function isActive(pathname: string, href: string, navItems: NavItem[]): boolean {
  if (pathname === href) return true;
  if (navItems.findIndex(n => n.href === href) === 0) return pathname === href;
  return pathname.startsWith(href + "/");
}

export default function AppShell({ role, userName, children }: { role: string; userName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const nav = navMap[role] || donorNav;
  const roleLabel = roleLabelMap[role] || "Utilisateur";
  const roleBg = roleBgMap[role] || "bg-gray-600";

  const tabItems = nav.filter(n => n.mobileTab).slice(0, 4);
  const hasMore = nav.length > tabItems.length;
  const moreItems = nav.filter(n => !tabItems.includes(n));

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="flex h-[100dvh] bg-[#F1F4F9]">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex w-[272px] flex-col bg-white border-r border-gray-200/80 shadow-sm">
        <div className="p-5 pb-4">
          <VitaLinkLogoFull />
        </div>

        <div className="px-4 mb-2">
          <GlobalSearch />
        </div>

        <div className="mx-4 mb-3 p-3 rounded-xl bg-[#F5F7FA] border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm", roleBg)}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-[11px] text-gray-500 font-medium">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {nav.map((item) => {
            const active = isActive(pathname, item.href, nav);
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200",
                  active
                    ? "bg-[#E30613]/8 text-[#E30613] shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                )}>
                <span className={cn("transition-colors", active ? "text-[#E30613]" : "text-gray-400")}>{item.icon}</span>
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-[#E30613]/50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-gray-400 hover:bg-red-50 hover:text-[#E30613] transition-all w-full">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden glass-strong border-b border-gray-200/60 flex-shrink-0 z-40">
          <div className="flex items-center justify-between px-4 h-14" style={{ paddingTop: "var(--safe-top)" }}>
            <VitaLinkLogoCompact />
            <div className="flex items-center gap-2">
              <Link href={nav.find(n => n.label.includes("Notification"))?.href || "#"}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell size={18} className="text-gray-500" />
              </Link>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold", roleBg)}>
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden -webkit-overflow-scrolling-touch">
          <div className="p-4 md:p-6 lg:p-8 pb-safe lg:pb-8 max-w-[1400px] mx-auto w-full min-h-0">
            {children}
          </div>
        </main>
      </div>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-gray-200/60"
        style={{ paddingBottom: "var(--safe-bottom)" }}>
        <div className="flex items-stretch justify-around px-1 h-16">
          {tabItems.map((item) => {
            const active = isActive(pathname, item.href, nav);
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 gap-0.5 py-1 touch-active transition-all",
                  active ? "text-[#E30613]" : "text-gray-400"
                )}>
                <span className={cn(
                  "w-10 h-7 flex items-center justify-center rounded-full transition-all",
                  active ? "bg-[#E30613]/10 scale-110" : ""
                )}>
                  {item.icon}
                </span>
                <span className={cn("text-[10px] font-semibold leading-tight", active ? "text-[#E30613]" : "text-gray-400")}>
                  {item.shortLabel}
                </span>
              </Link>
            );
          })}
          {hasMore && (
            <button onClick={() => setMoreOpen(true)}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 py-1 touch-active text-gray-400">
              <span className="w-10 h-7 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                </svg>
              </span>
              <span className="text-[10px] font-semibold leading-tight">Plus</span>
            </button>
          )}
        </div>
      </nav>

      {/* ===== MOBILE "MORE" SHEET ===== */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-[slideUp_0.3s_ease]"
            style={{ paddingBottom: "calc(var(--safe-bottom) + 16px)" }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
            <div className="px-4 pb-2">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</p>
              {moreItems.map((item) => {
                const active = isActive(pathname, item.href, nav);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors",
                      active ? "bg-[#E30613]/8 text-[#E30613]" : "text-gray-600"
                    )}>
                    <span className={cn(active ? "text-[#E30613]" : "text-gray-400")}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-[#E30613] w-full mt-1">
                <LogOut size={20} /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
