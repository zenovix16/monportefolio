"use client";

import { useEffect, useState } from "react";

interface Exp {
  $id: string;
  company: string;
  role: string;
  location?: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  order?: number;
}

const empty: Omit<Exp, "$id"> = {
  company: "", role: "", location: "", description: "", startDate: "", endDate: "", current: false, order: 0,
};

export default function ExperiencePage() {
  const [items, setItems] = useState<Exp[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/experience").then((r) => r.json()).then((d) => setItems(d.documents ?? []));

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) {
      await fetch(`/api/admin/experience/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/experience", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const edit = (e: Exp) => {
    setForm({ company: e.company, role: e.role, location: e.location ?? "", description: e.description, startDate: e.startDate, endDate: e.endDate ?? "", current: e.current ?? false, order: e.order ?? 0 });
    setEditing(e.$id); setShowForm(true);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/experience/${id}`, { method: "DELETE" }); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-2">Contenu</p>
          <h1 className="text-3xl font-bold text-white">Expériences</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Entreprise *" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Rôle *" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
          </div>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Localisation" className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description *" rows={3} className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="Date début (ex: Jan. 2024)" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            <input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="Date fin (laisser vide si actuel)" disabled={form.current} className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none disabled:opacity-30" />
          </div>
          <label className="flex items-center gap-3 text-sm text-white/50 cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: "" })} />
            Poste actuel
          </label>
          <button onClick={save} className="w-full py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
            {editing ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((e) => (
          <div key={e.$id} className="glass rounded-xl p-5 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {e.current && <span className="text-[10px] border border-white/10 text-white/30 rounded-full px-2 py-0.5 uppercase tracking-widest">Actuel</span>}
                <p className="text-white font-medium text-sm">{e.role}</p>
              </div>
              <p className="text-white/40 text-xs">{e.company} · {e.startDate}{e.endDate ? ` — ${e.endDate}` : ""}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => edit(e)} className="text-xs text-white/30 hover:text-white border border-white/[0.08] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
              <button onClick={() => del(e.$id)} className="text-xs text-red-400/40 hover:text-red-400 border border-red-400/15 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
