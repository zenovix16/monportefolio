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
    <section className="min-h-[calc(100dvh-49px)] flex flex-col justify-between px-5 md:px-10 pt-10 pb-8 md:pt-16">

      {/* Top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
            {avatarSrc ? (
              <Image src={avatarSrc} alt="Soumaïla" fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full glass flex items-center justify-center">
                <span className="text-white/40 text-xs font-bold">SN</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-white/55 text-xs font-medium">Soumaïla Niampa</p>
            <p className="text-white/22 text-[11px]">Casablanca · Maroc</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/35 animate-pulse" />
          <span className="text-white/28 text-xs">Disponible</span>
        </div>
      </motion.div>

      {/* Name */}
      <div className="my-auto py-8">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="font-bold leading-[0.88] tracking-tighter text-white"
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
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
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
      >
        <div className="rule mb-5" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-xs">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/22 mb-1.5">
              Consultant Data & Transformation Digitale
            </p>
            <p className="text-white/40 text-sm leading-relaxed">
              Ingénieur École Centrale Casablanca · Data Analyst chez Attijariwafa Bank.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate("projects")}
              className="px-5 py-2.5 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Voir les projets
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-5 py-2.5 glass text-white/45 text-xs rounded-full hover:text-white transition-all"
            >
              Me contacter
            </button>
            <a
              href="https://linkedin.com/in/souma%C3%AFla-niampa"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 glass text-white/45 text-xs rounded-full hover:text-white transition-all"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
