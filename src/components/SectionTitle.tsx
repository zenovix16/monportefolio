"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  noMargin?: boolean;
}

// Même traitement "reveal en ligne" que le nom dans le Hero, réutilisé pour
// tous les titres de section — plus de présence qu'un simple fade, et une
// vraie cohérence avec la seule pièce du site déjà jugée forte.
export default function SectionTitle({ children, className = "", noMargin = false }: Props) {
  return (
    <div className={`overflow-hidden ${noMargin ? "" : "mb-6"}`}>
      <motion.h2
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`font-bold text-[#14161A] leading-[0.95] ${className}`}
        style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}
      >
        {children}
      </motion.h2>
    </div>
  );
}
