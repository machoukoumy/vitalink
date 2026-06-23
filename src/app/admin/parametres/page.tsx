"use client";

import { Settings, Shield, Database } from "lucide-react";

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Param&egrave;tres</h1>
        <p className="text-gray-500 mt-1">Configuration du syst&egrave;me CNTS</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Informations G&eacute;n&eacute;rales</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Centre</label>
              <input defaultValue="Centre National de Transfusion Sanguine" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
              <input defaultValue="+235 22 51 XX XX" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input defaultValue="contact@cnts.td" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input defaultValue="N'Djaména, Tchad" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">R&egrave;gles de Don</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intervalle minimum entre dons (jours)</label>
              <input type="number" defaultValue="56" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids minimum donneur (kg)</label>
              <input type="number" defaultValue="50" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">&Acirc;ge minimum (ans)</label>
              <input type="number" defaultValue="18" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dur&eacute;e conservation sang (jours)</label>
              <input type="number" defaultValue="42" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database size={20} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Syst&egrave;me</h3>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Version: 1.0.0</p>
            <p>Base de donn&eacute;es: SQLite</p>
            <p>Framework: Next.js</p>
          </div>
        </div>
      </div>
    </div>
  );
}
