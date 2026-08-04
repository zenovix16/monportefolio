import { initAdminPage, esc } from "./shared.js";
import { databases, DB_ID, COLLECTIONS, Query } from "../appwrite.js";
import * as XLSX from "xlsx";

let messages = [];
let selected = null;

function renderList() {
  const content = document.getElementById("content");

  if (messages.length === 0) {
    content.innerHTML = `<div class="glass rounded-lg p-10 text-center text-black/45 text-sm">Aucun message pour le moment.</div>`;
    return;
  }

  content.innerHTML = `
    <div class="grid md:grid-cols-2 gap-4">
      <div id="msg-list" class="space-y-2"></div>
      <div id="msg-detail" class="glass rounded-lg p-6 h-fit sticky top-0">
        <p class="text-black/40 text-sm text-center py-8">Clique sur un message pour le lire.</p>
      </div>
    </div>
  `;

  const listEl = document.getElementById("msg-list");
  listEl.innerHTML = messages.map((msg) => `
    <div data-select="${msg.$id}" class="glass rounded-lg p-4 cursor-pointer transition-all ${selected?.$id === msg.$id ? "border-[var(--accent)]/50" : "hover:border-black/20"}">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="text-[#14161A] text-sm font-medium truncate">${esc(msg.name)}</p>
          <p class="text-black/50 text-xs truncate">${esc(msg.email)}</p>
        </div>
        <p class="mono text-black/35 text-xs shrink-0">${new Date(msg.$createdAt).toLocaleDateString("fr-FR")}</p>
      </div>
      <p class="text-black/55 text-xs mt-2 line-clamp-1">${esc(msg.message)}</p>
    </div>
  `).join("");

  listEl.querySelectorAll("[data-select]").forEach((el) => {
    el.addEventListener("click", () => {
      selected = messages.find((m) => m.$id === el.dataset.select);
      renderList();
    });
  });

  renderDetail();
}

function renderDetail() {
  if (!selected) return;
  const detail = document.getElementById("msg-detail");
  detail.innerHTML = `
    <div class="flex items-start justify-between mb-6">
      <div>
        <p class="text-[#14161A] font-semibold">${esc(selected.name)}</p>
        <a href="mailto:${esc(selected.email)}" class="text-black/55 text-sm hover:text-[var(--accent-light)] transition-colors">${esc(selected.email)}</a>
        <p class="mono text-black/40 text-xs mt-1">${new Date(selected.$createdAt).toLocaleString("fr-FR")}</p>
      </div>
      <button id="msg-delete" class="text-xs text-red-600/75 hover:text-red-600 border border-red-400/40 rounded-lg px-3 py-1.5 transition-colors">Supprimer</button>
    </div>
    <p class="text-black/70 text-sm leading-relaxed whitespace-pre-wrap">${esc(selected.message)}</p>
    <a href="mailto:${esc(selected.email)}?subject=Re: Votre message" class="mt-6 inline-block text-sm text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-4 py-2 transition-colors">Répondre par email →</a>
  `;
  document.getElementById("msg-delete").addEventListener("click", async () => {
    if (!confirm("Supprimer ce message ?")) return;
    await databases.deleteDocument(DB_ID, COLLECTIONS.MESSAGES, selected.$id);
    messages = messages.filter((m) => m.$id !== selected.$id);
    selected = null;
    renderList();
  });
}

async function load() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [Query.orderDesc("$createdAt"), Query.limit(500)]);
  messages = res.documents;
  renderList();
}

document.getElementById("export-btn").addEventListener("click", () => {
  const rows = messages.map((d) => ({
    Nom: d.name,
    Email: d.email,
    Message: d.message,
    Date: new Date(d.$createdAt).toLocaleString("fr-FR"),
  }));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Messages");
  const out = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `messages-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(a.href);
});

initAdminPage().then((user) => { if (user) load(); });
