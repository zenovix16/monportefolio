"use client";

import { useEffect, useState } from "react";

interface Stats {
  messages: number;
  projects: number;
  articles: number;
  experience: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = stats
    ? [
        { label: "Messages reçus", value: stats.messages, icon: "✉", href: "/admin/messages" },
        { label: "Projets", value: stats.projects, icon: "◈", href: "/admin/projects" },
        { label: "Articles", value: stats.articles, icon: "◇", href: "/admin/articles" },
        { label: "Expériences", value: stats.experience, icon: "◆", href: "/admin/experience" },
      ]
    : [];

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-2">Vue d&apos;ensemble</p>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats
          ? cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="glass rounded-2xl p-6 hover:border-white/15 transition-all"
              >
                <p className="text-2xl mb-1">{c.icon}</p>
                <p className="text-3xl font-bold text-white mb-1">{c.value}</p>
                <p className="text-xs text-white/35">{c.label}</p>
              </a>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse h-28" />
            ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-4">Accès rapide</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Voir les messages", href: "/admin/messages" },
            { label: "Ajouter un projet", href: "/admin/projects" },
            { label: "Ajouter un article", href: "/admin/articles" },
            { label: "Modifier l'expérience", href: "/admin/experience" },
            { label: "Modifier les skills", href: "/admin/skills" },
            { label: "Voir le portfolio", href: "/" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/40 hover:text-white border border-white/[0.06] hover:border-white/[0.15] rounded-xl px-4 py-3 transition-all"
            >
              {link.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
