"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { SectionId } from "./PortfolioClient";

interface Props {
  onNavigate: (id: SectionId) => void;
  profilePhotoUrl: string | null;
  cvUrl: string | null;
  name?: string;
  location?: string;
  tagline?: string;
  description?: string;
  linkedinUrl?: string;
}

const DEFAULTS = {
  name: "Soumaïla Niampa",
  location: "Casablanca · Maroc",
  tagline: "Consultant Data & Transformation Digitale",
  description: "Ingénieur École Centrale Casablanca · Data Analyst chez Attijariwafa Bank.",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

export default function Hero({ onNavigate, profilePhotoUrl, cvUrl, name, location, tagline, description, linkedinUrl }: Props) {
  const fullName = name || DEFAULTS.name;
  const nameParts = fullName.trim().split(/\s+/);
  const firstLine = (nameParts[0] ?? "").toUpperCase();
  const secondLine = (nameParts.slice(1).join(" ") || nameParts[0] || "").toUpperCase();

  return (
    <section id="hero" className="relative min-h-[90svh] flex flex-col justify-between px-5 md:px-10 pt-6 pb-5 md:pt-10 overflow-hidden">

      {/* Halo accent */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.28, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="pointer-events-none absolute top-1/3 right-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
      />

      {/* Portrait détouré — élément de design, ancré à droite, fondu vers le fond */}
      {profilePhotoUrl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-full md:w-[58%]"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 38%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 38%)",
          }}
        >
          <Image
            src={profilePhotoUrl}
            alt=""
            fill
            priority
            className="object-contain object-bottom opacity-[0.4] md:opacity-95"
          />
        </div>
      )}

      {/* Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between"
      >
        <div>
          <p className="text-black/70 text-xs font-medium">{fullName}</p>
          <p className="text-black/40 text-[11px]">{location || DEFAULTS.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-black/45 text-xs">Disponible</span>
        </div>
      </motion.div>

      {/* Name */}
      <div className="relative z-10 my-auto py-8">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-bold leading-[0.88] tracking-tighter text-[#14161A]"
            style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
          >
            {firstLine}
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
            className="font-bold leading-[0.88] tracking-tighter"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 10rem)",
              color: "transparent",
              WebkitTextStroke: "1px var(--accent-light)",
            }}
          >
            {secondLine}.
          </motion.h1>
        </div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10"
      >
        <div className="rule mb-5" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-xs">
            <p className="text-[10px] tracking-[0.25em] uppercase text-black/45 mb-1.5">
              {tagline || DEFAULTS.tagline}
            </p>
            <p className="text-black/60 text-sm leading-relaxed">
              {description || DEFAULTS.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate("projects")}
              className="glow px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-full hover:bg-[var(--accent-light)] transition-colors"
            >
              Voir les projets
            </button>
            {cvUrl && (
              <a
                href={cvUrl}
                download
                className="btn-ghost px-5 py-2.5 text-black/60 text-xs rounded-full hover:text-black transition-colors"
              >
                Télécharger le CV ↓
              </a>
            )}
            <button
              onClick={() => onNavigate("contact")}
              className="btn-ghost px-5 py-2.5 text-black/60 text-xs rounded-full hover:text-black transition-colors"
            >
              Me contacter
            </button>
            <a
              href={linkedinUrl || DEFAULTS.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-5 py-2.5 text-black/60 text-xs rounded-full hover:text-black transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => onNavigate("about")}
            aria-label="Défiler vers la section suivante"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-[var(--accent-light)]/70 hover:text-[var(--accent-light)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
