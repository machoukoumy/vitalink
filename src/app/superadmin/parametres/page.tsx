"use client";

import { useState } from "react";
import { Settings, Shield, Database, Server, Save, RefreshCw } from "lucide-react";

export default function SuperAdminParametresPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [systemConfig, setSystemConfig] = useState({
    systemName: "Centre National de Transfusion Sanguine",
    phone: "+235 22 51 XX XX",
    email: "contact@cnts.td",
    address: "N'Djaména, Tchad",
  });

  const [donationRules, setDonationRules] = useState({
    minDonationInterval: 56,
    minWeight: 50,
    minAge: 18,
    maxAge: 65,
    bloodShelfLife: 42,
    minHemoglobin: 12.5,
    maxDonationsPerYear: 4,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulation de sauvegarde - peut etre connecte a un endpoint API futur
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Param&egrave;tres Syst&egrave;me</h1>
          <p className="text-gray-500 mt-1">Configuration globale du syst&egrave;me CNTS</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
          {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Enregistrement..." : saved ? "Enregistré !" : "Enregistrer"}
        </button>
      </div>

      <div className="grid gap-6">
        {/* Informations Generales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informations G&eacute;n&eacute;rales</h3>
              <p className="text-sm text-gray-500">Coordonn&eacute;es et informations du syst&egrave;me</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Syst&egrave;me</label>
              <input value={systemConfig.systemName}
                onChange={e => setSystemConfig({ ...systemConfig, systemName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
              <input value={systemConfig.phone}
                onChange={e => setSystemConfig({ ...systemConfig, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={systemConfig.email}
                onChange={e => setSystemConfig({ ...systemConfig, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input value={systemConfig.address}
                onChange={e => setSystemConfig({ ...systemConfig, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Regles de Don */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">R&egrave;gles de Don de Sang</h3>
              <p className="text-sm text-gray-500">Param&egrave;tres m&eacute;dicaux et r&egrave;gles de s&eacute;curit&eacute;</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intervalle minimum entre dons (jours)</label>
              <input type="number" value={donationRules.minDonationInterval}
                onChange={e => setDonationRules({ ...donationRules, minDonationInterval: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids minimum donneur (kg)</label>
              <input type="number" value={donationRules.minWeight}
                onChange={e => setDonationRules({ ...donationRules, minWeight: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">&Acirc;ge minimum (ans)</label>
              <input type="number" value={donationRules.minAge}
                onChange={e => setDonationRules({ ...donationRules, minAge: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">&Acirc;ge maximum (ans)</label>
              <input type="number" value={donationRules.maxAge}
                onChange={e => setDonationRules({ ...donationRules, maxAge: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dur&eacute;e conservation sang (jours)</label>
              <input type="number" value={donationRules.bloodShelfLife}
                onChange={e => setDonationRules({ ...donationRules, bloodShelfLife: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">H&eacute;moglobine minimum (g/dL)</label>
              <input type="number" step="0.1" value={donationRules.minHemoglobin}
                onChange={e => setDonationRules({ ...donationRules, minHemoglobin: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dons maximum par an</label>
              <input type="number" value={donationRules.maxDonationsPerYear}
                onChange={e => setDonationRules({ ...donationRules, maxDonationsPerYear: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Informations Systeme */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Informations Syst&egrave;me</h3>
              <p className="text-sm text-gray-500">D&eacute;tails techniques du syst&egrave;me</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Server size={16} className="text-gray-500" />
                <p className="text-sm font-medium text-gray-700">Application</p>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Version: <span className="font-medium text-gray-900">1.0.0</span></p>
                <p>Framework: <span className="font-medium text-gray-900">Next.js 16</span></p>
                <p>Authentification: <span className="font-medium text-gray-900">JWT (jose)</span></p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Database size={16} className="text-gray-500" />
                <p className="text-sm font-medium text-gray-700">Base de donn&eacute;es</p>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Type: <span className="font-medium text-gray-900">SQLite</span></p>
                <p>ORM: <span className="font-medium text-gray-900">Prisma</span></p>
                <p>Environnement: <span className="font-medium text-gray-900">Développement</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de danger */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900">Zone Dangereuse</h3>
              <p className="text-sm text-red-500">Actions irr&eacute;versibles - Proc&eacute;dez avec pr&eacute;caution</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-100">
              <div>
                <p className="text-sm font-medium text-gray-900">R&eacute;initialiser les statistiques</p>
                <p className="text-xs text-gray-500">Remet &agrave; z&eacute;ro tous les compteurs de statistiques</p>
              </div>
              <button className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                onClick={() => alert("Cette fonctionnalité sera disponible dans une version ultérieure.")}>
                R&eacute;initialiser
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Exporter la base de donn&eacute;es</p>
                <p className="text-xs text-gray-500">T&eacute;l&eacute;charger une copie compl&egrave;te de la base de donn&eacute;es</p>
              </div>
              <button className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                onClick={() => alert("Cette fonctionnalité sera disponible dans une version ultérieure.")}>
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
