"use client";

import { useEffect, useState } from "react";

interface Skill {
  $id: string;
  name: string;
  category: string;
  level?: number;
  order?: number;
}

const CATEGORIES = [
  "Data & Analyse",
  "IA & NLP",
  "Data Engineering",
  "Automatisation",
  "Soft Skills",
  "Langues",
  "Autre",
];

const empty: Omit<Skill, "$id"> = { name: "", category: "Data & Analyse", level: 80, order: 0 };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/skills").then((r) => r.json()).then((d) => setSkills(d.documents ?? []));

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) {
      await fetch(`/api/admin/skills/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    } else {
      await fetch("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const edit = (s: Skill) => {
    setForm({ name: s.name, category: s.category, level: s.level ?? 80, order: s.order ?? 0 });
    setEditing(s.$id); setShowForm(true);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" }); load();
  };

  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-2">Contenu</p>
          <h1 className="text-3xl font-bold text-[#14161A]">Skills</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="glow px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom du skill *" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] outline-none bg-transparent">
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#F1F2F4]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-black/55 mb-2 block">Niveau : {form.level}%</label>
            <input type="range" min={0} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className="w-full accent-[var(--accent)]" />
          </div>
          <button onClick={save} className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
            {editing ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(byCategory).map(([cat, catSkills]) => (
          <div key={cat}>
            <p className="text-xs tracking-widest uppercase text-black/45 mb-3">{cat}</p>
            <div className="space-y-2">
              {catSkills.map((s) => (
                <div key={s.$id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[#14161A] text-sm">{s.name}</span>
                      <span className="text-black/50 text-xs">{s.level}%</span>
                    </div>
                    <div className="h-px bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => edit(s)} className="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-2.5 py-1 transition-colors">Modifier</button>
                    <button onClick={() => del(s.$id)} className="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-2.5 py-1 transition-colors">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
