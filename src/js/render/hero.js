import { gsap, splitText, reduceMotion } from "../motion.js";

const DEFAULTS = {
  name: "Soumaïla Niampa",
  location: "Casablanca · Maroc",
  tagline: "Consultant Data & Transformation Digitale",
  description: "Ingénieur École Centrale Casablanca · Data Analyst chez Attijariwafa Bank.",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

export function renderHero(settings, profilePhotoUrl, cvUrl) {
  const fullName = settings.heroName || DEFAULTS.name;
  const parts = fullName.trim().split(/\s+/);
  const firstLine = (parts[0] || "").toUpperCase();
  const secondLine = (parts.slice(1).join(" ") || parts[0] || "").toUpperCase();

  document.getElementById("hero-h1").textContent = fullName;
  document.getElementById("hero-name-top").textContent = fullName;
  document.getElementById("hero-location").textContent = settings.heroLocation || DEFAULTS.location;
  document.getElementById("hero-tagline").textContent = settings.heroTagline || DEFAULTS.tagline;
  document.getElementById("hero-description").textContent = settings.heroDescription || DEFAULTS.description;
  document.getElementById("hero-name-1").textContent = firstLine;
  document.getElementById("hero-name-2").textContent = `${secondLine}.`;
  document.getElementById("hero-year").textContent = new Date().getFullYear();
  document.getElementById("footer-giant").textContent = (parts[parts.length - 1] || "").toUpperCase();

  document.getElementById("hero-linkedin").href = settings.linkedinUrl || DEFAULTS.linkedinUrl;

  if (cvUrl) {
    const btn = document.getElementById("hero-cv-btn");
    btn.href = cvUrl;
    btn.classList.remove("hidden");
  }

  if (profilePhotoUrl) {
    document.getElementById("hero-portrait").src = profilePhotoUrl;
    document.getElementById("hero-portrait-wrap").classList.remove("hidden");
  }

  splitText(document.getElementById("hero-name-1"), { chars: true });
  splitText(document.getElementById("hero-name-2"), { chars: true });
}

// Entrée du hero, créée en pause (les états de départ s'appliquent tout de
// suite, sous l'intro) puis jouée quand l'intro ou le rideau se retire.
export function createHeroIntro() {
  if (reduceMotion) return null;
  const chars1 = document.querySelectorAll("#hero-name-1 .c");
  const chars2 = document.querySelectorAll("#hero-name-2 .c");
  return gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
    .from(chars1, { yPercent: 115, rotate: 8, duration: 1.4, stagger: 0.045 })
    .from(chars2, { yPercent: 115, rotate: -8, duration: 1.4, stagger: 0.045 }, 0.12)
    .from("#hero-portrait", { opacity: 0, scale: 1.12, yPercent: 6, duration: 2, ease: "power3.out" }, 0)
    .from(".aurora", { opacity: 0, scale: 0.7, duration: 2.4, ease: "power2.out" }, 0)
    .from("#hero-rule", { scaleX: 0, duration: 1.4, ease: "expo.inOut" }, 0.3)
    .from(".hero-intro > *:not(#hero-rule)", { opacity: 0, y: 30, duration: 1.1, stagger: 0.08 }, 0.45);
}

// Interactions continues du hero : parallaxe souris, sortie au scroll et
// mots qui défilent dans la phrase d'accroche.
export function initHeroMotion() {
  if (reduceMotion) return;

  const portrait = document.getElementById("hero-portrait");
  const aurora = document.querySelector(".aurora");
  const hero = document.getElementById("hero");
  if (window.matchMedia("(pointer: fine)").matches) {
    const px = gsap.quickTo(portrait, "x", { duration: 1.2, ease: "power3" });
    const ax = gsap.quickTo(aurora, "x", { duration: 2, ease: "power3" });
    const ay = gsap.quickTo(aurora, "y", { duration: 2, ease: "power3" });
    hero.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      px(nx * -24);
      ax(nx * 90);
      ay(ny * 90);
    });
  }

  // Sortie : le nom s'écarte, le portrait recule, tout s'estompe.
  const out = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to("#hero-name-1", { xPercent: -18, ease: "none", scrollTrigger: out });
  gsap.to("#hero-name-2", { xPercent: 14, ease: "none", scrollTrigger: out });
  gsap.to("#hero-title", { yPercent: 40, opacity: 0.2, ease: "none", scrollTrigger: out });
  gsap.to("#hero-portrait-wrap", { yPercent: 18, scale: 0.92, opacity: 0.3, ease: "none", scrollTrigger: out });

  // Rotateur de mots
  const words = document.querySelectorAll("#rotator > span");
  gsap.set(words, { yPercent: 110 });
  gsap.set(words[0], { yPercent: 0 });
  let i = 0;
  setInterval(() => {
    const cur = words[i];
    i = (i + 1) % words.length;
    const next = words[i];
    gsap.to(cur, { yPercent: -110, duration: 0.8, ease: "expo.inOut" });
    gsap.fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut" });
  }, 2400);
}
