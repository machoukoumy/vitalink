"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, PROVINCES, CENTER_TYPES } from "@/lib/utils";

interface CenterRecord {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { users: number; donors: number; donations: number; bloodStock: number };
}

const emptyForm = { name: "", type: "PROVINCIAL", province: "", address: "", phone: "", email: "" };

export default function SuperAdminCentresPage() {
  const [centers, setCenters] = useState<CenterRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCenters = () => {
    setLoading(true);
    fetch("/api/centers")
      .then(r => r.json())
      .then(d => setCenters(d.centers || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCenters(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (center: CenterRecord) => {
    setEditingId(center.id);
    setForm({
      name: center.name,
      type: center.type,
      province: center.province,
      address: center.address,
      phone: center.phone || "",
      email: center.email || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await fetch(`/api/centers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/centers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      fetchCenters();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce centre ? Cette action est irréversible.")) return;
    await fetch(`/api/centers/${id}`, { method: "DELETE" });
    fetchCenters();
  };

  const toggleActive = async (center: CenterRecord) => {
    await fetch(`/api/centers/${center.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...center, isActive: !center.isActive }),
    });
    fetchCenters();
  };

  const columns = [
    { key: "name", label: "Nom", render: (c: CenterRecord) => (
      <div className="flex items-center gap-2">
        <Building2 size={16} className="text-blue-600" />
        <div>
          <p className="font-medium text-gray-900">{c.name}</p>
          <p className="text-xs text-gray-500">{c.address}</p>
        </div>
      </div>
    )},
    { key: "type", label: "Type", render: (c: CenterRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.type === "HEADQUARTERS" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
        {CENTER_TYPES[c.type as keyof typeof CENTER_TYPES] || c.type}
      </span>
    )},
    { key: "province", label: "Province" },
    { key: "isActive", label: "Statut", render: (c: CenterRecord) => (
      <button onClick={() => toggleActive(c)}>
        <StatusBadge status={c.isActive ? "CONFIRMED" : "CANCELLED"} />
      </button>
    )},
    { key: "donors", label: "Donneurs", render: (c: CenterRecord) => c._count.donors },
    { key: "donations", label: "Dons", render: (c: CenterRecord) => c._count.donations },
    { key: "stock", label: "Stock", render: (c: CenterRecord) => c._count.bloodStock },
    { key: "createdAt", label: "Créé le", render: (c: CenterRecord) => formatDate(c.createdAt) },
    { key: "actions", label: "Actions", render: (c: CenterRecord) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
          <Pencil size={16} className="text-blue-600" />
        </button>
        <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Centres</h1>
          <p className="text-gray-500 mt-1">Tous les centres de transfusion sanguine</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Nouveau Centre
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={centers} emptyMessage="Aucun centre enregistr&eacute;" />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier le Centre" : "Nouveau Centre"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du centre *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                {Object.entries(CENTER_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
              <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                <option value="">S&eacute;lectionner...</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {submitting ? "Enregistrement..." : editingId ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
