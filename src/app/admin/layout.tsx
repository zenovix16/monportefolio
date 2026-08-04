"use client";

import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "◉" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "About", href: "/admin/about", icon: "●" },
  { label: "Projets", href: "/admin/projects", icon: "◈" },
  { label: "Articles", href: "/admin/articles", icon: "◇" },
  { label: "Expérience", href: "/admin/experience", icon: "◆" },
  { label: "Formation", href: "/admin/education", icon: "▲" },
  { label: "Skills", href: "/admin/skills", icon: "◎" },
  { label: "Réglages", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F1F2F4] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-black/[0.08] flex flex-col py-8 px-4">
        <div className="mb-10 px-2">
          <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-1">Portfolio</p>
          <p className="text-sm font-bold text-[#14161A]">Admin</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? "bg-[var(--accent-soft)] text-[var(--accent-light)]"
                    : "text-black/50 hover:text-black/80 hover:bg-black/[0.04]"
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-black/[0.08] pt-4 mt-4">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/45 hover:text-black/75 transition-colors"
          >
            ← Portfolio
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/45 hover:text-red-600/80 transition-colors"
          >
            ⊗ Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
