import { esc } from "../utils.js";

const FALLBACK = [
  {
    $id: "f1",
    school: "École Centrale Casablanca",
    degree: "Ingénieur généraliste",
    speciality: "Spécialisation Data & Transformation Digitale",
    location: "Casablanca, Maroc",
    period: "2022 — 2025",
    highlights: [
      "Deep learning, NLP, digitalisation des processus, gestion du changement",
      "Projets appliqués en transformation digitale et innovation produit",
    ],
  },
  {
    $id: "f2",
    school: "École Polytechnique de Ouagadougou",
    degree: "CPGE",
    speciality: "Génie informatique et télécommunications",
    location: "Ouagadougou, Burkina Faso",
    period: "2019 — 2022",
    highlights: [],
  },
];

export function renderEducation(education) {
  const data = education.length > 0 ? education : FALLBACK;
  const list = document.getElementById("education-list");

  list.innerHTML = data.map((e, i) => {
    const highlights = (e.highlights || []).length
      ? `<ul class="space-y-2 mt-5 pt-5 border-t border-[#0A0C10]/10">${e.highlights.map((h) => `<li class="flex gap-3 text-[#0A0C10]/60 text-sm leading-relaxed"><span class="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0"></span>${esc(h)}</li>`).join("")}</ul>`
      : "";

    return `
      <article class="spot p-7 md:p-9 flex flex-col" data-tilt>
        <div class="flex items-start justify-between gap-4 mb-10">
          <span class="mono text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-[#0A0C10] text-white">${esc(e.period)}</span>
          <span class="mono text-[64px] leading-none font-medium text-[#0A0C10]/[0.07] -mt-2">${String(i + 1).padStart(2, "0")}</span>
        </div>
        <h3 class="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-2">${esc(e.school)}</h3>
        <p class="text-[#0A0C10]/75 text-base font-medium">${esc(e.degree)}</p>
        ${e.speciality ? `<p class="grad-text self-start font-semibold text-sm mt-1">${esc(e.speciality)}</p>` : ""}
        ${e.location ? `<p class="mono text-[#0A0C10]/40 text-xs mt-3">${esc(e.location)}</p>` : ""}
        ${highlights}
      </article>
    `;
  }).join("");
}
