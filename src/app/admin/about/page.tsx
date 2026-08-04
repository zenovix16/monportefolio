"use client";

import { useEffect, useState } from "react";

interface Block {
  $id: string;
  type: "stat" | "text" | "tags" | "quote";
  title?: string;
  body?: string;
  value?: string;
  items?: string[];
  order?: number;
}

const TYPE_LABELS: Record<Block["type"], string> = {
  stat: "Statistique",
  text: "Texte",
  tags: "Liste de tags",
  quote: "Citation",
};

const empty = {
  type: "text" as Block["type"],
  title: "",
  body: "",
  value: "",
  items: "" as string | string[],
  order: 0,
};

export default function AboutPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/about-blocks").then((r) => r.json()).then((d) => setBlocks(d.documents ?? []));

  useEffect(() => { load(); }, []);

  const save = async () => {
    const body = {
      type: form.type,
      title: form.title || undefined,
      body: form.body || undefined,
      value: form.value || undefined,
      items: form.type === "tags"
        ? (typeof form.items === "string" ? form.items.split(",").map((s) => s.trim()).filter(Boolean) : form.items)
        : undefined,
      order: form.order,
    };
    if (editing) {
      await fetch(`/api/admin/about-blocks/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/about-blocks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const edit = (b: Block) => {
    setForm({
      type: b.type,
      title: b.title ?? "",
      body: b.body ?? "",
      value: b.value ?? "",
      items: b.items ?? [],
      order: b.order ?? 0,
    });
    setEditing(b.$id); setShowForm(true);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/about-blocks/${id}`, { method: "DELETE" });
    load();
  };

  const summarize = (b: Block) => {
    if (b.type === "stat") return `${b.value ?? ""} — ${b.title ?? ""}`;
    if (b.type === "tags") return (b.items ?? []).join(", ");
    return b.title ? `${b.title} — ${b.body ?? ""}` : (b.body ?? "");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-2">Section About</p>
          <h1 className="text-3xl font-bold text-[#14161A]">Blocs de contenu</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="glow px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
          {showForm ? "Annuler" : "+ Ajouter un bloc"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium text-[#14161A] mb-5">{editing ? "Modifier le bloc" : "Nouveau bloc"}</p>
          <div className="space-y-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Block["type"] })}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] outline-none bg-transparent">
              {(Object.keys(TYPE_LABELS) as Block["type"][]).map((t) => (
                <option key={t} value={t} className="bg-[#F1F2F4]">{TYPE_LABELS[t]}</option>
              ))}
            </select>

            {form.type === "stat" && (
              <div className="grid grid-cols-2 gap-3">
                <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Valeur (ex: 3+)" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Libellé (ex: Années d'expérience)" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
              </div>
            )}

            {form.type === "text" && (
              <>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre (optionnel, ex: Langues)" className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Texte *" rows={4} className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none resize-none" />
              </>
            )}

            {form.type === "tags" && (
              <input value={typeof form.items === "string" ? form.items : form.items.join(", ")}
                onChange={(e) => setForm({ ...form, items: e.target.value })}
                placeholder="Tags séparés par virgule (ex: Python, SQL, Power BI)"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            )}

            {form.type === "quote" && (
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Citation *" rows={3} className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none resize-none" />
            )}

            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="Ordre" className="w-24 glass rounded-xl px-3 py-2 text-sm text-[#14161A] outline-none" />

            <button onClick={save} className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
              {editing ? "Enregistrer" : "Ajouter le bloc"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {blocks.map((b) => (
          <div key={b.$id} className="glass rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] border border-[var(--accent)]/40 text-[var(--accent-light)] rounded-full px-2 py-0.5 uppercase tracking-widest">{TYPE_LABELS[b.type]}</span>
                <span className="text-black/40 text-xs">ordre {b.order ?? 0}</span>
              </div>
              <p className="text-black/60 text-sm line-clamp-1">{summarize(b)}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => edit(b)} className="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
              <button onClick={() => del(b.$id)} className="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
        {blocks.length === 0 && !showForm && (
          <div className="glass rounded-2xl p-10 text-center text-black/45 text-sm">
            Aucun bloc. Clique sur &quot;+ Ajouter un bloc&quot; pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}
