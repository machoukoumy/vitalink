"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { formatDate } from "@/lib/utils";

interface AppointmentRecord {
  id: string;
  date: string;
  time: string;
  status: string;
  type: string;
  notes: string | null;
}

export default function DonneurRdvPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", notes: "" });

  const fetchData = () => {
    fetch("/api/appointments?limit=50")
      .then(r => r.json())
      .then(d => setAppointments(d.appointments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ date: "", time: "", notes: "" });
    fetchData();
  };

  const handleCancel = async (id: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  const columns = [
    { key: "date", label: "Date", render: (a: AppointmentRecord) => formatDate(a.date) },
    { key: "time", label: "Heure" },
    { key: "type", label: "Type", render: (a: AppointmentRecord) => a.type === "DONATION" ? "Don de sang" : "Consultation" },
    { key: "notes", label: "Notes", render: (a: AppointmentRecord) => a.notes || "-" },
    { key: "status", label: "Statut", render: (a: AppointmentRecord) => <StatusBadge status={a.status} /> },
    { key: "actions", label: "", render: (a: AppointmentRecord) => (
      a.status === "SCHEDULED" || a.status === "CONFIRMED" ? (
        <button onClick={() => handleCancel(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600" title="Annuler">
          <Trash2 size={16} />
        </button>
      ) : null
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-vous</h1>
          <p className="text-gray-500 mt-1">G&eacute;rez vos rendez-vous de don</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Plus size={18} /> Prendre RDV
        </button>
      </div>

      <DataTable columns={columns} data={appointments} emptyMessage="Aucun rendez-vous" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Prendre un rendez-vous">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
            <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
              <option value="">S&eacute;lectionner</option>
              {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Information complémentaire..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
          </div>
          <button type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
            Confirmer le rendez-vous
          </button>
        </form>
      </Modal>
    </div>
  );
}
