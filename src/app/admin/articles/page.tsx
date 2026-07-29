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
          <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-2">Publications</p>
          <h1 className="text-3xl font-bold text-[#14161A]">Articles scientifiques</h1>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(!showForm); }} className="glow px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
          {showForm ? "Annuler" : "+ Nouvel article"}
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium text-[#14161A] mb-5">{editing ? "Modifier l'article" : "Ajouter un article"}</p>
          <div className="space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre *" className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Résumé / Abstract *" rows={4} className="w-full glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.journal} onChange={(e) => setForm({ ...form, journal: e.target.value })} placeholder="Journal / Conférence" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
              <input value={form.publishedDate} onChange={(e) => setForm({ ...form, publishedDate: e.target.value })} placeholder="Date (ex: 2024-03)" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={Array.isArray(form.authors) ? form.authors.join(", ") : form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value.split(",").map(s => s.trim()) })} placeholder="Auteurs (séparés par virgule)" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
              <input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(s => s.trim()) })} placeholder="Tags (séparés par virgule)" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="DOI" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
              <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} placeholder="URL du PDF" className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none" />
            </div>
            <label className="flex items-center gap-3 text-sm text-black/65 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[var(--accent)]" />
              Mettre en avant (featured)
            </label>
            <button onClick={save} className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors">
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
                  {a.featured && <span className="text-[10px] border border-[var(--accent)]/40 text-[var(--accent-light)] rounded-full px-2 py-0.5 uppercase tracking-widest">Featured</span>}
                  <p className="text-[#14161A] font-medium text-sm">{a.title}</p>
                </div>
                {a.journal && <p className="text-black/55 text-xs mb-1">{a.journal} {a.publishedDate && `· ${a.publishedDate}`}</p>}
                <p className="text-black/60 text-xs line-clamp-2">{a.abstract}</p>
                {a.tags && a.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {a.tags.map((t) => <span key={t} className="text-[10px] text-black/45 border border-black/[0.08] rounded-full px-2 py-0.5">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => edit(a)} className="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
                <button onClick={() => del(a.$id)} className="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {articles.length === 0 && !showForm && (
          <div className="glass rounded-2xl p-10 text-center text-black/45 text-sm">
            Aucun article. Clique sur &quot;+ Nouvel article&quot; pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}
