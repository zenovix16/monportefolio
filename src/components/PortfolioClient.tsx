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
import Footer from "./Footer";
import type { ProjectDoc, SkillDoc, ExperienceDoc, ArticleDoc, AboutBlockDoc, EducationDoc } from "@/types/portfolio";

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
  aboutBlocks: AboutBlockDoc[];
  education: EducationDoc[];
  profilePhotoUrl: string | null;
  cvUrl: string | null;
  heroName?: string;
  heroLocation?: string;
  heroTagline?: string;
  heroDescription?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
}

export default function PortfolioClient({
  projects, skills, experience, articles, aboutBlocks, education,
  profilePhotoUrl, cvUrl, heroName, heroLocation, heroTagline, heroDescription,
  linkedinUrl, email, phone,
}: Props) {
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
      <Navbar active={active} onNavigate={navigate} email={email} />
      <main>
        <Hero
          onNavigate={navigate}
          profilePhotoUrl={profilePhotoUrl}
          cvUrl={cvUrl}
          name={heroName}
          location={heroLocation}
          tagline={heroTagline}
          description={heroDescription}
          linkedinUrl={linkedinUrl}
        />
        <About blocks={aboutBlocks} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Education education={education} />
        <Articles articles={articles} />
        <Contact cvUrl={cvUrl} email={email} phone={phone} linkedinUrl={linkedinUrl} />
      </main>
      <Footer
        onNavigate={navigate}
        name={heroName}
        tagline={heroTagline}
        email={email}
        phone={phone}
        linkedinUrl={linkedinUrl}
      />
    </>
  );
}
