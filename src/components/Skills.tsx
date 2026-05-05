"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    label: "Data & Analyse",
    skills: [
      { name: "Python", level: 88 },
      { name: "SQL", level: 82 },
      { name: "Power BI", level: 85 },
      { name: "Excel", level: 80 },
      { name: "KPI & Reporting", level: 88 },
    ],
  },
  {
    label: "IA & NLP",
    skills: [
      { name: "NLP", level: 80 },
      { name: "Deep Learning", level: 73 },
      { name: "RASA", level: 70 },
      { name: "REST APIs", level: 82 },
    ],
  },
  {
    label: "Data Engineering",
    skills: [
      { name: "PySpark / Spark", level: 75 },
      { name: "Apache Airflow", level: 72 },
      { name: "Minio", level: 68 },
      { name: "Nessie", level: 68 },
    ],
  },
  {
    label: "Automatisation",
    skills: [
      { name: "n8n", level: 75 },
      { name: "Processus", level: 82 },
      { name: "Transformation digitale", level: 85 },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  let idx = 0;

  return (
    <section id="skills" ref={ref} className="py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">02</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Skills</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-bold text-white mb-12"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          Ce que je maîtrise.
        </motion.h2>

        {/* Mobile: scroll horizontal */}
        <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-5 md:mx-0 px-5 md:px-0 snap-x snap-mandatory md:snap-none">
          {categories.map((cat) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="glass rounded-2xl p-6 min-w-[78vw] md:min-w-0 snap-start"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-5">
                {cat.label}
              </p>
              <div className="space-y-4">
                {cat.skills.map((s) => {
                  const delay = 0.25 + idx++ * 0.035;
                  return (
                    <div key={s.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-white/70 text-sm">{s.name}</span>
                        <span className="text-white/20 text-xs tabular-nums">{s.level}%</span>
                      </div>
                      <div className="h-px bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${s.level}%` } : {}}
                          transition={{ duration: 1, delay, ease: "easeOut" }}
                          className="h-full bg-white/20 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
