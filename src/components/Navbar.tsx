"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "About", href: "#about", icon: "○" },
  { label: "Skills", href: "#skills", icon: "◎" },
  { label: "Projets", href: "#projects", icon: "◈" },
  { label: "Parcours", href: "#experience", icon: "◆" },
  { label: "Contact", href: "#contact", icon: "✉" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop nav — top */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-10 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-white/[0.05] py-3"
            : "bg-transparent py-6"
        }`}
      >
        <a href="#" className="text-[11px] tracking-[0.3em] uppercase text-white/30 hover:text-white/60 transition-colors font-medium">
          SN
        </a>

        <ul className="flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[11px] tracking-wide text-white/35 hover:text-white transition-colors duration-200">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="mailto:soumaila.niampa@centrale-casablanca.ma"
          className="text-[11px] text-white/30 hover:text-white transition-colors border border-white/[0.07] hover:border-white/20 rounded-full px-4 py-1.5"
        >
          soumaila.niampa@centrale-casablanca.ma
        </a>
      </motion.nav>

      {/* Mobile nav — bottom fixed */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/[0.06]">
        <ul className="flex items-stretch">
          {links.map((l) => (
            <li key={l.href} className="flex-1">
              <a
                href={l.href}
                className="flex flex-col items-center justify-center gap-1 py-3 text-white/35 hover:text-white active:text-white transition-colors"
              >
                <span className="text-base leading-none">{l.icon}</span>
                <span className="text-[9px] tracking-wider uppercase">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
