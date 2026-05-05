"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getFilePreviewUrl } from "@/lib/storage";

const PROFILE_FILE_ID = process.env.NEXT_PUBLIC_PROFILE_FILE_ID;

function Avatar() {
  const src = PROFILE_FILE_ID ? getFilePreviewUrl(PROFILE_FILE_ID, 300, 300) : null;
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/10 shrink-0">
      {src ? (
        <Image src={src} alt="Soumaïla" fill className="object-cover" priority />
      ) : (
        <div className="w-full h-full glass flex items-center justify-center">
          <span className="text-white/40 text-sm font-bold tracking-widest">SN</span>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between px-5 md:px-10 pt-24 pb-8 overflow-hidden">

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Avatar />
          <div>
            <p className="text-white/60 text-xs font-medium">Soumaïla Niampa</p>
            <p className="text-white/25 text-[11px]">Casablanca, Maroc</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          <span className="text-white/35 text-xs tracking-wide">Disponible</span>
        </div>
      </motion.div>

      {/* Nom massif */}
      <div className="my-auto py-10 md:py-0">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-bold leading-[0.88] tracking-tighter text-white"
            style={{ fontSize: "clamp(3.8rem, 14vw, 11rem)" }}
          >
            SOUMAÏLA
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
            className="font-bold leading-[0.88] tracking-tighter"
            style={{
              fontSize: "clamp(3.8rem, 14vw, 11rem)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.18)",
            }}
          >
            NIAMPA.
          </motion.h1>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="space-y-5"
      >
        <div className="rule" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-sm">
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/25 mb-2">
              Consultant Data & Transformation Digitale
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              Ingénieur spécialisé en data, automatisation et transformation digitale.
              École Centrale Casablanca · Attijariwafa Bank.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#projects"
              className="px-5 py-2.5 bg-white text-black text-xs font-semibold tracking-wide rounded-full hover:bg-white/90 transition-all"
            >
              Voir les projets
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 glass text-white/50 text-xs tracking-wide rounded-full hover:text-white transition-all"
            >
              Me contacter
            </a>
            <a
              href="https://linkedin.com/in/souma%C3%AFla-niampa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 glass text-white/50 text-xs tracking-wide rounded-full hover:text-white transition-all"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
