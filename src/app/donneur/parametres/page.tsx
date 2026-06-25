"use client";

import { useState, useEffect } from "react";
import { Globe, Moon, Lock, Eye, EyeOff, Check } from "lucide-react";
import { getLang, setLang } from "@/lib/i18n";

export default function ParametresPage() {
  const [lang, setCurrentLang] = useState<"fr" | "ar">("fr");
  const [dark, setDark] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    setCurrentLang(getLang());
    const saved = localStorage.getItem("vitalink-dark") === "true";
    setDark(saved);
    if (saved) document.documentElement.classList.add("dark");
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("vitalink-dark", String(next));
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword.length < 6) {
      setPwError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Les mots de passe ne correspondent pas.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Erreur lors du changement de mot de passe.");
        return;
      }
      setPwSuccess("Mot de passe modifié avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPwError("Erreur de connexion au serveur.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>

      {/* Section 1: Langue */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#003DA5]/10 flex items-center justify-center">
            <Globe size={18} className="text-[#003DA5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Langue</h2>
            <p className="text-xs text-gray-500">Choisir la langue de l&apos;application</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLang("fr")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
              lang === "fr"
                ? "border-[#003DA5] bg-[#003DA5]/5 text-[#003DA5]"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {lang === "fr" && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
            Français
          </button>
          <button
            onClick={() => setLang("ar")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
              lang === "ar"
                ? "border-[#003DA5] bg-[#003DA5]/5 text-[#003DA5]"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {lang === "ar" && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
            العربية
          </button>
        </div>
      </div>

      {/* Section 2: Mode sombre */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-900/10 flex items-center justify-center">
              <Moon size={18} className="text-gray-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Mode sombre</h2>
              <p className="text-xs text-gray-500">Activer le thème sombre</p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              dark ? "bg-[#003DA5]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                dark ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 3: Changer le mot de passe */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-[#E30613]/10 flex items-center justify-center">
            <Lock size={18} className="text-[#E30613]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Changer le mot de passe</h2>
            <p className="text-xs text-gray-500">Mettre à jour votre mot de passe</p>
          </div>
        </div>

        {pwSuccess && (
          <div className="bg-green-50 text-green-700 text-sm p-3.5 rounded-xl mb-4 font-medium border border-green-200">
            {pwSuccess}
          </div>
        )}
        {pwError && (
          <div className="bg-[#E30613]/10 text-[#E30613] text-sm p-3.5 rounded-xl mb-4 font-medium border border-[#E30613]/15">
            {pwError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm pr-11 placeholder:text-gray-400"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm pr-11 placeholder:text-gray-400"
                placeholder="Min. 6 caractères"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm pr-11 placeholder:text-gray-400"
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="btn-primary w-full py-3.5 text-sm mt-2 disabled:opacity-50"
          >
            {pwLoading ? "Modification..." : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
