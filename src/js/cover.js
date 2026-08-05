// Générateur de "cover art" déterministe (dégradé + motif de points + initiale)
// utilisé quand un projet n'a pas d'image réelle. Toujours le même rendu pour
// un même projet (seed = id/titre), pour que ça ait l'air pensé, pas aléatoire.

const PALETTES = [
  ["#2E6BFF", "#7C3AED"], // bleu → violet
  ["#0EA5E9", "#22D3EE"], // ciel → cyan
  ["#F59E0B", "#EF4444"], // ambre → rouge
  ["#10B981", "#2E6BFF"], // émeraude → bleu
  ["#7C3AED", "#EC4899"], // violet → rose
  ["#0F172A", "#2E6BFF"], // ardoise → bleu
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  return h;
}

export function coverHTML(seed, label) {
  const h = hash(String(seed));
  const [from, to] = PALETTES[h % PALETTES.length];
  const angle = 25 + (h % 130);
  const initial = (label || "?").trim().charAt(0).toUpperCase();
  const patId = `cv-${h}`;
  return `
    <div class="absolute inset-0 overflow-hidden" style="background: linear-gradient(${angle}deg, ${from}, ${to});">
      <svg class="absolute inset-0 w-full h-full opacity-[0.16]" preserveAspectRatio="none">
        <defs>
          <pattern id="${patId}" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#${patId})" />
      </svg>
      <span class="absolute -bottom-3 -right-1 font-bold text-white/[0.22] select-none leading-none" style="font-size: 6rem;">${initial}</span>
    </div>
  `;
}

export function badgeHTML(seed, label, size = 44) {
  const h = hash(String(seed));
  const [from, to] = PALETTES[h % PALETTES.length];
  const initial = (label || "?").trim().charAt(0).toUpperCase();
  return `
    <span class="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0" style="width:${size}px;height:${size}px;font-size:${size * 0.4}px;background:linear-gradient(135deg, ${from}, ${to});">${initial}</span>
  `;
}
