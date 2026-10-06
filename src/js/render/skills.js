import { esc } from "../utils.js";
import { gsap, reduceMotion } from "../motion.js";

export const FALLBACK_SKILLS = [
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
  const data = skills.length > 0 ? skills : FALLBACK_SKILLS;
  const byCategory = data.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  const grid = document.getElementById("skills-grid");
  const count = Object.keys(byCategory).length;
  grid.classList.toggle("lg:grid-cols-3", count % 2 === 1 || count > 4);
  grid.classList.toggle("lg:grid-cols-2", count % 2 === 0 && count <= 4);
  grid.innerHTML = Object.entries(byCategory).map(([cat, catSkills], catIdx) => {
    const avg = Math.round(catSkills.reduce((n, s) => n + (s.level ?? 80), 0) / catSkills.length);
    const rows = catSkills.map((s) => {
      const level = s.level ?? 80;
      return `
        <div class="skill-row">
          <div class="flex justify-between items-baseline mb-2">
            <span class="text-[15px] font-medium">${esc(s.name)}</span>
            <span class="mono text-[#0A0C10]/45 text-xs tabular-nums" data-count="${level}%">${level}%</span>
          </div>
          <div class="skill-track"><div class="skill-fill" data-level="${level}"></div></div>
        </div>
      `;
    }).join("");

    return `
      <article class="spot skill-card" data-tilt>
        <div class="flex items-center justify-between mb-7">
          <span class="skill-cat-icon">${String(catIdx + 1).padStart(2, "0")}</span>
          <span class="mono text-xs text-[#0A0C10]/40">moy. <span class="text-[#0A0C10] font-medium" data-count="${avg}%">${avg}%</span></span>
        </div>
        <h3 class="text-xl font-bold tracking-tight mb-6">${esc(cat)}</h3>
        ${rows}
      </article>
    `;
  }).join("");
}

export function initSkillsMotion() {
  document.querySelectorAll("#skills-grid .skill-card").forEach((card) => {
    const fills = card.querySelectorAll(".skill-fill");
    if (reduceMotion) { fills.forEach((f) => gsap.set(f, { scaleX: f.dataset.level / 100 })); return; }
    fills.forEach((f, i) => {
      gsap.to(f, {
        scaleX: f.dataset.level / 100,
        duration: 1.6,
        ease: "expo.out",
        delay: 0.2 + i * 0.08,
        scrollTrigger: { trigger: card, start: "top 80%" },
      });
    });
  });
}

export function skillNames(skills) {
  const data = skills.length > 0 ? skills : FALLBACK_SKILLS;
  return data.map((s) => s.name);
}
