// Cover art des projets : vraies photos libres de droits (Unsplash), choisies
// à la main pour concorder avec le thème data/tech du portfolio — plus de
// dégradés générés. Sélection déterministe par hash (même projet → même
// photo à chaque rendu), pour les projets qui n'ont pas d'image uploadée
// dans l'admin.

const STOCK_POOL = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71", // dashboard analytics (sombre)
  "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74", // dashboard tuiles bleues
  "https://images.unsplash.com/photo-1591696205602-2f950c417cb9", // courbe de données
  "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee", // baie de serveurs
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4", // code sur écran
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", // code sur écran (sombre)
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  return h;
}

export function stockPhotoUrl(seed, width = 900, height = 650) {
  const base = STOCK_POOL[hash(String(seed)) % STOCK_POOL.length];
  return `${base}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function badgeHTML(seed, label, size = 44) {
  const PALETTES = [
    ["#2E6BFF", "#7C3AED"],
    ["#0EA5E9", "#22D3EE"],
    ["#F59E0B", "#EF4444"],
    ["#10B981", "#2E6BFF"],
    ["#7C3AED", "#EC4899"],
    ["#0F172A", "#2E6BFF"],
  ];
  const h = hash(String(seed));
  const [from, to] = PALETTES[h % PALETTES.length];
  const initial = (label || "?").trim().charAt(0).toUpperCase();
  return `
    <span class="inline-flex items-center justify-center rounded-full font-bold text-white shrink-0" style="width:${size}px;height:${size}px;font-size:${size * 0.4}px;background:linear-gradient(135deg, ${from}, ${to});">${initial}</span>
  `;
}
