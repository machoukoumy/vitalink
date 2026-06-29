"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Heart, Shield, Users, Globe, Zap, Building2, MapPin, Phone, Clock, Droplets, CheckCircle, ArrowRight } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { cn } from "@/lib/utils";

const faqItems = [
  { q: "Qui peut donner du sang ?", a: "Toute personne en bonne santé, âgée de 18 à 65 ans et pesant plus de 50 kg. Certaines conditions médicales peuvent temporairement empêcher le don." },
  { q: "Combien de temps dure un don ?", a: "Le prélèvement dure environ 10 minutes. En comptant l'accueil, le questionnaire et la collation, prévoyez 45 minutes au total." },
  { q: "À quelle fréquence peut-on donner ?", a: "Les hommes tous les 56 jours (8 semaines) et les femmes tous les 90 jours (12 semaines)." },
  { q: "Le don est-il douloureux ?", a: "Non. Vous ressentirez une petite piqûre lors de l'insertion de l'aiguille, similaire à une prise de sang classique." },
  { q: "Que devient mon sang après le don ?", a: "Il est testé, séparé en composants (globules rouges, plaquettes, plasma) puis distribué aux hôpitaux qui en ont besoin." },
  { q: "Comment m'inscrire ?", a: "Créez votre compte sur VitaLink, complétez votre profil et prenez rendez-vous dans le centre le plus proche." },
];

