"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ProjectDoc } from "@/types/portfolio";

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

function Card({ p, i }: { p: ProjectDoc; i: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className={`glass rounded-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300 ${
        p.featured ? "md:col-span-2" : ""
      }`}
    >
      <div className={`relative w-full ${p.featured ? "h-48 md:h-56" : "h-40"} bg-black/[0.02] border-b border-black/[0.06] overflow-hidden`}>
        {p.imageId && !imgError ? (
          <>
            <Image
              src={previewUrl(p.imageId)}
              alt={p.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] tracking-widest uppercase text-black/[0.15]">image</span>
          </div>
        )}
      </div>

      <div className="p-5">
        {p.featured && (
          <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-black/40 border border-black/[0.08] rounded-full px-2.5 py-1 mb-3">
            Projet phare
          </span>
        )}
        <h3 className="text-[#14141A] font-semibold text-sm mb-1.5 leading-snug">{p.title}</h3>
        <p className="text-black/50 text-xs leading-relaxed mb-4">{p.description}</p>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {(p.tags ?? []).map((t) => (
              <span key={t} className="text-[10px] text-black/40 border border-black/[0.07] rounded-full px-2.5 py-1">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 shrink-0">
            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-black/40 hover:text-black transition-colors">GitHub ↗</a>}
            {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noopener noreferrer" className="text-[11px] text-black/40 hover:text-black transition-colors">Live ↗</a>}
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
    <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">03</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/35">Projects</span>
      </div>

      <h2 className="font-bold text-[#14141A] mb-8" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
        Ce que j&apos;ai construit.
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((p, i) => <Card key={p.$id} p={p} i={i} />)}
      </div>
    </section>
  );
}
