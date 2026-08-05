import { esc, readMoreHtml, wireReadMores } from "../utils.js";
import { observeReveal } from "../reveal.js";

export function renderArticles(articles) {
  const list = document.getElementById("articles-list");
  const empty = document.getElementById("articles-empty");
  const label = document.getElementById("articles-label");
  const titleWrap = document.getElementById("articles-title-wrap");

  if (articles.length === 0) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    titleWrap.classList.add("hidden");
    label.textContent = "Articles";
    return;
  }

  empty.classList.add("hidden");
  titleWrap.classList.remove("hidden");
  label.textContent = "Publications";

  list.innerHTML = articles.map((a, i) => {
    const tags = (a.tags || []).length
      ? `<div class="flex flex-wrap gap-1.5 mt-3">${a.tags.map((t) => `<span class="text-[11px] font-medium text-[var(--accent-light)] bg-[var(--accent-soft)] rounded-full px-2.5 py-1">${esc(t)}</span>`).join("")}</div>`
      : "";
    const links = `
      ${a.doi ? `<a href="https://doi.org/${esc(a.doi)}" target="_blank" rel="noopener noreferrer" class="link-underline text-xs font-medium text-black/55 hover:text-[var(--accent-light)] transition-colors whitespace-nowrap">DOI ↗</a>` : ""}
      ${a.pdfUrl ? `<a href="${esc(a.pdfUrl)}" target="_blank" rel="noopener noreferrer" class="link-underline text-xs font-medium text-black/55 hover:text-[var(--accent-light)] transition-colors whitespace-nowrap">PDF ↓</a>` : ""}
    `;

    return `
      <div data-animate style="--delay:${i * 0.08}s" class="py-5 first:pt-0">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2.5 mb-1.5 flex-wrap">
              ${a.featured ? `<span class="text-[9px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-2.5 py-1">Featured</span>` : ""}
              ${a.publishedDate ? `<span class="mono text-black/40 text-xs">${esc(a.publishedDate)}</span>` : ""}
            </div>
            <h3 class="text-[#14161A] font-bold text-lg mb-1 leading-snug">${esc(a.title)}</h3>
            ${a.journal ? `<p class="text-black/50 text-sm italic mb-2">${esc(a.journal)}</p>` : ""}
            ${a.authors && a.authors.length ? `<p class="text-black/45 text-xs mb-2">${esc(a.authors.join(", "))}</p>` : ""}
            ${readMoreHtml(a.abstract, { lines: 3, className: "text-black/60 text-sm leading-relaxed" })}
            ${tags}
          </div>
          <div class="flex flex-col gap-2 shrink-0 items-end">${links}</div>
        </div>
      </div>
    `;
  }).join("");

  wireReadMores(list);
  observeReveal(list);
}
