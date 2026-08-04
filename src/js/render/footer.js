import { esc } from "../utils.js";
import { FOOTER_LINKS } from "../sections.js";
import { navigate } from "../nav.js";

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
  nav.innerHTML = FOOTER_LINKS.map((l) => `<li><button class="link-underline text-black/60 hover:text-[var(--accent-light)] text-sm transition-colors" data-footer-nav="${l.id}">${esc(l.label)}</button></li>`).join("");
  nav.querySelectorAll("[data-footer-nav]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.footerNav));
  });
}
