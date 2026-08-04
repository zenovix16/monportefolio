"use client";

import { motion } from "framer-motion";
import type { SkillDoc } from "@/types/portfolio";
import SectionHeading from "./SectionHeading";
import SectionTitle from "./SectionTitle";

// Données de secours si Appwrite est vide
const FALLBACK: SkillDoc[] = [
  { $id: "1", name: "Python",               category: "Data & Analyse",    level: 88 },
  { $id: "2", name: "SQL",                  category: "Data & Analyse",    level: 82 },
  { $id: "3", name: "Power BI",             category: "Data & Analyse",    level: 85 },
  { $id: "4", name: "Excel",                category: "Data & Analyse",    level: 80 },
  { $id: "5", name: "KPI & Reporting",      category: "Data & Analyse",    level: 88 },
  { $id: "6", name: "NLP",                  category: "IA & NLP",          level: 80 },
  { $id: "7", name: "Deep Learning",        category: "IA & NLP",          level: 73 },
  { $id: "8", name: "RASA",                 category: "IA & NLP",          level: 70 },
  { $id: "9", name: "REST APIs",            category: "IA & NLP",          level: 82 },
  { $id:"10", name: "PySpark / Spark",      category: "Data Engineering",  level: 75 },
  { $id:"11", name: "Apache Airflow",       category: "Data Engineering",  level: 72 },
  { $id:"12", name: "Minio",               category: "Data Engineering",  level: 68 },
  { $id:"13", name: "Nessie",              category: "Data Engineering",  level: 68 },
  { $id:"14", name: "n8n",                 category: "Automatisation",    level: 75 },
  { $id:"15", name: "Transformation digitale", category: "Automatisation",level: 85 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

interface Props { skills: SkillDoc[] }

export default function Skills({ skills }: Props) {
  const data = skills.length > 0 ? skills : FALLBACK;

  const byCategory = data.reduce<Record<string, SkillDoc[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <section id="skills" className="px-5 md:px-10 py-10 md:py-16 max-w-6xl mx-auto">
      <SectionHeading number="02" label="Skills" />

      <SectionTitle>Ce que je maîtrise.</SectionTitle>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5"
        style={{ gridAutoFlow: "dense" }}
      >
        {Object.entries(byCategory).map(([cat, catSkills], catIdx) => (
          <motion.div
            key={cat}
            variants={item}
            className={`border-t border-black/[0.08] pt-4 ${catIdx === 0 ? "lg:col-span-2" : ""}`}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--accent-light)] mb-4">{cat}</p>
            <div className="space-y-3.5">
              {catSkills.map((s) => {
                const delay = 0.05 + globalIdx++ * 0.03;
                return (
                  <div key={s.$id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-black/80 text-sm">{s.name}</span>
                      <span className="text-black/35 text-xs tabular-nums">{s.level ?? 80}%</span>
                    </div>
                    <div className="h-px bg-black/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level ?? 80}%` }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.9, delay, ease: "easeOut" }}
                        className="h-full bg-[var(--accent)] rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
