"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { VitaLinkIcon } from "@/components/VitaLinkLogo";

export default function MotDePasseOubliePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi du code.");
        return;
      }
      setSuccess("Un code de réinitialisation a été envoyé à votre email.");
      setStep(2);
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la réinitialisation.");
        return;
      }
      setSuccess("Mot de passe réinitialisé avec succès ! Redirection...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
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

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/5 border border-white/70 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {step === 1 ? "Mot de passe oublié" : "Réinitialiser"}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {step === 1
                ? "Entrez votre email pour recevoir un code"
                : "Entrez le code reçu et votre nouveau mot de passe"}
            </p>

            {error && (
              <div className="bg-[#E30613]/10 text-[#E30613] text-sm p-3.5 rounded-xl mb-5 font-medium border border-[#E30613]/15">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 text-sm p-3.5 rounded-xl mb-5 font-medium border border-green-200">
                {success}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 backdrop-blur-sm pl-11"
                      placeholder="votre@email.com"
                      required
                    />
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm mt-2 disabled:opacity-50"
                >
                  {loading ? "Envoi..." : "Envoyer le code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Code de vérification</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 backdrop-blur-sm pl-11"
                      placeholder="123456"
                      required
                    />
                    <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl text-sm pr-11 placeholder:text-gray-400 backdrop-blur-sm"
                      placeholder="Min. 6 caractères"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm mt-2 disabled:opacity-50"
                >
                  {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <Link href="/login" className="text-[#003DA5] hover:text-[#002D7A] font-semibold inline-flex items-center gap-1">
                <ArrowLeft size={14} />
                Retour à la connexion
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">&larr; Retour à l&apos;accueil</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
