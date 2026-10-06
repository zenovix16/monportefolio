import { esc, readMoreHtml, wireReadMores } from "../utils.js";

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
      ? `<div class="flex flex-wrap gap-2 mt-4">${a.tags.map((t) => `<span class="pill">${esc(t)}</span>`).join("")}</div>`
      : "";
    const links = `
      ${a.doi ? `<a href="https://doi.org/${esc(a.doi)}" target="_blank" rel="noopener noreferrer" data-magnetic class="btn btn-outline h-10 px-4 text-xs"><span class="btn-fill"></span>DOI ↗</a>` : ""}
      ${a.pdfUrl ? `<a href="${esc(a.pdfUrl)}" target="_blank" rel="noopener noreferrer" data-magnetic class="btn btn-primary h-10 px-4 text-xs"><span class="btn-fill"></span>PDF ↓</a>` : ""}
    `;

    return `
      <article class="a-row" data-reveal>
        <div class="grid md:grid-cols-[5rem_1fr_auto] gap-4 md:gap-8 items-start">
          <span class="mono text-3xl md:text-4xl font-medium text-[#0A0C10]/15">${String(i + 1).padStart(2, "0")}</span>
          <div class="min-w-0">
            <div class="flex items-center gap-2.5 mb-2 flex-wrap">
              ${a.featured ? `<span class="text-[10px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-2.5 py-1">Featured</span>` : ""}
              ${a.publishedDate ? `<span class="mono text-[#0A0C10]/45 text-xs">${esc(a.publishedDate)}</span>` : ""}
              ${a.journal ? `<span class="text-[#0A0C10]/50 text-sm italic">${esc(a.journal)}</span>` : ""}
            </div>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight leading-snug mb-2">${esc(a.title)}</h3>
            ${a.authors && a.authors.length ? `<p class="text-[#0A0C10]/50 text-sm mb-3">${esc(a.authors.join(", "))}</p>` : ""}
            ${readMoreHtml(a.abstract, { lines: 3, className: "text-[#0A0C10]/65 text-[15px] leading-relaxed" })}
            ${tags}
          </div>
          <div class="flex md:flex-col gap-2 shrink-0 md:items-end">${links}</div>
        </div>
      </article>
    `;
  }).join("");

  wireReadMores(list);
}
