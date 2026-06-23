"use client";

import { useEffect, useState } from "react";
import { Plus, Shield, Search } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

interface AdminRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  center: { id: string; name: string } | null;
  hospital: { id: string; name: string } | null;
}

interface CenterOption {
  id: string;
  name: string;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrateur",
  PERSONNEL: "Personnel",
  HOSPITAL: "Hôpital",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
  ADMIN: "bg-red-100 text-red-800",
  PERSONNEL: "bg-blue-100 text-blue-800",
  HOSPITAL: "bg-teal-100 text-teal-800",
};

const emptyForm = { name: "", email: "", password: "", phone: "", role: "ADMIN", centerId: "" };

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [centers, setCenters] = useState<CenterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchAdmins = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    fetch(`/api/personnel?${params}`)
      .then(r => r.json())
      .then(d => setAdmins(d.personnel || []))
      .finally(() => setLoading(false));
  };

  const fetchCenters = () => {
    fetch("/api/centers")
      .then(r => r.json())
      .then(d => setCenters((d.centers || []).map((c: CenterOption) => ({ id: c.id, name: c.name }))));
  };

  useEffect(() => { fetchAdmins(); fetchCenters(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdmins();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        setForm(emptyForm);
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de la création");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAdmins = admins.filter(a => {
    if (roleFilter && a.role !== roleFilter) return false;
    return true;
  });

  const columns = [
    { key: "name", label: "Nom", render: (a: AdminRecord) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
          {a.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900">{a.name}</p>
          <p className="text-xs text-gray-500">{a.email}</p>
        </div>
      </div>
    )},
    { key: "phone", label: "Téléphone", render: (a: AdminRecord) => a.phone || "-" },
    { key: "role", label: "Rôle", render: (a: AdminRecord) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[a.role] || "bg-gray-100 text-gray-800"}`}>
        {ROLE_LABELS[a.role] || a.role}
      </span>
    )},
    { key: "center", label: "Centre", render: (a: AdminRecord) => a.center?.name || a.hospital?.name || "-" },
    { key: "isActive", label: "Statut", render: (a: AdminRecord) => (
      <StatusBadge status={a.isActive ? "CONFIRMED" : "CANCELLED"} />
    )},
    { key: "createdAt", label: "Créé le", render: (a: AdminRecord) => formatDate(a.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Administrateurs</h1>
          <p className="text-gray-500 mt-1">Tous les utilisateurs administratifs du syst&egrave;me</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Nouvel Administrateur
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
        </form>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
          <option value="">Tous les r&ocirc;les</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Administrateur</option>
          <option value="PERSONNEL">Personnel</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <DataTable columns={columns} data={filteredAdmins} emptyMessage="Aucun administrateur trouv&eacute;" />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel Administrateur">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">T&eacute;l&eacute;phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">R&ocirc;le *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                <option value="ADMIN">Administrateur</option>
                <option value="PERSONNEL">Personnel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Centre</label>
              <select value={form.centerId} onChange={e => setForm({ ...form, centerId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                <option value="">Aucun centre</option>
                {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {submitting ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
