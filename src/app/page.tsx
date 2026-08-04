import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import PortfolioClient from "@/components/PortfolioClient";
import { getFileViewUrl } from "@/lib/storage";
import type { ProjectDoc, SkillDoc, ExperienceDoc, ArticleDoc, SettingsDoc, AboutBlockDoc, EducationDoc } from "@/types/portfolio";

// Sans ça, la page est générée en statique au build et ne se met plus à jour
// après coup : les modifications faites depuis l'admin n'apparaîtraient pas
// sur le site tant qu'il n'y a pas de nouveau déploiement. On revalide donc
// périodiquement (régénération en arrière-plan, ISR) plutôt que de rendre
// la page dynamique à chaque requête, pour rester rapide.
export const revalidate = 60;

async function fetchAll() {
  const [projectsRes, skillsRes, experienceRes, articlesRes, settingsRes, aboutBlocksRes, educationRes] = await Promise.allSettled([
    databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.orderAsc("order"), Query.limit(20)]),
    databases.listDocuments(DB_ID, COLLECTIONS.SKILLS, [Query.orderAsc("order"), Query.limit(50)]),
    databases.listDocuments(DB_ID, COLLECTIONS.EXPERIENCE, [Query.orderAsc("order"), Query.limit(10)]),
    databases.listDocuments(DB_ID, COLLECTIONS.ARTICLES, [Query.orderDesc("$createdAt"), Query.limit(10)]),
    databases.getDocument(DB_ID, COLLECTIONS.SETTINGS, "main"),
    databases.listDocuments(DB_ID, COLLECTIONS.ABOUT_BLOCKS, [Query.orderAsc("order"), Query.limit(50)]),
    databases.listDocuments(DB_ID, COLLECTIONS.EDUCATION, [Query.orderAsc("order"), Query.limit(20)]),
  ]);

  const settings = settingsRes.status === "fulfilled" ? (settingsRes.value as unknown as SettingsDoc) : {};

  return {
    // Reconstruits en objets simples : les documents Appwrite (instances avec
    // méthodes/prototype propre) ne sont pas sérialisables tels quels à
    // travers la frontière Server → Client Component. Ça ne se voyait pas
    // tant que ces collections étaient vides (tableau [] toujours OK).
    projects: projectsRes.status === "fulfilled"
      ? projectsRes.value.documents.map((d): ProjectDoc => ({
          $id: d.$id, title: d.title, description: d.description, tags: d.tags ?? undefined,
          imageId: d.imageId ?? undefined, githubUrl: d.githubUrl ?? undefined, liveUrl: d.liveUrl ?? undefined,
          featured: d.featured ?? false, order: d.order ?? 0,
        }))
      : [],
    skills: skillsRes.status === "fulfilled"
      ? skillsRes.value.documents.map((d): SkillDoc => ({
          $id: d.$id, name: d.name, category: d.category, level: d.level ?? undefined, order: d.order ?? 0,
        }))
      : [],
    experience: experienceRes.status === "fulfilled"
      ? experienceRes.value.documents.map((d): ExperienceDoc => ({
          $id: d.$id, company: d.company, role: d.role, location: d.location ?? undefined,
          description: d.description, startDate: d.startDate, endDate: d.endDate ?? undefined,
          current: d.current ?? false, order: d.order ?? 0,
        }))
      : [],
    articles: articlesRes.status === "fulfilled"
      ? articlesRes.value.documents.map((d): ArticleDoc => ({
          $id: d.$id, title: d.title, abstract: d.abstract, journal: d.journal ?? undefined,
          authors: d.authors ?? undefined, publishedDate: d.publishedDate ?? undefined, doi: d.doi ?? undefined,
          pdfUrl: d.pdfUrl ?? undefined, tags: d.tags ?? undefined, featured: d.featured ?? false,
        }))
      : [],
    aboutBlocks: aboutBlocksRes.status === "fulfilled"
      ? aboutBlocksRes.value.documents.map((d): AboutBlockDoc => ({
          $id: d.$id,
          type: d.type,
          title: d.title ?? undefined,
          body: d.body ?? undefined,
          value: d.value ?? undefined,
          items: d.items ?? undefined,
          order: d.order ?? 0,
        }))
      : [],
    education: educationRes.status === "fulfilled"
      ? educationRes.value.documents.map((d): EducationDoc => ({
          $id: d.$id,
          school: d.school,
          degree: d.degree,
          speciality: d.speciality ?? undefined,
          location: d.location ?? undefined,
          period: d.period,
          highlights: d.highlights ?? [],
          order: d.order ?? 0,
        }))
      : [],
    profilePhotoUrl: settings.profileFileId ? getFileViewUrl(settings.profileFileId) : null,
    cvUrl: settings.cvFileId ? getFileViewUrl(settings.cvFileId) : null,
    heroName: settings.heroName,
    heroLocation: settings.heroLocation,
    heroTagline: settings.heroTagline,
    heroDescription: settings.heroDescription,
    linkedinUrl: settings.linkedinUrl,
    email: settings.email,
    phone: settings.phone,
  };
}

export default async function Home() {
  const data = await fetchAll();
  return <PortfolioClient {...data} />;
}
