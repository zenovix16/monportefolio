"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    name: "Data & Analyse",
    skills: [
      { name: "Python", level: 88 },
      { name: "SQL", level: 82 },
      { name: "Power BI", level: 85 },
      { name: "Excel", level: 80 },
      { name: "KPI & Reporting", level: 88 },
    ],
  },
  {
    name: "IA & NLP",
    skills: [
      { name: "NLP", level: 80 },
      { name: "Deep Learning", level: 73 },
      { name: "RASA", level: 70 },
      { name: "REST APIs", level: 82 },
    ],
  },
  {
    name: "Data Engineering",
    skills: [
      { name: "PySpark / Spark", level: 75 },
      { name: "Apache Airflow", level: 72 },
      { name: "Minio", level: 68 },
      { name: "Nessie", level: 68 },
    ],
  },
  {
    name: "Automatisation",
    skills: [
      { name: "n8n", level: 75 },
      { name: "Automatisation processus", level: 82 },
      { name: "Transformation digitale", level: 85 },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  let globalIndex = 0;

  return (
    <section id="skills" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Skills</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ce que je maîtrise.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <p className="text-xs tracking-[0.25em] uppercase text-white/30 mb-5">
                {cat.name}
              </p>
              <div className="space-y-4">
                {cat.skills.map((skill) => {
                  const delay = 0.3 + globalIndex++ * 0.04;
                  return (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-white/80 text-sm">{skill.name}</span>
                        <span className="text-white/25 text-xs">{skill.level}%</span>
                      </div>
                      <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 0.9, delay, ease: "easeOut" }}
                          className="h-full bg-white/25 rounded-full"
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
