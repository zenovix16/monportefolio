import { account } from "../appwrite.js";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/index.html", icon: "◉" },
  { label: "Messages", href: "/admin/messages.html", icon: "✉" },
  { label: "About", href: "/admin/about.html", icon: "●" },
  { label: "Projets", href: "/admin/projects.html", icon: "◈" },
  { label: "Articles", href: "/admin/articles.html", icon: "◇" },
  { label: "Expérience", href: "/admin/experience.html", icon: "◆" },
  { label: "Formation", href: "/admin/education.html", icon: "▲" },
  { label: "Skills", href: "/admin/skills.html", icon: "◎" },
  { label: "Réglages", href: "/admin/settings.html", icon: "⚙" },
];

// Vérifie la session Appwrite au chargement de chaque page admin (remplace
// le middleware Next.js). Redirige vers login si non connecté.
export async function requireAuth() {
  try {
    return await account.get();
  } catch {
    window.location.href = "/admin/login.html";
    return null;
  }
}

export function renderSidebar() {
  const el = document.getElementById("admin-sidebar");
  if (!el) return;
  const current = window.location.pathname;

  el.innerHTML = `
    <div class="mb-10 px-2">
      <p class="text-xs tracking-[0.3em] uppercase text-black/45 mb-1">Portfolio</p>
      <p class="text-sm font-bold text-[#14161A]">Admin</p>
    </div>
    <nav class="flex-1 space-y-1">
      ${NAV_ITEMS.map((item) => `
        <a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          current === item.href ? "bg-[var(--accent-soft)] text-[var(--accent-light)]" : "text-black/50 hover:text-black/80 hover:bg-black/[0.04]"
        }">
          <span class="text-xs">${item.icon}</span>${item.label}
        </a>
      `).join("")}
    </nav>
    <div class="border-t border-black/[0.08] pt-4 mt-4">
      <a href="/" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/45 hover:text-black/75 transition-colors">← Portfolio</a>
      <button id="admin-logout" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/45 hover:text-red-600/80 transition-colors">⊗ Déconnexion</button>
    </div>
  `;

  document.getElementById("admin-logout").addEventListener("click", async () => {
    await account.deleteSession("current");
    window.location.href = "/admin/login.html";
  });
}

export async function initAdminPage() {
  const user = await requireAuth();
  if (!user) return null;
  renderSidebar();
  return user;
}

export function esc(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
