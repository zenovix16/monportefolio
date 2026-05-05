"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  tags: string[];
  imageId?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

function previewUrl(fileId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${PROJECT_ID}&width=900&height=500&gravity=center&quality=80`;
}

const data: Project[] = [
  {
    title: "Tableaux de bord de pilotage",
    description: "Création d'outils de suivi pour piloter l'activité et visualiser les performances en temps réel. Automatisation du reporting pour réduire les tâches manuelles.",
    tags: ["Power BI", "Excel", "KPI", "Reporting"],
    featured: true,
  },
  {
    title: "Gestion & automatisation des données",
    description: "Mise en place de pipelines pour collecter, traiter et organiser les données. Structuration des flux pour faciliter leur exploitation en entreprise.",
    tags: ["PySpark", "Spark", "Airflow", "Minio", "Nessie"],
    featured: false,
  },
  {
    title: "Assistant virtuel IA",
    description: "Conception d'un assistant permettant d'automatiser les tâches et répondre aux utilisateurs. Intégration d'échanges vocal et texte.",
    tags: ["Python", "RASA", "NLP", "REST APIs"],
    featured: false,
  },
];

function Card({ p, i, inView }: { p: Project; i: number; inView: boolean }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      className={`glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.012] ${
        p.featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Image */}
      <div className={`relative w-full ${p.featured ? "h-52 md:h-64" : "h-44"} overflow-hidden bg-white/[0.015] border-b border-white/[0.04]`}>
        {p.imageId && !imgError ? (
          <>
            <Image
              src={previewUrl(p.imageId)}
              alt={p.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/8 text-[10px] tracking-widest uppercase">
              {p.featured ? "Image du projet" : "—"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {p.featured && (
          <span className="inline-block text-[9px] tracking-[0.3em] uppercase text-white/25 border border-white/[0.07] rounded-full px-2.5 py-1 mb-4">
            Projet phare
          </span>
        )}
        <h3 className="text-white font-semibold mb-2 leading-snug">{p.title}</h3>
        <p className="text-white/38 text-sm leading-relaxed mb-5">{p.description}</p>

        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span key={t} className="text-[11px] text-white/28 border border-white/[0.06] rounded-full px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-3 shrink-0">
            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/28 hover:text-white transition-colors">GitHub ↗</a>}
            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white/28 hover:text-white transition-colors">Live ↗</a>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={ref} className="py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">03</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Projects</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-bold text-white mb-12"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}
        >
          Ce que j&apos;ai construit.
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((p, i) => <Card key={p.title} p={p} i={i} inView={inView} />)}
        </div>
      </div>
    </section>
  );
}
