import { databases, DB_ID, COLLECTIONS, Query, getFileViewUrl } from "./appwrite.js";
import { initNav, setMenuEmail } from "./nav.js";
import { renderHero, createHeroIntro, initHeroMotion } from "./render/hero.js";
import { renderAbout, renderAboutImage } from "./render/about.js";
import { renderSkills, initSkillsMotion, skillNames } from "./render/skills.js";
import { renderProjects, initProjectsMotion } from "./render/projects.js";
import { renderExperience, initExperienceMotion } from "./render/experience.js";
import { renderEducation } from "./render/education.js";
import { renderArticles } from "./render/articles.js";
import { renderFooter, initFooterMotion } from "./render/footer.js";
import { renderContactRows, initContactForm } from "./contact.js";
import { esc } from "./utils.js";
import { loadSnapshot } from "./snapshot.js";
import {
  gsap, ScrollTrigger, reduceMotion, getLenis,
  initSmoothScroll, lockScroll, initCursor, initMagnetic, initSpotlight,
  initScrollProgress, initReveals, initPanels, initPageTransitions,
  playCurtainOut, initClock,
} from "./motion.js";

let backendDown = false;

async function safeList(collection, queries) {
  try {
    const res = await databases.listDocuments(DB_ID, collection, queries);
    return res.documents;
  } catch (e) {
    if (e.type === "project_paused" || !e.code) backendDown = true;
    console.warn(`Impossible de charger '${collection}' :`, e.message);
    return [];
  }
}

async function safeGetSettings() {
  try {
    return await databases.getDocument(DB_ID, COLLECTIONS.SETTINGS, "main");
  } catch (e) {
    if (e.type === "project_paused" || !e.code) backendDown = true;
    return {};
  }
}

// Données live si possible ; sinon dernière sauvegarde (public/data).
async function loadData() {
  const live = await loadLive();
  if (!backendDown) return live;
  const snap = await loadSnapshot();
  if (!snap) return live;
  console.info("Appwrite indisponible — affichage de la dernière sauvegarde.");
  return [
    snap.projects || [], snap.skills || [], snap.experience || [],
    [...(snap.articles || [])].sort((a, b) => String(b.$createdAt).localeCompare(String(a.$createdAt))),
    snap.aboutBlocks || [], snap.education || [], snap.settings || {},
  ];
}

function loadLive() {
  return Promise.all([
    safeList(COLLECTIONS.PROJECTS, [Query.orderAsc("order"), Query.limit(20)]),
    safeList(COLLECTIONS.SKILLS, [Query.orderAsc("order"), Query.limit(50)]),
    safeList(COLLECTIONS.EXPERIENCE, [Query.orderAsc("order"), Query.limit(10)]),
    safeList(COLLECTIONS.ARTICLES, [Query.orderDesc("$createdAt"), Query.limit(10)]),
    safeList(COLLECTIONS.ABOUT_BLOCKS, [Query.orderAsc("order"), Query.limit(50)]),
    safeList(COLLECTIONS.EDUCATION, [Query.orderAsc("order"), Query.limit(20)]),
    safeGetSettings(),
  ]);
}

// --------------------------------------------------------------------------
// Intro : compteur qui monte pendant le chargement des données, puis le
// panneau se retire vers le haut en découvrant le hero.
// --------------------------------------------------------------------------
function startLoader() {
  const loader = document.getElementById("loader");
  const active = document.documentElement.classList.contains("js-motion")
    && !document.documentElement.classList.contains("pt-enter");
  if (!active) {
    loader.remove();
    return { finish: async (heroTl) => heroTl?.play() };
  }

  let returning = false;
  try { returning = !!sessionStorage.getItem("visited"); sessionStorage.setItem("visited", "1"); } catch { /* ignore */ }

  document.getElementById("loader-year").textContent = new Date().getFullYear();
  const num = document.getElementById("loader-num");
  const bar = document.getElementById("loader-bar");
  const counter = { v: 0 };
  const render = () => {
    num.textContent = Math.round(counter.v);
    bar.style.transform = `scaleX(${counter.v / 100})`;
  };

  gsap.from(loader.querySelectorAll(".loader-name > span"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08 });
  const climb = gsap.to(counter, { v: 86, duration: returning ? 0.7 : 1.8, ease: "power2.inOut", onUpdate: render });

  return {
    finish: (heroTl) => new Promise((resolve) => {
      const exit = () => {
        gsap.timeline({ onComplete: () => { loader.remove(); resolve(); } })
          .to(counter, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: render })
          .to(loader.querySelectorAll(".loader-name > span, .loader-count"), { yPercent: -110, opacity: 0, duration: 0.6, ease: "expo.in", stagger: 0.04 }, "+=0.1")
          .to(loader, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2")
          .add(() => heroTl?.play(), "-=0.55");
      };
      climb.isActive() ? climb.eventCallback("onComplete", exit) : exit();
    }),
  };
}

