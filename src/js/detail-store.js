// Petit pont entre les listes (carrousels Projets/Expérience) et les pages
// de détail dédiées (project.html / experience.html). On stocke l'objet
// cliqué dans sessionStorage juste avant la navigation : la page de détail
// l'affiche instantanément (pas d'écran de chargement), puis retente un
// fetch réseau si jamais l'entrée n'existe pas (lien partagé, accès direct).
export function stashDetail(kind, item) {
  try {
    sessionStorage.setItem(`detail:${kind}:${item.$id}`, JSON.stringify(item));
  } catch {
    // sessionStorage indisponible (navigation privée stricte, quota...) —
    // la page de détail retombera sur un fetch réseau.
  }
}

export function readStashedDetail(kind, id) {
  try {
    const raw = sessionStorage.getItem(`detail:${kind}:${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
