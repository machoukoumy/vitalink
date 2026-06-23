"use client";

import { useState } from "react";
import Link from "next/link";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";
import { BLOOD_GROUPS, RH_FACTORS } from "@/lib/utils";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
    bloodGroup: "", rhFactor: "", dateOfBirth: "", gender: "",
    address: "", nationalId: "", weight: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Les mots de passe ne correspondent pas"); return; }
    if (form.password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      window.location.href = "/donneur";
    } catch { setError("Erreur de connexion au serveur"); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all placeholder:text-gray-400";

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F1F4F9]">
      <div className="flex-1 flex items-start md:items-center justify-center px-4 py-4 md:py-8 overflow-y-auto">
        <div className="w-full max-w-[560px]">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <VitaLinkIcon size={48} />
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#E30613]">Vita</span>
                <span className="font-extrabold text-xl tracking-tight text-[#003DA5]">Link</span>
              </div>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-5 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Inscription Donneur</h2>
            <p className="text-sm text-gray-400 mb-5">Cr&eacute;ez votre compte pour donner votre sang</p>

            {error && <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl mb-5 font-medium border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Section: Personnel */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Informations personnelles</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                    <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="email@exemple.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe *</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} required className={inputClass} placeholder="Min. 6 caractères" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmer *</label>
                    <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className={inputClass} placeholder="Répéter le mot de passe" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">T&eacute;l&eacute;phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+235 66 XX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">N&deg; Identit&eacute; *</label>
                    <input name="nationalId" value={form.nationalId} onChange={handleChange} required className={inputClass} placeholder="Numéro CNI" />
                  </div>
                </div>
              </div>

              {/* Section: Medical */}
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Informations m&eacute;dicales</p>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Groupe Sanguin *</label>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className={inputClass}>
                      <option value="">Choisir</option>
                      {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rh&eacute;sus *</label>
                    <select name="rhFactor" value={form.rhFactor} onChange={handleChange} required className={inputClass}>
                      <option value="">Choisir</option>
                      {RH_FACTORS.map(r => <option key={r} value={r}>{r === "+" ? "Positif (+)" : "Négatif (-)"}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date de naissance *</label>
                    <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Genre *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} required className={inputClass}>
                      <option value="">Choisir</option>
                      <option value="M">Masculin</option>
                      <option value="F">F&eacute;minin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Poids (kg)</label>
                    <input name="weight" type="number" value={form.weight} onChange={handleChange} className={inputClass} placeholder="Ex: 65" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse *</label>
                    <input name="address" value={form.address} onChange={handleChange} required className={inputClass} placeholder="Quartier, Ville" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-sm disabled:opacity-50">
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-400">
              D&eacute;j&agrave; un compte ?{" "}
              <Link href="/login" className="text-[#003DA5] hover:text-[#002D7A] font-semibold">Se connecter</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
