"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { PROVINCES } from "@/lib/utils";

interface CenterRecord {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  _count: { users: number; donors: number; donations: number; bloodStock: number };
}

export default function AdminCentresPage() {
  const [centers, setCenters] = useState<CenterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<CenterRecord | null>(null);
  const [form, setForm] = useState({ name: "", type: "PROVINCIAL", province: "", address: "", phone: "", email: "" });

  const fetchData = () => {
    fetch("/api/centers").then(r => r.json()).then(d => setCenters(d.centers || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      await fetch(`/api/centers/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/centers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    setEditItem(null);
    setForm({ name: "", type: "PROVINCIAL", province: "", address: "", phone: "", email: "" });
    fetchData();
  };

  const handleEdit = (c: CenterRecord) => {
    setEditItem(c);
    setForm({ name: c.name, type: c.type, province: c.province, address: c.address, phone: c.phone || "", email: c.email || "" });
    setShowModal(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  const columns = [
    { key: "name", label: "Nom", render: (c: CenterRecord) => <span className="font-medium">{c.name}</span> },
    { key: "type", label: "Type", render: (c: CenterRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.type === "HEADQUARTERS" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
        {c.type === "HEADQUARTERS" ? "Siège" : "Provincial"}
      </span>
    )},
    { key: "province", label: "Province" },
    { key: "donors", label: "Donneurs", render: (c: CenterRecord) => c._count.donors },
    { key: "donations", label: "Dons", render: (c: CenterRecord) => c._count.donations },
    { key: "stock", label: "Stock", render: (c: CenterRecord) => c._count.bloodStock },
    { key: "isActive", label: "Statut", render: (c: CenterRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {c.isActive ? "Actif" : "Inactif"}
      </span>
    )},
    { key: "actions", label: "", render: (c: CenterRecord) => (
      <button onClick={() => handleEdit(c)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={16} /></button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centres de Transfusion</h1>
          <p className="text-gray-500 mt-1">{centers.length} centre(s)</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: "", type: "PROVINCIAL", province: "", address: "", phone: "", email: "" }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Nouveau Centre
        </button>
      </div>

      <DataTable columns={columns} data={centers} emptyMessage="Aucun centre enregistré" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? "Modifier le Centre" : "Nouveau Centre"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du centre *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                <option value="PROVINCIAL">Provincial</option>
                <option value="HEADQUARTERS">Si&egrave;ge</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
              <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                <option value="">S&eacute;lectionner</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
            {editItem ? "Modifier" : "Créer le centre"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
