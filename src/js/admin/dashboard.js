import { initAdminPage } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, Query } from "../appwrite.js";

async function loadStats() {
  const grid = document.getElementById("stats-grid");
  grid.innerHTML = Array.from({ length: 4 }).map(() => `<div class="glass rounded-lg p-6 animate-pulse h-28"></div>`).join("");

  const [messages, projects, articles, experience] = await Promise.all([
    databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [Query.limit(1)]),
    databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.limit(1)]),
    databases.listDocuments(DB_ID, COLLECTIONS.ARTICLES, [Query.limit(1)]),
    databases.listDocuments(DB_ID, COLLECTIONS.EXPERIENCE, [Query.limit(1)]),
  ]);

  const cards = [
    { label: "Messages reçus", value: messages.total, icon: "✉", href: "/admin/messages.html" },
    { label: "Projets", value: projects.total, icon: "◈", href: "/admin/projects.html" },
    { label: "Articles", value: articles.total, icon: "◇", href: "/admin/articles.html" },
    { label: "Expériences", value: experience.total, icon: "◆", href: "/admin/experience.html" },
  ];

  grid.innerHTML = cards.map((c) => `
    <a href="${c.href}" class="glass rounded-lg p-6 hover:border-[var(--accent)]/40 transition-all">
      <p class="text-2xl mb-1">${c.icon}</p>
      <p class="mono text-3xl font-bold text-[#14161A] mb-1">${c.value}</p>
      <p class="text-xs text-black/55">${c.label}</p>
    </a>
  `).join("");
}

initAdminPage().then((user) => { if (user) loadStats(); });
