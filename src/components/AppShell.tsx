"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { VitaLinkLogoFull, VitaLinkLogoCompact } from "./VitaLinkLogo";
import GlobalSearch from "./GlobalSearch";
import {
  LayoutDashboard, Users, Droplets, Package, Bell, Settings, Heart, LogOut, Building2,
  Hospital, AlertTriangle, FileText, ChevronDown, Mail, MapPin, Award, Activity,
} from "lucide-react";
import { useState } from "react";

/* ================================================================
   NAVIGATION STRUCTURE: 5 modules per role
   Desktop: sidebar with collapsible groups
   Mobile: 5 bottom tabs
   ================================================================ */

interface SubItem { label: string; href: string; }
interface NavModule {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  href: string;            // main page (clicked on mobile)
  children?: SubItem[];    // sub-items (desktop sidebar)
}

// ===== SUPER ADMIN =====
const superAdminModules: NavModule[] = [
  { id: "dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: <LayoutDashboard size={20} />, href: "/superadmin" },
  { id: "gestion", label: "Gestion", shortLabel: "Gestion", icon: <Building2 size={20} />, href: "/superadmin/utilisateurs", children: [
    { label: "Utilisateurs", href: "/superadmin/utilisateurs" },
    { label: "Centres", href: "/superadmin/centres" },
    { label: "Hôpitaux", href: "/superadmin/hopitaux" },
    { label: "Administrateurs", href: "/superadmin/admins" },
  ]},
  { id: "sang", label: "Sang & Stock", shortLabel: "Stock", icon: <Droplets size={20} />, href: "/superadmin/stock", children: [
    { label: "Stock global", href: "/superadmin/stock" },
    { label: "Donneurs", href: "/superadmin/donneurs" },
    { label: "Demandes", href: "/superadmin/demandes" },
  ]},
  { id: "stats", label: "Statistiques", shortLabel: "Stats", icon: <Activity size={20} />, href: "/superadmin/statistiques" },
  { id: "config", label: "Paramètres", shortLabel: "Config", icon: <Settings size={20} />, href: "/superadmin/parametres" },
];

// ===== ADMIN =====
const adminModules: NavModule[] = [
  { id: "dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: <LayoutDashboard size={20} />, href: "/admin" },
  { id: "equipe", label: "Organisation", shortLabel: "Équipe", icon: <Users size={20} />, href: "/admin/personnel", children: [
    { label: "Personnel", href: "/admin/personnel" },
    { label: "Centres", href: "/admin/centres" },
    { label: "Hôpitaux", href: "/admin/hopitaux" },
    { label: "Campagnes", href: "/admin/campagnes" },
  ]},
  { id: "sang", label: "Sang & Dons", shortLabel: "Sang", icon: <Droplets size={20} />, href: "/admin/donneurs", children: [
    { label: "Donneurs", href: "/admin/donneurs" },
    { label: "Dons", href: "/admin/dons" },
    { label: "Stock Sanguin", href: "/admin/stock" },
    { label: "Rendez-vous", href: "/admin/rendez-vous" },
    { label: "Demandes", href: "/admin/demandes" },
  ]},
  { id: "outils", label: "Outils", shortLabel: "Outils", icon: <FileText size={20} />, href: "/admin/statistiques", children: [
    { label: "Statistiques", href: "/admin/statistiques" },
    { label: "Certificats", href: "/admin/certificats" },
    { label: "Export", href: "/admin/export" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Notifications", href: "/admin/notifications" },
  ]},
  { id: "config", label: "Paramètres", shortLabel: "Config", icon: <Settings size={20} />, href: "/admin/parametres" },
];

// ===== PERSONNEL =====
const personnelModules: NavModule[] = [
  { id: "dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: <LayoutDashboard size={20} />, href: "/personnel" },
  { id: "collecte", label: "Collecte", shortLabel: "Collecte", icon: <Heart size={20} />, href: "/personnel/nouveau-don", children: [
    { label: "Nouveau Don", href: "/personnel/nouveau-don" },
    { label: "Donneurs", href: "/personnel/donneurs" },
    { label: "Dons", href: "/personnel/dons" },
    { label: "Rendez-vous", href: "/personnel/rendez-vous" },
    { label: "Certificats", href: "/personnel/certificats" },
  ]},
  { id: "stock", label: "Stock", shortLabel: "Stock", icon: <Package size={20} />, href: "/personnel/stock" },
  { id: "comm", label: "Communication", shortLabel: "Comm.", icon: <Mail size={20} />, href: "/personnel/messages", children: [
    { label: "Messages", href: "/personnel/messages" },
    { label: "Notifications", href: "/personnel/notifications" },
  ]},
  { id: "profil", label: "Mon Compte", shortLabel: "Compte", icon: <Users size={20} />, href: "/personnel/mon-dossier" },
];

// ===== HOPITAL =====
const hospitalModules: NavModule[] = [
  { id: "dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: <LayoutDashboard size={20} />, href: "/hopital" },
  { id: "demandes", label: "Demandes", shortLabel: "Demandes", icon: <Droplets size={20} />, href: "/hopital/demandes", children: [
    { label: "Nouvelle demande", href: "/hopital/nouvelle-demande" },
    { label: "Mes demandes", href: "/hopital/demandes" },
    { label: "Réponses donneurs", href: "/hopital/reponses" },
  ]},
  { id: "urgences", label: "Urgences", shortLabel: "Urgences", icon: <AlertTriangle size={20} />, href: "/hopital/urgences", children: [
    { label: "Urgences publiques", href: "/hopital/urgences" },
    { label: "Appels aux dons", href: "/hopital/appels" },
  ]},
  { id: "comm", label: "Communication", shortLabel: "Messages", icon: <Mail size={20} />, href: "/hopital/messages", children: [
    { label: "Messages", href: "/hopital/messages" },
    { label: "Notifications", href: "/hopital/notifications" },
  ]},
  { id: "dossier", label: "Mon Dossier", shortLabel: "Dossier", icon: <FileText size={20} />, href: "/hopital/dossier" },
];

// ===== DONNEUR =====
const donorModules: NavModule[] = [
  { id: "dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: <LayoutDashboard size={20} />, href: "/donneur" },
  { id: "don", label: "Mes Dons", shortLabel: "Dons", icon: <Droplets size={20} />, href: "/donneur/dons", children: [
    { label: "Historique", href: "/donneur/dons" },
    { label: "Rendez-vous", href: "/donneur/rendez-vous" },
    { label: "Certificats", href: "/donneur/certificat" },
    { label: "Ma Santé", href: "/donneur/sante" },
  ]},
  { id: "urgences", label: "Urgences", shortLabel: "Urgences", icon: <AlertTriangle size={20} />, href: "/donneur/urgences", children: [
    { label: "Appels urgents", href: "/donneur/urgences" },
    { label: "Mes Réponses", href: "/donneur/mes-reponses" },
    { label: "Mes Demandes", href: "/donneur/demande-don" },
    { label: "Campagnes", href: "/donneur/campagnes" },
  ]},
  { id: "decouvrir", label: "Découvrir", shortLabel: "Plus", icon: <MapPin size={20} />, href: "/donneur/carte", children: [
    { label: "Carte des centres", href: "/donneur/carte" },
    { label: "Badges", href: "/donneur/badges" },
    { label: "Messages", href: "/donneur/messages" },
    { label: "Notifications", href: "/donneur/notifications" },
  ]},
  { id: "profil", label: "Mon Profil", shortLabel: "Profil", icon: <Users size={20} />, href: "/donneur/profil", children: [
    { label: "Profil", href: "/donneur/profil" },
    { label: "Mon Dossier", href: "/donneur/mon-dossier" },
    { label: "Paramètres", href: "/donneur/parametres" },
  ]},
];

const moduleMap: Record<string, NavModule[]> = {
  SUPER_ADMIN: superAdminModules, ADMIN: adminModules, PERSONNEL: personnelModules,
  HOSPITAL: hospitalModules, DONOR: donorModules,
};

const roleLabelMap: Record<string, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Administrateur", PERSONNEL: "Personnel", HOSPITAL: "Hôpital", DONOR: "Donneur" };
const roleBgMap: Record<string, string> = { SUPER_ADMIN: "bg-[#003DA5]", ADMIN: "bg-[#E30613]", PERSONNEL: "bg-[#003DA5]", HOSPITAL: "bg-[#003DA5]", DONOR: "bg-[#E30613]" };

function isModuleActive(pathname: string, mod: NavModule): boolean {
  if (pathname === mod.href) return true;
  return mod.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/")) || false;
}

export default function AppShell({ role, userName, children }: { role: string; userName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const modules = moduleMap[role] || donorModules;
  const roleLabel = roleLabelMap[role] || "Utilisateur";
  const roleBg = roleBgMap[role] || "bg-gray-600";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const toggleGroup = (id: string) => setOpenGroup(prev => prev === id ? null : id);

  return (
    <div className="flex h-[100dvh] bg-[#F1F4F9]">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-white border-r border-gray-200/80 shadow-sm">
        <div className="p-5 pb-3"><VitaLinkLogoFull /></div>
        <div className="px-4 mb-2"><GlobalSearch /></div>

        <div className="mx-4 mb-3 p-3 rounded-xl bg-[#F5F7FA] border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold", roleBg)}>{userName.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-[11px] text-gray-500 font-medium">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
          {modules.map(mod => {
            const active = isModuleActive(pathname, mod);
            const isOpen = openGroup === mod.id || active;
            const hasChildren = mod.children && mod.children.length > 0;

            return (
              <div key={mod.id}>
                {hasChildren ? (
                  <button onClick={() => toggleGroup(mod.id)}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all w-full",
                      active ? "bg-[#E30613]/8 text-[#E30613]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    )}>
                    <span className={cn("transition-colors", active ? "text-[#E30613]" : "text-gray-400")}>{mod.icon}</span>
                    {mod.label}
                    <ChevronDown size={14} className={cn("ml-auto transition-transform", isOpen && "rotate-180")} />
                  </button>
                ) : (
                  <Link href={mod.href}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all",
                      active ? "bg-[#E30613]/8 text-[#E30613]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    )}>
                    <span className={cn("transition-colors", active ? "text-[#E30613]" : "text-gray-400")}>{mod.icon}</span>
                    {mod.label}
                  </Link>
                )}

                {hasChildren && isOpen && (
                  <div className="ml-8 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {mod.children!.map(sub => (
                      <Link key={sub.href} href={sub.href}
                        className={cn("block py-1.5 px-2 rounded-lg text-[12.5px] font-medium transition-colors",
                          pathname === sub.href || pathname.startsWith(sub.href + "/") ? "text-[#E30613] bg-[#E30613]/5" : "text-gray-400 hover:text-gray-700"
                        )}>
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
          <div className="flex items-center justify-between px-4 h-14" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
            <VitaLinkLogoCompact />
            <div className="flex items-center gap-2">
              <Link href={modules.find(m => m.children?.some(c => c.href.includes("notification")))?.children?.find(c => c.href.includes("notification"))?.href || "#"}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell size={18} className="text-gray-500" />
              </Link>
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold", roleBg)}>
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8 pb-safe lg:pb-8 max-w-[1400px] mx-auto w-full min-h-0">
            {children}
          </div>
        </main>
      </div>

      {/* ===== MOBILE BOTTOM TAB BAR (5 tabs fixed) ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-gray-200/60"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-stretch justify-around px-1 h-16">
          {modules.map(mod => {
            const active = isModuleActive(pathname, mod);
            return (
              <Link key={mod.id} href={mod.href}
                className={cn("flex flex-col items-center justify-center flex-1 gap-0.5 py-1 touch-active transition-all",
                  active ? "text-[#E30613]" : "text-gray-400"
                )}>
                <span className={cn("w-10 h-7 flex items-center justify-center rounded-full transition-all",
                  active ? "bg-[#E30613]/10 scale-110" : ""
                )}>{mod.icon}</span>
                <span className={cn("text-[10px] font-semibold leading-tight", active ? "text-[#E30613]" : "text-gray-400")}>
                  {mod.shortLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ===== MOBILE "MORE" SHEET ===== */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }} onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
            <div className="px-4 pb-2">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-[#E30613] w-full">
                <LogOut size={20} /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
