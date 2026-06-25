"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, BLOOD_GROUPS, getBloodGroupLabel } from "@/lib/utils";

interface DonorRecord {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  gender: string;
  nationalId: string;
  isEligible: boolean;
  lastDonation: string | null;
  user: { name: string; email: string; phone: string | null };
  _count: { donations: number };
}

export default function PersonnelDonneursPage() {
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonors = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (search) params.set("search", search);
    if (bloodGroup) params.set("bloodGroup", bloodGroup);
    fetch(`/api/donors?${params}`)
      .then(r => r.json())
      .then(d => { setDonors(d.donors || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDonors(); }, [page, bloodGroup]);

  const columns = [
    { key: "name", label: "Nom", render: (d: DonorRecord) => (
      <div><Link href={`/personnel/donneurs/${d.id}`} className="font-medium hover:text-[#E30613] hover:underline transition-colors">{d.user.name}</Link><p className="text-xs text-gray-500">{d.user.phone || d.user.email}</p></div>
    )},
    { key: "bloodGroup", label: "Groupe", render: (d: DonorRecord) => (
      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
        {getBloodGroupLabel(d.bloodGroup, d.rhFactor)}
      </span>
    )},
    { key: "nationalId", label: "N° Identité" },
    { key: "donations", label: "Total Dons", render: (d: DonorRecord) => d._count.donations },
    { key: "lastDonation", label: "Dernier Don", render: (d: DonorRecord) => d.lastDonation ? formatDate(d.lastDonation) : "-" },
    { key: "isEligible", label: "Éligibilité", render: (d: DonorRecord) => (
      <StatusBadge status={d.isEligible ? "AVAILABLE" : "EXPIRED"} />
    )},
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Donneurs</h1><p className="text-gray-500 mt-1">Liste des donneurs</p></div>

      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchDonors(); }} className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
        </form>
        <select value={bloodGroup} onChange={e => { setBloodGroup(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
          <option value="">Tous les groupes</option>
          {BLOOD_GROUPS.map(g => <option key={g} value={g}>Groupe {g}</option>)}
        </select>
      </div>

      {loading ? <div className="text-center py-12 text-gray-500">Chargement...</div> : (
        <>
          <DataTable columns={columns} data={donors} emptyMessage="Aucun donneur" />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg disabled:opacity-50">Précédent</button>
              <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-50">Suivant</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
