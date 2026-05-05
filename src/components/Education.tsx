"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const data = [
  {
    school: "École Centrale Casablanca",
    degree: "Ingénieur généraliste",
    speciality: "Spécialisation Data & Transformation Digitale",
    location: "Casablanca, Maroc",
    period: "2022 — 2025",
    highlights: [
      "Deep learning, NLP, digitalisation des processus, gestion du changement",
      "Projets appliqués en transformation digitale et innovation produit",
    ],
  },
  {
    school: "École Polytechnique de Ouagadougou",
    degree: "CPGE",
    speciality: "Génie informatique et télécommunications",
    location: "Ouagadougou, Burkina Faso",
    period: "2019 — 2022",
    highlights: [],
  },
];

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="education" ref={ref} className="py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">05</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Formation</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {data.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="glass rounded-2xl p-7"
            >
              <div className="flex justify-between items-start mb-5 text-[10px] tracking-widest uppercase text-white/20">
                <span>{e.period}</span>
                <span className="text-right">{e.location}</span>
              </div>

              <h3 className="text-white font-bold text-lg leading-snug mb-1">{e.school}</h3>
              <p className="text-white/45 text-sm font-medium mb-0.5">{e.degree}</p>
              <p className="text-white/25 text-sm mb-5">{e.speciality}</p>

              {e.highlights.length > 0 && (
                <ul className="space-y-2 border-t border-white/[0.05] pt-4">
                  {e.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="text-white/18 text-xs mt-1.5 shrink-0">—</span>
                      <span className="text-white/32 text-sm leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
