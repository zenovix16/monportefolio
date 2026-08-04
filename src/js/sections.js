export const SECTION_LINKS = [
  { id: "hero",       label: "Accueil"   },
  { id: "about",      label: "About"     },
  { id: "skills",     label: "Skills"    },
  { id: "projects",   label: "Projets"   },
  { id: "experience", label: "Parcours"  },
  { id: "education",  label: "Formation" },
  { id: "articles",   label: "Articles"  },
  { id: "contact",    label: "Contact"   },
];

export const FOOTER_LINKS = SECTION_LINKS.filter((l) => l.id !== "hero");
