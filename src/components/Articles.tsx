"use client";

import { motion } from "framer-motion";
import type { ArticleDoc } from "@/types/portfolio";
import SectionHeading from "./SectionHeading";
import ReadMore from "./ReadMore";

interface Props { articles: ArticleDoc[] }

export default function Articles({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <section id="articles" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
        <SectionHeading number="06" label="Articles" />
        <div className="glass rounded-2xl p-10 text-center text-black/40 text-sm">
          Aucun article publié pour le moment.
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
      <SectionHeading number="06" label="Publications" />

      <h2 className="font-bold text-[#14161A] mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
        Articles scientifiques.
      </h2>

      <div className="space-y-3">
        {articles.map((a, i) => (
          <motion.div
            key={a.$id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="glass rounded-2xl p-5 md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  {a.featured && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5">Featured</span>
                  )}
                  {a.publishedDate && <span className="text-black/40 text-xs">{a.publishedDate}</span>}
                </div>
                <h3 className="text-[#14161A] font-semibold text-sm mb-1 leading-snug">{a.title}</h3>
                {a.journal && <p className="text-black/55 text-xs italic mb-2">{a.journal}</p>}
                {a.authors && a.authors.length > 0 && (
                  <p className="text-black/45 text-xs mb-2">{a.authors.join(", ")}</p>
                )}
                <ReadMore text={a.abstract} lines={3} className="text-black/55 text-xs leading-relaxed" />
                {a.tags && a.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {a.tags.map((t) => (
                      <span key={t} className="text-[10px] text-black/45 border border-black/[0.08] rounded-full px-2.5 py-1">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {a.doi && (
                  <a href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap">
                    DOI ↗
                  </a>
                )}
                {a.pdfUrl && (
                  <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-black/55 hover:text-[var(--accent-light)] border border-black/[0.1] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap">
                    PDF ↓
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
