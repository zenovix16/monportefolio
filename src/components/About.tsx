"use client";

export default function About() {
  return (
    <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">01</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">About</span>
      </div>

      <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 md:gap-16 items-start">
        <div>
          <h2 className="font-bold text-white mb-6 leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            La data,{" "}
            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.18)" }}>
              c'est mon terrain.
            </span>
          </h2>

          <p className="text-white/40 leading-relaxed text-sm mb-3">
            Ingénieur généraliste diplômé de l'École Centrale Casablanca, spécialisé
            en Data & Transformation Digitale. J'accompagne les entreprises dans la
            structuration de leurs données, l'optimisation de leurs processus et la
            mise en place d'outils de pilotage.
          </p>
          <p className="text-white/25 leading-relaxed text-sm">
            Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.
          </p>

          <div className="flex gap-2 mt-6 flex-wrap">
            {["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"].map((t) => (
              <span key={t} className="text-[11px] text-white/32 border border-white/[0.07] rounded-full px-3 py-1">
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
            <div key={s.label} className="glass rounded-xl px-5 py-4 flex items-center gap-5">
              <span className="text-2xl font-bold text-white tabular-nums">{s.n}</span>
              <span className="text-white/32 text-sm">{s.label}</span>
            </div>
          ))}

          <div className="glass rounded-xl px-5 py-4">
            <p className="text-[10px] tracking-widest uppercase text-white/18 mb-3">Langues</p>
            <div className="flex gap-6">
              <div>
                <p className="text-white text-sm font-medium">Français</p>
                <p className="text-white/28 text-xs mt-0.5">Niveau C1</p>
              </div>
              <div className="w-px bg-white/[0.06]" />
              <div>
                <p className="text-white text-sm font-medium">Anglais</p>
                <p className="text-white/28 text-xs mt-0.5">Niveau B2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
