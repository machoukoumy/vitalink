"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Heart, Shield, Users, Globe, Zap, Building2, MapPin, Phone, Clock, Droplets, CheckCircle, ArrowRight } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { cn } from "@/lib/utils";

const faq = [
  { q: "Qui peut donner du sang ?", a: "Toute personne en bonne santé, âgée de 18 à 65 ans et pesant plus de 50 kg." },
  { q: "Combien de temps dure un don ?", a: "Le prélèvement dure 10 minutes. Prévoyez 45 minutes au total avec l'accueil et la collation." },
  { q: "À quelle fréquence peut-on donner ?", a: "Hommes : tous les 56 jours. Femmes : tous les 90 jours." },
  { q: "Le don est-il douloureux ?", a: "Non, juste une petite piqûre comme une prise de sang classique." },
  { q: "Que devient mon sang après le don ?", a: "Il est testé, séparé en composants puis distribué aux hôpitaux." },
  { q: "Comment m'inscrire ?", a: "Créez votre compte sur VitaLink et prenez rendez-vous." },
];

export default function AProposPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] bg-white overflow-x-hidden">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <ArrowLeft size={18} /> Accueil
          </Link>
          <div className="flex items-center gap-2">
            <VitaLinkIcon size={28} />
            <span className="font-extrabold text-[15px] text-[#E30613]">Vita</span>
            <span className="font-extrabold text-[15px] text-[#003DA5]">Link</span>
          </div>
          <Link href="/register" className="text-sm font-bold text-white bg-[#E30613] px-3 py-1.5 rounded-lg">S{"'"}inscrire</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-[#003DA5] py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <VitaLinkIcon size={48} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4">La technologie au service de la transfusion sanguine</h1>
          <p className="text-white/70 mt-3 max-w-lg mx-auto">VitaLink connecte donneurs, hôpitaux et centres de transfusion pour que chaque goutte de sang arrive à temps.</p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div><p className="text-3xl font-extrabold">4</p><p className="text-xs text-white/50">Centres</p></div>
            <div><p className="text-3xl font-extrabold">5+</p><p className="text-xs text-white/50">Hôpitaux</p></div>
            <div><p className="text-3xl font-extrabold">22</p><p className="text-xs text-white/50">Provinces</p></div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-14 md:py-18">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider text-center mb-2">Notre Mission</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8">Sauver des vies</h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="text-gray-600 leading-relaxed space-y-3 text-sm">
              <p>Le <strong>Centre National de Transfusion Sanguine (CNTS)</strong> est l{"'"}{"é"}tablissement public de r{"é"}f{"é"}rence au Tchad pour la collecte et la distribution des produits sanguins.</p>
              <p><strong>VitaLink</strong> est sa plateforme num{"é"}rique qui modernise l{"'"}ensemble du processus.</p>
              <p>Chaque ann{"é"}e, des milliers de patients ont besoin de transfusions : victimes d{"'"}accidents, femmes enceintes, enfants an{"é"}mi{"é"}s.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Droplets size={24} />, val: "450 ml", label: "par don", bg: "bg-red-50", color: "text-[#E30613]" },
                { icon: <Heart size={24} />, val: "3 vies", label: "sauvées", bg: "bg-blue-50", color: "text-[#003DA5]" },
                { icon: <Clock size={24} />, val: "10 min", label: "durée", bg: "bg-amber-50", color: "text-amber-600" },
                { icon: <Shield size={24} />, val: "100%", label: "sécurisé", bg: "bg-green-50", color: "text-emerald-600" },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
                  <span className={s.color}>{s.icon}</span>
                  <p className={`text-xl font-extrabold ${s.color} mt-1`}>{s.val}</p>
                  <p className="text-[11px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="bg-[#F5F7FA] py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Nos Valeurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { icon: <Heart size={20} />, c: "bg-[#E30613]", t: "Solidarité" },
              { icon: <Shield size={20} />, c: "bg-[#003DA5]", t: "Fiabilité" },
              { icon: <Zap size={20} />, c: "bg-amber-500", t: "Réactivité" },
              { icon: <Globe size={20} />, c: "bg-emerald-500", t: "Innovation" },
              { icon: <Users size={20} />, c: "bg-purple-500", t: "Humanité" },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className={`w-10 h-10 ${v.c} rounded-lg flex items-center justify-center text-white mx-auto mb-2`}>{v.icon}</div>
                <p className="text-sm font-bold text-gray-900">{v.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CENTRES */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Nos Centres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { city: "N'Djaména", type: "Siège", c: "bg-[#E30613]", icon: <Building2 size={18} /> },
              { city: "Moundou", type: "Provincial", c: "bg-[#003DA5]", icon: <MapPin size={18} /> },
              { city: "Abéché", type: "Provincial", c: "bg-[#003DA5]", icon: <MapPin size={18} /> },
              { city: "Sarh", type: "Provincial", c: "bg-[#003DA5]", icon: <MapPin size={18} /> },
            ].map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <div className={`w-9 h-9 ${c.c} rounded-lg flex items-center justify-center text-white mx-auto mb-2`}>{c.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{c.city}</p>
                <p className="text-[11px] text-gray-500">{c.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 ÉTAPES */}
      <section className="bg-[#E30613] py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Comment donner ?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "1", t: "Inscrivez-vous", d: "Créez votre profil en 2 minutes sur VitaLink." },
              { n: "2", t: "Prenez RDV", d: "Choisissez le centre et l'heure qui vous conviennent." },
              { n: "3", t: "Donnez", d: "10 minutes de don = 3 vies sauvées." },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-5 text-center border border-white/10">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#E30613] font-extrabold mx-auto mb-3">{s.n}</div>
                <h3 className="text-white font-bold mb-1">{s.t}</h3>
                <p className="text-white/70 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Questions fr{"é"}quentes</h2>
          <div className="space-y-2">
            {faq.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left">
                  <span className="text-sm font-semibold text-gray-900">{item.q}</span>
                  <ChevronDown size={18} className={cn("text-gray-400 transition-transform", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && <div className="px-4 pb-4"><p className="text-sm text-gray-600">{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#003DA5] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-white">Pr{"ê"}t {"à"} sauver des vies ?</h2>
          <p className="text-white/60 mt-2">Rejoignez VitaLink.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/register" className="px-6 py-3 bg-white text-[#003DA5] rounded-xl font-bold flex items-center justify-center gap-2">
              Devenir donneur <ArrowRight size={18} />
            </Link>
            <Link href="/urgences" className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold border border-white/20 flex items-center justify-center gap-2">
              <Phone size={18} /> Urgences
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <VitaLinkIcon size={24} />
            <span className="font-bold text-sm"><span className="text-[#E30613]">Vita</span><span className="text-white">Link</span></span>
          </div>
          <p className="text-xs text-gray-500">{"©"} 2026 VitaLink {"·"} D{"é"}velopp{"é"} par <a href="https://jidicom.lovable.app" target="_blank" rel="noopener noreferrer" className="text-white font-bold">JIDICOM</a></p>
        </div>
      </footer>
    </div>
  );
}
