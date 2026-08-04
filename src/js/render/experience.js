import { esc } from "../utils.js";
import { observeReveal } from "../reveal.js";
import { initCarousel } from "../carousel.js";
import { stashDetail } from "../detail-store.js";

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
  const track = document.getElementById("experience-carousel");

  track.innerHTML = data.map((e, i) => `
    <div data-animate style="--delay:${i * 0.12}s" class="card-hover btn-ghost rounded-lg p-5 shrink-0 snap-start w-[80%] sm:w-[55%] lg:w-[320px]">
      <div class="flex items-center gap-2 flex-wrap mb-0.5">
        <h3 class="text-[#14161A] font-semibold text-base">${esc(e.role)}</h3>
        ${e.current ? `<span class="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5">Actuel</span>` : ""}
      </div>
      <p class="text-black/55 text-sm mb-1">${esc(e.company)} · ${esc(e.location)}</p>
      <p class="mono text-black/35 text-xs mb-3">${esc(dateRange(e))}</p>
      <p class="text-black/55 text-sm leading-relaxed line-clamp-3 mb-3">${esc(e.description)}</p>
      <a href="/experience.html?id=${encodeURIComponent(e.$id)}" data-detail-exp="${e.$id}" class="link-underline text-[12px] font-medium text-[var(--accent-light)]">Voir plus →</a>
    </div>
  `).join("");

  track.querySelectorAll("[data-detail-exp]").forEach((link) => {
    link.addEventListener("click", () => {
      const e = data.find((x) => x.$id === link.dataset.detailExp);
      if (e) stashDetail("experience", { ...e, dateRange: dateRange(e) });
    });
  });

  observeReveal(track);
  initCarousel({
    track,
    prevBtn: document.getElementById("experience-prev"),
    nextBtn: document.getElementById("experience-next"),
    progressTrack: document.getElementById("experience-progress-track"),
    progressFill: document.getElementById("experience-progress-fill"),
    scrollAmount: 320,
    showProgress: data.length > 1,
  });
}