// --------------------------------------------------------------------------
// Bandeau défilant : avance en continu, accélère et s'incline avec la
// vitesse du scroll, et change de sens quand on remonte.
// --------------------------------------------------------------------------
function initMarquee(names) {
  const track = document.getElementById("marquee-track");
  let items = names.length ? [...names] : ["Data", "Automatisation", "IA", "Reporting"];
  while (items.length < 8) items = items.concat(items);
  const group = `<div class="marquee-group">${items.map((n) => `<span class="marquee-item">${esc(n)}<span class="marquee-star">✦</span></span>`).join("")}</div>`;
  track.innerHTML = group + group;
  if (reduceMotion) return;

  let x = 0;
  let dir = -1;
  let boost = 0;
  const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      dir = self.direction === 1 ? -1 : 1;
      const v = self.getVelocity();
      boost = Math.min(Math.abs(v) / 900, 1.2);
      skew(gsap.utils.clamp(-8, 8, v / -250));
    },
  });
  gsap.ticker.add((_, dt) => {
    boost *= 0.94;
    if (boost < 0.01) skew(0);
    x += dir * (0.02 + boost * 0.25) * (dt / 16.67);
    if (x <= -50) x += 50;
    if (x > 0) x -= 50;
    gsap.set(track, { xPercent: x });
  });
}

function jumpToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id && document.getElementById(id);
  if (!el) return false;
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(el, { immediate: true, force: true });
  }
  else el.scrollIntoView();
  return true;
}

async function init() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  initSmoothScroll();
  lockScroll(true);
  initCursor();
  initPageTransitions();
  initClock();
  initNav();
  initContactForm();

  const loader = startLoader();
  const [projects, skills, experience, articles, aboutBlocks, education, settings] = await loadData();

  const profilePhotoUrl = settings.profileFileId ? getFileViewUrl(settings.profileFileId) : null;
  const aboutImageUrl = settings.aboutImageFileId ? getFileViewUrl(settings.aboutImageFileId) : profilePhotoUrl;
  const cvUrl = settings.cvFileId ? getFileViewUrl(settings.cvFileId) : null;

  setMenuEmail(settings.email || "soumaila.niampa@centrale-casablanca.ma");
  renderHero(settings, profilePhotoUrl, cvUrl);
  renderAbout(aboutBlocks);
  renderAboutImage(aboutImageUrl);
  renderEducation(education);
  renderExperience(experience);
  renderProjects(projects);
  renderSkills(skills);
  renderArticles(articles);
  renderContactRows(settings, cvUrl);
  renderFooter(settings);
  initMarquee(skillNames(skills));

  initReveals();
  initPanels();
  initScrollProgress();
  initMagnetic();
  initSpotlight();
  initHeroMotion();
  initExperienceMotion();
  initProjectsMotion();
  initSkillsMotion();
  initFooterMotion();
  const heroTl = createHeroIntro();

  ScrollTrigger.refresh();
  window.addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  if (location.hash) jumpToHash();

  if (document.documentElement.classList.contains("pt-enter")) {
    heroTl?.play();
    await playCurtainOut();
  } else {
    await loader.finish(heroTl);
  }
  lockScroll(false);
}

init();
