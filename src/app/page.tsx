"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { cn } from "@/lib/utils";

const slides = [
  { img: "/images/don-sang.png", bg: "bg-white", title: "Donnez votre sang,\nsauvez des vies", desc: "VitaLink connecte les donneurs, les hôpitaux et le CNTS du Tchad.", accent: "text-[#E30613]" },
  { img: "/images/anemie.png", bg: "bg-red-50", title: "Des enfants\nont besoin de vous", desc: "L'anémie sévère touche des milliers d'enfants. Votre don les sauve.", accent: "text-[#E30613]" },
  { img: "/images/accident.png", bg: "bg-orange-50", title: "Chaque minute\ncompte", desc: "Les victimes d'accidents ont besoin de transfusions immédiates.", accent: "text-orange-600" },
  { img: "/images/accouchement.png", bg: "bg-pink-50", title: "Protégez\nles mamans", desc: "L'hémorragie post-partum est la 1ère cause de mortalité maternelle.", accent: "text-pink-600" },
  { img: "/images/chirurgie.png", bg: "bg-blue-50", title: "Rendez les\nchirurgies possibles", desc: "Chaque intervention nécessite des réserves de sang.", accent: "text-[#003DA5]" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + slides.length) % slides.length), []);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => { touchEnd.current = e.touches[0].clientX; };
  const onTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div
      className={cn("h-[100dvh] flex flex-col overflow-hidden transition-colors duration-500", slide.bg)}
      onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-1 md:px-8 md:pt-5 flex-shrink-0"
        style={{ paddingTop: "calc(12px + var(--safe-top, 0px))" }}>
        <div className="flex items-center gap-2">
          <VitaLinkIcon size={28} />
          <span className="font-extrabold text-[15px] text-[#E30613]">Vita</span>
          <span className="font-extrabold text-[15px] text-[#003DA5]">Link</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-gray-500 active:text-[#003DA5]">
          Connexion
        </Link>
      </div>

      {/* Carousel content - swipable */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 md:px-8 relative min-h-0">
        {/* Image */}
        <div className="flex items-center justify-center mb-4 md:mb-6" style={{ height: "clamp(180px, 35dvh, 320px)" }}>
          <img
            key={current}
            src={slide.img}
            alt=""
            className="max-h-full w-auto object-contain mix-blend-multiply animate-[fadeSlide_0.35s_ease]"
            draggable={false}
          />
        </div>

        {/* Text */}
        <div className="text-center max-w-md mx-auto px-2" key={`t-${current}`}>
          <h1 className={cn("text-[26px] md:text-5xl font-extrabold leading-[1.15] tracking-tight whitespace-pre-line animate-[fadeSlide_0.35s_ease]", slide.accent)}>
            {slide.title}
          </h1>
          <p className="text-gray-500 mt-2.5 md:mt-4 text-[15px] md:text-lg leading-relaxed animate-[fadeSlide_0.4s_ease]">
            {slide.desc}
          </p>
        </div>

        {/* Desktop arrows */}
        <button onClick={prev} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-lg border border-gray-100">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <button onClick={next} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-lg border border-gray-100">
          <ChevronRight size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Bottom section */}
      <div className="px-5 pb-4 md:px-8 md:pb-6 flex-shrink-0" style={{ paddingBottom: "calc(16px + var(--safe-bottom, 0px))" }}>
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
                className="w-full py-2.5 text-[#E30613] font-semibold text-sm text-center">
                Voir les urgences en cours
              </Link>
            </>
          ) : (
            <>
              <button onClick={next}
                className="w-full py-3.5 bg-[#E30613] text-white rounded-2xl font-bold text-[15px] text-center active:bg-[#C00510] flex items-center justify-center gap-2">
                Suivant <ArrowRight size={18} />
              </button>
              <button onClick={() => setCurrent(slides.length - 1)}
                className="w-full py-2.5 text-gray-400 font-semibold text-sm text-center active:text-gray-600">
                Passer
              </button>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-gray-300 mt-3">
          &copy; 2026 VitaLink &middot; D&eacute;velopp&eacute; par{" "}
          <a href="https://jidicom.lovable.app" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-400">JIDICOM</a>
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
