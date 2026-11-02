import { esc } from "../utils.js";

export const FALLBACK_SKILLS = [
  { $id: "1", name: "Python",               category: "Data & Analyse" },
  { $id: "2", name: "SQL",                  category: "Data & Analyse" },
  { $id: "3", name: "Power BI",             category: "Data & Analyse" },
  { $id: "4", name: "Excel",                category: "Data & Analyse" },
  { $id: "5", name: "KPI & Reporting",      category: "Data & Analyse" },
  { $id: "6", name: "NLP",                  category: "IA & NLP" },
  { $id: "7", name: "Deep Learning",        category: "IA & NLP" },
  { $id: "8", name: "RASA",                 category: "IA & NLP" },
  { $id: "9", name: "REST APIs",            category: "IA & NLP" },
  { $id:"10", name: "PySpark / Spark",      category: "Data Engineering" },
  { $id:"11", name: "Apache Airflow",       category: "Data Engineering" },
  { $id:"12", name: "Minio",               category: "Data Engineering" },
  { $id:"13", name: "Nessie",              category: "Data Engineering" },
  { $id:"14", name: "n8n",                 category: "Automatisation" },
  { $id:"15", name: "Transformation digitale", category: "Automatisation" },
];

export function renderSkills(skills) {
  const data = skills.length > 0 ? skills : FALLBACK_SKILLS;
  const byCategory = data.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const grid = document.getElementById("skills-grid");
  const count = Object.keys(byCategory).length;
  grid.classList.toggle("lg:grid-cols-3", count % 2 === 1 || count > 4);
  grid.innerHTML = Object.entries(byCategory).map(([cat, catSkills], catIdx) => `
    <article class="spot skill-card" data-tilt>
      <span class="skill-cat-icon mb-7">${String(catIdx + 1).padStart(2, "0")}</span>
      <h3 class="text-2xl font-bold tracking-tight mb-6">${esc(cat)}</h3>
      <div class="flex flex-wrap gap-2">${catSkills.map((s) => `<span class="pill">${esc(s.name)}</span>`).join("")}</div>
    </article>
  `).join("");
}

export function skillNames(skills) {
  const data = skills.length > 0 ? skills : FALLBACK_SKILLS;
  return data.map((s) => s.name);
}
