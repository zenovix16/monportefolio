import { initAdminPage, esc } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, ID, Query } from "../appwrite.js";

let editingId = null;

const form = document.getElementById("exp-form");
const list = document.getElementById("items-list");
const toggleBtn = document.getElementById("toggle-form");
const submitBtn = document.getElementById("form-submit");

form.current.addEventListener("change", () => {
  form.endDate.disabled = form.current.checked;
  if (form.current.checked) form.endDate.value = "";
});

function resetForm() {
  form.reset();
  form.endDate.disabled = false;
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
    company: data.get("company"),
    role: data.get("role"),
    location: data.get("location") || undefined,
    description: data.get("description"),
    startDate: data.get("startDate"),
    endDate: form.current.checked ? undefined : (data.get("endDate") || undefined),
    current: form.current.checked,
    order: 0,
  };
  try {
    if (editingId) await databases.updateDocument(DB_ID, COLLECTIONS.EXPERIENCE, editingId, body);
    else await databases.createDocument(DB_ID, COLLECTIONS.EXPERIENCE, ID.unique(), body);
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
  form.company.value = item.company;
  form.role.value = item.role;
  form.location.value = item.location || "";
  form.description.value = item.description;
  form.startDate.value = item.startDate || "";
  form.endDate.value = item.endDate || "";
  form.current.checked = !!item.current;
  form.endDate.disabled = !!item.current;
  submitBtn.textContent = "Enregistrer";
  form.classList.remove("hidden");
  toggleBtn.textContent = "Annuler";
  form.scrollIntoView({ behavior: "smooth" });
}

async function del(id) {
  if (!confirm("Supprimer cette expérience ?")) return;
  await databases.deleteDocument(DB_ID, COLLECTIONS.EXPERIENCE, id);
  load();
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.EXPERIENCE, [Query.orderAsc("order")]);
  list.innerHTML = res.documents.map((item) => `
    <div class="glass rounded-lg p-5 flex items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          ${item.current ? `<span class="text-[10px] border border-[var(--accent)]/40 text-[var(--accent-light)] rounded-full px-2 py-0.5 uppercase tracking-widest">Actuel</span>` : ""}
          <p class="text-[#14161A] font-medium text-sm">${esc(item.role)}</p>
        </div>
        <p class="text-black/60 text-xs">${esc(item.company)} · ${esc(item.startDate)}${item.endDate ? ` — ${esc(item.endDate)}` : ""}</p>
      </div>
      <div class="flex gap-2 shrink-0">
        <button data-edit="${item.$id}" class="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors">Modifier</button>
        <button data-del="${item.$id}" class="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
      </div>
    </div>
  `).join("") || `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucune expérience.</div>`;

  const docs = res.documents;
  list.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => edit(docs.find((d) => d.$id === btn.dataset.edit))));
  list.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => del(btn.dataset.del)));
}

initAdminPage().then((user) => { if (user) load(); });
