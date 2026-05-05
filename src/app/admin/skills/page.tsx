"use client";

import { useEffect, useState } from "react";

interface Skill {
  $id: string;
  name: string;
  category: string;
  level?: number;
  order?: number;
}

const empty: Omit<Skill, "$id"> = { name: "", category: "", level: 80, order: 0 };

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
          <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-2">Contenu</p>
          <h1 className="text-3xl font-bold text-white">Skills</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
          {showForm ? "Annuler" : "+ Ajouter"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom du skill *" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Catégorie *" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
          </div>
          <div>
            <label className="text-xs text-white/35 mb-2 block">Niveau : {form.level}%</label>
            <input type="range" min={0} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className="w-full accent-white" />
          </div>
          <button onClick={save} className="w-full py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
            {editing ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(byCategory).map(([cat, catSkills]) => (
          <div key={cat}>
            <p className="text-xs tracking-widest uppercase text-white/25 mb-3">{cat}</p>
            <div className="space-y-2">
              {catSkills.map((s) => (
                <div key={s.$id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white text-sm">{s.name}</span>
                      <span className="text-white/30 text-xs">{s.level}%</span>
                    </div>
                    <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-white/25 rounded-full" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => edit(s)} className="text-xs text-white/30 hover:text-white border border-white/[0.08] rounded-lg px-2.5 py-1 transition-colors">Modifier</button>
                    <button onClick={() => del(s.$id)} className="text-xs text-red-400/40 hover:text-red-400 border border-red-400/15 rounded-lg px-2.5 py-1 transition-colors">×</button>
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
