"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const data = [
  {
    company: "Attijariwafa Bank",
    role: "Data Analyst",
    location: "Casablanca, Maroc",
    period: "2025 — Présent",
    current: true,
    bullets: [
      "Tableaux de bord pour suivre les indicateurs clés et améliorer la prise de décision",
      "Analyse et optimisation des processus métiers",
      "Traduction des besoins business en solutions concrètes basées sur la data",
    ],
  },
  {
    company: "Société Générale Maroc",
    role: "Data Engineer",
    location: "Casablanca, Maroc",
    period: "Janv. — Mars 2025",
    current: false,
    bullets: [
      "Automatisation de la collecte et du traitement des données",
      "Organisation et structuration des données pour les rendre exploitables",
      "Amélioration des flux de données pour réduire les erreurs",
    ],
  },
  {
    company: "BBC & Partners",
    role: "Ingénieur IA",
    location: "Casablanca, Maroc",
    period: "Mai — Août 2024",
    current: false,
    bullets: [
      "Développement d'un assistant virtuel pour automatiser les demandes utilisateurs",
      "Amélioration de l'expérience via l'interaction homme-assistant",
      "Intégration d'échanges en vocal et en texte",
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" ref={ref} className="py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">04</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Experience</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-bold text-white mb-12"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          Mon parcours.
        </motion.h2>

        <div className="space-y-4">
          {data.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold">{e.role}</h3>
                    {e.current && (
                      <span className="text-[9px] tracking-[0.25em] uppercase text-white/30 border border-white/[0.08] rounded-full px-2 py-0.5">
                        Actuel
                      </span>
                    )}
                  </div>
                  <p className="text-white/38 text-sm">{e.company} · {e.location}</p>
                </div>
                <p className="text-white/22 text-xs md:text-right shrink-0">{e.period}</p>
              </div>

              <ul className="space-y-2 border-t border-white/[0.05] pt-4">
                {e.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="text-white/18 text-xs mt-1.5 shrink-0">—</span>
                    <span className="text-white/38 text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
