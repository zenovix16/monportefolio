"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "3+", label: "Ans d'expérience" },
  { value: "3", label: "Stages en entreprise" },
  { value: "2", label: "Grandes écoles" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">About</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            La data,
            <br />
            <span className="text-white/25">c&apos;est mon terrain.</span>
          </h2>
          <p className="text-white/50 leading-relaxed mb-5">
            Ingénieur généraliste diplômé de l&apos;École Centrale Casablanca, spécialisé en
            Data & Transformation Digitale. J&apos;accompagne les entreprises dans la
            structuration de leurs données, l&apos;optimisation de leurs processus et la
            mise en place d&apos;outils de pilotage (KPI, reporting).
          </p>
          <p className="text-white/35 leading-relaxed">
            Basé à Casablanca — actuellement Data Analyst chez Attijariwafa Bank.
            Mon objectif : améliorer la performance, réduire les tâches manuelles
            et faciliter la prise de décision.
          </p>

          <div className="flex gap-3 mt-8 flex-wrap">
            {["Python", "SQL", "Power BI", "NLP", "Airflow"].map((tech) => (
              <span
                key={tech}
                className="text-xs text-white/40 border border-white/[0.08] rounded-full px-3 py-1.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="space-y-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6 flex items-center gap-6">
              <p className="text-4xl font-bold text-white min-w-[72px]">{stat.value}</p>
              <p className="text-sm text-white/40 leading-snug">{stat.label}</p>
            </div>
          ))}

          <div className="glass rounded-2xl p-6">
            <p className="text-xs tracking-widest uppercase text-white/25 mb-3">Langues</p>
            <div className="flex gap-4">
              <div>
                <p className="text-white text-sm font-medium">Français</p>
                <p className="text-white/35 text-xs">Niveau C1</p>
              </div>
              <div className="w-px bg-white/[0.08]" />
              <div>
                <p className="text-white text-sm font-medium">Anglais</p>
                <p className="text-white/35 text-xs">Niveau B2</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
