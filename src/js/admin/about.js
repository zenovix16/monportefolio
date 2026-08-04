import { initAdminPage, esc } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, ID, Query } from "../appwrite.js";

const TYPE_LABELS = { stat: "Statistique", text: "Texte", tags: "Liste de tags", quote: "Citation" };
let editingId = null;

const form = document.getElementById("block-form");
const list = document.getElementById("items-list");
const toggleBtn = document.getElementById("toggle-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("form-submit");
const typeSelect = document.getElementById("type-select");

function updateFieldVisibility() {
  const type = typeSelect.value;
  form.querySelectorAll("[data-fields]").forEach((el) => {
    el.classList.toggle("hidden", el.dataset.fields !== type);
  });
}
typeSelect.addEventListener("change", updateFieldVisibility);

function resetForm() {
  form.reset();
  editingId = null;
  updateFieldVisibility();
  formTitle.textContent = "Nouveau bloc";
  submitBtn.textContent = "Ajouter le bloc";
}

toggleBtn.addEventListener("click", () => {
  const willShow = form.classList.contains("hidden");
  resetForm();
  form.classList.toggle("hidden", !willShow);
  toggleBtn.textContent = willShow ? "Annuler" : "+ Ajouter un bloc";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const type = data.get("type");
  const body = { type, order: Number(data.get("order")) || 0 };

  if (type === "stat") {
    body.value = data.get("value") || undefined;
    body.title = data.get("statTitle") || undefined;
  } else if (type === "text") {
    body.title = data.get("textTitle") || undefined;
    body.body = data.get("body") || undefined;
  } else if (type === "tags") {
    body.items = (data.get("items") || "").split(",").map((s) => s.trim()).filter(Boolean);
  } else if (type === "quote") {
    body.body = data.get("quoteBody") || undefined;
  }

  try {
    if (editingId) await databases.updateDocument(DB_ID, COLLECTIONS.ABOUT_BLOCKS, editingId, body);
    else await databases.createDocument(DB_ID, COLLECTIONS.ABOUT_BLOCKS, ID.unique(), body);
    resetForm();
    form.classList.add("hidden");
    toggleBtn.textContent = "+ Ajouter un bloc";
    load();
  } catch (e) {
    alert("Échec : " + e.message);
  }
});

function edit(b) {
  editingId = b.$id;
  typeSelect.value = b.type;
  updateFieldVisibility();
  if (b.type === "stat") {
    form.value.value = b.value || "";
    form.statTitle.value = b.title || "";
  } else if (b.type === "text") {
    form.textTitle.value = b.title || "";
    form.body.value = b.body || "";
  } else if (b.type === "tags") {
    form.items.value = (b.items || []).join(", ");
  } else if (b.type === "quote") {
    form.quoteBody.value = b.body || "";
  }
  form.order.value = b.order || 0;
  formTitle.textContent = "Modifier le bloc";
  submitBtn.textContent = "Enregistrer";
  form.classList.remove("hidden");
  toggleBtn.textContent = "Annuler";
  form.scrollIntoView({ behavior: "smooth" });
}

async function del(id) {
  if (!confirm("Supprimer ce bloc ?")) return;
  await databases.deleteDocument(DB_ID, COLLECTIONS.ABOUT_BLOCKS, id);
  load();
}

function summarize(b) {
  if (b.type === "stat") return `${b.value ?? ""} — ${b.title ?? ""}`;
  if (b.type === "tags") return (b.items ?? []).join(", ");
  return b.title ? `${b.title} — ${b.body ?? ""}` : (b.body ?? "");
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.ABOUT_BLOCKS, [Query.orderAsc("order")]);
  list.innerHTML = res.documents.map((b) => `
    <div class="glass rounded-lg p-5 flex items-center justify-between gap-4">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-[10px] border border-[var(--accent)]/40 text-[var(--accent-light)] rounded-full px-2 py-0.5 uppercase tracking-widest">${TYPE_LABELS[b.type]}</span>
          <span class="mono text-black/40 text-xs">ordre ${b.order ?? 0}</span>
        </div>
        <p class="text-black/60 text-sm line-clamp-1">${esc(summarize(b))}</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button data-edit="${b.$id}" class="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
        <button data-del="${b.$id}" class="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
      </div>
    </div>
  `).join("") || `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucun bloc. Clique sur "+ Ajouter un bloc" pour commencer.</div>`;

  const docs = res.documents;
  list.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => edit(docs.find((d) => d.$id === btn.dataset.edit))));
  list.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => del(btn.dataset.del)));
}

updateFieldVisibility();
initAdminPage().then((user) => { if (user) load(); });
