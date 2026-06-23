"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, UserPlus } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { PROVINCES } from "@/lib/utils";

interface HospitalRecord {
  id: string;
  name: string;
  type: string;
  province: string;
  address: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  _count: { users: number; bloodRequests: number };
}

export default function AdminHopitauxPage() {
  const [hospitals, setHospitals] = useState<HospitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editItem, setEditItem] = useState<HospitalRecord | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalRecord | null>(null);
  const [form, setForm] = useState({ name: "", type: "PUBLIC", province: "", address: "", phone: "", email: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", phone: "" });

  const fetchData = () => {
    fetch("/api/hospitals").then(r => r.json()).then(d => setHospitals(d.hospitals || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      await fetch(`/api/hospitals/${editItem.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/hospitals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setShowModal(false);
    setEditItem(null);
    fetchData();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital) return;
    await fetch(`/api/hospitals/${selectedHospital.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ createUser: userForm }),
    });
    setShowUserModal(false);
    setUserForm({ name: "", email: "", password: "", phone: "" });
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  const typeLabels: Record<string, string> = { PUBLIC: "Public", PRIVATE: "Privé", MILITARY: "Militaire", UNIVERSITY: "Universitaire" };

  const columns = [
    { key: "name", label: "Nom", render: (h: HospitalRecord) => <span className="font-medium">{h.name}</span> },
    { key: "type", label: "Type", render: (h: HospitalRecord) => (
      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">{typeLabels[h.type] || h.type}</span>
    )},
    { key: "province", label: "Province" },
    { key: "users", label: "Comptes", render: (h: HospitalRecord) => h._count.users },
    { key: "requests", label: "Demandes", render: (h: HospitalRecord) => h._count.bloodRequests },
    { key: "isActive", label: "Statut", render: (h: HospitalRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${h.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        {h.isActive ? "Actif" : "Inactif"}
      </span>
    )},
    { key: "actions", label: "Actions", render: (h: HospitalRecord) => (
      <div className="flex items-center gap-1">
        <button onClick={() => { setEditItem(h); setForm({ name: h.name, type: h.type, province: h.province, address: h.address, phone: h.phone || "", email: h.email || "" }); setShowModal(true); }}
          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600" title="Modifier"><Edit2 size={16} /></button>
        <button onClick={() => { setSelectedHospital(h); setShowUserModal(true); }}
          className="p-1.5 hover:bg-green-50 rounded-lg text-green-600" title="Créer un compte"><UserPlus size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">H&ocirc;pitaux</h1>
          <p className="text-gray-500 mt-1">{hospitals.length} h&ocirc;pital(aux)</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ name: "", type: "PUBLIC", province: "", address: "", phone: "", email: "" }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Nouvel H&ocirc;pital
        </button>
      </div>

      <DataTable columns={columns} data={hospitals} emptyMessage="Aucun hôpital enregistré" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? "Modifier l'hôpital" : "Nouvel Hôpital"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Priv&eacute;</option>
                <option value="MILITARY">Militaire</option>
                <option value="UNIVERSITY">Universitaire</option>
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
            {editItem ? "Modifier" : "Créer"}
          </button>
        </form>
      </Modal>

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={`Créer un compte pour ${selectedHospital?.name || ""}`}>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
            <input value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
            Cr&eacute;er le compte h&ocirc;pital
          </button>
        </form>
      </Modal>
    </div>
  );
}
