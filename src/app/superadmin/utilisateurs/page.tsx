"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, Shield, UserCog, Users, Building2, Hospital, Droplets } from "lucide-react";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import { formatDate, cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  SUPER_ADMIN: { label: "Super Admin", color: "bg-purple-100 text-purple-800", icon: Shield },
  ADMIN: { label: "Admin", color: "bg-[#E30613]/10 text-[#E30613]", icon: UserCog },
  PERSONNEL: { label: "Personnel", color: "bg-[#003DA5]/10 text-[#003DA5]", icon: Users },
  HOSPITAL: { label: "Hôpital", color: "bg-teal-100 text-teal-800", icon: Hospital },
  DONOR: { label: "Donneur", color: "bg-emerald-100 text-emerald-800", icon: Droplets },
};

interface UserRecord {
  id: string; name: string; email: string; phone: string | null; role: string;
  isActive: boolean; createdAt: string; centerId: string | null; hospitalId: string | null;
  center: { name: string } | null; hospital: { name: string } | null;
  donor: { id: string; bloodGroup: string; rhFactor: string } | null;
}

interface CenterOption { id: string; name: string; }
interface HospitalOption { id: string; name: string; }

export default function UtilisateursPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "PERSONNEL", centerId: "", hospitalId: "" });
  const [centers, setCenters] = useState<CenterOption[]>([]);
  const [hospitals, setHospitals] = useState<HospitalOption[]>([]);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "30" });
    if (roleFilter) params.set("role", roleFilter);
    if (search) params.set("search", search);
    fetch(`/api/superadmin/users?${params}`).then(r => r.json()).then(d => {
      setUsers(d.users || []); setTotal(d.total || 0);
    }).finally(() => setLoading(false));
  }, [page, roleFilter, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => {
    Promise.all([
      fetch("/api/centers").then(r => r.json()),
      fetch("/api/hospitals").then(r => r.json()),
    ]).then(([c, h]) => {
      setCenters(c.centers || []);
      setHospitals(h.hospitals || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = { ...form };
    if (!body.centerId) delete body.centerId;
    if (!body.hospitalId) delete body.hospitalId;
    if (editUser) {
      if (!body.password) delete body.password;
      await fetch(`/api/superadmin/users/${editUser.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/superadmin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setShowModal(false); setEditUser(null); setForm({ name: "", email: "", password: "", phone: "", role: "PERSONNEL", centerId: "", hospitalId: "" });
    fetchUsers();
  };

  const handleEdit = (u: UserRecord) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: "", phone: u.phone || "", role: u.role, centerId: u.centerId || "", hospitalId: u.hospitalId || "" });
    setShowModal(true);
  };

  const handleToggleActive = async (u: UserRecord) => {
    await fetch(`/api/superadmin/users/${u.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !u.isActive }) });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ? Cette action est irréversible.")) return;
    await fetch(`/api/superadmin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const roleCounts = users.reduce((acc: Record<string, number>, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});

  const columns = [
    { key: "name", label: "Utilisateur", render: (u: UserRecord) => (
      <div className="flex items-center gap-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold",
          u.role === "SUPER_ADMIN" ? "bg-purple-500" : u.role === "ADMIN" ? "bg-[#E30613]" : u.role === "HOSPITAL" ? "bg-teal-500" : u.role === "DONOR" ? "bg-emerald-500" : "bg-[#003DA5]"
        )}>{u.name.charAt(0)}</div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      </div>
    )},
    { key: "role", label: "Rôle", render: (u: UserRecord) => {
      const rc = ROLE_CONFIG[u.role];
      return <span className={cn("px-2.5 py-1 rounded-lg text-[11px] font-bold", rc?.color || "bg-gray-100 text-gray-600")}>{rc?.label || u.role}</span>;
    }},
    { key: "affectation", label: "Affectation", render: (u: UserRecord) => (
      <span className="text-xs text-gray-500">{u.center?.name || u.hospital?.name || (u.donor ? `${u.donor.bloodGroup}${u.donor.rhFactor}` : "-")}</span>
    )},
    { key: "phone", label: "Téléphone", render: (u: UserRecord) => <span className="text-sm">{u.phone || "-"}</span> },
    { key: "isActive", label: "Statut", render: (u: UserRecord) => (
      <button onClick={() => handleToggleActive(u)}
        className={cn("px-2.5 py-1 rounded-lg text-[11px] font-bold", u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
        {u.isActive ? "Actif" : "Inactif"}
      </button>
    )},
    { key: "date", label: "Inscrit", render: (u: UserRecord) => <span className="text-xs text-gray-400">{formatDate(u.createdAt)}</span> },
    { key: "actions", label: "", render: (u: UserRecord) => (
      <div className="flex items-center gap-1">
        <button onClick={() => handleEdit(u)} className="p-1.5 hover:bg-blue-50 rounded-lg text-[#003DA5]"><Edit2 size={15} /></button>
        {u.role !== "SUPER_ADMIN" && <button onClick={() => handleDelete(u.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-[#E30613]"><Trash2 size={15} /></button>}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tous les Utilisateurs</h1>
          <p className="text-gray-500 mt-1">{total} compte(s) au total</p>
        </div>
        <button onClick={() => { setEditUser(null); setForm({ name: "", email: "", password: "", phone: "", role: "PERSONNEL", centerId: "", hospitalId: "" }); setShowModal(true); }}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"><Plus size={16} /> Nouveau compte</button>
      </div>

      {/* Role filter chips */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setRoleFilter(""); setPage(1); }}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", !roleFilter ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500")}>
          Tous ({total})
        </button>
        {Object.entries(ROLE_CONFIG).map(([key, conf]) => (
          <button key={key} onClick={() => { setRoleFilter(key); setPage(1); }}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", roleFilter === key ? conf.color : "bg-gray-100 text-gray-500")}>
            {conf.label} {roleCounts[key] ? `(${roleCounts[key]})` : ""}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Rechercher par nom ou email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
      </div>

      {loading ? <div className="text-center py-12 text-gray-400">Chargement...</div> : (
        <DataTable columns={columns} data={users} emptyMessage="Aucun utilisateur trouvé" />
      )}

      {/* Pagination */}
      {total > 30 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm">Précédent</button>
          <span className="text-sm text-gray-500">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={users.length < 30} className="px-4 py-2 border rounded-lg disabled:opacity-50 text-sm">Suivant</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editUser ? `Modifier ${editUser.name}` : "Nouveau compte"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
          </div>
          {!editUser && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{editUser ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe *"}</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editUser}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">T&eacute;l&eacute;phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">R&ocirc;le *</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
              <option value="ADMIN">Administrateur</option>
              <option value="PERSONNEL">Personnel</option>
              <option value="HOSPITAL">Hôpital</option>
              <option value="DONOR">Donneur</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
          {(form.role === "ADMIN" || form.role === "PERSONNEL") && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Centre</label>
              <select value={form.centerId} onChange={e => setForm({ ...form, centerId: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                <option value="">Aucun</option>
                {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          {form.role === "HOSPITAL" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">H&ocirc;pital</label>
              <select value={form.hospitalId} onChange={e => setForm({ ...form, hospitalId: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm">
                <option value="">Aucun</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          )}
          <button type="submit" className="btn-primary w-full py-3.5 text-sm">
            {editUser ? "Enregistrer" : "Créer le compte"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
