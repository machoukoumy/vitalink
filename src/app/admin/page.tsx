"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Droplets,
  Package,
  Calendar,
  AlertTriangle,
  UserCog,
  Heart,
  ArrowRight,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import BloodStockChart from "@/components/BloodStockChart";
import DashboardCharts from "@/components/DashboardCharts";
import { formatDate, getBloodGroupLabel } from "@/lib/utils";

interface Stats {
  totalDonors: number;
  activeDonors: number;
  totalDonations: number;
  recentDonations: number;
  totalStock: number;
  availableStock: number;
  pendingAppointments: number;
  todayAppointments: number;
  stockByGroup: Array<{
    bloodGroup: string;
    rhFactor: string;
    _sum: { quantity: number | null };
    _count: number;
  }>;
  expiringStock: number;
  personnelCount: number;
}

interface BloodRequest {
  id: string;
  bloodGroup: string;
  rhFactor: string;
  quantity: number;
  urgency: string;
  status: string;
  patientInfo: string | null;
  createdAt: string;
  hospital: { name: string };
  _count?: { donorResponses: number };
}

interface RequestsData {
  requests: BloodRequest[];
  total: number;
}

interface DonorResponse {
  id: string;
  status: string;
  createdAt: string;
  donor: {
    bloodGroup: string;
    rhFactor: string;
    user: { name: string; phone: string | null };
  };
  bloodRequest: {
    bloodGroup: string;
    rhFactor: string;
    quantity: number;
    urgency: string;
    hospital: { name: string };
  };
}

interface EligibilityData {
  eligibleCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [responses, setResponses] = useState<DonorResponse[]>([]);
  const [eligibleCount, setEligibleCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/blood-requests?limit=20").then((r) => r.json()),
      fetch("/api/donor-responses").then((r) => r.json()),
      fetch("/api/donors/eligible-count").then((r) =>
        r.ok ? r.json() : { eligibleCount: 0 }
      ),
    ])
      .then(
        ([
          statsData,
          reqData,
          resData,
          eligData,
        ]: [Stats, RequestsData, { responses: DonorResponse[] }, EligibilityData]) => {
          setStats(statsData);
          setRequests(reqData.requests || []);
          setResponses(resData.responses || []);
          setEligibleCount(eligData.eligibleCount || 0);
        }
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!stats) return null;

  const urgentRequests = requests.filter(
    (r) =>
      (r.urgency === "CRITICAL" || r.urgency === "URGENT") &&
      r.status === "PENDING"
  );

  const urgencyColor: Record<string, string> = {
    CRITICAL: "text-red-600 bg-red-50",
    URGENT: "text-orange-600 bg-orange-50",
    NORMAL: "text-blue-600 bg-blue-50",
  };

  const urgencyLabel: Record<string, string> = {
    CRITICAL: "Critique",
    URGENT: "Urgent",
    NORMAL: "Normal",
  };

  // Count responses per request based on matching blood request data
  const getResponseCount = (request: BloodRequest): number => {
    if (request._count?.donorResponses !== undefined) {
      return request._count.donorResponses;
    }
    return responses.filter(
      (r) =>
        r.bloodRequest.bloodGroup === request.bloodGroup &&
        r.bloodRequest.rhFactor === request.rhFactor &&
        r.bloodRequest.quantity === request.quantity &&
        r.bloodRequest.hospital.name === request.hospital.name
    ).length;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de Bord Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Vue d&apos;ensemble du Centre National de Transfusion Sanguine
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Donneurs"
          value={stats.totalDonors}
          subtitle={`${stats.activeDonors} eligibles`}
          icon={<Users size={24} />}
          color="blue"
        />
        <StatsCard
          title="Personnel"
          value={stats.personnelCount}
          icon={<UserCog size={24} />}
          color="purple"
        />
        <StatsCard
          title="Dons (30j)"
          value={stats.recentDonations}
          subtitle={`${stats.totalDonations} au total`}
          icon={<Droplets size={24} />}
          color="red"
        />
        <StatsCard
          title="Stock Disponible"
          value={stats.availableStock}
          subtitle={`${stats.totalStock} total`}
          icon={<Package size={24} />}
          color="green"
        />
        <StatsCard
          title="RDV Aujourd&apos;hui"
          value={stats.todayAppointments}
          subtitle={`${stats.pendingAppointments} en attente`}
          icon={<Calendar size={24} />}
          color="yellow"
        />
        <StatsCard
          title="Stock Expirant"
          value={stats.expiringStock}
          subtitle="dans les 7 prochains jours"
          icon={<AlertTriangle size={24} />}
          color="red"
        />
      </div>

      {/* Quick Actions + Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/demandes"
              className="flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Voir demandes urgentes
                </span>
              </div>
              <ArrowRight
                size={16}
                className="text-red-400 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/admin/stock"
              className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Gerer stock
                </span>
              </div>
              <ArrowRight
                size={16}
                className="text-blue-400 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/admin/donneurs"
              className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Users size={20} className="text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Voir donneurs
                </span>
              </div>
              <ArrowRight
                size={16}
                className="text-green-400 group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/admin/rendez-vous"
              className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  Rendez-vous
                </span>
              </div>
              <ArrowRight
                size={16}
                className="text-purple-400 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Eligibility Reminders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Rappels d&apos;eligibilite
          </h3>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-800">
                {eligibleCount || stats.activeDonors}
              </p>
              <p className="text-sm text-green-600">
                Donneurs redevenus eligibles
              </p>
              <p className="text-xs text-green-500 mt-0.5">
                56+ jours (hommes) / 90+ jours (femmes) depuis le dernier don
              </p>
            </div>
          </div>
          <Link
            href="/admin/donneurs"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Users size={16} />
            Voir les donneurs eligibles
          </Link>
        </div>
      </div>

      {/* Urgent/Critical Pending Requests */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-600" />
            <h3 className="font-semibold text-gray-900">
              Demandes urgentes en attente
            </h3>
            {urgentRequests.length > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                {urgentRequests.length}
              </span>
            )}
          </div>
          <Link
            href="/admin/demandes"
            className="text-sm text-red-600 hover:text-red-700"
          >
            Voir tout
          </Link>
        </div>
        {urgentRequests.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Aucune demande urgente en attente
          </p>
        ) : (
          <div className="space-y-3">
            {urgentRequests.slice(0, 5).map((r) => {
              const respCount = getResponseCount(r);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-red-600">
                        {getBloodGroupLabel(r.bloodGroup, r.rhFactor)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {r.hospital.name} - {r.quantity} ml
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.patientInfo || "Patient non specifie"} -{" "}
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {respCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                        <Users size={12} />
                        {respCount} reponse{respCount > 1 ? "s" : ""}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColor[r.urgency] || "text-gray-600 bg-gray-50"}`}
                    >
                      {urgencyLabel[r.urgency] || r.urgency}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Blood Stock Chart */}
      <BloodStockChart data={stats.stockByGroup} />

      {/* Dashboard Charts */}
      <DashboardCharts />
    </div>
  );
}
