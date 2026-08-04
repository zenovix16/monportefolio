"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  lines?: 2 | 3 | 4;
}

const CLAMP: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
};

// Heuristique simple : pas la peine d'afficher "Voir plus" si le texte est
// de toute façon assez court pour tenir dans le nombre de lignes visées.
const APPROX_CHARS_PER_LINE = 55;

export default function ReadMore({ text, className = "", lines = 3 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const mightOverflow = text.length > lines * APPROX_CHARS_PER_LINE;

  if (!mightOverflow) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {expanded ? (
          <motion.p
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={className}
          >
            {text}
          </motion.p>
        ) : (
          <p key="clamped" className={`${CLAMP[lines]} ${className}`}>
            {text}
          </p>
        )}
      </AnimatePresence>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-1.5 text-[11px] font-medium text-[var(--accent-light)] hover:underline"
      >
        {expanded ? "Voir moins" : "Voir plus"}
      </button>
    </div>
  );
}
