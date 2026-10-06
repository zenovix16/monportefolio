import { esc } from "../utils.js";
import { getFilePreviewUrl } from "../appwrite.js";
import { stashDetail } from "../detail-store.js";
import { stockPhotoUrl } from "../cover.js";
import { gsap, reduceMotion } from "../motion.js";

export const FALLBACK_PROJECTS = [
  {
    $id: "1",
    title: "Tableaux de bord de pilotage",
    description: "Création d'outils de suivi pour piloter l'activité et visualiser les performances en temps réel. Automatisation du reporting pour réduire les tâches manuelles.",
    tags: ["Power BI", "Excel", "KPI", "Reporting"],
    featured: true,
    fallbackImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
  },
  {
    $id: "2",
    title: "Gestion & automatisation des données",
    description: "Pipelines pour collecter, traiter et organiser les données. Structuration des flux pour faciliter leur exploitation.",
    tags: ["PySpark", "Spark", "Airflow", "Minio", "Nessie"],
    featured: false,
    fallbackImage: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee",
  },
  {
    $id: "3",
    title: "Assistant virtuel IA",
    description: "Assistant pour automatiser les tâches et répondre aux utilisateurs. Intégration d'échanges vocal et texte.",
    tags: ["Python", "RASA", "NLP", "REST APIs"],
    featured: false,
    fallbackImage: "https://images.unsplash.com/photo-1684369176170-463e84248b70",
  },
];

export function projectImageUrl(p, w = 1200, h = 900) {
  const uploaded = p.imageId && getFilePreviewUrl(p.imageId, w, h);
  if (uploaded) return uploaded;
  if (p.fallbackImage) return `${p.fallbackImage}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
  return stockPhotoUrl(p.$id + p.title, w, h);
}

export function renderProjects(projects) {
  const data = projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const list = document.getElementById("projects-list");
  const total = String(data.length).padStart(2, "0");

  list.innerHTML = data.map((p, i) => {
    const href = `/project.html?id=${encodeURIComponent(p.$id)}`;
    const tags = (p.tags || []).map((t) => `<span class="pill">${esc(t)}</span>`).join("");
    const links = `
      ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-sm font-medium text-[#0A0C10]/60 hover:text-[#0A0C10]">GitHub ↗</a>` : ""}
      ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-sm font-medium text-[#0A0C10]/60 hover:text-[#0A0C10]">Démo ↗</a>` : ""}
    `;

    return `
      <div class="p-card-wrap" style="--i:${i}">
        <article class="p-card">
          <a href="${href}" data-detail-project="${p.$id}" data-transition="${esc(p.title)}" data-cursor="Voir" class="p-media block" aria-label="Voir le projet ${esc(p.title)}">
            <img src="${projectImageUrl(p)}" alt="${esc(p.title)}" loading="lazy" />
            <span class="p-index">${String(i + 1).padStart(2, "0")} / ${total}</span>
          </a>
          <div class="p-body">
            <div class="flex items-center gap-2 mb-5">
              ${p.featured ? `<span class="text-[10px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-3 py-1">Projet phare</span>` : ""}
            </div>
            <h3 class="font-bold tracking-tight leading-[1.02] mb-4" style="font-size: clamp(1.7rem, 3.2vw, 2.6rem);">${esc(p.title)}</h3>
            <p class="text-[#0A0C10]/65 text-base leading-relaxed mb-6 line-clamp-4">${esc(p.description)}</p>
            <div class="flex flex-wrap gap-2 mb-8">${tags}</div>
            <div class="mt-auto flex items-center gap-5 flex-wrap">
              <a href="${href}" data-detail-project="${p.$id}" data-transition="${esc(p.title)}" data-magnetic class="btn btn-primary"><span class="btn-fill"></span>Étude de cas <span class="arrow">→</span></a>
              ${links}
            </div>
          </div>
          <div class="p-shade"></div>
        </article>
      </div>
    `;
  }).join("");

  list.querySelectorAll("[data-detail-project]").forEach((link) => {
    link.addEventListener("click", () => {
      const p = data.find((x) => x.$id === link.dataset.detailProject);
      if (p) stashDetail("project", p);
    });
  });
}

// Cartes empilées : chaque carte reste collée en haut pendant que la
// suivante glisse par-dessus ; celle du dessous recule et s'assombrit.
export function initProjectsMotion() {
  const wraps = [...document.querySelectorAll("#projects-list .p-card-wrap")];
  if (reduceMotion) return;

  wraps.forEach((wrap) => {
    gsap.from(wrap.querySelector(".p-card"), {
      y: 120,
      opacity: 0,
      duration: 1.3,
      ease: "expo.out",
      scrollTrigger: { trigger: wrap, start: "top 90%" },
    });
    const img = wrap.querySelector(".p-media img");
    gsap.set(img, { scale: 1.12 });
    const card = wrap.querySelector(".p-card");
    card.addEventListener("pointerenter", () => gsap.to(img, { scale: 1.2, duration: 1.2, ease: "expo.out" }));
    card.addEventListener("pointerleave", () => gsap.to(img, { scale: 1.12, duration: 1.2, ease: "expo.out" }));
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    wraps.forEach((wrap, i) => {
      const next = wraps[i + 1];
      if (!next) return;
      const card = wrap.querySelector(".p-card");
      gsap.to(card, {
        scale: 0.9 + i * 0.015,
        rotateX: -6,
        transformPerspective: 1200,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
      });
      gsap.to(wrap.querySelector(".p-shade"), {
        opacity: 0.45,
        ease: "none",
        scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
      });
    });
  });
}
