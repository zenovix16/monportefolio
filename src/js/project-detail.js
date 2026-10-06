import { databases, DB_ID, COLLECTIONS, Query } from "./appwrite.js";
import { esc } from "./utils.js";
import { loadSnapshot } from "./snapshot.js";
import { readStashedDetail } from "./detail-store.js";
import { FALLBACK_PROJECTS, projectImageUrl } from "./render/projects.js";
import { bootDetailPage, revealDetail, showNotFound, setNext } from "./detail-page.js";

function paragraphs(text) {
  return String(text || "").split(/\n\s*\n|\n/).map((t) => t.trim()).filter(Boolean);
}

function render(p, list) {
  document.title = `${p.title} — Soumaïla Niampa`;
  const idx = list.findIndex((x) => x.$id === p.$id);
  const pos = idx >= 0 ? `${String(idx + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}` : "";
  const [lead, ...rest] = paragraphs(p.description);

  const tags = (p.tags || []).map((t) => `<span class="pill">${esc(t)}</span>`).join("");
  const links = `
    ${p.liveUrl ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" data-magnetic class="btn btn-primary"><span class="btn-fill"></span>Voir le projet <span class="arrow">→</span></a>` : ""}
    ${p.githubUrl ? `<a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer" data-magnetic class="btn btn-outline"><span class="btn-fill"></span>GitHub ↗</a>` : ""}
  `;

  document.getElementById("state-content").innerHTML = `
    <header class="px-5 md:px-10 pt-32 md:pt-40 max-w-6xl mx-auto">
      <div data-hero-fade class="flex items-center gap-3 mb-6">
        ${pos ? `<span class="mono text-xs px-3 py-1.5 rounded-full bg-[#0A0C10] text-white">Projet ${pos}</span>` : ""}
        ${p.featured ? `<span class="text-[10px] tracking-[0.25em] uppercase text-white bg-[var(--accent)] rounded-full px-3 py-1.5">Projet phare</span>` : ""}
      </div>
      <h1 data-hero-title class="font-extrabold tracking-[-0.05em] leading-[0.92]" style="font-size: clamp(2.6rem, 8vw, 7rem);">${esc(p.title)}</h1>
      ${tags ? `<div data-hero-fade class="flex flex-wrap gap-2 mt-8">${tags}</div>` : ""}
    </header>

    <div class="px-3 md:px-6 mt-12 md:mt-16">
      <div class="detail-hero-img max-w-[1400px] mx-auto" data-hero-media>
        <img src="${projectImageUrl(p, 1800, 1000)}" alt="${esc(p.title)}" />
      </div>
    </div>

    <section class="px-5 md:px-10 py-20 md:py-28 max-w-6xl mx-auto grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
      <aside class="space-y-8 md:sticky md:top-28 self-start" data-reveal>
        ${(p.tags || []).length ? `
        <div>
          <p class="mono text-[10px] tracking-[0.25em] uppercase text-black/45 mb-3">Technologies</p>
          <ul class="space-y-1.5">${p.tags.map((t) => `<li class="text-lg font-medium">${esc(t)}</li>`).join("")}</ul>
        </div>` : ""}
        ${links.trim() ? `<div class="flex flex-wrap gap-3">${links}</div>` : ""}
      </aside>
      <div>
        <div class="sec-head"><span class="num">↘</span><span>Le projet</span><span class="rule"></span></div>
        ${lead ? `<p class="lead-text mb-10" data-scrub-words>${esc(lead)}</p>` : ""}
        <div class="space-y-5">${rest.map((t) => `<p data-reveal class="text-black/65 text-lg leading-relaxed">${esc(t)}</p>`).join("")}</div>
      </div>
    </section>
  `;

  if (list.length > 1) {
    const next = list[(idx + 1) % list.length];
    setNext(next, { href: `/project.html?id=${encodeURIComponent(next.$id)}`, title: next.title, sub: (next.tags || []).slice(0, 4).join(" · ") });
  } else {
    setNext(null, {});
  }
  return revealDetail();
}

async function loadList() {
  try {
    const res = await databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.orderAsc("order"), Query.limit(20)]);
    return res.documents.length ? res.documents : FALLBACK_PROJECTS;
  } catch {
    const snap = await loadSnapshot();
    return snap?.projects?.length ? snap.projects : FALLBACK_PROJECTS;
  }
}

async function init() {
  bootDetailPage();
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return showNotFound();

  const list = await loadList();
  const p = list.find((x) => x.$id === id) || readStashedDetail("project", id);
  if (p) return render(p, list);

  try {
    render(await databases.getDocument(DB_ID, COLLECTIONS.PROJECTS, id), list);
  } catch {
    showNotFound();
  }
}

init();
