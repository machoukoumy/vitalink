"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { cn } from "@/lib/utils";

const faq = [
  { q: "Qui peut donner du sang ?", a: "Toute personne en bonne santé, âgée de 18 à 65 ans et pesant plus de 50 kg peut donner du sang. Certaines conditions médicales peuvent temporairement empêcher le don." },
  { q: "Combien de temps dure un don de sang ?", a: "Le prélèvement en lui-même dure environ 10 minutes. En comptant l’accueil, l’entretien médical, le prélèvement et la collation, prévoyez environ 45 minutes." },
  { q: "À quelle fréquence peut-on donner ?", a: "Les hommes peuvent donner tous les 56 jours (8 semaines) et les femmes tous les 90 jours (12 semaines), soit respectivement 4 et 3 dons par an." },
  { q: "Le don de sang est-il douloureux ?", a: "Non. Vous ressentirez une légère piqûre lors de l’insertion de l’aiguille. Le personnel médical veille à votre confort tout au long du processus." },
  { q: "Que devient mon sang après le don ?", a: "Votre sang est testé, séparé en trois composants (globules rouges, plaquettes, plasma) puis distribué aux hôpitaux selon les besoins des patients." },
  { q: "Comment m’inscrire sur VitaLink ?", a: "Créez votre compte en ligne, complétez votre profil avec votre groupe sanguin et prenez rendez-vous dans le centre le plus proche." },
];

