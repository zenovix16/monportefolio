import { databases, DB_ID, COLLECTIONS, Query } from "./appwrite.js";
import { esc } from "./utils.js";
import { loadSnapshot } from "./snapshot.js";
import { readStashedDetail } from "./detail-store.js";
import { badgeHTML } from "./cover.js";
import { bootDetailPage, revealDetail, showNotFound, setNext } from "./detail-page.js";

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

// Découpe en paragraphes, ou en phrases si la description tient en un bloc.
function paragraphs(text) {
  const parts = String(text || "").split(/\n\s*\n|\n/).map((t) => t.trim()).filter(Boolean);
  if (parts.length > 1) return parts;
  return String(text || "").split(/(?<=\.)\s+/).map((t) => t.trim()).filter(Boolean);
}

function render(e, list) {
  document.title = `${e.role} · ${e.company} — Soumaïla Niampa`;
  const [lead, ...rest] = paragraphs(e.description);
  const facts = [
    ["Période", dateRange(e)],
    ["Lieu", e.location],
    ["Statut", e.current ? "Poste actuel" : "Mission terminée"],
  ].filter(([, v]) => v);

  document.getElementById("state-content").innerHTML = `
    <header class="px-5 md:px-10 pt-32 md:pt-40 max-w-6xl mx-auto">
      <div data-hero-fade class="flex items-center gap-3 mb-6">
        ${badgeHTML(e.$id + e.company, e.company, 40)}
        <span class="text-lg font-semibold">${esc(e.company)}</span>
        ${e.current ? `<span class="text-[10px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-3 py-1.5">Actuel</span>` : ""}
      </div>
      <h1 data-hero-title class="font-extrabold tracking-[-0.05em] leading-[0.92]" style="font-size: clamp(2.8rem, 9vw, 8rem);">${esc(e.role)}</h1>
      <div data-hero-fade class="grid sm:grid-cols-3 gap-3 mt-12">
        ${facts.map(([k, v]) => `
          <div class="spot p-6">
            <p class="mono text-[10px] tracking-[0.25em] uppercase text-black/45 mb-2">${esc(k)}</p>
            <p class="text-xl font-semibold tracking-tight">${esc(v)}</p>
          </div>`).join("")}
      </div>
    </header>

    <section class="px-5 md:px-10 py-20 md:py-28 max-w-6xl mx-auto">
      <div class="sec-head"><span class="num">↘</span><span>La mission</span><span class="rule"></span></div>
      ${lead ? `<p class="lead-text mb-12 max-w-4xl" data-scrub-words>${esc(lead)}</p>` : ""}
      <div class="grid md:grid-cols-2 gap-4" data-stagger="0.1">
        ${rest.map((t, i) => `
          <div class="spot p-7" data-tilt>
            <span class="mono text-xs text-[var(--accent)]">${String(i + 1).padStart(2, "0")}</span>
            <p class="mt-3 text-black/70 text-lg leading-relaxed">${esc(t)}</p>
          </div>`).join("")}
      </div>
    </section>
  `;

  if (list.length > 1) {
    const idx = list.findIndex((x) => x.$id === e.$id);
    const next = list[(idx + 1) % list.length];
    setNext(next, {
      href: `/experience.html?id=${encodeURIComponent(next.$id)}`,
      title: next.role,
      sub: `${next.company} · ${dateRange(next)}`,
      label: `${next.role} · ${next.company}`,
    });
  } else {
    setNext(null, {});
  }
  return revealDetail();
}

async function loadList() {
  try {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.EXPERIENCE, [Query.orderAsc("order"), Query.limit(10)]);
    return res.documents.length ? res.documents : FALLBACK;
  } catch {
    const snap = await loadSnapshot();
    return snap?.experience?.length ? snap.experience : FALLBACK;
  }
}

async function init() {
  bootDetailPage();
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return showNotFound();

  const list = await loadList();
  const e = list.find((x) => x.$id === id) || readStashedDetail("experience", id);
  if (e) return render(e, list);

  try {
    render(await databases.getDocument(DB_ID, COLLECTIONS.EXPERIENCE, id), list);
  } catch {
    showNotFound();
  }
}

init();
