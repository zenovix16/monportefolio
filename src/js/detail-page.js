// Socle commun des pages de détail (projet / expérience) : mêmes
// défilement, curseur, rideau et entrée animée que la page d'accueil.
import {
  gsap, ScrollTrigger, reduceMotion, initSmoothScroll, lockScroll, initCursor,
  initMagnetic, initSpotlight, initScrollProgress, initReveals, initPanels,
  initPageTransitions, playCurtainOut, splitText,
} from "./motion.js";

export function bootDetailPage() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  initSmoothScroll();
  lockScroll(true);
  initCursor();
  initPageTransitions();
  initMagnetic();
  document.getElementById("footer-year").textContent = new Date().getFullYear();
}

// Remplit le bloc "suivant" en bas de page (boucle sur la liste).
export function setNext(next, { href, title, sub, label }) {
  const section = document.getElementById("next");
  section.classList.remove("hidden");
  const link = document.getElementById("next-link");
  if (!next) { link.classList.add("hidden"); return; }
  link.href = href;
  link.dataset.transition = label || title;
  document.getElementById("next-title").textContent = title;
  document.getElementById("next-sub").textContent = sub || "";
}

export async function revealDetail() {
  const content = document.getElementById("state-content");
  document.getElementById("state-loading").classList.add("hidden");
  content.classList.remove("hidden");

  initReveals(content);
  initSpotlight(content);
  initMagnetic(content);
  initPanels();
  initScrollProgress();

  let tl = null;
  if (!reduceMotion) {
    const title = content.querySelector("[data-hero-title]");
    const chars = title ? splitText(title, { chars: false }) : [];
    tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
      .from(chars, { yPercent: 115, rotate: 5, duration: 1.3, stagger: 0.06 })
      .from(content.querySelectorAll("[data-hero-fade]"), { opacity: 0, y: 30, duration: 1, stagger: 0.08 }, 0.25)
      .fromTo(content.querySelectorAll("[data-hero-media]"),
        { clipPath: "inset(18% 10% 18% 10% round 48px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.6, ease: "expo.inOut" }, 0.2)
      .from(content.querySelectorAll("[data-hero-media] img"), { scale: 1.4, duration: 2, ease: "expo.out" }, 0.2);
    const media = content.querySelector("[data-hero-media] img");
    if (media) {
      gsap.to(media, { yPercent: 10, ease: "none", scrollTrigger: { trigger: media.parentElement, start: "top top", end: "bottom top", scrub: true } });
    }
  }

  ScrollTrigger.refresh();
  window.addEventListener("load", () => ScrollTrigger.refresh());

  if (document.documentElement.classList.contains("pt-enter")) {
    tl?.play();
    await playCurtainOut();
  } else {
    tl?.play();
  }
  lockScroll(false);
}

export async function showNotFound() {
  document.getElementById("state-loading").classList.add("hidden");
  document.getElementById("state-notfound").classList.remove("hidden");
  document.getElementById("next").classList.remove("hidden");
  document.getElementById("next-link").classList.add("hidden");
  await playCurtainOut();
  lockScroll(false);
}
