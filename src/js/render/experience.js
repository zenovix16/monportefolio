import { esc } from "../utils.js";
import { stashDetail } from "../detail-store.js";
import { badgeHTML } from "../cover.js";
import { gsap, ScrollTrigger, reduceMotion } from "../motion.js";

const FALLBACK = [
  {
    $id: "1",
    company: "Attijariwafa Bank",
    role: "Data Analyst",
    location: "Casablanca, Maroc",
    startDate: "2025",
    current: true,
    description: "Tableaux de bord pour suivre les KPI et améliorer la prise de décision. Analyse et optimisation des processus métiers. Traduction des besoins business en solutions data.",
  },
  {
    $id: "2",
    company: "Société Générale Maroc",
    role: "Data Engineer",
    location: "Casablanca, Maroc",
    startDate: "Janv. 2025",
    endDate: "Mars 2025",
    description: "Automatisation de la collecte et du traitement des données. Organisation et structuration pour les rendre exploitables. Amélioration des flux pour réduire les erreurs.",
  },
  {
    $id: "3",
    company: "BBC & Partners",
    role: "Ingénieur IA",
    location: "Casablanca, Maroc",
    startDate: "Mai 2024",
    endDate: "Août 2024",
    description: "Développement d'un assistant virtuel pour automatiser les demandes. Amélioration de l'expérience via l'interaction homme-assistant. Intégration d'échanges vocal et texte.",
  },
];

function dateRange(e) {
  return `${e.startDate}${e.endDate ? ` — ${e.endDate}` : e.current ? " — Présent" : ""}`;
}

export function renderExperience(experience) {
  const data = experience.length > 0 ? experience : FALLBACK;
  const list = document.getElementById("experience-list");

  list.innerHTML = data.map((e) => `
    <div class="t-item">
      <div class="t-meta hidden md:block pt-2">
        <p class="t-date">${esc(dateRange(e))}</p>
        <p class="text-white/45 text-sm mt-1">${esc(e.location || "")}</p>
      </div>
      <div class="t-node">${badgeHTML(e.$id + e.company, e.company, 36)}</div>
      <div class="t-card spot">
        <div class="flex items-center gap-2.5 flex-wrap mb-1">
          ${e.current ? `<span class="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-white bg-[var(--accent)] rounded-full px-2.5 py-1"><span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>Actuel</span>` : ""}
          <p class="mono text-white/45 text-xs md:hidden">${esc(dateRange(e))}</p>
        </div>
        <h3 class="text-2xl md:text-3xl font-bold tracking-tight">${esc(e.role)}</h3>
        <p class="text-[var(--accent-bright)] font-medium mb-4">${esc(e.company)}</p>
        <p class="text-white/65 leading-relaxed mb-5">${esc(e.description)}</p>
        <a href="/experience.html?id=${encodeURIComponent(e.$id)}" data-detail-exp="${e.$id}" data-transition="${esc(e.role)} · ${esc(e.company)}" class="inline-flex items-center gap-2 text-sm font-semibold text-white group">
          Voir le détail <span class="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </a>
      </div>
    </div>
  `).join("");

  list.querySelectorAll("[data-detail-exp]").forEach((link) => {
    link.addEventListener("click", () => {
      const e = data.find((x) => x.$id === link.dataset.detailExp);
      if (e) stashDetail("experience", { ...e, dateRange: dateRange(e) });
    });
  });
}

export function initExperienceMotion() {
  const items = document.querySelectorAll("#experience-list .t-item");
  if (reduceMotion) { items.forEach((it) => it.classList.add("is-active")); return; }

  gsap.to("#timeline-fill", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: { trigger: "#timeline", start: "top 60%", end: "bottom 60%", scrub: true },
  });

  items.forEach((item, i) => {
    const card = item.querySelector(".t-card");
    const meta = item.querySelector(".t-meta");
    const fromLeft = window.innerWidth >= 768 && i % 2 === 1;
    ScrollTrigger.create({
      trigger: item,
      start: "top 60%",
      onEnter: () => item.classList.add("is-active"),
      onLeaveBack: () => item.classList.remove("is-active"),
    });
    gsap.from(card, { opacity: 0, x: fromLeft ? -80 : 80, rotate: fromLeft ? -2 : 2, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 80%" } });
    if (meta) gsap.from(meta, { opacity: 0, y: 30, duration: 1, ease: "expo.out", delay: 0.1, scrollTrigger: { trigger: item, start: "top 80%" } });
    gsap.from(item.querySelector(".t-node"), { scale: 0, duration: 0.9, ease: "back.out(2)", scrollTrigger: { trigger: item, start: "top 75%" } });
  });
}
