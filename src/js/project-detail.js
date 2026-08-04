import { databases, DB_ID, COLLECTIONS, getFilePreviewUrl } from "./appwrite.js";
import { esc } from "./utils.js";
import { readStashedDetail } from "./detail-store.js";

const FALLBACK = [
  {
    $id: "1",
    title: "Tableaux de bord de pilotage",
    description: "Création d'outils de suivi pour piloter l'activité et visualiser les performances en temps réel. Automatisation du reporting pour réduire les tâches manuelles.",
    tags: ["Power BI", "Excel", "KPI", "Reporting"],
    featured: true,
  },
  {
    $id: "2",
    title: "Gestion & automatisation des données",
    description: "Pipelines pour collecter, traiter et organiser les données. Structuration des flux pour faciliter leur exploitation.",
    tags: ["PySpark", "Spark", "Airflow", "Minio", "Nessie"],
    featured: false,
  },
  {
    $id: "3",
    title: "Assistant virtuel IA",
    description: "Assistant pour automatiser les tâches et répondre aux utilisateurs. Intégration d'échanges vocal et texte.",
    tags: ["Python", "RASA", "NLP", "REST APIs"],
    featured: false,
  },
];

function render(p) {
  document.getElementById("state-loading").classList.add("hidden");
  document.title = `${p.title} — Soumaïla Niampa`;

  const img = p.imageId
    ? `<div class="w-full h-56 md:h-80 rounded-lg overflow-hidden border border-black/[0.08] mb-8"><img src="${getFilePreviewUrl(p.imageId, 1200, 675)}" alt="${esc(p.title)}" class="w-full h-full object-cover" /></div>`
    : "";

  const tags = (p.tags || []).map((t) => `<span class="text-[11px] text-black/55 border border-black/[0.1] rounded-full px-3 py-1">${esc(t)}</span>`).join("");

  const links = `
    ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-ghost px-5 py-2.5 text-black/70 text-xs rounded-lg hover:text-black transition-colors">GitHub ↗</a>` : ""}
    ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="glow px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent-light)] transition-colors">Voir le projet ↗</a>` : ""}
  `;

  const content = document.getElementById("state-content");
  content.innerHTML = `
    ${img}
    ${p.featured ? `<span class="inline-block text-[9px] tracking-[0.3em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2.5 py-1 mb-4">Projet phare</span>` : ""}
    <h1 class="font-bold text-[#14161A] leading-[1.02] mb-5" style="font-size: clamp(1.9rem, 4.5vw, 3rem);">${esc(p.title)}</h1>
    ${tags ? `<div class="flex flex-wrap gap-1.5 mb-6">${tags}</div>` : ""}
    <p class="text-black/65 text-base leading-relaxed whitespace-pre-line mb-8">${esc(p.description)}</p>
    ${links ? `<div class="flex flex-wrap gap-3">${links}</div>` : ""}
  `;
  content.classList.remove("hidden");
  requestAnimationFrame(() => content.classList.add("in-view"));
}

function notFound() {
  document.getElementById("state-loading").classList.add("hidden");
  document.getElementById("state-notfound").classList.remove("hidden");
}

async function init() {
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  const id = new URLSearchParams(location.search).get("id");
  if (!id) return notFound();

  const stashed = readStashedDetail("project", id);
  if (stashed) return render(stashed);

  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.PROJECTS, id);
    render(doc);
  } catch {
    const fallback = FALLBACK.find((p) => p.$id === id);
    if (fallback) render(fallback);
    else notFound();
  }
}

init();
