"use client";

import type { SectionId } from "./PortfolioClient";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "hero",       label: "Accueil"   },
  { id: "about",      label: "About"     },
  { id: "skills",     label: "Skills"    },
  { id: "projects",   label: "Projets"   },
  { id: "experience", label: "Parcours"  },
  { id: "education",  label: "Formation" },
  { id: "articles",   label: "Articles"  },
  { id: "contact",    label: "Contact"   },
];

interface Props {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}

export default function Navbar({ active, onNavigate }: Props) {
  return (
    <header className="shrink-0 border-b border-white/[0.06] bg-[#0C0B0E]/80 backdrop-blur-lg z-50">
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between px-10 py-3">
        <button
          onClick={() => onNavigate("hero")}
          className="text-[11px] tracking-[0.3em] uppercase text-white/30 hover:text-white/60 transition-colors font-medium"
        >
          SN
        </button>

        <ul className="flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => onNavigate(l.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 ${
                  active === l.id
                    ? "bg-white/[0.08] text-white"
                    : "text-white/35 hover:text-white/70"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <span className="text-[11px] text-white/20">Casablanca, Maroc</span>
      </nav>

      {/* Mobile — scroll horizontal */}
      <nav className="md:hidden flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-none">
        {LINKS.map((l) => (
          <button
            key={l.id}
            onClick={() => onNavigate(l.id)}
            className={`shrink-0 text-[11px] px-3.5 py-1.5 rounded-full border transition-all duration-200 whitespace-nowrap ${
              active === l.id
                ? "border-white/30 text-white bg-white/[0.06]"
                : "border-white/[0.08] text-white/35"
            }`}
          >
            {l.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
