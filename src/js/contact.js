import { esc } from "./utils.js";
import { observeReveal } from "./reveal.js";
import { databases, DB_ID, COLLECTIONS, ID } from "./appwrite.js";

const DEFAULTS = {
  email: "soumaila.niampa@centrale-casablanca.ma",
  phone: "+212 708-778-658",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

export function renderContactRows(settings, cvUrl) {
  const mail = settings.email || DEFAULTS.email;
  const tel = settings.phone || DEFAULTS.phone;
  const linkedin = settings.linkedinUrl || DEFAULTS.linkedinUrl;

  const rows = [
    { label: "Email", value: mail, href: `mailto:${mail}` },
    { label: "Téléphone", value: tel, href: `tel:${tel.replace(/[\s-]/g, "")}` },
    { label: "LinkedIn", value: linkedin.replace(/^https?:\/\//, ""), href: linkedin, external: true },
    ...(cvUrl ? [{ label: "CV", value: "Télécharger le CV complet", href: cvUrl, download: true }] : []),
  ];

  const container = document.getElementById("contact-rows");
  container.innerHTML = rows.map((r, i) => `
    <a data-animate="fade" style="--delay:${i * 0.08}s" href="${esc(r.href)}"
      ${r.download ? "download" : ""} ${r.external ? 'target="_blank" rel="noopener noreferrer"' : ""}
      class="group flex items-center justify-between py-4">
      <div>
        <p class="text-[10px] tracking-widest uppercase text-black/40 mb-0.5">${esc(r.label)}</p>
        <p class="text-black/65 text-sm group-hover:text-[var(--accent-light)] transition-colors break-all">${esc(r.value)}</p>
      </div>
      <span class="text-black/30 group-hover:text-[var(--accent-light)] group-hover:translate-x-0.5 transition-all ml-3 shrink-0">${r.download ? "↓" : "↗"}</span>
    </a>
  `).join("");

  observeReveal(container);
}

export function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit");
  const errorEl = document.getElementById("contact-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi...";

    const data = new FormData(form);
    try {
      await databases.createDocument(DB_ID, COLLECTIONS.MESSAGES, ID.unique(), {
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
      });
      submitBtn.textContent = "Message envoyé ✓";
      form.reset();
    } catch {
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Envoyer";
    }
  });
}
