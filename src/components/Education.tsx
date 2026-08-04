"use client";

import { motion } from "framer-motion";
import type { EducationDoc } from "@/types/portfolio";
import SectionHeading from "./SectionHeading";
import SectionTitle from "./SectionTitle";

const FALLBACK: EducationDoc[] = [
  {
    $id: "f1",
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
    $id: "f2",
    school: "École Polytechnique de Ouagadougou",
    degree: "CPGE",
    speciality: "Génie informatique et télécommunications",
    location: "Ouagadougou, Burkina Faso",
    period: "2019 — 2022",
    highlights: [],
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

interface Props { education: EducationDoc[] }

export default function Education({ education }: Props) {
  const data = education.length > 0 ? education : FALLBACK;

  return (
    <section id="education" className="px-5 md:px-10 py-10 md:py-16 max-w-6xl mx-auto">
      <SectionHeading number="05" label="Formation" />

      <SectionTitle>Parcours académique.</SectionTitle>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
        className="divide-y divide-black/[0.08]"
      >
        {data.map((e) => (
          <motion.div key={e.$id} variants={item} className="py-5 first:pt-0">
            <div className="mono flex justify-between text-[10px] tracking-widest uppercase text-black/40 mb-2">
              <span>{e.period}</span>
              <span className="text-right">{e.location}</span>
            </div>
            <h3 className="text-[#14161A] font-bold text-lg mb-0.5">{e.school}</h3>
            <p className="text-black/60 text-sm font-medium mb-0.5">{e.degree}</p>
            {e.speciality && <p className="text-[var(--accent-light)] text-sm mb-3">{e.speciality}</p>}
            {e.highlights && e.highlights.length > 0 && (
              <ul className="space-y-1.5">
                {e.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2.5 text-black/50 text-xs leading-relaxed">
                    <span className="text-black/30 mt-0.5 shrink-0">—</span>{h}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
