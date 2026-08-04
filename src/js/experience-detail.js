import { databases, DB_ID, COLLECTIONS } from "./appwrite.js";
import { esc } from "./utils.js";
import { readStashedDetail } from "./detail-store.js";

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
  if (e.dateRange) return e.dateRange;
  return `${e.startDate}${e.endDate ? ` — ${e.endDate}` : e.current ? " — Présent" : ""}`;
}

function render(e) {
  document.getElementById("state-loading").classList.add("hidden");
  document.title = `${e.role} · ${e.company} — Soumaïla Niampa`;

  const content = document.getElementById("state-content");
  content.innerHTML = `
    <div class="flex items-center gap-2.5 flex-wrap mb-2">
      <h1 class="font-bold text-[#14161A] leading-[1.02]" style="font-size: clamp(1.9rem, 4.5vw, 3rem);">${esc(e.role)}</h1>
      ${e.current ? `<span class="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5 self-start mt-2">Actuel</span>` : ""}
    </div>
    <p class="text-black/60 text-base mb-1">${esc(e.company)}${e.location ? ` · ${esc(e.location)}` : ""}</p>
    <p class="mono text-black/35 text-sm mb-8">${esc(dateRange(e))}</p>
    <p class="text-black/65 text-base leading-relaxed whitespace-pre-line">${esc(e.description)}</p>
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

  const stashed = readStashedDetail("experience", id);
  if (stashed) return render(stashed);

  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.EXPERIENCE, id);
    render(doc);
  } catch {
    const fallback = FALLBACK.find((e) => e.$id === id);
    if (fallback) render(fallback);
    else notFound();
  }
}

init();
