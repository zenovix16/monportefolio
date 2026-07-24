"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">01</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">About</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 items-start"
      >
        <div>
          <h2 className="font-bold text-[#14141A] mb-6 leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            La data,{" "}
            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(0,0,0,0.2)" }}>
              c'est mon terrain.
            </span>
          </h2>

          <p className="text-black/60 leading-relaxed text-sm mb-3">
            Ingénieur généraliste diplômé de l'École Centrale Casablanca, spécialisé
            en Data & Transformation Digitale. J'accompagne les entreprises dans la
            structuration de leurs données, l'optimisation de leurs processus et la
            mise en place d'outils de pilotage.
          </p>
          <p className="text-black/45 leading-relaxed text-sm">
            Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.
          </p>

          <div className="flex gap-2 mt-6 flex-wrap">
            {["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"].map((t) => (
              <span key={t} className="text-[11px] text-black/50 border border-black/[0.08] rounded-full px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[
            { n: "3+", label: "Années d'expérience" },
            { n: "3",  label: "Missions en entreprise" },
            { n: "2",  label: "Grandes écoles" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl px-5 py-4 flex items-center gap-5 hover:border-black/20 transition-colors">
              <span className="text-2xl font-bold text-[#14141A] tabular-nums">{s.n}</span>
              <span className="text-black/50 text-sm">{s.label}</span>
            </div>
          ))}

          <div className="glass rounded-xl px-5 py-4 hover:border-black/20 transition-colors">
            <p className="text-[10px] tracking-widest uppercase text-black/35 mb-3">Langues</p>
            <div className="flex gap-6">
              <div>
                <p className="text-[#14141A] text-sm font-medium">Français</p>
                <p className="text-black/40 text-xs mt-0.5">Niveau C1</p>
              </div>
              <div className="w-px bg-black/[0.08]" />
              <div>
                <p className="text-[#14141A] text-sm font-medium">Anglais</p>
                <p className="text-black/40 text-xs mt-0.5">Niveau B2</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
