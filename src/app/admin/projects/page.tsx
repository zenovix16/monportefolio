"use client";

import { useEffect, useState } from "react";

interface Project {
  $id: string;
  title: string;
  description: string;
  tags?: string[];
  imageId?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  order?: number;
}

const empty: Omit<Project, "$id"> = {
  title: "", description: "", tags: [], imageId: "", githubUrl: "", liveUrl: "", featured: false, order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () =>
    fetch("/api/admin/projects").then((r) => r.json()).then((d) => setProjects(d.documents ?? []));

  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-secret": "portfolio2025secret" }, body: fd });
    const data = await res.json();
    setForm((f) => ({ ...f, imageId: data.fileId }));
    setUploading(false);
  };

  const save = async () => {
    const body = {
      ...form,
      tags: typeof form.tags === "string" ? (form.tags as string).split(",").map((s) => s.trim()) : form.tags,
    };
    if (editing) {
      await fetch(`/api/admin/projects/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const edit = (p: Project) => {
    setForm({ title: p.title, description: p.description, tags: p.tags ?? [], imageId: p.imageId ?? "", githubUrl: p.githubUrl ?? "", liveUrl: p.liveUrl ?? "", featured: p.featured ?? false, order: p.order ?? 0 });
    setEditing(p.$id); setShowForm(true);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-2">Contenu</p>
          <h1 className="text-3xl font-bold text-white">Projets</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
          {showForm ? "Annuler" : "+ Nouveau projet"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium text-white mb-5">{editing ? "Modifier le projet" : "Ajouter un projet"}</p>
          <div className="space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre *" className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description *" rows={3} className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none resize-none" />
            <input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(s => s.trim()) })} placeholder="Tags (séparés par virgule)" className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="URL GitHub" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
              <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="URL Live" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            </div>

            {/* Upload image */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs text-white/30 mb-3">Image du projet</p>
              {form.imageId && <p className="text-xs text-white/40 mb-2">ID actuel : {form.imageId}</p>}
              <label className="cursor-pointer flex items-center gap-3">
                <span className="text-xs text-white/40 border border-white/[0.08] rounded-lg px-3 py-2 hover:border-white/20 transition-colors">
                  {uploading ? "Upload en cours..." : "Choisir une image"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} disabled={uploading} />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 text-sm text-white/50 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured
              </label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="Ordre" className="w-24 glass rounded-xl px-3 py-2 text-sm text-white outline-none" />
            </div>

            <button onClick={save} className="w-full py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
              {editing ? "Enregistrer" : "Créer le projet"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.$id} className="glass rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {p.featured && <span className="text-[10px] border border-white/10 text-white/30 rounded-full px-2 py-0.5 uppercase tracking-widest">Featured</span>}
                <p className="text-white font-medium text-sm">{p.title}</p>
              </div>
              <p className="text-white/35 text-xs line-clamp-1">{p.description}</p>
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tags.map((t) => <span key={t} className="text-[10px] text-white/25 border border-white/[0.06] rounded-full px-2 py-0.5">{t}</span>)}
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => edit(p)} className="text-xs text-white/30 hover:text-white border border-white/[0.08] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
              <button onClick={() => del(p.$id)} className="text-xs text-red-400/40 hover:text-red-400 border border-red-400/15 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
