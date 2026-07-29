"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getFilePreviewUrl } from "@/lib/storage";
import type { SectionId } from "./PortfolioClient";

const PROFILE_FILE_ID = process.env.NEXT_PUBLIC_PROFILE_FILE_ID;

interface Props {
  onNavigate: (id: SectionId) => void;
}

export default function Hero({ onNavigate }: Props) {
  const avatarSrc = PROFILE_FILE_ID ? getFilePreviewUrl(PROFILE_FILE_ID, 300, 300) : null;

  return (
    <section id="hero" className="relative min-h-[90svh] flex flex-col justify-between px-5 md:px-10 pt-8 pb-6 md:pt-14 overflow-hidden">

      {/* Halo accent */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)" }}
      />

      {/* Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
            {avatarSrc ? (
              <Image src={avatarSrc} alt="Soumaïla" fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full glass flex items-center justify-center">
                <span className="text-white/50 text-xs font-bold">SN</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-white/65 text-xs font-medium">Soumaïla Niampa</p>
            <p className="text-white/35 text-[11px]">Casablanca · Maroc</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="text-white/40 text-xs">Disponible</span>
        </div>
      </motion.div>

      {/* Name */}
      <div className="relative my-auto py-8">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-bold leading-[0.88] tracking-tighter text-[#F4F5F7]"
            style={{ fontSize: "clamp(3.5rem, 13vw, 10rem)" }}
          >
            SOUMAÏLA
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
            NIAMPA.
          </motion.h1>
        </div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative"
      >
        <div className="rule mb-5" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-xs">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-1.5">
              Consultant Data & Transformation Digitale
            </p>
            <p className="text-white/55 text-sm leading-relaxed">
              Ingénieur École Centrale Casablanca · Data Analyst chez Attijariwafa Bank.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate("projects")}
              className="glow px-5 py-2.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-full hover:bg-[var(--accent-light)] transition-colors"
            >
              Voir les projets
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-5 py-2.5 glass text-white/55 text-xs rounded-full hover:text-white transition-all"
            >
              Me contacter
            </button>
            <a
              href="https://linkedin.com/in/souma%C3%AFla-niampa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 glass text-white/55 text-xs rounded-full hover:text-white transition-all"
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
            className="text-[var(--accent-light)]/60 hover:text-[var(--accent-light)] transition-colors"
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
