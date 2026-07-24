"use client";

import { motion } from "framer-motion";
import type { ExperienceDoc } from "@/types/portfolio";

const FALLBACK: ExperienceDoc[] = [
  {
    $id: "1",
    company: "Attijariwafa Bank",
    role: "Data Analyst",
    location: "Casablanca, Maroc",
    startDate: "2025",
    current: true,
    description: "Tableaux de bord pour suivre les KPI et améliorer la prise de décision. Analyse et optimisation des processus métiers. Traduction des besoins business en solutions data.",
  },
  {
    $id: "2",
    company: "Société Générale Maroc",
    role: "Data Engineer",
    location: "Casablanca, Maroc",
    startDate: "Janv. 2025",
    endDate: "Mars 2025",
    description: "Automatisation de la collecte et du traitement des données. Organisation et structuration pour les rendre exploitables. Amélioration des flux pour réduire les erreurs.",
  },
  {
    $id: "3",
    company: "BBC & Partners",
    role: "Ingénieur IA",
    location: "Casablanca, Maroc",
    startDate: "Mai 2024",
    endDate: "Août 2024",
    description: "Développement d'un assistant virtuel pour automatiser les demandes. Amélioration de l'expérience via l'interaction homme-assistant. Intégration d'échanges vocal et texte.",
  },
];

interface Props { experience: ExperienceDoc[] }

export default function Experience({ experience }: Props) {
  const data = experience.length > 0 ? experience : FALLBACK;

  return (
    <section id="experience" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">04</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">Experience</span>
      </div>

      <h2 className="font-bold text-[#14141A] mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
        Mon parcours.
      </h2>

      <div className="space-y-3">
        {data.map((e, i) => (
          <motion.div
            key={e.$id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="glass rounded-2xl p-5 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="text-[#14141A] font-semibold text-sm">{e.role}</h3>
                  {e.current && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-black/45 border border-black/[0.09] rounded-full px-2 py-0.5">
                      Actuel
                    </span>
                  )}
                </div>
                <p className="text-black/50 text-xs">{e.company} · {e.location}</p>
              </div>
              <p className="text-black/35 text-xs sm:text-right shrink-0">
                {e.startDate}{e.endDate ? ` — ${e.endDate}` : e.current ? " — Présent" : ""}
              </p>
            </div>
            <p className="text-black/50 text-sm leading-relaxed border-t border-black/[0.07] pt-3">
              {e.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
