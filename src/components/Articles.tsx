"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite";
import { Query } from "appwrite";

interface Article {
  $id: string;
  title: string;
  abstract: string;
  journal?: string;
  authors?: string[];
  publishedDate?: string;
  doi?: string;
  pdfUrl?: string;
  tags?: string[];
  featured?: boolean;
}

export default function Articles() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    databases
      .listDocuments(DB_ID, COLLECTIONS.ARTICLES, [Query.orderDesc("$createdAt"), Query.limit(10)])
      .then((res) => {
        setArticles(res.documents as unknown as Article[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section id="articles" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Publications</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Articles scientifiques.
          </h2>
        </motion.div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="glass rounded-2xl h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, i) => (
              <motion.div
                key={article.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 group"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {article.featured && (
                        <span className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-2.5 py-0.5">
                          Featured
                        </span>
                      )}
                      {article.publishedDate && (
                        <span className="text-xs text-white/25">{article.publishedDate}</span>
                      )}
                    </div>

                    <h3 className="text-white font-semibold text-base mb-1 leading-snug">
                      {article.title}
                    </h3>

                    {article.journal && (
                      <p className="text-white/40 text-xs mb-3 italic">{article.journal}</p>
                    )}

                    {article.authors && article.authors.length > 0 && (
                      <p className="text-white/30 text-xs mb-3">{article.authors.join(", ")}</p>
                    )}

                    <p className="text-white/40 text-sm leading-relaxed line-clamp-3">
                      {article.abstract}
                    </p>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map((t) => (
                          <span key={t} className="text-[11px] text-white/25 border border-white/[0.07] rounded-full px-2.5 py-1">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {article.doi && (
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/30 hover:text-white border border-white/[0.08] rounded-lg px-3 py-2 transition-colors whitespace-nowrap"
                      >
                        DOI →
                      </a>
                    )}
                    {article.pdfUrl && (
                      <a
                        href={article.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/30 hover:text-white border border-white/[0.08] rounded-lg px-3 py-2 transition-colors whitespace-nowrap"
                      >
                        PDF ↓
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
