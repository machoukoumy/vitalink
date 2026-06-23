"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { formatDate } from "@/lib/utils";

interface Personnel {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Personnel | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const fetchPersonnel = () => {
    fetch("/api/personnel").then(r => r.json()).then(d => setPersonnel(d.personnel || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPersonnel(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      await fetch(`/api/personnel/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
    } else {
      await fetch("/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowModal(false);
    setEditItem(null);
    setForm({ name: "", email: "", password: "", phone: "" });
    fetchPersonnel();
  };

  const handleEdit = (p: Personnel) => {
    setEditItem(p);
    setForm({ name: p.name, email: p.email, password: "", phone: p.phone || "" });
    setShowModal(true);
  };

  const handleToggleActive = async (p: Personnel) => {
    await fetch(`/api/personnel/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    fetchPersonnel();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce membre du personnel ?")) return;
    await fetch(`/api/personnel/${id}`, { method: "DELETE" });
    fetchPersonnel();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Chargement...</div></div>;

  const columns = [
    { key: "name", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Téléphone", render: (p: Personnel) => p.phone || "-" },
    {
      key: "isActive", label: "Statut",
      render: (p: Personnel) => (
        <button onClick={() => handleToggleActive(p)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {p.isActive ? "Actif" : "Inactif"}
        </button>
      ),
    },
    { key: "createdAt", label: "Inscrit le", render: (p: Personnel) => formatDate(p.createdAt) },
    {
      key: "actions", label: "Actions",
      render: (p: Personnel) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit2 size={16} /></button>
          <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Personnel</h1>
          <p className="text-gray-500 mt-1">{personnel.length} membres</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: "", email: "", password: "", phone: "" }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <DataTable columns={columns} data={personnel} emptyMessage="Aucun personnel enregistré" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? "Modifier Personnel" : "Ajouter Personnel"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          {!editItem && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
            {editItem ? "Modifier" : "Ajouter"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
