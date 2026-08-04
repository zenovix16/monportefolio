"use client";

import { useEffect, useState } from "react";

interface Edu {
  $id: string;
  school: string;
  degree: string;
  speciality?: string;
  location?: string;
  period: string;
  highlights?: string[];
  order?: number;
}

const empty: Omit<Edu, "$id"> = {
  school: "", degree: "", speciality: "", location: "", period: "", highlights: [], order: 0,
};

export default function EducationPage() {
  const [items, setItems] = useState<Edu[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/education").then((r) => r.json()).then((d) => setItems(d.documents ?? []));

  useEffect(() => { load(); }, []);

  const save = async () => {
    const body = {
      ...form,
      highlights: typeof form.highlights === "string"
        ? (form.highlights as unknown as string).split("\n").map((s) => s.trim()).filter(Boolean)
        : form.highlights,
    };
    if (editing) {
      await fetch(`/api/admin/education/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const edit = (e: Edu) => {
    setForm({ school: e.school, degree: e.degree, speciality: e.speciality ?? "", location: e.location ?? "", period: e.period, highlights: e.highlights ?? [], order: e.order ?? 0 });
    setEditing(e.$id); setShowForm(true);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/education/${id}`, { method: "DELETE" }); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-2">Contenu</p>
          <h1 className="text-3xl font-bold text-[#14161A]">Formation</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="glow px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="École *" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Diplôme *" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
          </div>
          <input value={form.speciality} onChange={(e) => setForm({ ...form, speciality: e.target.value })} placeholder="Spécialité" className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Localisation" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Période (ex: 2022 — 2025) *" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
          </div>
          <textarea
            value={Array.isArray(form.highlights) ? form.highlights.join("\n") : form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value as unknown as string[] })}
            placeholder="Points forts (un par ligne)" rows={3}
            className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none resize-none" />
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="Ordre" className="w-24 glass rounded-xl px-3 py-2 text-sm text-[#14161A] outline-none" />
          <button onClick={save} className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
            {editing ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((e) => (
          <div key={e.$id} className="glass rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[#14161A] font-medium text-sm">{e.school}</p>
              <p className="text-black/55 text-xs">{e.degree} · {e.period}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => edit(e)} className="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
              <button onClick={() => del(e.$id)} className="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
