import { esc, readMoreHtml, wireReadMores } from "../utils.js";
import { observeReveal } from "../reveal.js";
import { getFilePreviewUrl } from "../appwrite.js";
import { openModal } from "../modal.js";
import { initCarousel } from "../carousel.js";

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
  const track = document.getElementById("projects-carousel");

  track.innerHTML = data.map((p, i) => {
    const img = p.imageId
      ? `<img src="${getFilePreviewUrl(p.imageId, 900, 500)}" alt="${esc(p.title)}" class="absolute inset-0 w-full h-full object-cover" />
         <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>`
      : `<div class="w-full h-full flex items-center justify-center"><span class="text-[10px] tracking-widest uppercase text-black/[0.2]">image</span></div>`;

    const tags = (p.tags || []).slice(0, 2).map((t) => `<span class="text-[10px] text-black/45 border border-black/[0.08] rounded-full px-2.5 py-1">${esc(t)}</span>`).join("");

    return `
      <article data-animate style="--delay:${(i % 3) * 0.08}s"
        class="btn-ghost rounded-lg overflow-hidden shrink-0 snap-start w-[85%] sm:w-[65%] ${p.featured ? "lg:w-[440px] border-[var(--accent)]/40" : "lg:w-[360px]"}">
        <div class="relative w-full h-48 bg-black/[0.02] border-b border-black/[0.07] overflow-hidden">${img}</div>
        <div class="p-5">
          ${p.featured ? `<span class="inline-block text-[9px] tracking-[0.3em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2.5 py-1 mb-3">Projet phare</span>` : ""}
          <h3 class="text-[#14161A] font-semibold text-base mb-1.5 leading-snug">${esc(p.title)}</h3>
          <p class="text-black/55 text-xs leading-relaxed mb-4 line-clamp-2">${esc(p.description)}</p>
          <div class="flex items-center justify-between gap-2">
            <div class="flex flex-wrap gap-1.5">${tags}</div>
            <button type="button" data-open-project="${p.$id}" class="link-underline text-[12px] font-medium text-[var(--accent-light)] shrink-0">Voir plus →</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  track.querySelectorAll("[data-open-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const p = data.find((x) => x.$id === btn.dataset.openProject);
      if (!p) return;
      openModal({
        kind: "project",
        title: p.title,
        description: p.description,
        tags: p.tags,
        imageUrl: p.imageId ? getFilePreviewUrl(p.imageId, 900, 500) : null,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
      });
    });
  });

  observeReveal(track);
  initCarousel({
    track,
    prevBtn: document.getElementById("projects-prev"),
    nextBtn: document.getElementById("projects-next"),
    progressTrack: document.getElementById("projects-progress-track"),
    progressFill: document.getElementById("projects-progress-fill"),
    scrollAmount: 360,
    showProgress: data.length > 1,
  });
}
