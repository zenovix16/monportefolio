import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import PortfolioClient from "@/components/PortfolioClient";
import { getFileViewUrl } from "@/lib/storage";
import type { ProjectDoc, SkillDoc, ExperienceDoc, ArticleDoc, SettingsDoc, AboutBlockDoc, EducationDoc } from "@/types/portfolio";

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
    projects: projectsRes.status === "fulfilled" ? (projectsRes.value.documents as unknown as ProjectDoc[]) : [],
    skills:   skillsRes.status   === "fulfilled" ? (skillsRes.value.documents   as unknown as SkillDoc[])   : [],
    experience: experienceRes.status === "fulfilled" ? (experienceRes.value.documents as unknown as ExperienceDoc[]) : [],
    articles: articlesRes.status === "fulfilled" ? (articlesRes.value.documents as unknown as ArticleDoc[]) : [],
    // Reconstruits en objets simples : les documents Appwrite ne sont pas
    // sérialisables tels quels à travers la frontière Server → Client Component.
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
