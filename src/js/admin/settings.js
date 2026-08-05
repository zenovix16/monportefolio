import { initAdminPage } from "./shared.js";
import { databases, storage, DB_ID, BUCKET_ID, COLLECTIONS, ID, getFileViewUrl } from "../appwrite.js";

let settings = {};
const FIELDS = ["heroName", "heroLocation", "heroTagline", "heroDescription", "email", "phone", "linkedinUrl"];

async function load() {
  try {
    settings = await databases.getDocument(DB_ID, COLLECTIONS.SETTINGS, "main");
  } catch {
    settings = {};
  }
  FIELDS.forEach((f) => { document.getElementById(f).value = settings[f] || ""; });

  if (settings.profileFileId) {
    const img = document.getElementById("photo-preview");
    img.src = getFileViewUrl(settings.profileFileId);
    img.classList.remove("hidden");
  }
  if (settings.aboutImageFileId) {
    const img = document.getElementById("about-photo-preview");
    img.src = getFileViewUrl(settings.aboutImageFileId);
    img.classList.remove("hidden");
  }
  if (settings.cvFileId) {
    document.getElementById("cv-current").innerHTML = `<a href="${getFileViewUrl(settings.cvFileId)}" target="_blank" rel="noopener noreferrer" class="text-[var(--accent-light)]">Voir le CV actuel ↗</a>`;
  }
}

document.getElementById("photo-input").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const label = document.getElementById("photo-upload-label");
  label.textContent = "Upload en cours...";
  try {
    const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
    settings.profileFileId = res.$id;
    const img = document.getElementById("photo-preview");
    img.src = getFileViewUrl(res.$id);
    img.classList.remove("hidden");
  } catch (err) {
    alert("Échec de l'upload : " + err.message);
  }
  label.textContent = "Changer la photo";
});

document.getElementById("about-photo-input").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const label = document.getElementById("about-photo-upload-label");
  label.textContent = "Upload en cours...";
  try {
    const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
    settings.aboutImageFileId = res.$id;
    const img = document.getElementById("about-photo-preview");
    img.src = getFileViewUrl(res.$id);
    img.classList.remove("hidden");
  } catch (err) {
    alert("Échec de l'upload : " + err.message);
  }
  label.textContent = "Changer la photo";
});

document.getElementById("cv-input").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const label = document.getElementById("cv-upload-label");
  label.textContent = "Upload en cours...";
  try {
    const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
    settings.cvFileId = res.$id;
    document.getElementById("cv-current").innerHTML = `<a href="${getFileViewUrl(res.$id)}" target="_blank" rel="noopener noreferrer" class="text-[var(--accent-light)]">Voir le CV actuel ↗</a>`;
  } catch (err) {
    alert("Échec de l'upload : " + err.message);
  }
  label.textContent = "Changer le CV";
});

document.getElementById("save-btn").addEventListener("click", async () => {
  const btn = document.getElementById("save-btn");
  btn.disabled = true;
  btn.textContent = "Enregistrement...";

  const body = {};
  FIELDS.forEach((f) => { body[f] = document.getElementById(f).value; });
  if (settings.profileFileId) body.profileFileId = settings.profileFileId;
  if (settings.aboutImageFileId) body.aboutImageFileId = settings.aboutImageFileId;
  if (settings.cvFileId) body.cvFileId = settings.cvFileId;

  try {
    await databases.updateDocument(DB_ID, COLLECTIONS.SETTINGS, "main", body);
    btn.textContent = "Enregistré ✓";
  } catch (e) {
    btn.textContent = "Échec — réessayer";
    console.error(e);
  }
  setTimeout(() => { btn.disabled = false; btn.textContent = "Enregistrer"; }, 2000);
});

initAdminPage().then((user) => { if (user) load(); });
