"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Hospital, UserPlus } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, PROVINCES, HOSPITAL_TYPES } from "@/lib/utils";

interface HospitalRecord {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  _count: { users: number; bloodRequests: number };
}

const emptyForm = { name: "", type: "PUBLIC", province: "", address: "", phone: "", email: "" };
const emptyUserForm = { name: "", email: "", password: "", phone: "" };

export default function SuperAdminHopitauxPage() {
  const [hospitals, setHospitals] = useState<HospitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchHospitals = () => {
    setLoading(true);
    fetch("/api/hospitals")
      .then(r => r.json())
      .then(d => setHospitals(d.hospitals || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHospitals(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (hospital: HospitalRecord) => {
    setEditingId(hospital.id);
    setForm({
      name: hospital.name,
      type: hospital.type,
      province: hospital.province,
      address: hospital.address,
      phone: hospital.phone || "",
      email: hospital.email || "",
    });
    setModalOpen(true);
  };

  const openCreateUser = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    setUserForm(emptyUserForm);
    setUserModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await fetch(`/api/hospitals/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/hospitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      fetchHospitals();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospitalId) return;
    setSubmitting(true);
    try {
      await fetch(`/api/hospitals/${selectedHospitalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createUser: userForm }),
      });
      setUserModalOpen(false);
      fetchHospitals();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet hôpital ? Cette action est irréversible.")) return;
    await fetch(`/api/hospitals/${id}`, { method: "DELETE" });
    fetchHospitals();
  };

  const toggleActive = async (hospital: HospitalRecord) => {
    await fetch(`/api/hospitals/${hospital.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...hospital, isActive: !hospital.isActive }),
    });
    fetchHospitals();
  };

  const columns = [
    { key: "name", label: "Nom", render: (h: HospitalRecord) => (
      <div className="flex items-center gap-2">
        <Hospital size={16} className="text-green-600" />
        <div>
          <p className="font-medium text-gray-900">{h.name}</p>
          <p className="text-xs text-gray-500">{h.address}</p>
        </div>
      </div>
    )},
    { key: "type", label: "Type", render: (h: HospitalRecord) => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
        {HOSPITAL_TYPES[h.type as keyof typeof HOSPITAL_TYPES] || h.type}
      </span>
    )},
    { key: "province", label: "Province" },
    { key: "isActive", label: "Statut", render: (h: HospitalRecord) => (
      <button onClick={() => toggleActive(h)}>
        <StatusBadge status={h.isActive ? "CONFIRMED" : "CANCELLED"} />
      </button>
    )},
    { key: "users", label: "Utilisateurs", render: (h: HospitalRecord) => h._count.users },
    { key: "requests", label: "Demandes", render: (h: HospitalRecord) => h._count.bloodRequests },
    { key: "createdAt", label: "Créé le", render: (h: HospitalRecord) => formatDate(h.createdAt) },
    { key: "actions", label: "Actions", render: (h: HospitalRecord) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openCreateUser(h.id)} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Créer un utilisateur">
          <UserPlus size={16} className="text-green-600" />
        </button>
        <button onClick={() => openEdit(h)} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
          <Pencil size={16} className="text-blue-600" />
        </button>
        <button onClick={() => handleDelete(h.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des H&ocirc;pitaux</h1>
          <p className="text-gray-500 mt-1">Tous les h&ocirc;pitaux partenaires du CNTS</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Nouvel H&ocirc;pital
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={hospitals} emptyMessage="Aucun h&ocirc;pital enregistr&eacute;" />
      )}

      {/* Modal Hopital */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier l'Hôpital" : "Nouvel Hôpital"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                {Object.entries(HOSPITAL_TYPES).map(([key, label]) => (
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

      {/* Modal Utilisateur Hopital */}
      <Modal isOpen={userModalOpen} onClose={() => setUserModalOpen(false)} title="Cr&eacute;er un Compte H&ocirc;pital">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required minLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
            <input value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setUserModalOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {submitting ? "Création..." : "Créer le Compte"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
