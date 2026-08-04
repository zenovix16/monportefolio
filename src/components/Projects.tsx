"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ProjectDoc } from "@/types/portfolio";
import SectionHeading from "./SectionHeading";
import SectionTitle from "./SectionTitle";
import ReadMore from "./ReadMore";

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

function Card({ p }: { p: ProjectDoc }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      variants={item}
      className={`btn-ghost rounded-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300 ${
        p.featured ? "md:col-span-2 border-[var(--accent)]/40" : ""
      }`}
    >
      <div className={`relative w-full ${p.featured ? "h-48 md:h-56" : "h-40"} bg-black/[0.02] border-b border-black/[0.07] overflow-hidden`}>
        {p.imageId && !imgError ? (
          <>
            <Image
              src={previewUrl(p.imageId)}
              alt={p.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
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
        <div className="mb-4">
          <ReadMore text={p.description} lines={3} className="text-black/55 text-xs leading-relaxed" />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(p.tags ?? []).map((t) => (
              <span key={t} className="text-[10px] text-black/45 border border-black/[0.08] rounded-full px-2.5 py-1">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 shrink-0">
            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-[11px] text-black/45 hover:text-[var(--accent-light)] transition-colors">GitHub ↗</a>}
            {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noopener noreferrer" className="link-underline text-[11px] text-black/45 hover:text-[var(--accent-light)] transition-colors">Live ↗</a>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

interface Props { projects: ProjectDoc[] }

export default function Projects({ projects }: Props) {
  const data = projects.length > 0 ? projects : FALLBACK;

  return (
    <section id="projects" className="px-5 md:px-10 py-14 md:py-20 max-w-6xl mx-auto">
      <SectionHeading number="03" label="Projects" />

      <SectionTitle>Ce que j&apos;ai construit.</SectionTitle>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {data.map((p) => <Card key={p.$id} p={p} />)}
      </motion.div>
    </section>
  );
}
