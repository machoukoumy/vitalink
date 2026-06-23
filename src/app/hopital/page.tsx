"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Users,
  Phone,
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, formatDateTime, getBloodGroupLabel } from "@/lib/utils";

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

interface DonorResponse {
  id: string;
  status: string;
  message: string | null;
  availableDate: string | null;
  createdAt: string;
  donor: {
    bloodGroup: string;
    rhFactor: string;
    user: { name: string; phone: string | null; email: string | null };
  };
  bloodRequest: {
    bloodGroup: string;
    rhFactor: string;
    quantity: number;
    urgency: string;
    hospital: { name: string };
  };
}

interface RequestsData {
  requests: BloodRequest[];
  total: number;
}

interface ResponsesData {
  responses: DonorResponse[];
}

export default function HopitalDashboard() {
  const [data, setData] = useState<RequestsData | null>(null);
  const [responses, setResponses] = useState<DonorResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/blood-requests?limit=50").then((r) => r.json()),
      fetch("/api/donor-responses").then((r) => r.json()),
    ])
      .then(([reqData, resData]: [RequestsData, ResponsesData]) => {
        setData(reqData);
        setResponses(resData.responses || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chargement...
      </div>
    );

  const requests = data?.requests || [];
  const total = data?.total || 0;
  const pending = requests.filter((r) => r.status === "PENDING").length;
  const fulfilled = requests.filter(
    (r) => r.status === "FULFILLED" || r.status === "PARTIALLY_FULFILLED"
  ).length;
  const totalResponses = responses.length;

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

  // Count responses per request
  const responseCountByRequest: Record<string, number> = {};
  for (const resp of responses) {
    const reqId = resp.bloodRequest
      ? responses
          .filter(
            (r) =>
              r.bloodRequest.bloodGroup === resp.bloodRequest.bloodGroup &&
              r.bloodRequest.rhFactor === resp.bloodRequest.rhFactor
          )
          .length.toString()
      : "0";
    // Build a simple map by iterating responses
    responseCountByRequest[resp.id] =
      (responseCountByRequest[resp.id] || 0) + 1;
  }

  // Build response count per blood request ID from _count or manual count
  const respCountMap: Record<string, number> = {};
  for (const resp of responses) {
    // We need the bloodRequestId - extract from response context
    // Since API returns responses with bloodRequest included, group them
    const key = `${resp.bloodRequest.bloodGroup}-${resp.bloodRequest.rhFactor}-${resp.bloodRequest.quantity}`;
    respCountMap[key] = (respCountMap[key] || 0) + 1;
  }

  // Better approach: count responses that match each request
  const getResponseCount = (request: BloodRequest): number => {
    if (request._count?.donorResponses !== undefined) {
      return request._count.donorResponses;
    }
    return responses.filter(
      (r) =>
        r.bloodRequest.bloodGroup === request.bloodGroup &&
        r.bloodRequest.rhFactor === request.rhFactor &&
        r.bloodRequest.quantity === request.quantity
    ).length;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-500 mt-1">Espace Hopital</p>
        </div>
        <Link
          href="/hopital/nouvelle-demande"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <Plus size={18} /> Nouvelle demande
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total demandes"
          value={total}
          icon={<FileText size={24} />}
          color="blue"
        />
        <StatsCard
          title="En attente"
          value={pending}
          icon={<Clock size={24} />}
          color="yellow"
        />
        <StatsCard
          title="Satisfaites"
          value={fulfilled}
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatsCard
          title="Reponses donneurs"
          value={totalResponses}
          subtitle={`${responses.filter((r) => r.status === "ACCEPTED").length} acceptees`}
          icon={<Users size={24} />}
          color="purple"
        />
      </div>

      {/* Pending Requests with Response Count */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Demandes en attente
          </h3>
          <Link
            href="/hopital/demandes"
            className="text-sm text-red-600 hover:text-red-700"
          >
            Voir tout
          </Link>
        </div>
        {requests.filter((r) => r.status === "PENDING").length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Aucune demande en attente
          </p>
        ) : (
          <div className="space-y-3">
            {requests
              .filter((r) => r.status === "PENDING")
              .slice(0, 5)
              .map((r) => {
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
                          {r.quantity} ml -{" "}
                          {r.patientInfo || "Patient non specifie"}
                        </p>
                        <p className="text-xs text-gray-500">
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

      {/* Recent Donor Responses */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Reponses des donneurs
          </h3>
          <Link
            href="/hopital/reponses"
            className="text-sm text-red-600 hover:text-red-700"
          >
            Voir tout
          </Link>
        </div>
        {responses.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Aucune reponse de donneur pour le moment
          </p>
        ) : (
          <div className="space-y-3">
            {responses.slice(0, 5).map((resp) => (
              <div
                key={resp.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      resp.status === "ACCEPTED"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold ${
                        resp.status === "ACCEPTED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {getBloodGroupLabel(
                        resp.donor.bloodGroup,
                        resp.donor.rhFactor
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {resp.donor.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {resp.donor.user.phone || "Pas de telephone"} -{" "}
                      {formatDateTime(resp.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {getBloodGroupLabel(
                      resp.bloodRequest.bloodGroup,
                      resp.bloodRequest.rhFactor
                    )}{" "}
                    - {resp.bloodRequest.quantity} ml
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      resp.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {resp.status === "ACCEPTED" ? "Accepte" : "Refuse"}
                  </span>
                  {resp.status === "ACCEPTED" && resp.donor.user.phone && (
                    <a
                      href={`tel:${resp.donor.user.phone}`}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Phone size={12} />
                      Appeler
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
