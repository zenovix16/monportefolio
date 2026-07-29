import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import PortfolioClient from "@/components/PortfolioClient";
import { getFileViewUrl } from "@/lib/storage";
import type { ProjectDoc, SkillDoc, ExperienceDoc, ArticleDoc, SettingsDoc } from "@/types/portfolio";

async function fetchAll() {
  const [projectsRes, skillsRes, experienceRes, articlesRes, settingsRes] = await Promise.allSettled([
    databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.orderAsc("order"), Query.limit(20)]),
    databases.listDocuments(DB_ID, COLLECTIONS.SKILLS, [Query.orderAsc("order"), Query.limit(50)]),
    databases.listDocuments(DB_ID, COLLECTIONS.EXPERIENCE, [Query.orderAsc("order"), Query.limit(10)]),
    databases.listDocuments(DB_ID, COLLECTIONS.ARTICLES, [Query.orderDesc("$createdAt"), Query.limit(10)]),
    databases.getDocument(DB_ID, COLLECTIONS.SETTINGS, "main"),
  ]);

  const settings = settingsRes.status === "fulfilled" ? (settingsRes.value as unknown as SettingsDoc) : {};

  return {
    projects: projectsRes.status === "fulfilled" ? (projectsRes.value.documents as unknown as ProjectDoc[]) : [],
    skills:   skillsRes.status   === "fulfilled" ? (skillsRes.value.documents   as unknown as SkillDoc[])   : [],
    experience: experienceRes.status === "fulfilled" ? (experienceRes.value.documents as unknown as ExperienceDoc[]) : [],
    articles: articlesRes.status === "fulfilled" ? (articlesRes.value.documents as unknown as ArticleDoc[]) : [],
    profilePhotoUrl: settings.profileFileId ? getFileViewUrl(settings.profileFileId) : null,
    cvUrl: settings.cvFileId ? getFileViewUrl(settings.cvFileId) : null,
  };
}

export default async function Home() {
  const data = await fetchAll();
  return <PortfolioClient {...data} />;
}