export default function AProposPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] bg-white overflow-x-hidden" style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ===== TOP BAR - style gouvernemental ===== */}
      <div className="bg-[#1a1a2e] text-white/70 text-[10px] py-1.5 hidden md:block">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span>République du Tchad — Ministère de la Santé Publique</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={10} /> +235 22 51 44 33</span>
            <span className="flex items-center gap-1"><Mail size={10} /> contact@cnts.td</span>
          </div>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 text-sm">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-gray-200 rounded flex items-center justify-center text-[6px] text-gray-400 text-center leading-tight hidden md:flex">
              Armoiries<br/>Tchad
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1.5">
                <VitaLinkIcon size={28} />
                <span className="font-extrabold text-base text-[#E30613]">Vita</span>
                <span className="font-extrabold text-base text-[#003DA5]">Link</span>
              </div>
              <p className="text-[8px] text-gray-400 tracking-wider uppercase hidden md:block">Centre National de Transfusion Sanguine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-gray-600 font-medium hidden sm:block">Connexion</Link>
            <Link href="/register" className="text-xs font-bold text-white bg-[#E30613] px-3 py-1.5 rounded">Donner</Link>
          </div>
        </div>
      </header>

      {/* ===== HERO INSTITUTIONNEL ===== */}
      <section className="relative bg-[#0a1628] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/images/don-sang.png')", backgroundSize: "contain", backgroundPosition: "right center", backgroundRepeat: "no-repeat" }} />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold text-[#E30613] uppercase tracking-[0.2em] mb-3">Centre National de Transfusion Sanguine</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
              Au service de la santé publique du Tchad
            </h1>
            <p className="text-gray-400 mt-4 text-base md:text-lg leading-relaxed max-w-lg">
              Le CNTS assure la collecte, le traitement, la qualification et la distribution des produits sanguins sur l{"'"}ensemble du territoire national.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/register" className="px-6 py-3 bg-[#E30613] text-white rounded font-bold text-sm flex items-center gap-2 hover:bg-[#c00510] transition-colors">
                Devenir donneur <ArrowRight size={16} />
              </Link>
              <Link href="/urgences" className="px-6 py-3 bg-white/10 text-white rounded font-bold text-sm border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-colors">
                Urgences en cours
              </Link>
            </div>
          </div>
        </div>
        {/* Bande tricolore en bas */}
        <div className="h-1 flex"><div className="flex-1 bg-[#003DA5]" /><div className="flex-1 bg-[#FCD116]" /><div className="flex-1 bg-[#E30613]" /></div>
      </section>

      {/* ===== CHIFFRES CLÉS ===== */}
      <section className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { val: "4", label: "Centres de transfusion", color: "text-[#003DA5]" },
              { val: "5+", label: "Hôpitaux partenaires", color: "text-[#003DA5]" },
              { val: "22", label: "Provinces couvertes", color: "text-[#003DA5]" },
              { val: "450 ml", label: "Par don de sang", color: "text-[#E30613]" },
              { val: "3", label: "Vies sauvées par don", color: "text-[#E30613]" },
            ].map((s, i) => (
              <div key={i}>
                <p className={`text-3xl md:text-4xl font-extrabold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRÉSENTATION CNTS ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-5 gap-10">
            <div className="md:col-span-3">
              <p className="text-xs font-bold text-[#003DA5] uppercase tracking-wider mb-2">À propos du CNTS</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Un établissement au cœur du système de santé</h2>
              <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
                <p>Le <strong className="text-gray-900">Centre National de Transfusion Sanguine (CNTS)</strong> est l{"'"}organisme public chargé de garantir la sécurité transfusionnelle au Tchad. Placé sous la tutelle du Ministère de la Santé Publique, il opère à travers un réseau de centres régionaux.</p>
                <p>La plateforme <strong className="text-[#E30613]">Vita</strong><strong className="text-[#003DA5]">Link</strong> a été développée pour moderniser la gestion du don de sang : inscription en ligne, alertes géolocalisées, suivi médical du donneur, gestion des stocks et des demandes des hôpitaux.</p>
                <p>Le CNTS travaille en collaboration avec les hôpitaux, les associations de donneurs et les partenaires internationaux pour garantir un approvisionnement suffisant et sûr en produits sanguins.</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="bg-[#F5F7FA] rounded-lg p-6 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-3">Informations</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3"><MapPin size={16} className="text-[#003DA5] mt-0.5 flex-shrink-0" /><div><p className="font-bold text-gray-900">Siège</p><p className="text-gray-500">Avenue Charles de Gaulle, N{"'"}Djaména, Tchad</p></div></div>
                  <div className="flex gap-3"><Phone size={16} className="text-[#003DA5] mt-0.5 flex-shrink-0" /><div><p className="font-bold text-gray-900">Téléphone</p><p className="text-gray-500">+235 22 51 44 33</p></div></div>
                  <div className="flex gap-3"><Mail size={16} className="text-[#003DA5] mt-0.5 flex-shrink-0" /><div><p className="font-bold text-gray-900">Email</p><p className="text-gray-500">contact@cnts.td</p></div></div>
                  <div className="flex gap-3"><Clock size={16} className="text-[#003DA5] mt-0.5 flex-shrink-0" /><div><p className="font-bold text-gray-900">Horaires</p><p className="text-gray-500">Lun - Ven : 7h30 - 15h30</p></div></div>
                </div>
              </div>
              <div className="bg-[#003DA5] rounded-lg p-5 mt-4 text-white">
                <p className="text-xs uppercase tracking-wider text-white/60 mb-2">Tutelle</p>
                <p className="text-sm font-bold">Ministère de la Santé Publique et de la Solidarité Nationale</p>
                <p className="text-xs text-white/60 mt-1">République du Tchad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RÉSEAU ===== */}
      <section className="bg-[#F5F7FA] border-y border-gray-200 py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider text-center mb-2">Réseau</p>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Implantation nationale</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { city: "N’Djaména", role: "Siège National — CNTS", color: "border-l-[#E30613]" },
              { city: "Moundou", role: "Centre Provincial — Logone Occidental", color: "border-l-[#003DA5]" },
              { city: "Abéché", role: "Centre Provincial — Ouaddaï", color: "border-l-[#003DA5]" },
              { city: "Sarh", role: "Centre Provincial — Moyen-Chari", color: "border-l-[#003DA5]" },
            ].map((c, i) => (
              <div key={i} className={`bg-white rounded-r-lg border-l-4 ${c.color} p-4 shadow-sm`}>
                <p className="font-bold text-gray-900">{c.city}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{c.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-3">Hôpitaux partenaires</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {[
              "Hôpital Général de Référence Nationale",
              "Hôpital de la Mère et de l’Enfant",
              "Hôpital Militaire",
              "Clinique La Liberté",
              "Hôpital Provincial de Moundou",
            ].map((h, i) => (
              <div key={i} className="bg-white rounded px-3 py-2.5 text-center text-xs text-gray-700 font-medium border border-gray-200 shadow-sm">{h}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCÉDURE DE DON ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold text-[#003DA5] uppercase tracking-wider text-center mb-2">Procédure</p>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">Les étapes du don de sang</h2>
          <div className="grid md:grid-cols-4 gap-0 md:gap-0">
            {[
              { n: "1", t: "Inscription", d: "Créez votre compte sur la plateforme VitaLink et complétez votre profil médical." },
              { n: "2", t: "Entretien médical", d: "Un professionnel de santé vérifie votre éligibilité et répond à vos questions." },
              { n: "3", t: "Prélèvement", d: "Le don de sang dure 10 minutes. Le personnel assure votre confort." },
              { n: "4", t: "Collation", d: "Après le don, une collation vous est offerte. Votre sang est envoyé au laboratoire." },
            ].map((s, i) => (
              <div key={i} className="relative text-center p-5 md:p-6">
                {i < 3 && <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-gray-200" style={{ left: "50%" }} />}
                <div className="w-12 h-12 bg-[#003DA5] rounded-full flex items-center justify-center text-white text-lg font-extrabold mx-auto mb-3 relative z-10 border-4 border-white shadow">{s.n}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{s.t}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CRITÈRES ===== */}
      <section className="bg-[#003DA5] text-white py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-extrabold text-center mb-8">Critères d{"'"é}ligibilité</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "18 – 65", unit: "ans", label: "Âge requis" },
              { val: "50+", unit: "kg", label: "Poids minimum" },
              { val: "56", unit: "jours", label: "Intervalle (H)" },
              { val: "90", unit: "jours", label: "Intervalle (F)" },
            ].map((c, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-5 text-center border border-white/10">
                <p className="text-3xl font-extrabold text-white">{c.val}</p>
                <p className="text-sm text-white/70">{c.unit}</p>
                <p className="text-[11px] text-white/40 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider text-center mb-2">FAQ</p>
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-1">
            {faq.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900 pr-4">{item.q}</span>
                  <ChevronDown size={18} className={cn("text-gray-400 flex-shrink-0 transition-transform", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && <div className="px-5 pb-4 border-t border-gray-100"><p className="text-sm text-gray-600 leading-relaxed pt-3">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#E30613] py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Donnez votre sang, sauvez des vies.</h2>
            <p className="text-white/70 text-sm mt-1">Inscrivez-vous sur VitaLink et prenez rendez-vous.</p>
          </div>
          <Link href="/register" className="px-8 py-3.5 bg-white text-[#E30613] rounded font-bold flex items-center gap-2 flex-shrink-0 hover:bg-gray-50 transition-colors">
            S{"'"}inscrire <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER INSTITUTIONNEL ===== */}
      <footer className="bg-[#0a1628] text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <VitaLinkIcon size={28} />
                <div><span className="font-extrabold text-[#E30613]">Vita</span><span className="font-extrabold text-white">Link</span></div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Plateforme nationale de gestion du don de sang du Tchad, développée pour le CNTS.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Liens utiles</h4>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-gray-500 hover:text-white transition-colors">Accueil</Link>
                <Link href="/register" className="block text-gray-500 hover:text-white transition-colors">Devenir donneur</Link>
                <Link href="/urgences" className="block text-gray-500 hover:text-white transition-colors">Urgences</Link>
                <Link href="/login" className="block text-gray-500 hover:text-white transition-colors">Connexion</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <p>N{"'"}Djaména, Tchad</p>
                <p>+235 22 51 44 33</p>
                <p>contact@cnts.td</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Groupes Sanguins</h4>
              <div className="flex flex-wrap gap-1.5">
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                  <span key={g} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold">{g}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-gray-600">{"©"} 2026 CNTS {"—"} Centre National de Transfusion Sanguine du Tchad. Tous droits réservés.</p>
            <p className="text-[11px] text-gray-600">Développé par <a href="https://jidicom.lovable.app" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[#E30613] transition-colors">JIDICOM</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
