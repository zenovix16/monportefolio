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

  document.getElementById("hero-name-top").textContent = fullName;
  document.getElementById("hero-location").textContent = settings.heroLocation || DEFAULTS.location;
  document.getElementById("hero-tagline").textContent = settings.heroTagline || DEFAULTS.tagline;
  document.getElementById("hero-description").textContent = settings.heroDescription || DEFAULTS.description;
  document.getElementById("hero-name-1").textContent = firstLine;
  document.getElementById("hero-name-2").textContent = `${secondLine}.`;

  const linkedin = settings.linkedinUrl || DEFAULTS.linkedinUrl;
  document.getElementById("hero-linkedin").href = linkedin;

  if (cvUrl) {
    const btn = document.getElementById("hero-cv-btn");
    btn.href = cvUrl;
    btn.classList.remove("hidden");
  }

  if (profilePhotoUrl) {
    const img = document.getElementById("hero-portrait");
    img.src = profilePhotoUrl;
    document.getElementById("hero-portrait-wrap").classList.remove("hidden");
  }

  // Reveals joués au chargement (Hero est toujours visible en premier, pas
  // besoin d'IntersectionObserver ici).
  requestAnimationFrame(() => {
    document.getElementById("hero-halo").classList.remove("opacity-0");
    document.getElementById("hero-halo").style.opacity = "0.28";
    document.querySelectorAll("#hero .reveal-line").forEach((el, i) => {
      el.querySelector(":scope > *").style.animationDelay = `${0.15 + i * 0.11}s`;
      el.classList.add("in-view");
    });
    document.querySelectorAll('#hero [data-animate]').forEach((el) => el.classList.add("in-view"));
  });
}
