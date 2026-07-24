"use client";

import { useEffect, useState } from "react";

interface Message {
  $id: string;
  name: string;
  email: string;
  message: string;
  $createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () =>
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((d) => { setMessages(d.documents ?? []); setLoading(false); });

  useEffect(() => { load(); }, []);

  const deleteMsg = async (id: string) => {
    await fetch("/api/admin/messages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessages((prev) => prev.filter((m) => m.$id !== id));
    if (selected?.$id === id) setSelected(null);
  };

  const exportExcel = () => {
    window.open("/api/admin/messages/export", "_blank");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-2">Boîte de réception</p>
          <h1 className="text-3xl font-bold text-[#14141A]">Messages</h1>
        </div>
        <button
          onClick={exportExcel}
          className="px-4 py-2.5 glass text-black/60 text-sm rounded-xl hover:text-black transition-colors"
        >
          ↓ Export Excel
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-black/40 text-sm">
          Aucun message pour le moment.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Liste */}
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.$id}
                onClick={() => setSelected(msg)}
                className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                  selected?.$id === msg.$id ? "border-black/25" : "hover:border-black/15"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[#14141A] text-sm font-medium truncate">{msg.name}</p>
                    <p className="text-black/50 text-xs truncate">{msg.email}</p>
                  </div>
                  <p className="text-black/35 text-xs shrink-0">
                    {new Date(msg.$createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <p className="text-black/55 text-xs mt-2 line-clamp-1">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Détail */}
          <div className="glass rounded-2xl p-6 h-fit sticky top-0">
            {selected ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[#14141A] font-semibold">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-black/55 text-sm hover:text-black transition-colors">
                      {selected.email}
                    </a>
                    <p className="text-black/40 text-xs mt-1">
                      {new Date(selected.$createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMsg(selected.$id)}
                    className="text-xs text-red-600/65 hover:text-red-600 border border-red-400/30 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
                <p className="text-black/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
                <a
                  href={`mailto:${selected.email}?subject=Re: Votre message`}
                  className="mt-6 inline-block text-sm text-black/55 hover:text-black border border-black/[0.09] rounded-lg px-4 py-2 transition-colors"
                >
                  Répondre par email →
                </a>
              </>
            ) : (
              <p className="text-black/40 text-sm text-center py-8">
                Clique sur un message pour le lire.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
