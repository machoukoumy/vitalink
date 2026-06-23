"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

interface AppointmentRecord {
  id: string;
  date: string;
  time: string;
  status: string;
  type: string;
  donor: { user: { name: string; phone: string | null }; bloodGroup: string; rhFactor: string };
}

export default function PersonnelRdvPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "20" });
    if (status) params.set("status", status);
    fetch(`/api/appointments?${params}`)
      .then(r => r.json())
      .then(d => setAppointments(d.appointments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [status]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const columns = [
    { key: "donor", label: "Donneur", render: (a: AppointmentRecord) => (
      <div><p className="font-medium">{a.donor.user.name}</p><p className="text-xs text-gray-500">{a.donor.user.phone || ""}</p></div>
    )},
    { key: "bloodGroup", label: "Groupe", render: (a: AppointmentRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">{a.donor.bloodGroup}{a.donor.rhFactor}</span>
    )},
    { key: "date", label: "Date", render: (a: AppointmentRecord) => formatDate(a.date) },
    { key: "time", label: "Heure" },
    { key: "status", label: "Statut", render: (a: AppointmentRecord) => <StatusBadge status={a.status} /> },
    { key: "actions", label: "Actions", render: (a: AppointmentRecord) => (
      <select value={a.status} onChange={e => handleStatusChange(a.id, e.target.value)}
        className="text-xs px-2 py-1 border rounded-lg outline-none">
        <option value="SCHEDULED">Planifié</option>
        <option value="CONFIRMED">Confirmé</option>
        <option value="COMPLETED">Terminé</option>
        <option value="CANCELLED">Annulé</option>
        <option value="NO_SHOW">Absent</option>
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Rendez-vous</h1></div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2.5 border rounded-lg outline-none">
          <option value="">Tous</option>
          <option value="SCHEDULED">Planifié</option>
          <option value="CONFIRMED">Confirmé</option>
          <option value="COMPLETED">Terminé</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>
      {loading ? <div className="text-center py-12 text-gray-500">Chargement...</div> : (
        <DataTable columns={columns} data={appointments} emptyMessage="Aucun rendez-vous" />
      )}
    </div>
  );
}
