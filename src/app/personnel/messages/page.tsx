"use client";

import { useEffect, useState } from "react";
import { Send, Mail, MailOpen, ChevronRight } from "lucide-react";
import Modal from "@/components/Modal";
import { formatDateTime, cn } from "@/lib/utils";

interface Msg { id: string; senderId: string; receiverId: string; subject: string | null; content: string; isRead: boolean; createdAt: string; }

export default function HopitalMessagesPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ receiverId: "", subject: "", content: "" });
  const [me, setMe] = useState<string>("");

  useEffect(() => {
    Promise.all([
      fetch("/api/messages").then(r => r.json()),
      fetch("/api/auth/me").then(r => r.json()),
    ]).then(([m, u]) => {
      setMessages(m.messages || []);
      setMe(u.user?.id || "");
    }).finally(() => setLoading(false));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowCompose(false);
    setForm({ receiverId: "", subject: "", content: "" });
    fetch("/api/messages").then(r => r.json()).then(d => setMessages(d.messages || []));
  };

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: true }) });
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const received = messages.filter(m => m.receiverId === me);
  const sent = messages.filter(m => m.senderId === me);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Messages</h1><p className="text-gray-500 mt-1">{received.filter(m => !m.isRead).length} non lu(s)</p></div>
        <button onClick={() => setShowCompose(true)} className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm"><Send size={16} /> Nouveau</button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Re&ccedil;us ({received.length})</h3>
        {received.length === 0 ? <p className="text-sm text-gray-400 bg-white rounded-xl p-6 text-center border border-gray-100">Aucun message</p> : (
          <div className="space-y-2">
            {received.map(m => (
              <div key={m.id} onClick={() => { setExpanded(expanded === m.id ? null : m.id); if (!m.isRead) markRead(m.id); }}
                className={cn("bg-white rounded-xl border p-4 cursor-pointer transition-all", m.isRead ? "border-gray-100" : "border-[#003DA5]/30 bg-[#003DA5]/5")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {m.isRead ? <MailOpen size={16} className="text-gray-300" /> : <Mail size={16} className="text-[#003DA5]" />}
                    <span className={cn("text-sm", m.isRead ? "text-gray-600" : "font-bold text-gray-900")}>{m.subject || "Sans objet"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{formatDateTime(m.createdAt)}</span>
                    <ChevronRight size={14} className={cn("text-gray-300 transition-transform", expanded === m.id && "rotate-90")} />
                  </div>
                </div>
                {expanded === m.id && <p className="text-sm text-gray-600 mt-3 pl-6 border-t border-gray-50 pt-3">{m.content}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Envoy&eacute;s ({sent.length})</h3>
        {sent.length === 0 ? <p className="text-sm text-gray-400 bg-white rounded-xl p-6 text-center border border-gray-100">Aucun message envoy&eacute;</p> : (
          <div className="space-y-2">
            {sent.map(m => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{m.subject || "Sans objet"}</span>
                  <span className="text-[10px] text-gray-400">{formatDateTime(m.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showCompose} onClose={() => setShowCompose(false)} title="Nouveau message">
        <form onSubmit={handleSend} className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Objet</label>
            <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" placeholder="Objet du message" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm h-32 resize-none" placeholder="Votre message..." /></div>
          <button type="submit" className="btn-primary w-full py-3.5 text-sm">Envoyer</button>
        </form>
      </Modal>
    </div>
  );
}
