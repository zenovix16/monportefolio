import { esc } from "../utils.js";
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
  const list = document.getElementById("experience-list");

  list.innerHTML = data.map((e) => `
    <a href="/experience.html?id=${encodeURIComponent(e.$id)}" data-detail-exp="${e.$id}" data-transition="${esc(e.role)} · ${esc(e.company)}" class="r-row">
      <div class="min-w-0">
        <p class="r-date">${esc(dateRange(e))}${e.current ? `<span class="r-now"><span class="live-dot"></span>Actuel</span>` : ""}</p>
        <h3 class="r-title">${esc(e.role)}</h3>
        <p class="r-sub">${esc(e.company)}</p>
      </div>
      <span class="r-arrow" aria-hidden="true">→</span>
    </a>
  `).join("");

  list.querySelectorAll("[data-detail-exp]").forEach((link) => {
    link.addEventListener("click", () => {
      const e = data.find((x) => x.$id === link.dataset.detailExp);
      if (e) stashDetail("experience", { ...e, dateRange: dateRange(e) });
    });
  });
}
