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

  list.innerHTML = data.map((e) => `
    <article class="r-row">
      <div class="min-w-0">
        <p class="r-date">${esc(e.period)}</p>
        <h3 class="r-title">${esc(e.school)}</h3>
        <p class="r-sub">${esc(e.speciality || e.degree)}</p>
      </div>
    </article>
  `).join("");
}
