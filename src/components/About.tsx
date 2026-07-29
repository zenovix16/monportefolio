"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="relative bg-[var(--bg-alt)] slant-top slant-bottom py-24 md:py-36 px-5 md:px-10">
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
              01
            </span>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/35 mt-2">About</p>
          </div>

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-bold text-[#F4F5F7] mb-6 leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              La data,{" "}
              <span className="text-[var(--accent-light)]">c&apos;est mon terrain.</span>
            </h2>

            <p className="text-white/60 leading-relaxed text-sm mb-3">
              Ingénieur généraliste diplômé de l&apos;École Centrale Casablanca, spécialisé
              en Data & Transformation Digitale. J&apos;accompagne les entreprises dans la
              structuration de leurs données, l&apos;optimisation de leurs processus et la
              mise en place d&apos;outils de pilotage.
            </p>
            <p className="text-white/40 leading-relaxed text-sm mb-6">
              Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.
            </p>

            <div className="flex gap-2 mb-8 flex-wrap">
              {["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"].map((t) => (
                <span key={t} className="text-[11px] text-white/55 border border-white/[0.1] rounded-full px-3 py-1">
                  {t}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { n: "3+", label: "Années d'expérience" },
                { n: "3",  label: "Missions en entreprise" },
                { n: "2",  label: "Grandes écoles" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-xl px-4 py-4">
                  <span className="block text-2xl font-bold text-[var(--accent-light)] tabular-nums">{s.n}</span>
                  <span className="text-white/45 text-xs">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl px-5 py-4 mt-3">
              <p className="text-[10px] tracking-widest uppercase text-white/35 mb-3">Langues</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-[#F4F5F7] text-sm font-medium">Français</p>
                  <p className="text-white/40 text-xs mt-0.5">Niveau C1</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <p className="text-[#F4F5F7] text-sm font-medium">Anglais</p>
                  <p className="text-white/40 text-xs mt-0.5">Niveau B2</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
