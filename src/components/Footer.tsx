"use client";

import type { SectionId } from "./PortfolioClient";

const LINKS: { id: SectionId; label: string }[] = [
  { id: "about",      label: "About"     },
  { id: "skills",     label: "Skills"    },
  { id: "projects",   label: "Projets"   },
  { id: "experience", label: "Parcours"  },
  { id: "education",  label: "Formation" },
  { id: "articles",   label: "Articles"  },
  { id: "contact",    label: "Contact"   },
];

const DEFAULTS = {
  name: "Soumaïla Niampa",
  tagline: "Consultant Data & Transformation Digitale",
  email: "soumaila.niampa@centrale-casablanca.ma",
  phone: "+212 708-778-658",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

interface Props {
  onNavigate: (id: SectionId) => void;
  name?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
}

export default function Footer({ onNavigate, name, tagline, email, phone, linkedinUrl }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.08] px-5 md:px-10 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 md:gap-6 mb-10">
          {/* Identité */}
          <div>
            <p className="text-lg font-bold text-[#14161A] mb-1">{name || DEFAULTS.name}</p>
            <p className="text-black/50 text-sm leading-relaxed">{tagline || DEFAULTS.tagline}</p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-black/40 mb-3">Navigation</p>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => onNavigate(l.id)}
                    className="link-underline text-black/60 hover:text-[var(--accent-light)] text-sm transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-black/40 mb-3">Contact</p>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${email || DEFAULTS.email}`} className="link-underline text-black/60 hover:text-[var(--accent-light)] text-sm transition-colors break-all">
                  {email || DEFAULTS.email}
                </a>
              </li>
              <li>
                <a href={`tel:${(phone || DEFAULTS.phone).replace(/[\s-]/g, "")}`} className="link-underline text-black/60 hover:text-[var(--accent-light)] text-sm transition-colors">
                  {phone || DEFAULTS.phone}
                </a>
              </li>
              <li>
                <a href={linkedinUrl || DEFAULTS.linkedinUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-black/60 hover:text-[var(--accent-light)] text-sm transition-colors">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-black/[0.08] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-black/35 text-xs">© {year} {name || DEFAULTS.name}</p>
          <button
            onClick={() => onNavigate("hero")}
            className="btn-ghost text-black/55 hover:text-black text-xs rounded-full px-4 py-2 transition-colors"
          >
            Retour en haut ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
