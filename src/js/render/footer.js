import { esc } from "../utils.js";
import { FOOTER_LINKS } from "../sections.js";
import { navigate } from "../nav.js";
import { gsap, reduceMotion } from "../motion.js";

const DEFAULTS = {
  name: "Soumaïla Niampa",
  tagline: "Consultant Data & Transformation Digitale",
  email: "soumaila.niampa@centrale-casablanca.ma",
  phone: "+212 708-778-658",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

export function renderFooter(settings) {
  const name = settings.heroName || DEFAULTS.name;
  const email = settings.email || DEFAULTS.email;
  const phone = settings.phone || DEFAULTS.phone;
  const linkedin = settings.linkedinUrl || DEFAULTS.linkedinUrl;

  document.getElementById("footer-name").textContent = name;
  document.getElementById("footer-tagline").textContent = settings.heroTagline || DEFAULTS.tagline;

  const emailLink = document.getElementById("footer-email");
  emailLink.href = `mailto:${email}`;
  emailLink.textContent = email;

  const phoneLink = document.getElementById("footer-phone");
  phoneLink.href = `tel:${phone.replace(/[\s-]/g, "")}`;
  phoneLink.textContent = phone;

  document.getElementById("footer-linkedin").href = linkedin;
  document.getElementById("footer-copyright").textContent = `© ${new Date().getFullYear()} ${name}`;

  const nav = document.getElementById("footer-nav");
  nav.innerHTML = FOOTER_LINKS.map((l) => `<li><button class="link-underline text-white/70 hover:text-white text-sm" data-footer-nav="${l.id}">${esc(l.label)}</button></li>`).join("");
  nav.querySelectorAll("[data-footer-nav]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.footerNav));
  });
}

export function initFooterMotion() {
  const ring = document.getElementById("to-top-progress");
  if (ring) {
    gsap.to(ring, { strokeDashoffset: 0, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }
  if (reduceMotion) return;
  gsap.from("#footer-giant", {
    yPercent: 60,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: "#site-footer", start: "top bottom", end: "bottom bottom", scrub: true },
  });
}
