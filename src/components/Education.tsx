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
    <section id="education" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">05</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">Formation</span>
      </div>

      <h2 className="font-bold text-[#14141A] mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
        Parcours académique.
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {data.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex justify-between text-[10px] tracking-widest uppercase text-black/35 mb-4">
              <span>{e.period}</span>
              <span className="text-right">{e.location}</span>
            </div>
            <h3 className="text-[#14141A] font-bold mb-0.5">{e.school}</h3>
            <p className="text-black/55 text-sm font-medium mb-0.5">{e.degree}</p>
            <p className="text-black/40 text-sm mb-4">{e.speciality}</p>
            {e.highlights.length > 0 && (
              <ul className="space-y-1.5 border-t border-black/[0.07] pt-4">
                {e.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2.5 text-black/45 text-xs leading-relaxed">
                    <span className="text-black/30 mt-0.5 shrink-0">—</span>{h}
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
