// Ordre narratif du site : ce que j'ai construit → ce que je fais → qui je
// suis → parcours en bref → publications → contact.
export const SECTION_LINKS = [
  { id: "hero",       label: "Accueil"   },
  { id: "projects",   label: "Projets"   },
  { id: "skills",     label: "Expertise" },
  { id: "about",      label: "À propos"  },
  { id: "experience", label: "Parcours"  },
  { id: "articles",   label: "Articles"  },
  { id: "contact",    label: "Contact"   },
];

export const FOOTER_LINKS = SECTION_LINKS.filter((l) => l.id !== "hero");
