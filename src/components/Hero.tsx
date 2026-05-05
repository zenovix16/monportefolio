"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getFilePreviewUrl } from "@/lib/storage";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

const PROFILE_FILE_ID = process.env.NEXT_PUBLIC_PROFILE_FILE_ID;

function ProfileAvatar() {
  if (PROFILE_FILE_ID) {
    return (
      <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-white/10 mx-auto mb-8">
        <Image
          src={getFilePreviewUrl(PROFILE_FILE_ID, 200, 200)}
          alt="Soumaïla Niampa"
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full glass border border-white/10 flex items-center justify-center mx-auto mb-8">
      <span className="text-2xl font-bold text-white/60 tracking-wider">SN</span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.015] blur-[140px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full text-center"
      >
        <motion.div variants={item}>
          <ProfileAvatar />
        </motion.div>

        <motion.p
          variants={item}
          className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6"
        >
          Consultant Data & Transformation Digitale
        </motion.p>

        <motion.h1
          variants={item}
          className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight text-white mb-6"
        >
          Soumaïla
          <br />
          <span className="text-white/20">Niampa</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-base md:text-lg text-white/35 max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Ingénieur spécialisé en data, automatisation et transformation digitale.
          J&apos;accompagne les entreprises dans la structuration de leurs données,
          l&apos;optimisation de leurs processus et la mise en place d&apos;outils de pilotage.
        </motion.p>

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-white text-black text-sm font-medium tracking-wide rounded-full hover:bg-white/90 transition-all duration-300"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="px-6 py-3 glass text-white/60 text-sm font-medium tracking-wide rounded-full hover:text-white transition-all duration-300"
          >
            Me contacter
          </a>
          <a
            href="https://linkedin.com/in/soumaïla-niampa"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 glass text-white/60 text-sm font-medium tracking-wide rounded-full hover:text-white transition-all duration-300"
          >
            LinkedIn
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
          />
          <span className="text-[10px] tracking-widest uppercase text-white/20">scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
