import { esc, readMoreHtml, wireReadMores } from "../utils.js";

export function renderAboutImage(url) {
  const img = document.getElementById("about-image");
  img.onerror = () => { img.onerror = null; img.src = "/portrait.jpg"; };
  img.src = url || "/portrait.jpg";
  img.classList.remove("hidden");
}

const FALLBACK = [
  { $id: "f1", type: "text", body: "Ingénieur généraliste diplômé de l'École Centrale Casablanca, spécialisé en Data & Transformation Digitale. J'accompagne les entreprises dans la structuration de leurs données, l'optimisation de leurs processus et la mise en place d'outils de pilotage.", order: 0 },
  { $id: "f2", type: "text", body: "Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.", order: 1 },
  { $id: "f3", type: "tags", items: ["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"], order: 2 },
  { $id: "f4", type: "stat", value: "3+", title: "Années d'expérience", order: 3 },
  { $id: "f5", type: "stat", value: "3", title: "Missions en entreprise", order: 4 },
  { $id: "f6", type: "stat", value: "2", title: "Grandes écoles", order: 5 },
  { $id: "f7", type: "text", title: "Langues", body: "Français — Niveau C1 · Anglais — Niveau B2", order: 6 },
];

const STAT_COLORS = ["var(--accent)", "var(--violet)", "#0EA5E9", "#10B981"];

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
  let leadUsed = false;

  container.innerHTML = groups.map((g) => {
    if (g.kind === "stat") {
      const cols = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2" }[g.blocks.length] || "sm:grid-cols-3";
      const tiles = g.blocks.map((s, i) => `
        <div class="stat-card spot" data-tilt>
          <span class="stat-value" style="color:${STAT_COLORS[i % STAT_COLORS.length]}" data-count="${esc(s.value)}">${esc(s.value)}</span>
          <span class="block mt-2 text-[#0A0C10]/55 text-sm">${esc(s.title)}</span>
        </div>
      `).join("");
      return `<div class="grid grid-cols-2 ${cols} gap-3" data-stagger="0.1">${tiles}</div>`;
    }

    if (g.kind === "tags") {
      const pills = (g.block.items || []).map((t) => `<span class="pill">${esc(t)}</span>`).join("");
      return `<div class="flex gap-2 flex-wrap" data-stagger="0.04">${pills}</div>`;
    }

    if (g.kind === "quote") {
      return `<blockquote data-reveal class="relative pl-6 text-2xl md:text-3xl font-semibold tracking-tight leading-snug"><span class="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--violet)]"></span><span class="grad-text">${esc(g.block.body)}</span></blockquote>`;
    }

    const block = g.block;
    if (block.title) {
      return `
        <div data-reveal class="border-t border-[#0A0C10]/10 pt-5 grid sm:grid-cols-[10rem_1fr] gap-2 sm:gap-6">
          <p class="mono text-[10px] tracking-[0.25em] uppercase text-[#0A0C10]/45 pt-1">${esc(block.title)}</p>
          ${block.body ? readMoreHtml(block.body, { lines: 3, className: "text-[#0A0C10]/70 text-base leading-relaxed" }) : ""}
        </div>
      `;
    }
    if (!leadUsed && block.body) {
      leadUsed = true;
      return `<p class="lead-text" data-scrub-words>${esc(block.body)}</p>`;
    }
    return `<div data-reveal>${block.body ? readMoreHtml(block.body, { lines: 4, className: "text-[#0A0C10]/65 leading-relaxed text-lg" }) : ""}</div>`;
  }).join("");

  wireReadMores(container);
}
