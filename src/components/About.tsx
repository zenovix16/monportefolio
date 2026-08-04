"use client";

import { motion } from "framer-motion";
import type { AboutBlockDoc } from "@/types/portfolio";
import ReadMore from "./ReadMore";
import SectionTitle from "./SectionTitle";

const FALLBACK: AboutBlockDoc[] = [
  { $id: "f1", type: "text", body: "Ingénieur généraliste diplômé de l'École Centrale Casablanca, spécialisé en Data & Transformation Digitale. J'accompagne les entreprises dans la structuration de leurs données, l'optimisation de leurs processus et la mise en place d'outils de pilotage.", order: 0 },
  { $id: "f2", type: "text", body: "Actuellement Data Analyst chez Attijariwafa Bank — Casablanca.", order: 1 },
  { $id: "f3", type: "tags", items: ["Python", "SQL", "Power BI", "NLP", "Airflow", "n8n"], order: 2 },
  { $id: "f4", type: "stat", value: "3+", title: "Années d'expérience", order: 3 },
  { $id: "f5", type: "stat", value: "3", title: "Missions en entreprise", order: 4 },
  { $id: "f6", type: "stat", value: "2", title: "Grandes écoles", order: 5 },
  { $id: "f7", type: "text", title: "Langues", body: "Français — Niveau C1 · Anglais — Niveau B2", order: 6 },
];

type Group =
  | { kind: "stat"; blocks: AboutBlockDoc[] }
  | { kind: "text" | "tags" | "quote"; block: AboutBlockDoc };

function groupBlocks(blocks: AboutBlockDoc[]): Group[] {
  const groups: Group[] = [];
  for (const b of blocks) {
    if (b.type === "stat") {
      const last = groups[groups.length - 1];
      if (last && last.kind === "stat") last.blocks.push(b);
      else groups.push({ kind: "stat", blocks: [b] });
    } else {
      groups.push({ kind: b.type, block: b });
    }
  }
  return groups;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

interface Props { blocks: AboutBlockDoc[] }

export default function About({ blocks }: Props) {
  const data = blocks.length > 0 ? blocks : FALLBACK;
  const groups = groupBlocks(data);

  return (
    <section id="about" className="relative bg-[var(--bg-alt)] slant-top slant-bottom py-16 md:py-24 px-5 md:px-10">
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
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mt-2">About</p>
          </div>

          {/* Contenu */}
          <div>
            <SectionTitle>
              La data,{" "}
              <span className="text-[var(--accent-light)]">c&apos;est mon terrain.</span>
            </SectionTitle>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={container}
              className="space-y-5"
            >
              {groups.map((g, i) => {
                if (g.kind === "stat") {
                  return (
                    <motion.div key={`stat-${i}`} variants={fadeItem} className="grid grid-cols-3 gap-6 border-t border-black/[0.08] pt-4">
                      {g.blocks.map((s) => (
                        <div key={s.$id}>
                          <span className="block text-3xl font-bold text-[var(--accent-light)] tabular-nums">{s.value}</span>
                          <span className="text-black/50 text-xs">{s.title}</span>
                        </div>
                      ))}
                    </motion.div>
                  );
                }

                if (g.kind === "tags") {
                  return (
                    <motion.div key={g.block.$id} variants={fadeItem} className="flex gap-2 flex-wrap">
                      {(g.block.items ?? []).map((t) => (
                        <span key={t} className="text-[11px] text-black/60 border border-black/[0.1] rounded-full px-3 py-1">
                          {t}
                        </span>
                      ))}
                    </motion.div>
                  );
                }

                if (g.kind === "quote") {
                  return (
                    <motion.blockquote
                      key={g.block.$id}
                      variants={fadeItem}
                      className="border-l-2 border-[var(--accent)] pl-4 text-lg md:text-xl font-semibold text-[var(--accent-light)] leading-snug"
                    >
                      {g.block.body}
                    </motion.blockquote>
                  );
                }

                // text
                const block = g.block;
                if (block.title) {
                  return (
                    <motion.div key={block.$id} variants={fadeItem} className="border-t border-black/[0.08] pt-4">
                      <p className="text-[10px] tracking-widest uppercase text-black/40 mb-2">{block.title}</p>
                      {block.body && <ReadMore text={block.body} lines={3} className="text-black/60 text-sm leading-relaxed" />}
                    </motion.div>
                  );
                }
                return (
                  <motion.div key={block.$id} variants={fadeItem}>
                    {block.body && <ReadMore text={block.body} lines={4} className="text-black/60 leading-relaxed text-base" />}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
