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

function getPreviewUrl(fileId: string) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${PROJECT_ID}&width=800&height=400&gravity=center&quality=80`;
}

const projectsData: Project[] = [
  {
    title: "Tableaux de bord de pilotage",
    description:
      "Création d'outils de suivi pour piloter l'activité et visualiser les performances. Automatisation du reporting pour gagner du temps et améliorer la prise de décision.",
    tags: ["Power BI", "Excel", "KPI", "Reporting"],
    featured: true,
  },
  {
    title: "Gestion & automatisation des données",
    description:
      "Mise en place de systèmes pour collecter, traiter et organiser les données. Structuration des informations pour faciliter leur utilisation dans l'entreprise.",
    tags: ["PySpark", "Spark", "Airflow", "Minio", "Nessie"],
    featured: false,
  },
  {
    title: "Assistant virtuel IA",
    description:
      "Conception d'un outil permettant d'automatiser certaines tâches et répondre aux utilisateurs. Intégration d'échanges en vocal et en texte.",
    tags: ["Python", "RASA", "NLP", "REST APIs"],
    featured: false,
  },
];

function ProjectCard({ project, index, inView }: { project: Project; index: number; inView: boolean }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={`glass rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.015] hover:border-white/[0.14] ${
        project.featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Image zone */}
      {project.imageId && !imgError ? (
        <div className={`relative w-full ${project.featured ? "h-56" : "h-44"} overflow-hidden`}>
          <Image
            src={getPreviewUrl(project.imageId)}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div
          className={`w-full ${project.featured ? "h-56" : "h-44"} bg-white/[0.02] flex items-center justify-center border-b border-white/[0.04]`}
        >
          <span className="text-white/10 text-xs tracking-widest uppercase">Image à venir</span>
        </div>
      )}

      <div className="p-6">
        {project.featured && (
          <span className="inline-block text-[10px] tracking-widest uppercase text-white/30 border border-white/10 rounded-full px-3 py-1 mb-4">
            Featured
          </span>
        )}
        <h3 className="text-base font-semibold text-white mb-2">{project.title}</h3>
        <p className="text-white/40 text-sm leading-relaxed mb-5">{project.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-white/30 border border-white/[0.07] rounded-full px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 shrink-0 ml-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                GitHub →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Live →
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Projects</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ce que j&apos;ai construit.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsData.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
