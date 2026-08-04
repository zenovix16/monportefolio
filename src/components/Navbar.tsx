"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  email?: string;
}

export default function Navbar({ active, onNavigate, email }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: SectionId) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 border-b border-black/[0.08] bg-[#F1F2F4]/80 backdrop-blur-lg z-50">
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between px-10 py-3">
        <button
          onClick={() => go("hero")}
          className="text-[11px] tracking-[0.3em] uppercase text-black/45 hover:text-black/75 transition-colors font-medium"
        >
          SN
        </button>

        <ul className="flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 ${
                  active === l.id
                    ? "bg-[var(--accent-soft)] text-[var(--accent-light)]"
                    : "text-black/45 hover:text-black/75"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <span className="text-[11px] text-black/40">Casablanca, Maroc</span>
      </nav>

      {/* Mobile bar */}
      <nav className="md:hidden flex items-center justify-between px-5 py-3">
        <button
          onClick={() => go("hero")}
          className="text-[11px] tracking-[0.3em] uppercase text-black/45 font-medium"
        >
          SN
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] z-[60]"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
            className="w-5 h-px bg-black block"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-px bg-black block"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
            className="w-5 h-px bg-black block"
          />
        </button>
      </nav>

      {/* Menu mobile — tiroir latéral */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="md:hidden fixed inset-y-0 right-0 w-[82%] max-w-sm bg-[#F1F2F4] z-50 flex flex-col px-6 py-8 shadow-2xl"
            >
              <nav className="flex-1 flex flex-col justify-center gap-1">
                {LINKS.map((l, i) => (
                  <motion.button
                    key={l.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.35 }}
                    onClick={() => go(l.id)}
                    className="flex items-baseline gap-3 py-2.5 text-left group"
                  >
                    <span className={`text-[11px] tabular-nums ${active === l.id ? "text-[var(--accent-light)]" : "text-black/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-2xl font-bold tracking-tight transition-colors ${
                      active === l.id ? "text-[var(--accent-light)]" : "text-black/75 group-hover:text-black"
                    }`}>
                      {l.label}
                    </span>
                  </motion.button>
                ))}
              </nav>
              {email && (
                <div className="pt-6 border-t border-black/[0.08]">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-black/40 mb-2">Contact</p>
                  <a href={`mailto:${email}`} className="text-black/60 text-sm break-all">{email}</a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
