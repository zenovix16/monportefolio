import { esc } from "../utils.js";
import { observeReveal } from "../reveal.js";

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
      ? `<ul class="space-y-1.5">${(e.highlights || []).map((h) => `<li class="flex gap-2.5 text-black/50 text-xs leading-relaxed"><span class="text-black/30 mt-0.5 shrink-0">—</span>${esc(h)}</li>`).join("")}</ul>`
      : "";

    return `
      <div data-animate ${i === 0 ? 'style="--delay:0s"' : `style="--delay:${i * 0.1}s"`} class="py-5 first:pt-0">
        <div class="mono flex justify-between text-[10px] tracking-widest uppercase text-black/40 mb-2">
          <span>${esc(e.period)}</span>
          <span class="text-right">${esc(e.location)}</span>
        </div>
        <h3 class="text-[#14161A] font-bold text-lg mb-0.5">${esc(e.school)}</h3>
        <p class="text-black/60 text-sm font-medium mb-0.5">${esc(e.degree)}</p>
        ${e.speciality ? `<p class="text-[var(--accent-light)] text-sm mb-3">${esc(e.speciality)}</p>` : ""}
        ${highlights}
      </div>
    `;
  }).join("");

  observeReveal(list);
}
