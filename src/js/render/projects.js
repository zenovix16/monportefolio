import { esc } from "../utils.js";
import { observeReveal } from "../reveal.js";
import { getFilePreviewUrl } from "../appwrite.js";
import { stashDetail } from "../detail-store.js";
import { coverHTML } from "../cover.js";

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

export function renderProjects(projects) {
  const data = projects.length > 0 ? projects : FALLBACK;
  const list = document.getElementById("projects-list");

  list.innerHTML = data.map((p, i) => {
    const flip = i % 2 === 1;
    const cover = p.imageId
      ? `<img src="${getFilePreviewUrl(p.imageId, 900, 650)}" alt="${esc(p.title)}" class="absolute inset-0 w-full h-full object-cover" />`
      : coverHTML(p.$id + p.title, p.title);

    const tags = (p.tags || []).map((t) => `<span class="text-[11px] font-medium text-[var(--accent-light)] bg-[var(--accent-soft)] rounded-full px-3 py-1">${esc(t)}</span>`).join("");

    const links = `
      ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-sm font-medium text-black/60 hover:text-[var(--accent-light)] transition-colors">GitHub ↗</a>` : ""}
      ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-sm font-medium text-black/60 hover:text-[var(--accent-light)] transition-colors">Démo ↗</a>` : ""}
    `;

    return `
      <article data-animate class="grid md:grid-cols-2 gap-6 md:gap-12 items-center py-8 md:py-12 border-t border-black/[0.08] first:border-t-0 first:pt-0">
        <div class="card-hover relative w-full aspect-[16/11] rounded-xl overflow-hidden border border-black/[0.08] ${flip ? "md:order-2" : ""}">
          ${cover}
        </div>
        <div class="${flip ? "md:order-1" : ""}">
          ${p.featured ? `<span class="inline-block text-[10px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-3 py-1 mb-4">Projet phare</span>` : ""}
          <h3 class="text-[#14161A] font-bold leading-tight mb-3" style="font-size: clamp(1.4rem, 2.6vw, 1.9rem);">${esc(p.title)}</h3>
          <p class="text-black/65 text-sm md:text-base leading-relaxed mb-5">${esc(p.description)}</p>
          <div class="flex flex-wrap gap-1.5 mb-5">${tags}</div>
          <div class="flex items-center gap-5 flex-wrap">
            <a href="/project.html?id=${encodeURIComponent(p.$id)}" data-detail-project="${p.$id}" class="link-underline text-sm font-semibold text-[var(--accent-light)]">Voir le détail →</a>
            ${links}
          </div>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-detail-project]").forEach((link) => {
    link.addEventListener("click", () => {
      const p = data.find((x) => x.$id === link.dataset.detailProject);
      if (p) stashDetail("project", p);
    });
  });

  observeReveal(list);
}
