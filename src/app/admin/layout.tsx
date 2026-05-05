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
    <div className="min-h-screen bg-[#08080A] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/[0.05] flex flex-col py-8 px-4">
        <div className="mb-10 px-2">
          <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-1">Portfolio</p>
          <p className="text-sm font-bold text-white">Admin</p>
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
                    ? "bg-white/[0.07] text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.05] pt-4 mt-4">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            ← Portfolio
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-red-400/60 transition-colors"
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
