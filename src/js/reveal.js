// Petit remplaçant de Framer Motion's whileInView : anime une fois au scroll,
// réutilisable pour du contenu ajouté dynamiquement (cartes rendues après
// un fetch Appwrite) en le rappelant après chaque injection de HTML.

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
);

const ruleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = "scaleX(1)";
        ruleObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

export function observeReveal(root = document) {
  root.querySelectorAll("[data-animate]:not(.observed), .reveal-line:not(.observed)").forEach((el) => {
    el.classList.add("observed");
    fadeObserver.observe(el);
  });
  root.querySelectorAll(".section-rule-fill:not(.observed)").forEach((el) => {
    el.classList.add("observed");
    ruleObserver.observe(el);
  });
}
