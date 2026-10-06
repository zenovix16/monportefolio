// Couche "motion" du site public : défilement fluide (Lenis), animations au
// scroll (GSAP + ScrollTrigger), curseur, éléments magnétiques, intro et
// rideau de transition entre pages. Tout est désactivé proprement si
// l'utilisateur préfère réduire les animations.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let lenis = null;
export const getLenis = () => lenis;

// --------------------------------------------------------------------------
// Défilement fluide
// --------------------------------------------------------------------------
export function initSmoothScroll() {
  if (reduceMotion) return null;
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTarget(target, opts = {}) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el && target !== 0) return;
  if (lenis) {
    lenis.scrollTo(el ?? 0, { offset: opts.offset ?? 0, duration: opts.duration ?? 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    (el ?? document.documentElement).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.body.style.overflow = locked ? "hidden" : "";
}

// --------------------------------------------------------------------------
// Découpage de texte (mots / lettres) sans casser les éléments imbriqués
// --------------------------------------------------------------------------
export function splitText(el, { chars = false, wordClass = "" } = {}) {
  if (!el || el.dataset.split === "done") return el?.querySelectorAll(chars ? ".c" : ".wi") ?? [];
  el.dataset.split = "done";
  if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.trim());

  const process = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = `w ${wordClass}`.trim();
          w.setAttribute("aria-hidden", "true");
          const wi = document.createElement("span");
          wi.className = "wi";
          if (chars) {
            [...part].forEach((ch) => {
              const c = document.createElement("span");
              c.className = "c";
              c.textContent = ch;
              wi.appendChild(c);
            });
          } else {
            wi.textContent = part;
          }
          w.appendChild(wi);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        process(child);
      }
    });
  };
  process(el);
  // background-clip: text ne survit pas aux enfants transformés : on reporte
  // le dégradé sur chaque mot.
  el.querySelectorAll(".grad-text").forEach((g) => {
    g.classList.remove("grad-text");
    g.querySelectorAll(".wi").forEach((wi) => wi.classList.add("grad-text"));
  });
  return el.querySelectorAll(chars ? ".c" : ".wi");
}

// --------------------------------------------------------------------------
// Curseur personnalisé
// --------------------------------------------------------------------------
export function initCursor() {
  const root = document.getElementById("cursor");
  if (!root || !finePointer || reduceMotion) return;
  const dot = root.querySelector(".cursor-dot");
  const ring = root.querySelector(".cursor-ring");
  const label = root.querySelector(".cursor-label");

  gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2 });
  const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
  const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

  window.addEventListener("pointermove", (e) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    root.classList.remove("is-hidden");
  }, { passive: true });
  document.addEventListener("pointerleave", () => root.classList.add("is-hidden"));

  document.addEventListener("pointerover", (e) => {
    const labelled = e.target.closest("[data-cursor]");
    const interactive = e.target.closest("a, button, input, textarea, [data-magnetic]");
    root.classList.toggle("has-label", !!labelled);
    root.classList.toggle("is-hover", !labelled && !!interactive);
    if (labelled) label.textContent = labelled.dataset.cursor;
    root.classList.toggle("on-dark", !!e.target.closest(".on-dark"));
  });
}

// --------------------------------------------------------------------------
// Éléments magnétiques (boutons, logo…)
// --------------------------------------------------------------------------
export function initMagnetic(root = document) {
  if (!finePointer || reduceMotion) return;
  root.querySelectorAll("[data-magnetic]:not([data-mag-ready])").forEach((el) => {
    el.dataset.magReady = "1";
    const strength = parseFloat(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
  });
}

// --------------------------------------------------------------------------
// Cartes "spotlight" (halo qui suit la souris) + inclinaison 3D légère
// --------------------------------------------------------------------------
export function initSpotlight(root = document) {
  root.querySelectorAll(".spot:not([data-spot-ready])").forEach((el) => {
    el.dataset.spotReady = "1";
    const tilt = el.hasAttribute("data-tilt") && finePointer && !reduceMotion;
    const rX = tilt ? gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" }) : null;
    const rY = tilt ? gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" }) : null;
    if (tilt) gsap.set(el, { transformPerspective: 900 });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      if (tilt) { rY((px - 0.5) * 8); rX((0.5 - py) * 8); }
    });
    el.addEventListener("pointerleave", () => { if (tilt) { rX(0); rY(0); } });
  });
}

// --------------------------------------------------------------------------
// Barre de progression du scroll
// --------------------------------------------------------------------------
export function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
}

