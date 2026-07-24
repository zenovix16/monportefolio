"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Education from "./Education";
import Articles from "./Articles";
import Contact from "./Contact";
import type { ProjectDoc, SkillDoc, ExperienceDoc, ArticleDoc } from "@/types/portfolio";

export type SectionId =
  | "hero" | "about" | "skills" | "projects"
  | "experience" | "education" | "articles" | "contact";

const SECTION_IDS: SectionId[] = [
  "hero", "about", "skills", "projects", "experience", "education", "articles", "contact",
];

interface Props {
  projects: ProjectDoc[];
  skills: SkillDoc[];
  experience: ExperienceDoc[];
  articles: ArticleDoc[];
}

export default function PortfolioClient({ projects, skills, experience, articles }: Props) {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navigate = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar active={active} onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} />
        <About />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Education />
        <Articles articles={articles} />
        <Contact />
      </main>
    </>
  );
}
