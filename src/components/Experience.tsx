"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ExperienceDoc } from "@/types/portfolio";
import SectionTitle from "./SectionTitle";
import DetailModal, { type DetailItem } from "./DetailModal";

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

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function dateRange(e: ExperienceDoc) {
  return `${e.startDate}${e.endDate ? ` — ${e.endDate}` : e.current ? " — Présent" : ""}`;
}

interface Props { experience: ExperienceDoc[] }

export default function Experience({ experience }: Props) {
  const data = experience.length > 0 ? experience : FALLBACK;
  const [selected, setSelected] = useState<ExperienceDoc | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const detail: DetailItem | null = selected ? {
    kind: "experience",
    role: selected.role,
    company: selected.company,
    location: selected.location,
    dateRange: dateRange(selected),
    current: selected.current,
    description: selected.description,
  } : null;

  return (
    <section id="experience" className="relative bg-[var(--bg-alt)] border-y border-black/[0.08] py-16 md:py-24 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-16 items-start">
          {/* Colonne sticky */}
          <div className="lg:sticky lg:top-24 self-start">
            <span className="mono block text-sm text-[var(--accent-light)] mb-1">04</span>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-6">Experience</p>
            <div className="hidden lg:flex items-center gap-3">
              <SectionTitle className="!text-3xl" noMargin>Mon parcours.</SectionTitle>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => scroll(-1)} aria-label="Précédent" className="btn-ghost w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black transition-colors">←</button>
                <button onClick={() => scroll(1)} aria-label="Suivant" className="btn-ghost w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black transition-colors">→</button>
              </div>
            </div>
          </div>

          {/* Carrousel */}
          <div>
            <div className="lg:hidden">
              <SectionTitle>Mon parcours.</SectionTitle>
            </div>

            <motion.div
              ref={scrollRef}
              onScroll={onScroll}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
            >
              {data.map((e) => (
                <motion.div
                  key={e.$id}
                  variants={item}
                  className="btn-ghost rounded-lg p-5 shrink-0 snap-start w-[80%] sm:w-[55%] lg:w-[320px]"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="text-[#14161A] font-semibold text-base">{e.role}</h3>
                    {e.current && (
                      <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5">
                        Actuel
                      </span>
                    )}
                  </div>
                  <p className="text-black/55 text-sm mb-1">{e.company} · {e.location}</p>
                  <p className="mono text-black/35 text-xs mb-3">{dateRange(e)}</p>
                  <p className="text-black/55 text-sm leading-relaxed line-clamp-3 mb-3">
                    {e.description}
                  </p>
                  <button onClick={() => setSelected(e)} className="link-underline text-[12px] font-medium text-[var(--accent-light)]">
                    Voir plus →
                  </button>
                </motion.div>
              ))}
            </motion.div>

            {data.length > 1 && (
              <div className="h-0.5 bg-black/[0.08] rounded-full mt-4 max-w-[160px] overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${Math.max(18, progress * 100)}%`, transition: "width 0.1s linear" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailModal item={detail} onClose={() => setSelected(null)} />
    </section>
  );
}
