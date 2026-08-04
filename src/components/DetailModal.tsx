"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ProjectDetail {
  kind: "project";
  title: string;
  description: string;
  tags?: string[];
  imageUrl?: string | null;
  githubUrl?: string;
  liveUrl?: string;
}

interface ExperienceDetail {
  kind: "experience";
  role: string;
  company: string;
  location?: string;
  dateRange: string;
  current?: boolean;
  description: string;
}

export type DetailItem = ProjectDetail | ExperienceDetail;

interface Props {
  item: DetailItem | null;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = item ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-lg bg-[#F1F2F4] border border-black/[0.08] shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center border border-black/[0.1] text-black/50 hover:text-black hover:border-black/25 transition-colors bg-[#F1F2F4] z-10"
            >
              ✕
            </button>

            {item.kind === "project" ? (
              <>
                {item.imageUrl && (
                  <div className="relative w-full h-56 md:h-64 bg-black/[0.03] border-b border-black/[0.08]">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-[#14161A] mb-3 pr-8">{item.title}</h3>
                  <p className="text-black/60 text-sm leading-relaxed mb-5 whitespace-pre-line">{item.description}</p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[11px] text-black/50 border border-black/[0.1] rounded-full px-3 py-1">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {item.githubUrl && (
                      <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-[var(--accent-light)] font-medium">GitHub ↗</a>
                    )}
                    {item.liveUrl && (
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-[var(--accent-light)] font-medium">Voir le projet ↗</a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 flex-wrap mb-1 pr-8">
                  <h3 className="text-xl md:text-2xl font-bold text-[#14161A]">{item.role}</h3>
                  {item.current && (
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2 py-0.5">Actuel</span>
                  )}
                </div>
                <p className="text-black/55 text-sm mb-1">{item.company}{item.location ? ` · ${item.location}` : ""}</p>
                <p className="mono text-black/35 text-xs mb-5">{item.dateRange}</p>
                <p className="text-black/60 text-sm leading-relaxed whitespace-pre-line">{item.description}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
