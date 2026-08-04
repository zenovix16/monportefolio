import { esc } from "./utils.js";

const root = () => document.getElementById("modal-root");

export function closeModal() {
  const el = root();
  el.innerHTML = "";
  document.body.style.overflow = "";
}

function projectContent(item) {
  return `
    ${item.imageUrl ? `<div class="relative w-full h-56 md:h-64 bg-black/[0.03] border-b border-black/[0.08]"><img src="${esc(item.imageUrl)}" alt="${esc(item.title)}" class="w-full h-full object-cover" /></div>` : ""}
    <div class="p-6 md:p-8">
      <h3 class="text-xl md:text-2xl font-bold text-[#14161A] mb-3 pr-8">${esc(item.title)}</h3>
      <p class="text-black/60 text-sm leading-relaxed mb-5 whitespace-pre-line">${esc(item.description)}</p>
      ${(item.tags || []).length ? `<div class="flex flex-wrap gap-1.5 mb-6">${item.tags.map((t) => `<span class="text-[11px] text-black/50 border border-black/[0.1] rounded-full px-3 py-1">${esc(t)}</span>`).join("")}</div>` : ""}
      <div class="flex gap-4">
        ${item.githubUrl ? `<a href="${esc(item.githubUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-sm text-[var(--accent-light)] font-medium">GitHub ↗</a>` : ""}
        ${item.liveUrl ? `<a href="${esc(item.liveUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-sm text-[var(--accent-light)] font-medium">Voir le projet ↗</a>` : ""}
      </div>
    </div>
  `;
}

function experienceContent(item) {
  return `
    <div class="p-6 md:p-8">
      <div class="flex items-center gap-2 flex-wrap mb-1 pr-8">
        <h3 class="text-xl md:text-2xl font-bold text-[#14161A]">${esc(item.role)}</h3>
        ${item.current ? `<span class="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5">Actuel</span>` : ""}
      </div>
      <p class="text-black/55 text-sm mb-1">${esc(item.company)}${item.location ? ` · ${esc(item.location)}` : ""}</p>
      <p class="mono text-black/35 text-xs mb-5">${esc(item.dateRange)}</p>
      <p class="text-black/60 text-sm leading-relaxed whitespace-pre-line">${esc(item.description)}</p>
    </div>
  `;
}

export function openModal(item) {
  const el = root();
  document.body.style.overflow = "hidden";

  el.innerHTML = `
    <div id="modal-backdrop" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div id="modal-panel" class="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-lg bg-[#F1F2F4] border border-black/[0.08] shadow-2xl">
        <button id="modal-close" aria-label="Fermer" class="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center border border-black/[0.1] text-black/50 hover:text-black hover:border-black/25 transition-colors bg-[#F1F2F4] z-10">✕</button>
        ${item.kind === "project" ? projectContent(item) : experienceContent(item)}
      </div>
    </div>
  `;

  document.getElementById("modal-backdrop").addEventListener("click", closeModal);
  document.getElementById("modal-panel").addEventListener("click", (e) => e.stopPropagation());
  document.getElementById("modal-close").addEventListener("click", closeModal);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
