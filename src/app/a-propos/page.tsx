"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Heart, Shield, Users, Globe } from "lucide-react";
import { VitaLinkLogoFull } from "@/components/VitaLinkLogo";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Qui peut donner du sang ?",
    answer:
      "Toute personne en bonne santé, âgée de 18 à 65 ans et pesant plus de 50 kg peut donner du sang. Certaines conditions médicales ou traitements peuvent temporairement empêcher le don.",
  },
  {
    question: "Combien de temps dure un don ?",
    answer:
      "Le prélèvement en lui-même dure environ 10 minutes. En comptant l’accueil, le questionnaire médical, le prélèvement et la collation, prévoyez environ 45 minutes au total.",
  },
  {
    question: "À quelle fréquence peut-on donner ?",
    answer:
      "Les hommes peuvent donner tous les 56 jours (8 semaines) et les femmes tous les 90 jours (12 semaines). Cela permet à votre organisme de reconstituer ses réserves en toute sécurité.",
  },
  {
    question: "Le don est-il douloureux ?",
    answer:
      "Non, le don de sang n’est pas douloureux. Vous ressentirez une petite piqûre lors de l’insertion de l’aiguille, similaire à une prise de sang classique. Le personnel médical veille à votre confort tout au long du processus.",
  },
  {
    question: "Que devient mon sang après le don ?",
    answer:
      "Après le prélèvement, votre sang est testé pour vérifier sa compatibilité et l’absence de maladies transmissibles. Il est ensuite séparé en ses différents composants (globules rouges, plaquettes, plasma) puis distribué aux hôpitaux qui en ont besoin.",
  },
  {
    question: "Comment m’inscrire ?",
    answer:
      "Vous pouvez vous inscrire directement via l’application VitaLink. Créez votre compte, complétez votre profil et prenez rendez-vous dans le centre de transfusion le plus proche de chez vous.",
  },
];

export default function AProposPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F1F4F9]">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#E30613] transition-colors"
        >
          <ArrowLeft size={16} />
          Retour
        </Link>

        {/* Logo */}
        <div className="flex justify-center">
          <VitaLinkLogoFull />
        </div>

        {/* A propos de VitaLink */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart size={20} className="text-[#E30613]" />
            &Agrave; propos de VitaLink
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            VitaLink est la plateforme num&eacute;rique du Centre National de Transfusion
            Sanguine (CNTS) du Tchad. Notre mission est de faciliter et
            s&eacute;curiser le don de sang en connectant donneurs, centres de collecte et
            h&ocirc;pitaux &agrave; travers tout le pays.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <Shield size={18} className="text-[#E30613] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">S&eacute;curit&eacute;</p>
                <p className="text-[11px] text-gray-500">
                  Tra&ccedil;abilit&eacute; compl&egrave;te de chaque don
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <Users size={18} className="text-[#003DA5] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Accessibilit&eacute;</p>
                <p className="text-[11px] text-gray-500">
                  Donner du sang n&apos;a jamais &eacute;t&eacute; aussi simple
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <Globe size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Solidarit&eacute;</p>
                <p className="text-[11px] text-gray-500">
                  Ensemble, sauvons des vies
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Le CNTS du Tchad */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Le CNTS du Tchad</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Le Centre National de Transfusion Sanguine (CNTS) est l&apos;&eacute;tablissement
            public de r&eacute;f&eacute;rence au Tchad pour la collecte, le traitement, la
            qualification et la distribution des produits sanguins. Il assure la
            s&eacute;curit&eacute; transfusionnelle sur l&apos;ensemble du territoire national &agrave;
            travers ses centres r&eacute;gionaux et ses &eacute;quipes mobiles de collecte.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Le CNTS travaille en &eacute;troite collaboration avec les h&ocirc;pitaux, les
            associations de donneurs et les partenaires internationaux pour
            garantir un approvisionnement suffisant et s&ucirc;r en produits sanguins.
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Comment donner ?</h2>
          <p className="text-sm text-gray-500 mb-2">
            Questions fr&eacute;quentes sur le don de sang
          </p>
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-gray-400 flex-shrink-0 transition-transform duration-200",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 space-y-2">
          <p className="text-xs text-gray-400">
            D&eacute;velopp&eacute; par{" "}
            <a
              href="https://jidicom.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#003DA5] font-semibold hover:underline"
            >
              JIDICOM
            </a>
          </p>
          <p className="text-[10px] text-gray-300">
            VitaLink - Plateforme de gestion du don de sang au Tchad
          </p>
        </div>
      </div>
    </div>
  );
}
