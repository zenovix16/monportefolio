"use client";

import { motion } from "framer-motion";
import type { ArticleDoc } from "@/types/portfolio";

interface Props { articles: ArticleDoc[] }

export default function Articles({ articles }: Props) {
  if (articles.length === 0) {
    return (
      <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">07</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Articles</span>
        </div>
        <div className="glass rounded-2xl p-10 text-center text-white/20 text-sm">
          Aucun article publié pour le moment.
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">07</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Publications</span>
      </div>

      <h2 className="font-bold text-white mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
        Articles scientifiques.
      </h2>

      <div className="space-y-3">
        {articles.map((a, i) => (
          <motion.div
            key={a.$id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="glass rounded-2xl p-5 md:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  {a.featured && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-white/25 border border-white/[0.07] rounded-full px-2 py-0.5">Featured</span>
                  )}
                  {a.publishedDate && <span className="text-white/20 text-xs">{a.publishedDate}</span>}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{a.title}</h3>
                {a.journal && <p className="text-white/32 text-xs italic mb-2">{a.journal}</p>}
                {a.authors && a.authors.length > 0 && (
                  <p className="text-white/25 text-xs mb-2">{a.authors.join(", ")}</p>
                )}
                <p className="text-white/35 text-xs leading-relaxed line-clamp-3">{a.abstract}</p>
                {a.tags && a.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {a.tags.map((t) => (
                      <span key={t} className="text-[10px] text-white/22 border border-white/[0.05] rounded-full px-2.5 py-1">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {a.doi && (
                  <a href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-white/28 hover:text-white border border-white/[0.07] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap">
                    DOI ↗
                  </a>
                )}
                {a.pdfUrl && (
                  <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-white/28 hover:text-white border border-white/[0.07] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap">
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
