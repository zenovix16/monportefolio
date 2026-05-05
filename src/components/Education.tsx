"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const educationData = [
  {
    school: "École Centrale Casablanca",
    degree: "Ingénieur généraliste",
    speciality: "Spécialisation Data & Transformation Digitale",
    location: "Casablanca, Maroc",
    startYear: "2022",
    endYear: "2025",
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
    startYear: "2019",
    endYear: "2022",
    highlights: [],
  },
];

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Formation</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Mon parcours académique.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {educationData.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="glass rounded-2xl p-7"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs tracking-widest uppercase text-white/25">
                  {edu.startYear} — {edu.endYear}
                </p>
                <p className="text-xs text-white/25">{edu.location}</p>
              </div>

              <h3 className="text-white font-bold text-lg leading-snug mb-1">
                {edu.school}
              </h3>
              <p className="text-white/50 text-sm font-medium mb-1">{edu.degree}</p>
              <p className="text-white/30 text-sm mb-5">{edu.speciality}</p>

              {edu.highlights.length > 0 && (
                <ul className="space-y-2 border-t border-white/[0.06] pt-4">
                  {edu.highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="text-white/20 mt-1.5 shrink-0">—</span>
                      <span className="text-white/35 text-sm leading-relaxed">{h}</span>
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
