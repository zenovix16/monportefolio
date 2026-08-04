import { esc, readMoreHtml, wireReadMores } from "../utils.js";
import { observeReveal } from "../reveal.js";

const FALLBACK = [
  { $id: "f1", type: "text", body: "Ingénieur généraliste diplômé de l'École Centrale Casablanca, spécialisé en Data & Transformation Digitale. J'accompagne les entreprises dans la structuration de leurs données, l'optimisation de leurs processus et la mise en place d'outils de pilotage.", order: 0 },
  { $id: "f2", type: "text", body: "Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.", order: 1 },
  { $id: "f3", type: "tags", items: ["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"], order: 2 },
  { $id: "f4", type: "stat", value: "3+", title: "Années d'expérience", order: 3 },
  { $id: "f5", type: "stat", value: "3", title: "Missions en entreprise", order: 4 },
  { $id: "f6", type: "stat", value: "2", title: "Grandes écoles", order: 5 },
  { $id: "f7", type: "text", title: "Langues", body: "Français — Niveau C1 · Anglais — Niveau B2", order: 6 },
];

function groupBlocks(blocks) {
  const groups = [];
  for (const b of blocks) {
    if (b.type === "stat") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "stat") last.blocks.push(b);
      else groups.push({ kind: "stat", blocks: [b] });
    } else {
      groups.push({ kind: b.type, block: b });
    }
  }
  return groups;
}

export function renderAbout(blocks) {
  const data = blocks.length > 0 ? blocks : FALLBACK;
  const groups = groupBlocks(data);
  const container = document.getElementById("about-blocks");

  container.innerHTML = groups.map((g, i) => {
    const delay = `style="--delay:${(i % 5) * 0.06}s"`;

    if (g.kind === "stat") {
      const tiles = g.blocks.map((s) => `
        <div>
          <span class="mono block text-3xl font-bold text-[var(--accent-light)] tabular-nums">${esc(s.value)}</span>
          <span class="text-black/50 text-xs">${esc(s.title)}</span>
        </div>
      `).join("");
      return `<div data-animate="fade" ${delay} class="grid grid-cols-3 gap-6 border-t border-black/[0.08] pt-4">${tiles}</div>`;
    }

    if (g.kind === "tags") {
      const pills = (g.block.items || []).map((t) => `<span class="text-[11px] text-black/60 border border-black/[0.1] rounded-full px-3 py-1">${esc(t)}</span>`).join("");
      return `<div data-animate="fade" ${delay} class="flex gap-2 flex-wrap">${pills}</div>`;
    }

    if (g.kind === "quote") {
      return `<blockquote data-animate="fade" ${delay} class="border-l-2 border-[var(--accent)] pl-4 text-lg md:text-xl font-semibold text-[var(--accent-light)] leading-snug">${esc(g.block.body)}</blockquote>`;
    }

    // text
    const block = g.block;
    if (block.title) {
      return `
        <div data-animate="fade" ${delay} class="border-t border-black/[0.08] pt-4">
          <p class="text-[10px] tracking-widest uppercase text-black/40 mb-2">${esc(block.title)}</p>
          ${block.body ? readMoreHtml(block.body, { lines: 3, className: "text-black/60 text-sm leading-relaxed" }) : ""}
        </div>
      `;
    }
    return `<div data-animate="fade" ${delay}>${block.body ? readMoreHtml(block.body, { lines: 4, className: "text-black/60 leading-relaxed text-base" }) : ""}</div>`;
  }).join("");

  wireReadMores(container);
  observeReveal(container);
}
