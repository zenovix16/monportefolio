import { databases, DB_ID, COLLECTIONS, Query, getFileViewUrl } from "./appwrite.js";
import { initNav, setMenuEmail } from "./nav.js";
import { renderHero } from "./render/hero.js";
import { renderAbout } from "./render/about.js";
import { renderSkills } from "./render/skills.js";
import { renderProjects } from "./render/projects.js";
import { renderExperience } from "./render/experience.js";
import { renderEducation } from "./render/education.js";
import { renderArticles } from "./render/articles.js";
import { renderFooter } from "./render/footer.js";
import { renderContactRows, initContactForm } from "./contact.js";

async function safeList(collection, queries) {
  try {
    const res = await databases.listDocuments(DB_ID, collection, queries);
    return res.documents;
  } catch (e) {
    console.warn(`Impossible de charger '${collection}' :`, e.message);
    return [];
  }
}

async function safeGetSettings() {
  try {
    return await databases.getDocument(DB_ID, COLLECTIONS.SETTINGS, "main");
  } catch {
    return {};
  }
}

async function init() {
  initNav();
  initContactForm();

  const [projects, skills, experience, articles, aboutBlocks, education, settings] = await Promise.all([
    safeList(COLLECTIONS.PROJECTS, [Query.orderAsc("order"), Query.limit(20)]),
    safeList(COLLECTIONS.SKILLS, [Query.orderAsc("order"), Query.limit(50)]),
    safeList(COLLECTIONS.EXPERIENCE, [Query.orderAsc("order"), Query.limit(10)]),
    safeList(COLLECTIONS.ARTICLES, [Query.orderDesc("$createdAt"), Query.limit(10)]),
    safeList(COLLECTIONS.ABOUT_BLOCKS, [Query.orderAsc("order"), Query.limit(50)]),
    safeList(COLLECTIONS.EDUCATION, [Query.orderAsc("order"), Query.limit(20)]),
    safeGetSettings(),
  ]);

  const profilePhotoUrl = settings.profileFileId ? getFileViewUrl(settings.profileFileId) : null;
  const cvUrl = settings.cvFileId ? getFileViewUrl(settings.cvFileId) : null;

  setMenuEmail(settings.email || "soumaila.niampa@centrale-casablanca.ma");
  renderHero(settings, profilePhotoUrl, cvUrl);
  renderAbout(aboutBlocks);
  renderSkills(skills);
  renderProjects(projects);
  renderExperience(experience);
  renderEducation(education);
  renderArticles(articles);
  renderContactRows(settings, cvUrl);
  renderFooter(settings);
}

init();
