import { esc } from "../utils.js";
import { observeReveal } from "../reveal.js";
import { stashDetail } from "../detail-store.js";
import { badgeHTML } from "../cover.js";

const FALLBACK = [
  {
    $id: "1",
    company: "Attijariwafa Bank",
    role: "Data Analyst",
    location: "Casablanca, Maroc",
    startDate: "2025",
    current: true,
    description: "Tableaux de bord pour suivre les KPI et améliorer la prise de décision. Analyse et optimisation des processus métiers. Traduction des besoins business en solutions data.",
  },
  {
    $id: "2",
    company: "Société Générale Maroc",
    role: "Data Engineer",
    location: "Casablanca, Maroc",
    startDate: "Janv. 2025",
    endDate: "Mars 2025",
    description: "Automatisation de la collecte et du traitement des données. Organisation et structuration pour les rendre exploitables. Amélioration des flux pour réduire les erreurs.",
  },
  {
    $id: "3",
    company: "BBC & Partners",
    role: "Ingénieur IA",
    location: "Casablanca, Maroc",
    startDate: "Mai 2024",
    endDate: "Août 2024",
    description: "Développement d'un assistant virtuel pour automatiser les demandes. Amélioration de l'expérience via l'interaction homme-assistant. Intégration d'échanges vocal et texte.",
  },
];

function dateRange(e) {
  return `${e.startDate}${e.endDate ? ` — ${e.endDate}` : e.current ? " — Présent" : ""}`;
}

export function renderExperience(experience) {
  const data = experience.length > 0 ? experience : FALLBACK;
  const list = document.getElementById("experience-list");

  list.innerHTML = data.map((e, i) => {
    const isLast = i === data.length - 1;
    return `
      <div data-animate style="--delay:${i * 0.08}s" class="relative flex gap-5 md:gap-6 pb-10 last:pb-0">
        <div class="relative flex flex-col items-center shrink-0">
          ${badgeHTML(e.$id + e.company, e.company, 44)}
          ${isLast ? "" : `<div class="w-px flex-1 bg-black/[0.1] mt-3"></div>`}
        </div>
        <div class="flex-1 min-w-0 pt-1">
          <div class="flex items-center gap-2.5 flex-wrap mb-0.5">
            <h3 class="text-[#14161A] font-bold text-lg md:text-xl">${esc(e.role)}</h3>
            ${e.current ? `<span class="text-[9px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-2.5 py-1">Actuel</span>` : ""}
          </div>
          <p class="text-black/60 text-sm md:text-base mb-1">${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ""}</p>
          <p class="mono text-black/35 text-xs mb-3">${esc(dateRange(e))}</p>
          <p class="text-black/65 text-sm md:text-base leading-relaxed mb-3 max-w-2xl">${esc(e.description)}</p>
          <a href="/experience.html?id=${encodeURIComponent(e.$id)}" data-detail-exp="${e.$id}" class="link-underline text-sm font-semibold text-[var(--accent-light)]">Voir le détail →</a>
        </div>
      </div>
    `;
  }).join("");

  list.querySelectorAll("[data-detail-exp]").forEach((link) => {
    link.addEventListener("click", () => {
      const e = data.find((x) => x.$id === link.dataset.detailExp);
      if (e) stashDetail("experience", { ...e, dateRange: dateRange(e) });
    });
  });

  observeReveal(list);
}
