import { account } from "../appwrite.js";

// Si déjà connecté, direction le dashboard.
account.get().then(() => { window.location.href = "/admin/index.html"; }).catch(() => {});

const form = document.getElementById("login-form");
const submitBtn = document.getElementById("login-submit");
const errorEl = document.getElementById("login-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.textContent = "Connexion...";

  const data = new FormData(form);
  try {
    await account.createEmailPasswordSession(data.get("email"), data.get("password"));
    window.location.href = "/admin/index.html";
  } catch {
    errorEl.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Se connecter";
  }
});
