import { initAdminPage, esc } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, ID, Query } from "../appwrite.js";

let editingId = null;

const form = document.getElementById("edu-form");
const list = document.getElementById("items-list");
const toggleBtn = document.getElementById("toggle-form");
const submitBtn = document.getElementById("form-submit");

function resetForm() {
  form.reset();
  editingId = null;
  submitBtn.textContent = "Ajouter";
}

toggleBtn.addEventListener("click", () => {
  const willShow = form.classList.contains("hidden");
  resetForm();
  form.classList.toggle("hidden", !willShow);
  toggleBtn.textContent = willShow ? "Annuler" : "+ Ajouter";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const body = {
    school: data.get("school"),
    degree: data.get("degree"),
    speciality: data.get("speciality") || undefined,
    location: data.get("location") || undefined,
    period: data.get("period"),
    highlights: (data.get("highlights") || "").split("\n").map((s) => s.trim()).filter(Boolean),
    order: 0,
  };
  try {
    if (editingId) await databases.updateDocument(DB_ID, COLLECTIONS.EDUCATION, editingId, body);
    else await databases.createDocument(DB_ID, COLLECTIONS.EDUCATION, ID.unique(), body);
    resetForm();
    form.classList.add("hidden");
    toggleBtn.textContent = "+ Ajouter";
    load();
  } catch (e) {
    alert("Échec : " + e.message);
  }
});

function edit(item) {
  editingId = item.$id;
  form.school.value = item.school;
  form.degree.value = item.degree;
  form.speciality.value = item.speciality || "";
  form.location.value = item.location || "";
  form.period.value = item.period;
  form.highlights.value = (item.highlights || []).join("\n");
  submitBtn.textContent = "Enregistrer";
  form.classList.remove("hidden");
  toggleBtn.textContent = "Annuler";
  form.scrollIntoView({ behavior: "smooth" });
}

async function del(id) {
  if (!confirm("Supprimer cette formation ?")) return;
  await databases.deleteDocument(DB_ID, COLLECTIONS.EDUCATION, id);
  load();
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.EDUCATION, [Query.orderAsc("order")]);
  list.innerHTML = res.documents.map((item) => `
    <div class="glass rounded-lg p-5 flex items-center justify-between gap-4">
      <div>
        <p class="text-[#14161A] font-medium text-sm">${esc(item.school)}</p>
        <p class="text-black/60 text-xs">${esc(item.degree)} · ${esc(item.period)}</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button data-edit="${item.$id}" class="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
        <button data-del="${item.$id}" class="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
      </div>
    </div>
  `).join("") || `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucune formation.</div>`;

  const docs = res.documents;
  list.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => edit(docs.find((d) => d.$id === btn.dataset.edit))));
  list.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => del(btn.dataset.del)));
}

initAdminPage().then((user) => { if (user) load(); });
