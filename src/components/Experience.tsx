"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const experienceData = [
  {
    company: "Attijariwafa Bank",
    role: "Data Analyst",
    location: "Casablanca, Maroc",
    startDate: "2025",
    endDate: null,
    current: true,
    bullets: [
      "Mise en place de tableaux de bord pour suivre les indicateurs clés et améliorer la prise de décision",
      "Analyse et optimisation des processus métiers pour gagner en efficacité",
      "Traduction des besoins business en solutions concrètes basées sur la data",
    ],
  },
  {
    company: "Société Générale Maroc",
    role: "Data Engineer",
    location: "Casablanca, Maroc",
    startDate: "Janv. 2025",
    endDate: "Mars 2025",
    current: false,
    bullets: [
      "Automatisation de la collecte et du traitement des données pour fiabiliser les informations",
      "Organisation et structuration des données pour les rendre exploitables facilement",
      "Amélioration des flux de données afin de réduire les erreurs et les tâches manuelles",
    ],
  },
  {
    company: "BBC & Partners",
    role: "Ingénieur IA",
    location: "Casablanca, Maroc",
    startDate: "Mai 2024",
    endDate: "Août 2024",
    current: false,
    bullets: [
      "Développement d'un assistant virtuel pour automatiser les demandes utilisateurs",
      "Amélioration de l'expérience utilisateur grâce à l'interaction homme-assistant",
      "Intégration d'échanges en vocal ou texte",
    ],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Experience</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Mon parcours.
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.05]" />

          <div className="space-y-8">
            {experienceData.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className="pl-10 relative"
              >
                <div className="absolute left-[-3.5px] top-5 w-2 h-2 rounded-full bg-white/20 border border-white/10" />

                <div className="glass rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-base">{exp.role}</h3>
                      <p className="text-white/40 text-sm mt-0.5">
                        {exp.company} · {exp.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-white/25">
                        {exp.startDate}
                        {exp.endDate ? ` — ${exp.endDate}` : ""}
                      </span>
                      {exp.current && (
                        <span className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-2 py-0.5">
                          Actuel
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="text-white/20 mt-1.5 shrink-0">—</span>
                        <span className="text-white/40 text-sm leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
