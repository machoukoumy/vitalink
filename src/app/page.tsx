"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { cn } from "@/lib/utils";

const slides = [
  { img: "/images/don-sang.png", title: "Donnez votre sang,\nsauvez des vies", desc: "VitaLink connecte les donneurs, les hôpitaux et le CNTS du Tchad.", accent: "text-[#E30613]" },
  { img: "/images/anemie.png", title: "Des enfants\nont besoin de vous", desc: "L'anémie sévère touche des milliers d'enfants. Votre don les sauve.", accent: "text-[#E30613]" },
  { img: "/images/accident.png", title: "Chaque minute\ncompte", desc: "Les victimes d'accidents ont besoin de transfusions immédiates.", accent: "text-orange-600" },
  { img: "/images/accouchement.png", title: "Protégez\nles mamans", desc: "L'hémorragie post-partum est la 1ère cause de mortalité maternelle.", accent: "text-pink-600" },
  { img: "/images/chirurgie.png", title: "Rendez les\nchirurgies possibles", desc: "Chaque intervention nécessite des réserves de sang.", accent: "text-[#003DA5]" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-white">
      {/* Top bar - always clickable */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 md:px-8 md:pt-5 flex-shrink-0"
        style={{ paddingTop: "calc(12px + env(safe-area-inset-top, 0px))" }}>
        <div className="flex items-center gap-2">
          <VitaLinkIcon size={28} />
          <span className="font-extrabold text-[15px] text-[#E30613]">Vita</span>
          <span className="font-extrabold text-[15px] text-[#003DA5]">Link</span>
        </div>
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl active:bg-gray-200">
          Connexion
        </Link>
      </div>

      {/* Image - lazy loaded, smaller */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 md:px-8 min-h-0">
        <div className="flex items-center justify-center mb-4" style={{ height: "clamp(160px, 30dvh, 280px)" }}>
          <img
            src={slide.img}
            alt=""
            className="max-h-full w-auto object-contain mix-blend-multiply"
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className="text-center max-w-md mx-auto">
          <h1 className={cn("text-[24px] md:text-4xl font-extrabold leading-[1.15] tracking-tight whitespace-pre-line", slide.accent)}>
            {slide.title}
          </h1>
          <p className="text-gray-500 mt-2 text-[14px] md:text-lg leading-relaxed">
            {slide.desc}
          </p>
        </div>
      </div>

      {/* Bottom - dots + buttons */}
      <div className="px-5 pb-4 md:px-8 md:pb-6 flex-shrink-0"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={cn("h-2 rounded-full transition-all duration-300",
                i === current ? "w-7 bg-[#E30613]" : "w-2 bg-gray-300"
              )} />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
          {isLast ? (
            <>
              <Link href="/register"
                className="w-full py-3.5 bg-[#E30613] text-white rounded-2xl font-bold text-[15px] text-center active:bg-[#C00510] flex items-center justify-center gap-2">
                Devenir Donneur <ArrowRight size={18} />
              </Link>
              <Link href="/login"
                className="w-full py-3.5 bg-[#003DA5] text-white rounded-2xl font-bold text-[15px] text-center active:bg-[#002D7A]">
                Se connecter
              </Link>
              <Link href="/urgences"
                className="w-full py-2 text-[#E30613] font-semibold text-sm text-center">
                Voir les urgences en cours
              </Link>
            </>
          ) : (
            <>
              <button onClick={() => setCurrent(c => c + 1)}
                className="w-full py-3.5 bg-[#E30613] text-white rounded-2xl font-bold text-[15px] text-center active:bg-[#C00510] flex items-center justify-center gap-2">
                Suivant <ArrowRight size={18} />
              </button>
              <button onClick={() => setCurrent(slides.length - 1)}
                className="w-full py-2 text-gray-400 font-semibold text-sm text-center active:text-gray-600">
                Passer
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-3">
          <Link href="/a-propos" className="text-[10px] text-gray-400 font-medium">&Agrave; propos</Link>
          <span className="text-gray-300">&middot;</span>
          <Link href="/urgences" className="text-[10px] text-gray-400 font-medium">Urgences</Link>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-1">
          &copy; 2026 VitaLink &middot; D&eacute;velopp&eacute; par{" "}
          <a href="https://jidicom.lovable.app" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-400">JIDICOM</a>
        </p>
      </div>
    </div>
  );
}