// --------------------------------------------------------------------------
// Animations génériques déclenchées au scroll
//   [data-reveal]            → fondu + montée
//   [data-reveal="clip"]     → révélation par clip-path (images)
//   [data-stagger]           → enfants en cascade
//   [data-split]             → titre révélé mot par mot
//   [data-scrub-words]       → texte qui s'allume mot à mot avec le scroll
//   [data-parallax="0.2"]    → parallaxe verticale
//   [data-count]             → compteur animé
//   .sec-head .rule          → trait qui se dessine
// --------------------------------------------------------------------------
export function initReveals(root = document) {
  if (reduceMotion) {
    root.querySelectorAll("[data-count]").forEach((el) => { el.textContent = el.dataset.count; });
    return;
  }

  root.querySelectorAll("[data-split]:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    const words = splitText(el);
    gsap.from(words, {
      yPercent: 110,
      rotate: 4,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  root.querySelectorAll("[data-reveal]:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    const delay = parseFloat(el.dataset.delay) || 0;
    if (el.dataset.reveal === "clip") {
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 28px)", opacity: 1 }, {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        duration: 1.4,
        ease: "expo.inOut",
        delay,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
      const img = el.querySelector("img");
      if (img) gsap.from(img, { scale: 1.35, duration: 1.8, ease: "expo.out", delay, scrollTrigger: { trigger: el, start: "top 85%" } });
      return;
    }
    gsap.fromTo(el, { opacity: 0, y: 50 }, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
      delay,
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  root.querySelectorAll("[data-stagger]:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    gsap.fromTo(el.children, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "expo.out",
      stagger: parseFloat(el.dataset.stagger) || 0.08,
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  root.querySelectorAll("[data-scrub-words]:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    const words = splitText(el);
    gsap.fromTo(words, { opacity: 0.12 }, {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  });

  root.querySelectorAll("[data-parallax]:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    const amount = parseFloat(el.dataset.parallax) || 0.15;
    gsap.fromTo(el, { yPercent: -amount * 50 }, {
      yPercent: amount * 50,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  root.querySelectorAll("[data-count]:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    const raw = el.dataset.count;
    const match = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!match) { el.textContent = raw; return; }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num.replace(",", "."));
    const decimals = (num.split(/[.,]/)[1] || "").length;
    const obj = { v: 0 };
    el.textContent = `${prefix}0${suffix}`;
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: () => { el.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`; },
    });
  });

  root.querySelectorAll(".sec-head:not([data-anim-ready])").forEach((el) => {
    el.dataset.animReady = "1";
    const rule = el.querySelector(".rule");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%" } });
    tl.from(el.children, { opacity: 0, x: -20, duration: 0.8, ease: "expo.out", stagger: 0.08 });
    if (rule) tl.from(rule, { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0.1);
  });
}

// Panneaux sombres : partent en carte arrondie et inset, s'ouvrent en
// pleine largeur au fur et à mesure qu'ils entrent dans l'écran.
export function initPanels(root = document) {
  if (reduceMotion) return;
  root.querySelectorAll(".panel").forEach((panel) => {
    gsap.fromTo(panel,
      { clipPath: "inset(0% 4% 0% 4% round 48px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: panel, start: "top bottom", end: "top 20%", scrub: true },
      });
  });
}

// --------------------------------------------------------------------------
// Rideau de transition entre pages
// --------------------------------------------------------------------------
const PT_KEY = "pt:label";

export function initPageTransitions() {
  const curtain = document.getElementById("curtain");
  if (!curtain) return;

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-transition]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    e.preventDefault();
    leaveTo(url.href, a.dataset.transition || "");
  });

  // Retour arrière depuis le cache (bfcache) : le rideau doit disparaître.
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      gsap.set(curtain.querySelectorAll(".curtain-layer"), { yPercent: 100 });
      curtain.style.visibility = "hidden";
      lockScroll(false);
    }
  });
}

export function leaveTo(href, label = "") {
  const curtain = document.getElementById("curtain");
  if (!curtain || reduceMotion) { location.href = href; return; }
  try { sessionStorage.setItem(PT_KEY, label || " "); } catch { /* ignore */ }
  const labelEl = document.getElementById("curtain-label");
  labelEl.innerHTML = label ? `<span>${label.replace(/</g, "&lt;")}</span>` : "";
  curtain.style.visibility = "visible";
  lockScroll(true);
  const [accent, ink] = curtain.querySelectorAll(".curtain-layer");
  gsap.timeline({ onComplete: () => { location.href = href; } })
    .fromTo(accent, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
    .fromTo(ink, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" }, 0.1)
    .from(labelEl.children, { yPercent: 120, duration: 0.6, ease: "expo.out" }, 0.45);
}

// Doit être appelé le plus tôt possible (script inline dans <head>) pour que
// le rideau couvre dès le premier paint : on ne fait ici que la sortie.
export function hasPendingTransition() {
  try { return !!sessionStorage.getItem(PT_KEY); } catch { return false; }
}

export function playCurtainOut() {
  const curtain = document.getElementById("curtain");
  let label = "";
  try { label = sessionStorage.getItem(PT_KEY) || ""; sessionStorage.removeItem(PT_KEY); } catch { /* ignore */ }
  if (!curtain || !document.documentElement.classList.contains("pt-enter")) return Promise.resolve(false);
  const labelEl = document.getElementById("curtain-label");
  if (label.trim()) labelEl.innerHTML = `<span>${label.replace(/</g, "&lt;")}</span>`;
  const [accent, ink] = curtain.querySelectorAll(".curtain-layer");
  gsap.set(accent, { yPercent: 100 });
  gsap.set(ink, { yPercent: 0 });
  return new Promise((resolve) => {
    gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("pt-enter");
        curtain.style.visibility = "hidden";
        gsap.set([accent, ink], { yPercent: 100 });
        resolve(true);
      },
    })
      .to(labelEl.children, { yPercent: -120, duration: 0.5, ease: "expo.in" }, 0)
      .to(ink, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 0.2);
    // Résolu un peu avant la fin pour enchaîner les entrées de la page.
    setTimeout(() => resolve(true), 700);
  });
}

// --------------------------------------------------------------------------
// Horloge locale (Casablanca)
// --------------------------------------------------------------------------
export function initClock(selector = "[data-clock]") {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Casablanca" });
  const tick = () => els.forEach((el) => { el.textContent = fmt.format(new Date()); });
  tick();
  setInterval(tick, 15000);
}
