import { initAdminPage, esc } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, ID, Query } from "../appwrite.js";

let editingId = null;

const form = document.getElementById("skill-form");
const list = document.getElementById("items-list");
const toggleBtn = document.getElementById("toggle-form");
const submitBtn = document.getElementById("form-submit");
const levelInput = form.level;
const levelValue = document.getElementById("level-value");

levelInput.addEventListener("input", () => { levelValue.textContent = levelInput.value; });

function resetForm() {
  form.reset();
  levelValue.textContent = "80";
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
    name: data.get("name"),
    category: data.get("category"),
    level: Number(data.get("level")),
    order: 0,
  };
  try {
    if (editingId) await databases.updateDocument(DB_ID, COLLECTIONS.SKILLS, editingId, body);
    else await databases.createDocument(DB_ID, COLLECTIONS.SKILLS, ID.unique(), body);
    resetForm();
    form.classList.add("hidden");
    toggleBtn.textContent = "+ Ajouter";
    load();
  } catch (e) {
    alert("Échec : " + e.message);
  }
});

function edit(s) {
  editingId = s.$id;
  form.name.value = s.name;
  form.category.value = s.category;
  form.level.value = s.level ?? 80;
  levelValue.textContent = s.level ?? 80;
  submitBtn.textContent = "Enregistrer";
  form.classList.remove("hidden");
  toggleBtn.textContent = "Annuler";
  form.scrollIntoView({ behavior: "smooth" });
}

async function del(id) {
  if (!confirm("Supprimer ce skill ?")) return;
  await databases.deleteDocument(DB_ID, COLLECTIONS.SKILLS, id);
  load();
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.SKILLS, [Query.orderAsc("order")]);
  const byCategory = res.documents.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  list.innerHTML = Object.entries(byCategory).map(([cat, skills]) => `
    <div>
      <p class="mono text-xs tracking-widest uppercase text-black/45 mb-3">${esc(cat)}</p>
      <div class="space-y-2">
        ${skills.map((s) => `
          <div class="glass rounded-lg p-4 flex items-center gap-4">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[#14161A] text-sm">${esc(s.name)}</span>
                <span class="mono text-black/50 text-xs">${s.level}%</span>
              </div>
              <div class="h-px bg-black/10 rounded-full overflow-hidden">
                <div class="h-full bg-[var(--accent)] rounded-full" style="width:${s.level}%"></div>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button data-edit="${s.$id}" class="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-2.5 py-1 transition-colors">Modifier</button>
              <button data-del="${s.$id}" class="text-xs text-red-600/70 hover:text-red-600 border border-red-400/35 rounded-lg px-2.5 py-1 transition-colors">×</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("") || `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucun skill.</div>`;

  const docs = res.documents;
  list.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => edit(docs.find((d) => d.$id === btn.dataset.edit))));
  list.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => del(btn.dataset.del)));
}

initAdminPage().then((user) => { if (user) load(); });
