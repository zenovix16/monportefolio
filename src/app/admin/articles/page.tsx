"use client";

import { useEffect, useState } from "react";

interface Article {
  $id: string;
  title: string;
  abstract: string;
  journal?: string;
  authors?: string[];
  publishedDate?: string;
  doi?: string;
  pdfUrl?: string;
  tags?: string[];
  featured?: boolean;
}

const empty: Omit<Article, "$id"> = {
  title: "", abstract: "", journal: "", authors: [], publishedDate: "",
  doi: "", pdfUrl: "", tags: [], featured: false,
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/admin/articles").then((r) => r.json()).then((d) => setArticles(d.documents ?? []));

  useEffect(() => { load(); }, []);

  const save = async () => {
    const body = {
      ...form,
      authors: typeof form.authors === "string" ? (form.authors as string).split(",").map((s) => s.trim()) : form.authors,
      tags: typeof form.tags === "string" ? (form.tags as string).split(",").map((s) => s.trim()) : form.tags,
    };
    if (editing) {
      await fetch(`/api/admin/articles/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const edit = (a: Article) => {
    setForm({ title: a.title, abstract: a.abstract, journal: a.journal ?? "", authors: a.authors ?? [], publishedDate: a.publishedDate ?? "", doi: a.doi ?? "", pdfUrl: a.pdfUrl ?? "", tags: a.tags ?? [], featured: a.featured ?? false });
    setEditing(a.$id); setShowForm(true);
  };

  const del = async (id: string) => {
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-2">Publications</p>
          <h1 className="text-3xl font-bold text-white">Articles scientifiques</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="px-4 py-2.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
          {showForm ? "Annuler" : "+ Nouvel article"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium text-white mb-5">{editing ? "Modifier l'article" : "Ajouter un article"}</p>
          <div className="space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre *" className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Résumé / Abstract *" rows={4} className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} placeholder="Journal / Conférence" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
              <input value={form.publishedDate} onChange={(e) => setForm({ ...form, publishedDate: e.target.value })} placeholder="Date (ex: 2024-03)" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={Array.isArray(form.authors) ? form.authors.join(", ") : form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value.split(",").map(s => s.trim()) })} placeholder="Auteurs (séparés par virgule)" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
              <input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(s => s.trim()) })} placeholder="Tags (séparés par virgule)" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="DOI" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
              <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} placeholder="URL du PDF" className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none" />
            </div>
            <label className="flex items-center gap-3 text-sm text-white/50 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
              Mettre en avant (featured)
            </label>
            <button onClick={save} className="w-full py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all">
              {editing ? "Enregistrer" : "Publier l'article"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a.$id} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {a.featured && <span className="text-[10px] border border-white/10 text-white/30 rounded-full px-2 py-0.5 uppercase tracking-widest">Featured</span>}
                  <p className="text-white font-medium text-sm">{a.title}</p>
                </div>
                {a.journal && <p className="text-white/35 text-xs mb-1">{a.journal} {a.publishedDate && `· ${a.publishedDate}`}</p>}
                <p className="text-white/40 text-xs line-clamp-2">{a.abstract}</p>
                {a.tags && a.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {a.tags.map((t) => <span key={t} className="text-[10px] text-white/25 border border-white/[0.06] rounded-full px-2 py-0.5">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => edit(a)} className="text-xs text-white/30 hover:text-white border border-white/[0.08] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
                <button onClick={() => del(a.$id)} className="text-xs text-red-400/40 hover:text-red-400 border border-red-400/15 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {articles.length === 0 && !showForm && (
          <div className="glass rounded-2xl p-10 text-center text-white/25 text-sm">
            Aucun article. Clique sur &quot;+ Nouvel article&quot; pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}
