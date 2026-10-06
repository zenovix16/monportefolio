import { esc } from "./utils.js";
import { databases, DB_ID, COLLECTIONS, ID } from "./appwrite.js";

const DEFAULTS = {
  email: "soumaila.niampa@centrale-casablanca.ma",
  phone: "+212 708-778-658",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch { return s; }
}

let contactEmail = DEFAULTS.email;

export function renderContactRows(settings, cvUrl) {
  const mail = settings.email || DEFAULTS.email;
  contactEmail = mail;
  const tel = settings.phone || DEFAULTS.phone;
  const linkedin = settings.linkedinUrl || DEFAULTS.linkedinUrl;

  const big = document.getElementById("contact-big-mail");
  big.href = `mailto:${mail}`;
  big.textContent = mail;

  const rows = [
    { label: "Téléphone", value: tel, href: `tel:${tel.replace(/[\s-]/g, "")}` },
    { label: "LinkedIn", value: safeDecode(linkedin.replace(/^https?:\/\/(www\.)?/, "")), href: linkedin, external: true },
    ...(cvUrl ? [{ label: "CV", value: "Télécharger le CV complet", href: cvUrl, download: true }] : []),
  ];

  const container = document.getElementById("contact-rows");
  container.setAttribute("data-stagger", "0.08");
  container.innerHTML = rows.map((r) => `
    <a href="${esc(r.href)}" ${r.download ? "download" : ""} ${r.external ? 'target="_blank" rel="noopener noreferrer"' : ""}
      class="c-row group flex items-center justify-between py-5">
      <div class="min-w-0">
        <p class="mono text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1">${esc(r.label)}</p>
        <p class="text-white/85 text-lg font-medium group-hover:text-[var(--accent-bright)] transition-colors duration-300 break-all">${esc(r.value)}</p>
      </div>
      <span class="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 shrink-0 ml-4 transition-all duration-500 group-hover:bg-white group-hover:text-[#0A0C10] group-hover:-rotate-45">${r.download ? "↓" : "→"}</span>
    </a>
  `).join("");
}

export function initContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit");
  const label = document.getElementById("contact-submit-label");
  const errorEl = document.getElementById("contact-error");
  const successEl = document.getElementById("contact-success");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");
    successEl.classList.add("hidden");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    submitBtn.disabled = true;
    label.textContent = "Envoi…";

    const data = new FormData(form);
    try {
      await databases.createDocument(DB_ID, COLLECTIONS.MESSAGES, ID.unique(), {
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
      });
      label.textContent = "Message envoyé ✓";
      successEl.classList.remove("hidden");
      form.reset();
    } catch {
      // Base indisponible : on propose l'e-mail direct, message pré-rempli.
      const subject = encodeURIComponent(`Contact portfolio — ${data.get("name")}`);
      const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
      errorEl.innerHTML = `L'envoi a échoué. <a class="underline" href="mailto:${esc(contactEmail)}?subject=${subject}&body=${body}">Envoyer par e-mail ↗</a>`;
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      label.textContent = "Envoyer le message";
    }
  });
}
