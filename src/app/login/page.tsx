"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      const redir: Record<string, string> = { SUPER_ADMIN: "/superadmin", ADMIN: "/admin", PERSONNEL: "/personnel", HOSPITAL: "/hopital", DONOR: "/donneur" };
      window.location.href = redir[data.user.role] || "/donneur";
    } catch { setError("Erreur de connexion au serveur"); }
    finally { setLoading(false); }
  };

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-y-auto overflow-x-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#F0F0F0]" />
        <img
          src="/images/don-sang.png"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[50%] h-auto opacity-[0.08] blur-[1px] mix-blend-multiply"
          aria-hidden="true"
        />
      </div>

      {/* Glass content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center gap-3">
              <VitaLinkIcon size={56} />
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-[#E30613]">Vita</span>
                <span className="font-extrabold text-2xl tracking-tight text-[#003DA5]">Link</span>
                <p className="text-[11px] text-gray-500 font-medium mt-1">Connecter les donneurs. Sauver des vies.</p>
              </div>
            </Link>
          </div>

          {/* Login card - glassmorphism */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/5 border border-white/70 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Connexion</h2>
            <p className="text-sm text-gray-400 mb-6">Acc&eacute;dez &agrave; votre espace VitaLink</p>

            {error && (
              <div className="bg-[#E30613]/10 text-[#E30613] text-sm p-3.5 rounded-xl mb-5 font-medium border border-[#E30613]/15">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 backdrop-blur-sm"
                  placeholder="votre@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm pr-11 placeholder:text-gray-400 backdrop-blur-sm"
                    placeholder="********" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm mt-2 disabled:opacity-50">
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-[#003DA5] hover:text-[#002D7A] font-semibold">S&apos;inscrire</Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">&larr; Retour &agrave; l&apos;accueil</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
