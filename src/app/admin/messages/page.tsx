"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/Modal";
import { formatDateTime, cn } from "@/lib/utils";
import { Mail, Send, ChevronDown, ChevronUp, Search } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  sender?: { name: string };
  receiver?: { name: string };
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    receiverId: "",
    subject: "",
    content: "",
  });

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : data.messages || []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/superadmin/users?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : data.users || []);
      }
    } catch {
      /* ignore */
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers(userSearch);
    }, 300);
    return () => clearTimeout(timeout);
  }, [userSearch, searchUsers]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: true } : m))
      );
    } catch {
      /* ignore */
    }
  };

  const toggleExpand = (msg: Message) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      if (!msg.read && tab === "inbox") {
        markAsRead(msg.id);
      }
    }
  };

  const openNewMessage = () => {
    setSelectedUser(null);
    setUserSearch("");
    setSearchResults([]);
    setForm({ receiverId: "", subject: "", content: "" });
    setModalOpen(true);
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setForm((prev) => ({ ...prev, receiverId: user.id }));
    setUserSearch("");
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.receiverId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        setForm({ receiverId: "", subject: "", content: "" });
        setSelectedUser(null);
        fetchMessages();
      }
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const inbox = messages.filter((m) => m.sender);
  const sent = messages.filter((m) => m.receiver);
  const displayMessages = tab === "inbox" ? inbox : sent;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-[#E30613] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Centre de messages</h1>
          <p className="text-sm text-gray-500 mt-1">Envoyez et recevez des messages</p>
        </div>
        <button
          onClick={openNewMessage}
          className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#E30613] text-white hover:bg-[#c9050f] transition-colors shadow-sm"
        >
          Nouveau message
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button
          onClick={() => setTab("inbox")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            tab === "inbox"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Mail size={16} />
          Recus
          {inbox.filter((m) => !m.read).length > 0 && (
            <span className="w-5 h-5 bg-[#E30613] text-white rounded-full text-[10px] flex items-center justify-center font-bold">
              {inbox.filter((m) => !m.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("sent")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
            tab === "sent"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Send size={16} />
          Envoyes
        </button>
      </div>

      {/* Messages list */}
      {displayMessages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Mail className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium text-sm">
            {tab === "inbox" ? "Aucun message recu" : "Aucun message envoye"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all",
                !msg.read && tab === "inbox" && "border-l-4 border-l-[#E30613]"
              )}
            >
              <button
                onClick={() => toggleExpand(msg)}
                className="w-full text-left p-4 flex items-center gap-3 touch-active"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {tab === "inbox"
                        ? msg.sender?.name || "Expediteur"
                        : msg.receiver?.name || "Destinataire"}
                    </span>
                    {!msg.read && tab === "inbox" && (
                      <span className="w-2 h-2 bg-[#E30613] rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {msg.content.substring(0, 80)}
                    {msg.content.length > 80 ? "..." : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[11px] text-gray-400">{formatDateTime(msg.createdAt)}</span>
                  {expandedId === msg.id ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </button>

              {expandedId === msg.id && (
                <div className="px-4 pb-4 border-t border-gray-50">
                  <div className="pt-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau message">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
            {selectedUser ? (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setForm((prev) => ({ ...prev, receiverId: "" }));
                  }}
                  className="text-xs text-gray-400 hover:text-[#E30613] font-semibold"
                >
                  Changer
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
                  />
                </div>
                {(searchResults.length > 0 || searching) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                    {searching ? (
                      <div className="p-3 text-center text-sm text-gray-400">Recherche...</div>
                    ) : (
                      searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => selectUser(user)}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.receiverId}
            className="w-full btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#E30613] text-white hover:bg-[#c9050f] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