export default function AProposPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-[100dvh] bg-white">

      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium">
            <ArrowLeft size={18} /> Accueil
          </Link>
          <div className="flex items-center gap-2">
            <VitaLinkIcon size={28} />
            <span className="font-extrabold text-[15px] text-[#E30613]">Vita</span>
            <span className="font-extrabold text-[15px] text-[#003DA5]">Link</span>
          </div>
          <Link href="/login" className="text-sm font-medium text-[#003DA5]">Connexion</Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="bg-[#003DA5] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <VitaLinkIcon size={52} />
            <div className="text-left">
              <span className="font-extrabold text-3xl text-white">Vita</span>
              <span className="font-extrabold text-3xl text-white/80">Link</span>
              <p className="text-[11px] text-white/50 tracking-wider">CNTS &middot; Tchad</p>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
            La technologie au service de la transfusion sanguine
          </h1>
          <p className="text-base md:text-lg text-white/70 mt-4 max-w-xl mx-auto leading-relaxed">
            VitaLink connecte donneurs, h&ocirc;pitaux et centres de transfusion pour que chaque goutte de sang arrive &agrave; temps.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
            {[
              { val: "4", label: "Centres" },
              { val: "5+", label: "Hôpitaux" },
              { val: "22", label: "Provinces" },
              { val: "10min", label: "Par don" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOTRE MISSION ===== */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider mb-2">Notre Mission</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Sauver des vies gr&acirc;ce au don de sang</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Le <strong>Centre National de Transfusion Sanguine (CNTS)</strong> est l&apos;&eacute;tablissement public de r&eacute;f&eacute;rence au Tchad pour la collecte, le traitement et la distribution des produits sanguins.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>VitaLink</strong> est sa plateforme num&eacute;rique qui modernise et s&eacute;curise l&apos;ensemble du processus, de l&apos;inscription du donneur &agrave; la distribution aux h&ocirc;pitaux.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Chaque ann&eacute;e, des milliers de patients au Tchad ont besoin de transfusions : victimes d&apos;accidents, femmes enceintes, enfants an&eacute;mi&eacute;s, patients en chirurgie. Votre don fait la diff&eacute;rence.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#E30613]/5 rounded-2xl p-5 text-center">
                <Droplets className="mx-auto text-[#E30613] mb-2" size={28} />
                <p className="text-2xl font-extrabold text-[#E30613]">450</p>
                <p className="text-xs text-gray-500">ml par don</p>
              </div>
              <div className="bg-[#003DA5]/5 rounded-2xl p-5 text-center">
                <Heart className="mx-auto text-[#003DA5] mb-2" size={28} />
                <p className="text-2xl font-extrabold text-[#003DA5]">3</p>
                <p className="text-xs text-gray-500">vies sauv&eacute;es</p>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 text-center">
                <Clock className="mx-auto text-amber-600 mb-2" size={28} />
                <p className="text-2xl font-extrabold text-amber-600">10</p>
                <p className="text-xs text-gray-500">minutes</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 text-center">
                <Shield className="mx-auto text-emerald-600 mb-2" size={28} />
                <p className="text-2xl font-extrabold text-emerald-600">100%</p>
                <p className="text-xs text-gray-500">s&eacute;curis&eacute;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOS VALEURS ===== */}
      <section className="bg-[#F5F7FA] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#003DA5] uppercase tracking-wider mb-2">Nos Valeurs</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Ce qui nous anime</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: <Heart size={22} />, color: "bg-[#E30613]", title: "Solidarité", desc: "Unis par le don" },
              { icon: <Shield size={22} />, color: "bg-[#003DA5]", title: "Fiabilité", desc: "Sécurité et traçabilité" },
              { icon: <Zap size={22} />, color: "bg-amber-500", title: "Réactivité", desc: "Intervenir à temps" },
              { icon: <Globe size={22} />, color: "bg-emerald-500", title: "Innovation", desc: "Technologie au service de la santé" },
              { icon: <Users size={22} />, color: "bg-purple-500", title: "Humanité", desc: "Le don au cœur de la vie" },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <div className={`w-11 h-11 ${v.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>{v.icon}</div>
                <h3 className="text-sm font-bold text-gray-900">{v.title}</h3>
                <p className="text-[11px] text-gray-500 mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOS CENTRES ===== */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider mb-2">R&eacute;seau National</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Nos Centres</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: "N'Djaména", type: "Siège National", icon: <Building2 size={20} />, color: "bg-[#E30613]" },
              { city: "Moundou", type: "Provincial", icon: <MapPin size={20} />, color: "bg-[#003DA5]" },
              { city: "Abéché", type: "Provincial", icon: <MapPin size={20} />, color: "bg-[#003DA5]" },
              { city: "Sarh", type: "Provincial", icon: <MapPin size={20} />, color: "bg-[#003DA5]" },
            ].map((c, i) => (
              <div key={i} className="bg-[#F5F7FA] rounded-2xl p-5 text-center border border-gray-100">
                <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center text-white mx-auto mb-3`}>{c.icon}</div>
                <h4 className="font-bold text-gray-900">{c.city}</h4>
                <p className="text-xs text-gray-500 mt-1">{c.type}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            {["Hôpital Général de Référence", "Hôpital Mère-Enfant", "Hôpital Militaire", "Clinique La Liberté", "Hôpital de Moundou"].map((h, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-3 py-2.5 text-center border border-gray-100">
                <p className="text-xs text-gray-600 font-medium">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="bg-[#E30613] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">3 &eacute;tapes</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Comment donner ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Inscrivez-vous", desc: "Créez votre profil en 2 minutes sur VitaLink. C'est gratuit et sécurisé." },
              { step: "2", title: "Prenez rendez-vous", desc: "Choisissez le centre et l'heure qui vous conviennent. Recevez des rappels." },
              { step: "3", title: "Donnez et sauvez", desc: "Rendez-vous au centre. 10 minutes de don = 3 vies sauvées." },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 text-center border border-white/10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#E30613] text-xl font-extrabold mx-auto mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUI BÉNÉFICIE ===== */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#003DA5] uppercase tracking-wider mb-2">Impact</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Qui b&eacute;n&eacute;ficie de votre don ?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { img: "/images/anemie.png", label: "Anémie", stat: "40%" },
              { img: "/images/accident.png", label: "Accidents", stat: "25%" },
              { img: "/images/accouchement.png", label: "Accouchements", stat: "30%" },
              { img: "/images/chirurgie.png", label: "Chirurgies", stat: "100%" },
              { img: "/images/leucemie.png", label: "Leucémies", stat: "2x/sem" },
            ].map((b, i) => (
              <div key={i} className="bg-[#F5F7FA] rounded-2xl p-4 text-center border border-gray-100">
                <div className="h-20 flex items-center justify-center mb-2">
                  <img src={b.img} alt={b.label} className="h-full w-auto object-contain mix-blend-multiply" loading="lazy" />
                </div>
                <p className="text-xs font-bold text-gray-900">{b.label}</p>
                <p className="text-lg font-extrabold text-[#E30613]">{b.stat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ÉLIGIBILITÉ ===== */}
      <section className="bg-[#F5F7FA] py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Qui peut donner ?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { val: "18-65", unit: "ans", label: "Âge" },
              { val: "50+", unit: "kg", label: "Poids min." },
              { val: "56", unit: "jours", label: "Hommes" },
              { val: "90", unit: "jours", label: "Femmes" },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
                <p className="text-3xl font-extrabold text-[#003DA5]">{c.val}</p>
                <p className="text-sm font-bold text-gray-500">{c.unit}</p>
                <p className="text-xs text-gray-400 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">VitaLink vous accompagne :</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {["Rappel automatique quand vous redevenez éligible", "Suivi hémoglobine et tension à chaque don", "Historique complet et certificats"].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#E30613] uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Questions fr&eacute;quentes</h2>
          </div>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-semibold text-gray-900 pr-4">{item.q}</span>
                  <ChevronDown size={18} className={cn("text-gray-400 flex-shrink-0 transition-transform", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#003DA5] py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Heart className="mx-auto text-white/30 mb-4" size={40} />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Pr&ecirc;t &agrave; sauver des vies ?</h2>
          <p className="text-white/60 mt-3 max-w-md mx-auto">Rejoignez la communaut&eacute; VitaLink et participez &agrave; la sant&eacute; de notre pays.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#003DA5] rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Devenir donneur <ArrowRight size={18} />
            </Link>
            <Link href="/urgences" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-colors">
              <Phone size={18} /> Urgences
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <VitaLinkIcon size={32} />
              <div>
                <span className="font-extrabold text-[#E30613]">Vita</span>
                <span className="font-extrabold text-white">Link</span>
                <p className="text-[10px] text-gray-500">Plateforme Nationale de Transfusion Sanguine</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <Link href="/login" className="hover:text-white">Connexion</Link>
              <Link href="/register" className="hover:text-white">Inscription</Link>
              <Link href="/urgences" className="hover:text-white">Urgences</Link>
            </div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">&copy; 2026 VitaLink &middot; CNTS Tchad &middot; Tous droits r&eacute;serv&eacute;s</p>
            <p className="text-xs text-gray-500">D&eacute;velopp&eacute; par <a href="https://jidicom.lovable.app" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[#E30613]">JIDICOM</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
