export function esc(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const APPROX_CHARS_PER_LINE = 55;
let readMoreCount = 0;

// Équivalent de ReadMore.tsx : texte tronqué avec un bouton "Voir plus" qui
// dévoile le reste. Retourne du HTML (à insérer via innerHTML) ; les
// boutons sont câblés séparément via wireReadMores() une fois dans le DOM.
export function readMoreHtml(text, { lines = 3, className = "" } = {}) {
  const safe = esc(text);
  if (!text || text.length <= lines * APPROX_CHARS_PER_LINE) {
    return `<p class="${className}">${safe}</p>`;
  }
  const id = `rm-${readMoreCount++}`;
  const clampClass = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" }[lines] || "line-clamp-3";
  return `
    <div data-readmore="${id}" data-lines="${clampClass}">
      <p class="${className} ${clampClass}" data-rm-text>${safe}</p>
      <button type="button" class="mt-1.5 text-[11px] font-medium text-[var(--accent-light)] hover:underline" data-rm-toggle>Voir plus</button>
    </div>
  `;
}

export function wireReadMores(root = document) {
  root.querySelectorAll("[data-rm-toggle]").forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", () => {
      const wrap = btn.closest("[data-readmore]");
      const p = wrap.querySelector("[data-rm-text]");
      const expanded = p.classList.toggle("expanded");
      if (expanded) {
        p.classList.remove("line-clamp-2", "line-clamp-3", "line-clamp-4");
        btn.textContent = "Voir moins";
      } else {
        p.classList.add(wrap.dataset.lines || "line-clamp-3");
        btn.textContent = "Voir plus";
      }
    });
  });
}
