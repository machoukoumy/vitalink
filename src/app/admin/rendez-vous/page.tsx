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
  notes: string | null;
  donor: { user: { name: string; email: string; phone: string | null }; bloodGroup: string; rhFactor: string };
}

const APPT_STATUSES = ["", "SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function AdminRdvPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (status) params.set("status", status);
    fetch(`/api/appointments?${params}`)
      .then(r => r.json())
      .then(d => { setAppointments(d.appointments || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [page, status]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAppointments();
  };

  const columns = [
    { key: "donor", label: "Donneur", render: (a: AppointmentRecord) => (
      <div>
        <p className="font-medium">{a.donor.user.name}</p>
        <p className="text-xs text-gray-500">{a.donor.user.phone || a.donor.user.email}</p>
      </div>
    )},
    { key: "bloodGroup", label: "Groupe", render: (a: AppointmentRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        {a.donor.bloodGroup}{a.donor.rhFactor}
      </span>
    )},
    { key: "date", label: "Date", render: (a: AppointmentRecord) => formatDate(a.date) },
    { key: "time", label: "Heure" },
    { key: "type", label: "Type", render: (a: AppointmentRecord) => a.type === "DONATION" ? "Don" : "Consultation" },
    { key: "status", label: "Statut", render: (a: AppointmentRecord) => <StatusBadge status={a.status} /> },
    { key: "actions", label: "Actions", render: (a: AppointmentRecord) => (
      <select value={a.status} onChange={e => handleStatusChange(a.id, e.target.value)}
        className="text-xs px-2 py-1 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
        {APPT_STATUSES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="text-gray-500 mt-1">Gestion des rendez-vous de don</p>
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Tous les statuts</option>
          {APPT_STATUSES.filter(s => s).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-gray-500">Chargement...</div>
      ) : (
        <>
          <DataTable columns={columns} data={appointments} emptyMessage="Aucun rendez-vous" />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Précédent</button>
              <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50">Suivant</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
