// Ordre narratif du site : qui je suis → ma formation → mon parcours →
// ce que j'ai construit → ce que je maîtrise → publications → contact.
export const SECTION_LINKS = [
  { id: "hero",       label: "Accueil"   },
  { id: "about",      label: "About"     },
  { id: "education",  label: "Formation" },
  { id: "experience", label: "Parcours"  },
  { id: "projects",   label: "Projets"   },
  { id: "skills",     label: "Skills"    },
  { id: "articles",   label: "Articles"  },
  { id: "contact",    label: "Contact"   },
];

export const FOOTER_LINKS = SECTION_LINKS.filter((l) => l.id !== "hero");
