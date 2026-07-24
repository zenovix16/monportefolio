"use client";

import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "◉" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Projets", href: "/admin/projects", icon: "◈" },
  { label: "Articles", href: "/admin/articles", icon: "◇" },
  { label: "Expérience", href: "/admin/experience", icon: "◆" },
  { label: "Skills", href: "/admin/skills", icon: "◎" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-black/[0.07] flex flex-col py-8 px-4">
        <div className="mb-10 px-2">
          <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-1">Portfolio</p>
          <p className="text-sm font-bold text-[#14141A]">Admin</p>
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
                    ? "bg-black/[0.06] text-[#14141A]"
                    : "text-black/45 hover:text-black/80 hover:bg-black/[0.03]"
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-black/[0.07] pt-4 mt-4">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/40 hover:text-black/70 transition-colors"
          >
            ← Portfolio
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/40 hover:text-red-600/70 transition-colors"
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
