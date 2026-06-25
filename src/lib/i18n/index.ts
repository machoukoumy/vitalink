"use client";

import { createContext, useContext } from "react";
import fr from "./fr";
import ar from "./ar";
import type { Translations } from "./fr";

export type Lang = "fr" | "ar";

const translations: Record<Lang, Translations> = { fr, ar };

export function getTranslations(lang: Lang): Translations {
  return translations[lang] || fr;
}

export function getLang(): Lang {
  if (typeof window === "undefined") return "fr";
  return (localStorage.getItem("vitalink-lang") as Lang) || "fr";
}

export function setLang(lang: Lang) {
  localStorage.setItem("vitalink-lang", lang);
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lang;
  window.location.reload();
}

export const I18nContext = createContext<Translations>(fr);
export const useT = () => useContext(I18nContext);
