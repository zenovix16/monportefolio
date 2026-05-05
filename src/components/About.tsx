"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">01</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">About</span>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="font-bold leading-tight mb-8 text-white"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
              La data,<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
                c'est mon terrain.
              </span>
            </h2>

            <p className="text-white/45 leading-relaxed text-sm mb-4">
              Ingénieur généraliste diplômé de l'École Centrale Casablanca,
              spécialisé en Data & Transformation Digitale. J'accompagne les
              entreprises dans la structuration de leurs données, l'optimisation
              de leurs processus et la mise en place d'outils de pilotage.
            </p>
            <p className="text-white/30 leading-relaxed text-sm">
              Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.
            </p>

            <div className="flex gap-2 mt-8 flex-wrap">
              {["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"].map((t) => (
                <span key={t} className="text-[11px] text-white/35 border border-white/[0.07] rounded-full px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-3"
          >
            {[
              { n: "3+", label: "Années d'expérience" },
              { n: "3", label: "Missions en entreprise" },
              { n: "2", label: "Grandes écoles" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl px-6 py-5 flex items-center gap-6">
                <span className="text-3xl font-bold text-white tabular-nums">{s.n}</span>
                <span className="text-white/35 text-sm">{s.label}</span>
              </div>
            ))}

            <div className="glass rounded-2xl px-6 py-5">
              <p className="text-[10px] tracking-widest uppercase text-white/20 mb-3">Langues</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-white text-sm font-medium">Français</p>
                  <p className="text-white/30 text-xs mt-0.5">Attestation C1</p>
                </div>
                <div className="w-px bg-white/[0.06]" />
                <div>
                  <p className="text-white text-sm font-medium">Anglais</p>
                  <p className="text-white/30 text-xs mt-0.5">Attestation B2</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
