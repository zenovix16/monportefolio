import { esc } from "../utils.js";
import { observeReveal } from "../reveal.js";

const FALLBACK = [
  { $id: "1", name: "Python",               category: "Data & Analyse",    level: 88 },
  { $id: "2", name: "SQL",                  category: "Data & Analyse",    level: 82 },
  { $id: "3", name: "Power BI",             category: "Data & Analyse",    level: 85 },
  { $id: "4", name: "Excel",                category: "Data & Analyse",    level: 80 },
  { $id: "5", name: "KPI & Reporting",      category: "Data & Analyse",    level: 88 },
  { $id: "6", name: "NLP",                  category: "IA & NLP",          level: 80 },
  { $id: "7", name: "Deep Learning",        category: "IA & NLP",          level: 73 },
  { $id: "8", name: "RASA",                 category: "IA & NLP",          level: 70 },
  { $id: "9", name: "REST APIs",            category: "IA & NLP",          level: 82 },
  { $id:"10", name: "PySpark / Spark",      category: "Data Engineering",  level: 75 },
  { $id:"11", name: "Apache Airflow",       category: "Data Engineering",  level: 72 },
  { $id:"12", name: "Minio",               category: "Data Engineering",  level: 68 },
  { $id:"13", name: "Nessie",              category: "Data Engineering",  level: 68 },
  { $id:"14", name: "n8n",                 category: "Automatisation",    level: 75 },
  { $id:"15", name: "Transformation digitale", category: "Automatisation",level: 85 },
];

export function renderSkills(skills) {
  const data = skills.length > 0 ? skills : FALLBACK;
  const byCategory = data.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const grid = document.getElementById("skills-grid");
  let globalIdx = 0;

  grid.innerHTML = Object.entries(byCategory).map(([cat, catSkills], catIdx) => {
    const bars = catSkills.map((s) => {
      const level = s.level ?? 80;
      const delay = 0.05 + globalIdx++ * 0.03;
      return `
        <div>
          <div class="flex justify-between mb-1.5">
            <span class="text-black/85 text-sm font-medium">${esc(s.name)}</span>
            <span class="mono text-black/40 text-xs tabular-nums">${level}%</span>
          </div>
          <div class="h-1 bg-black/10 rounded-full overflow-hidden">
            <div class="skill-bar h-full bg-[var(--accent)] rounded-full" style="width:0%; transition: width 0.9s ease-out ${delay}s;" data-level="${level}"></div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div data-animate="fade" class="border-t-2 border-black/[0.08] pt-4 ${catIdx === 0 ? "lg:col-span-2" : ""}">
        <p class="text-xs font-bold tracking-[0.2em] uppercase text-[var(--accent-light)] mb-4">${esc(cat)}</p>
        <div class="space-y-3.5">${bars}</div>
      </div>
    `;
  }).join("");

  observeReveal(grid);

  // Barres de progression : remplies au scroll (une fois), indépendamment
  // du fade du groupe parent.
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.level}%`;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  grid.querySelectorAll(".skill-bar").forEach((bar) => barObserver.observe(bar));
}
