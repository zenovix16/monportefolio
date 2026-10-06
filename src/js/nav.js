import { SECTION_LINKS } from "./sections.js";
import { gsap, ScrollTrigger, scrollToTarget, lockScroll, reduceMotion } from "./motion.js";

let drawerOpen = false;
let menuTl = null;

export function navigate(id) {
  if (drawerOpen) closeDrawer();
  scrollToTarget(id === "hero" ? 0 : id);
}

export function setMenuEmail(email) {
  const el = document.getElementById("menu-email");
  el.href = `mailto:${email}`;
  el.textContent = email;
}

function buildMenuTimeline() {
  menuTl?.kill();
  const overlay = document.getElementById("menu-overlay");
  const links = overlay.querySelectorAll(".m-link-inner");
  const r = document.getElementById("menu-toggle").getBoundingClientRect();
  const at = `${Math.round(r.left + r.width / 2)}px ${Math.round(r.top + r.height / 2)}px`;
  const d = reduceMotion ? 0 : 1;
  menuTl = gsap.timeline({ paused: true })
    .set(overlay, { visibility: "visible" })
    .fromTo(overlay, { clipPath: `circle(0px at ${at})` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight) * 1.1}px at ${at})`, duration: 0.9 * d, ease: "expo.inOut" })
    .fromTo(links, { yPercent: 120 }, { yPercent: 0, duration: 0.8 * d, ease: "expo.out", stagger: 0.05 * d }, "-=0.45")
    .fromTo(overlay.lastElementChild, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 * d }, "-=0.5");
  menuTl.eventCallback("onReverseComplete", () => gsap.set(overlay, { visibility: "hidden" }));
}

function openDrawer() {
  drawerOpen = true;
  const btn = document.getElementById("menu-toggle");
  btn.setAttribute("aria-expanded", "true");
  btn.setAttribute("aria-label", "Fermer le menu");
  document.getElementById("menu-overlay").setAttribute("aria-hidden", "false");
  lockScroll(true);
  buildMenuTimeline();
  menuTl.play();
}

function closeDrawer() {
  drawerOpen = false;
  const btn = document.getElementById("menu-toggle");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", "Ouvrir le menu");
  document.getElementById("menu-overlay").setAttribute("aria-hidden", "true");
  lockScroll(false);
  menuTl.timeScale(1.6).reverse();
}

function moveIndicator(btn) {
  const ind = document.getElementById("nav-indicator");
  if (!btn) { ind.style.opacity = "0"; return; }
  ind.style.opacity = "1";
  ind.style.width = `${btn.offsetWidth}px`;
  ind.style.transform = `translateX(${btn.offsetLeft}px)`;
}

function setActive(id) {
  let activeBtn = null;
  document.querySelectorAll("#nav-links-desktop [data-nav-link]").forEach((el) => {
    const isActive = el.dataset.navLink === id;
    el.classList.toggle("is-active", isActive);
    if (isActive) activeBtn = el;
  });
  moveIndicator(activeBtn);
  document.querySelectorAll("#nav-links-mobile [data-nav-link]").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.navLink === id);
  });
}

function buildLinks() {
  const desktop = document.getElementById("nav-links-desktop");
  const mobile = document.getElementById("nav-links-mobile");

  SECTION_LINKS.forEach((l) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.dataset.navLink = l.id;
    btn.className = "nav-link";
    btn.textContent = l.label;
    btn.addEventListener("click", () => navigate(l.id));
    li.appendChild(btn);
    desktop.appendChild(li);
  });

  SECTION_LINKS.forEach((l, i) => {
    const btn = document.createElement("button");
    btn.dataset.navLink = l.id;
    btn.className = "m-link text-left";
    btn.innerHTML = `<span class="m-link-inner"><span class="m-num">${String(i + 1).padStart(2, "0")}</span><span class="m-label">${l.label}</span></span>`;
    btn.addEventListener("click", () => navigate(l.id));
    mobile.appendChild(btn);
  });
}

function initScrollSpy() {
  SECTION_LINKS.forEach((l) => {
    const el = document.getElementById(l.id);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => { if (self.isActive) setActive(l.id); },
    });
  });
}

// La nav passe en thème sombre quand elle survole un panneau noir.
function initNavTheme() {
  const navbar = document.getElementById("navbar");
  document.querySelectorAll(".panel").forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top 40px",
      end: "bottom 40px",
      onToggle: (self) => navbar.classList.toggle("nav-dark", self.isActive),
    });
  });
}

export function initNav() {
  buildLinks();
  setActive("hero");
  initScrollSpy();
  initNavTheme();
  window.addEventListener("resize", () => moveIndicator(document.querySelector("#nav-links-desktop .is-active")));
  document.fonts?.ready.then(() => moveIndicator(document.querySelector("#nav-links-desktop .is-active")));

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  document.getElementById("menu-toggle").addEventListener("click", () => {
    drawerOpen ? closeDrawer() : openDrawer();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen) closeDrawer();
  });
}
