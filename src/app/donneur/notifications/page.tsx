"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function DonneurNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch("/api/notifications").then(r => r.json())
      .then(d => { setNotifications(d.notifications || []); setUnreadCount(d.unreadCount || 0); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ markAllRead: true }) });
    fetchData();
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchData();
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Notifications</h1><p className="text-gray-500 mt-1">{unreadCount} non lue(s)</p></div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
            <CheckCheck size={18} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} onClick={() => !n.isRead && markRead(n.id)}
              className={cn("bg-white rounded-xl border p-4 cursor-pointer transition-colors", n.isRead ? "border-gray-100" : "border-blue-200 bg-blue-50/50")}>
              <div className="flex items-start justify-between">
                <div><h4 className={cn("font-medium", !n.isRead && "text-gray-900")}>{n.title}</h4><p className="text-sm text-gray-600 mt-1">{n.message}</p></div>
                <span className="text-xs text-gray-400 ml-4">{formatDateTime(n.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
