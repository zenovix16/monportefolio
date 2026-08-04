import { SECTION_LINKS } from "./sections.js";

let activeId = "hero";
let drawerOpen = false;

export function navigate(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  closeDrawer();
}

export function setMenuEmail(email) {
  const el = document.getElementById("menu-email");
  el.href = `mailto:${email}`;
  el.textContent = email;
}

function closeDrawer() {
  drawerOpen = false;
  document.getElementById("menu-backdrop").classList.add("hidden", "opacity-0");
  const drawer = document.getElementById("menu-drawer");
  drawer.classList.add("translate-x-full");
  document.body.style.overflow = "";
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
  const bars = document.querySelectorAll(".menu-bar");
  bars[0].style.transform = "";
  bars[1].style.opacity = "1";
  bars[2].style.transform = "";
}

function openDrawer() {
  drawerOpen = true;
  const backdrop = document.getElementById("menu-backdrop");
  backdrop.classList.remove("hidden");
  requestAnimationFrame(() => backdrop.classList.remove("opacity-0"));
  document.getElementById("menu-drawer").classList.remove("translate-x-full");
  document.body.style.overflow = "hidden";
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "true");
  const bars = document.querySelectorAll(".menu-bar");
  bars[0].style.transform = "rotate(45deg) translateY(3px)";
  bars[1].style.opacity = "0";
  bars[2].style.transform = "rotate(-45deg) translateY(-3px)";
}

function setActive(id) {
  activeId = id;
  document.querySelectorAll("#nav-links-desktop [data-nav-link]").forEach((el) => {
    const isActive = el.dataset.navLink === id;
    el.classList.toggle("bg-[var(--accent-soft)]", isActive);
    el.classList.toggle("text-[var(--accent-light)]", isActive);
    el.classList.toggle("text-black/45", !isActive);
  });
  document.querySelectorAll("#nav-links-mobile [data-nav-link]").forEach((el) => {
    const isActive = el.dataset.navLink === id;
    const label = el.querySelector(".mobile-nav-label");
    const num = el.querySelector(".mobile-nav-num");
    label.classList.toggle("text-[var(--accent-light)]", isActive);
    label.classList.toggle("text-black/75", !isActive);
    num.classList.toggle("text-[var(--accent-light)]", isActive);
    num.classList.toggle("text-black/30", !isActive);
  });
}

function buildLinks() {
  const desktop = document.getElementById("nav-links-desktop");
  const mobile = document.getElementById("nav-links-mobile");

  SECTION_LINKS.forEach((l) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.dataset.navLink = l.id;
    btn.className = "px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 text-black/45 hover:text-black/75";
    btn.textContent = l.label;
    btn.addEventListener("click", () => navigate(l.id));
    li.appendChild(btn);
    desktop.appendChild(li);
  });

  SECTION_LINKS.forEach((l, i) => {
    const btn = document.createElement("button");
    btn.dataset.navLink = l.id;
    btn.className = "flex items-baseline gap-3 py-2.5 text-left group";
    btn.innerHTML = `
      <span class="mobile-nav-num mono text-[11px] tabular-nums text-black/30">${String(i + 1).padStart(2, "0")}</span>
      <span class="mobile-nav-label text-2xl font-bold tracking-tight transition-colors text-black/75 group-hover:text-black">${l.label}</span>
    `;
    btn.addEventListener("click", () => navigate(l.id));
    mobile.appendChild(btn);
  });
}

function initScrollSpy() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  SECTION_LINKS.forEach((l) => {
    const el = document.getElementById(l.id);
    if (el) observer.observe(el);
  });
}

export function initNav() {
  buildLinks();
  setActive("hero");
  initScrollSpy();

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });

  document.getElementById("menu-toggle").addEventListener("click", () => {
    drawerOpen ? closeDrawer() : openDrawer();
  });
  document.getElementById("menu-backdrop").addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen) closeDrawer();
  });
}
