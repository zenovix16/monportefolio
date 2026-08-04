import { initAdminPage, esc } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, ID, Query } from "../appwrite.js";

let editingId = null;

const form = document.getElementById("article-form");
const list = document.getElementById("items-list");
const toggleBtn = document.getElementById("toggle-form");
const submitBtn = document.getElementById("form-submit");

function resetForm() {
  form.reset();
  editingId = null;
  submitBtn.textContent = "Publier l'article";
}

toggleBtn.addEventListener("click", () => {
  const willShow = form.classList.contains("hidden");
  resetForm();
  form.classList.toggle("hidden", !willShow);
  toggleBtn.textContent = willShow ? "Annuler" : "+ Nouvel article";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const body = {
    title: data.get("title"),
    abstract: data.get("abstract"),
    journal: data.get("journal") || undefined,
    publishedDate: data.get("publishedDate") || undefined,
    authors: (data.get("authors") || "").split(",").map((s) => s.trim()).filter(Boolean),
    tags: (data.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean),
    doi: data.get("doi") || undefined,
    pdfUrl: data.get("pdfUrl") || undefined,
    featured: data.get("featured") === "on",
  };
  try {
    if (editingId) await databases.updateDocument(DB_ID, COLLECTIONS.ARTICLES, editingId, body);
    else await databases.createDocument(DB_ID, COLLECTIONS.ARTICLES, ID.unique(), body);
    resetForm();
    form.classList.add("hidden");
    toggleBtn.textContent = "+ Nouvel article";
    load();
  } catch (e) {
    alert("Échec : " + e.message);
  }
});

function edit(a) {
  editingId = a.$id;
  form.title.value = a.title;
  form.abstract.value = a.abstract;
  form.journal.value = a.journal || "";
  form.publishedDate.value = a.publishedDate || "";
  form.authors.value = (a.authors || []).join(", ");
  form.tags.value = (a.tags || []).join(", ");
  form.doi.value = a.doi || "";
  form.pdfUrl.value = a.pdfUrl || "";
  form.featured.checked = !!a.featured;
  submitBtn.textContent = "Enregistrer";
  form.classList.remove("hidden");
  toggleBtn.textContent = "Annuler";
  form.scrollIntoView({ behavior: "smooth" });
}

async function del(id) {
  if (!confirm("Supprimer cet article ?")) return;
  await databases.deleteDocument(DB_ID, COLLECTIONS.ARTICLES, id);
  load();
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.ARTICLES, [Query.orderDesc("$createdAt")]);
  list.innerHTML = res.documents.map((a) => `
    <div class="glass rounded-lg p-5">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            ${a.featured ? `<span class="text-[10px] border border-[var(--accent)]/40 text-[var(--accent-light)] rounded-full px-2 py-0.5 uppercase tracking-widest">Featured</span>` : ""}
            <p class="text-[#14161A] font-medium text-sm">${esc(a.title)}</p>
          </div>
          ${a.journal ? `<p class="text-black/50 text-xs mb-1">${esc(a.journal)} ${a.publishedDate ? `· ${esc(a.publishedDate)}` : ""}</p>` : ""}
          <p class="text-black/60 text-xs line-clamp-2">${esc(a.abstract)}</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button data-edit="${a.$id}" class="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
          <button data-del="${a.$id}" class="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
        </div>
      </div>
    </div>
  `).join("") || `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucun article. Clique sur "+ Nouvel article" pour commencer.</div>`;

  const docs = res.documents;
  list.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => edit(docs.find((d) => d.$id === btn.dataset.edit))));
  list.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => del(btn.dataset.del)));
}

initAdminPage().then((user) => { if (user) load(); });
