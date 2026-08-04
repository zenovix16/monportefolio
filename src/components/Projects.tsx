"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ProjectDoc } from "@/types/portfolio";
import SectionHeading from "./SectionHeading";
import SectionTitle from "./SectionTitle";
import DetailModal, { type DetailItem } from "./DetailModal";

const FALLBACK: ProjectDoc[] = [
  {
    $id: "1",
    title: "Tableaux de bord de pilotage",
    description: "Création d'outils de suivi pour piloter l'activité et visualiser les performances en temps réel. Automatisation du reporting pour réduire les tâches manuelles.",
    tags: ["Power BI", "Excel", "KPI", "Reporting"],
    featured: true,
  },
  {
    $id: "2",
    title: "Gestion & automatisation des données",
    description: "Pipelines pour collecter, traiter et organiser les données. Structuration des flux pour faciliter leur exploitation.",
    tags: ["PySpark", "Spark", "Airflow", "Minio", "Nessie"],
    featured: false,
  },
  {
    $id: "3",
    title: "Assistant virtuel IA",
    description: "Assistant pour automatiser les tâches et répondre aux utilisateurs. Intégration d'échanges vocal et texte.",
    tags: ["Python", "RASA", "NLP", "REST APIs"],
    featured: false,
  },
];

const ENDPOINT  = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

function previewUrl(fileId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${PROJECT_ID}&width=900&height=500&gravity=center&quality=80`;
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Card({ p, onOpen }: { p: ProjectDoc; onOpen: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      variants={item}
      className={`btn-ghost rounded-lg overflow-hidden shrink-0 snap-start w-[85%] sm:w-[65%] ${
        p.featured ? "lg:w-[440px] border-[var(--accent)]/40" : "lg:w-[360px]"
      }`}
    >
      <div className="relative w-full h-48 bg-black/[0.02] border-b border-black/[0.07] overflow-hidden">
        {p.imageId && !imgError ? (
          <>
            <Image
              src={previewUrl(p.imageId)}
              alt={p.title}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] tracking-widest uppercase text-black/[0.2]">image</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {p.featured && (
          <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-full px-2.5 py-1 mb-3">
            Projet phare
          </span>
        )}
        <h3 className="text-[#14161A] font-semibold text-base mb-1.5 leading-snug">{p.title}</h3>
        <p className="text-black/55 text-xs leading-relaxed mb-4 line-clamp-2">{p.description}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(p.tags ?? []).slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] text-black/45 border border-black/[0.08] rounded-full px-2.5 py-1">{t}</span>
            ))}
          </div>
          <button onClick={onOpen} className="link-underline text-[12px] font-medium text-[var(--accent-light)] shrink-0">
            Voir plus →
          </button>
        </div>
      </div>
    </motion.article>
  );
}

interface Props { projects: ProjectDoc[] }

export default function Projects({ projects }: Props) {
  const data = projects.length > 0 ? projects : FALLBACK;
  const [selected, setSelected] = useState<ProjectDoc | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const detail: DetailItem | null = selected ? {
    kind: "project",
    title: selected.title,
    description: selected.description,
    tags: selected.tags,
    imageUrl: selected.imageId ? previewUrl(selected.imageId) : null,
    githubUrl: selected.githubUrl,
    liveUrl: selected.liveUrl,
  } : null;

  return (
    <section id="projects" className="px-5 md:px-10 py-10 md:py-16 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <SectionHeading number="03" label="Projects" />
          <SectionTitle>Ce que j&apos;ai construit.</SectionTitle>
        </div>
        <div className="hidden sm:flex gap-2 mb-6 shrink-0">
          <button onClick={() => scroll(-1)} aria-label="Précédent" className="btn-ghost w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black transition-colors">←</button>
          <button onClick={() => scroll(1)} aria-label="Suivant" className="btn-ghost w-9 h-9 rounded-lg flex items-center justify-center text-black/50 hover:text-black transition-colors">→</button>
        </div>
      </div>

      <motion.div
        ref={scrollRef}
        onScroll={onScroll}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
      >
        {data.map((p) => <Card key={p.$id} p={p} onOpen={() => setSelected(p)} />)}
      </motion.div>

      {data.length > 1 && (
        <div className="h-0.5 bg-black/[0.08] rounded-full mt-4 max-w-[160px] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full"
            style={{ width: `${Math.max(18, progress * 100)}%`, transition: "width 0.1s linear" }}
          />
        </div>
      )}

      <DetailModal item={detail} onClose={() => setSelected(null)} />
    </section>
  );
}
