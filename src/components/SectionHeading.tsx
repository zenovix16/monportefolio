"use client";

import { motion } from "framer-motion";

interface Props {
  number: string;
  label: string;
}

export default function SectionHeading({ number, label }: Props) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/35 shrink-0">{number}</span>
      <div className="flex-1 h-px bg-white/10 overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full bg-[var(--accent)] origin-left"
        />
      </div>
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/35 shrink-0">{label}</span>
    </div>
  );
}
