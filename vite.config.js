import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        projectDetail: resolve(__dirname, "project.html"),
        experienceDetail: resolve(__dirname, "experience.html"),
        adminLogin: resolve(__dirname, "admin/login.html"),
        adminIndex: resolve(__dirname, "admin/index.html"),
        adminProjects: resolve(__dirname, "admin/projects.html"),
        adminSkills: resolve(__dirname, "admin/skills.html"),
        adminExperience: resolve(__dirname, "admin/experience.html"),
        adminArticles: resolve(__dirname, "admin/articles.html"),
        adminEducation: resolve(__dirname, "admin/education.html"),
        adminAbout: resolve(__dirname, "admin/about.html"),
        adminSettings: resolve(__dirname, "admin/settings.html"),
        adminMessages: resolve(__dirname, "admin/messages.html"),
      },
    },
  },
});
