"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

interface Props {
  projects: ProjectDoc[];
  skills: SkillDoc[];
  experience: ExperienceDoc[];
  articles: ArticleDoc[];
}

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function PortfolioClient({ projects, skills, experience, articles }: Props) {
  const [active, setActive] = useState<SectionId>("hero");

  const navigate = (id: SectionId) => setActive(id);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <Navbar active={active} onNavigate={navigate} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={active} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {active === "hero"       && <Hero       onNavigate={navigate} />}
            {active === "about"      && <About />}
            {active === "skills"     && <Skills     skills={skills} />}
            {active === "projects"   && <Projects   projects={projects} />}
            {active === "experience" && <Experience experience={experience} />}
            {active === "education"  && <Education />}
            {active === "articles"   && <Articles   articles={articles} />}
            {active === "contact"    && <Contact />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
