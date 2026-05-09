"use client";

import { motion } from "framer-motion";

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
  return (
    <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">05</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Formation</span>
      </div>

      <h2 className="font-bold text-white mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
        Parcours académique.
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {data.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex justify-between text-[10px] tracking-widest uppercase text-white/18 mb-4">
              <span>{e.period}</span>
              <span className="text-right">{e.location}</span>
            </div>
            <h3 className="text-white font-bold mb-0.5">{e.school}</h3>
            <p className="text-white/40 text-sm font-medium mb-0.5">{e.degree}</p>
            <p className="text-white/22 text-sm mb-4">{e.speciality}</p>
            {e.highlights.length > 0 && (
              <ul className="space-y-1.5 border-t border-white/[0.05] pt-4">
                {e.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2.5 text-white/30 text-xs leading-relaxed">
                    <span className="text-white/15 mt-0.5 shrink-0">—</span>{h}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
