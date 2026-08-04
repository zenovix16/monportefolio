"use client";

import { motion } from "framer-motion";
import type { ExperienceDoc } from "@/types/portfolio";
import SectionTitle from "./SectionTitle";

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

interface Props { experience: ExperienceDoc[] }

export default function Experience({ experience }: Props) {
  const data = experience.length > 0 ? experience : FALLBACK;

  return (
    <section id="experience" className="relative bg-[var(--bg-alt)] slant-top slant-bottom py-20 md:py-28 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          {/* Colonne sticky */}
          <div className="lg:sticky lg:top-24 self-start">
            <span
              className="block font-bold leading-none select-none"
              style={{
                fontSize: "clamp(5.5rem, 12vw, 10rem)",
                color: "transparent",
                WebkitTextStroke: "1.5px var(--accent-light)",
              }}
            >
              04
            </span>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mt-2 mb-6">Experience</p>
            <div className="hidden lg:block">
              <SectionTitle className="!text-3xl">Mon parcours.</SectionTitle>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="lg:hidden">
              <SectionTitle>Mon parcours.</SectionTitle>
            </div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={container}
              className="divide-y divide-black/[0.08]"
            >
              {data.map((e) => (
                <motion.div key={e.$id} variants={item} className="py-5 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="text-[#14161A] font-semibold text-base">{e.role}</h3>
                        {e.current && (
                          <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5">
                            Actuel
                          </span>
                        )}
                      </div>
                      <p className="text-black/55 text-sm">{e.company} · {e.location}</p>
                    </div>
                    <p className="text-black/35 text-xs sm:text-right shrink-0">
                      {e.startDate}{e.endDate ? ` — ${e.endDate}` : e.current ? " — Présent" : ""}
                    </p>
                  </div>
                  <p className="text-black/55 text-sm leading-relaxed">
                    {e.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
