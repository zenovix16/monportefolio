import { initAdminPage, esc } from "./shared.js";
import { databases, storage, DB_ID, BUCKET_ID, COLLECTIONS, ID, Query } from "../appwrite.js";

let editingId = null;
let currentImageId = "";

const form = document.getElementById("project-form");
const list = document.getElementById("items-list");
const toggleBtn = document.getElementById("toggle-form");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("form-submit");
const imageInput = document.getElementById("image-input");
const uploadLabel = document.getElementById("upload-label");
const currentImageEl = document.getElementById("current-image");

function resetForm() {
  form.reset();
  editingId = null;
  currentImageId = "";
  currentImageEl.classList.add("hidden");
  formTitle.textContent = "Ajouter un projet";
  submitBtn.textContent = "Créer le projet";
}

toggleBtn.addEventListener("click", () => {
  const willShow = form.classList.contains("hidden");
  resetForm();
  form.classList.toggle("hidden", !willShow);
  toggleBtn.textContent = willShow ? "Annuler" : "+ Nouveau projet";
});

imageInput.addEventListener("change", async () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  uploadLabel.textContent = "Upload en cours...";
  try {
    const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
    currentImageId = res.$id;
    uploadLabel.textContent = "Choisir une image";
    currentImageEl.textContent = `ID actuel : ${currentImageId}`;
    currentImageEl.classList.remove("hidden");
  } catch (e) {
    uploadLabel.textContent = "Choisir une image";
    alert("Échec de l'upload : " + e.message);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const body = {
    title: data.get("title"),
    description: data.get("description"),
    tags: (data.get("tags") || "").split(",").map((s) => s.trim()).filter(Boolean),
    githubUrl: data.get("githubUrl") || undefined,
    liveUrl: data.get("liveUrl") || undefined,
    imageId: currentImageId || undefined,
    featured: data.get("featured") === "on",
    order: Number(data.get("order")) || 0,
  };

  try {
    if (editingId) {
      await databases.updateDocument(DB_ID, COLLECTIONS.PROJECTS, editingId, body);
    } else {
      await databases.createDocument(DB_ID, COLLECTIONS.PROJECTS, ID.unique(), body);
    }
    resetForm();
    form.classList.add("hidden");
    toggleBtn.textContent = "+ Nouveau projet";
    load();
  } catch (e) {
    alert("Échec de l'enregistrement : " + e.message);
  }
});

function edit(p) {
  editingId = p.$id;
  currentImageId = p.imageId || "";
  form.title.value = p.title;
  form.description.value = p.description;
  form.tags.value = (p.tags || []).join(", ");
  form.githubUrl.value = p.githubUrl || "";
  form.liveUrl.value = p.liveUrl || "";
  form.featured.checked = !!p.featured;
  form.order.value = p.order || 0;
  if (currentImageId) {
    currentImageEl.textContent = `ID actuel : ${currentImageId}`;
    currentImageEl.classList.remove("hidden");
  }
  formTitle.textContent = "Modifier le projet";
  submitBtn.textContent = "Enregistrer";
  form.classList.remove("hidden");
  toggleBtn.textContent = "Annuler";
  form.scrollIntoView({ behavior: "smooth" });
}

async function del(id) {
  if (!confirm("Supprimer ce projet ?")) return;
  await databases.deleteDocument(DB_ID, COLLECTIONS.PROJECTS, id);
  load();
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.orderAsc("order")]);
  list.innerHTML = res.documents.map((p) => `
    <div class="glass rounded-lg p-5 flex items-center justify-between gap-4">
      <div class="min-w-0">
        <div class="flex items-center gap-2 mb-1">
          ${p.featured ? `<span class="text-[10px] border border-[var(--accent)]/40 text-[var(--accent-light)] rounded-full px-2 py-0.5 uppercase tracking-widest">Featured</span>` : ""}
          <p class="text-[#14161A] font-medium text-sm">${esc(p.title)}</p>
        </div>
        <p class="text-black/50 text-xs line-clamp-1">${esc(p.description)}</p>
        ${(p.tags || []).length ? `<div class="flex flex-wrap gap-1.5 mt-2">${p.tags.map((t) => `<span class="text-[10px] text-black/40 border border-black/[0.08] rounded-full px-2 py-0.5">${esc(t)}</span>`).join("")}</div>` : ""}
      </div>
      <div class="flex gap-2 shrink-0">
        <button data-edit="${p.$id}" class="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
        <button data-del="${p.$id}" class="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
      </div>
    </div>
  `).join("") || `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucun projet.</div>`;

  const docs = res.documents;
  list.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => edit(docs.find((d) => d.$id === btn.dataset.edit))));
  list.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => del(btn.dataset.del)));
}

initAdminPage().then((user) => { if (user) load(); });
