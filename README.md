# Portfolio — Soumaïla Niampa

Site portfolio + espace admin, en HTML/CSS/JS vanilla (build via [Vite](https://vitejs.dev)), avec [Appwrite](https://appwrite.io) comme backend (base de données, stockage de fichiers, authentification), appelé **directement depuis le navigateur** — pas de serveur applicatif.

## Structure

- `index.html` — site public (une seule page, sections chargées dynamiquement depuis Appwrite).
- `admin/*.html` — espace d'administration (une page HTML par section : projets, skills, expérience, articles, formation, blocs About, réglages, messages).
- `src/js/` — logique du site public (nav, carrousels, modale de détail, rendu des sections).
- `src/js/admin/` — logique de chaque page admin (auth, CRUD).
- `src/style.css` — Tailwind CSS v4 + utilitaires custom.
- `scripts/` — scripts Node ponctuels (création des collections Appwrite, migrations de permissions) — **jamais livrés au navigateur**, utilisent une clé API serveur. Dossier gitignored (contient des secrets).

## Développement local

```bash
npm install
npm run dev      # serveur Vite, http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # sert le build de dist/
```

Variables d'environnement (`.env.local`, non commité) :

```
VITE_APPWRITE_ENDPOINT=...
VITE_APPWRITE_PROJECT_ID=...
VITE_APPWRITE_DATABASE_ID=...
VITE_APPWRITE_BUCKET_ID=...
```

## ⚠️ Étape obligatoire côté Appwrite : enregistrer les Platforms Web

Le site et l'admin appellent Appwrite directement depuis le navigateur (authentification par session, écritures incluses). Pour des raisons de sécurité, **Appwrite refuse les requêtes authentifiées venant d'une origine non enregistrée** — sans ça, la connexion admin et toutes les actions d'écriture échouent silencieusement.

À faire une seule fois dans la [Console Appwrite](https://cloud.appwrite.io) → ton projet → **Overview → Add Platform → Web App** :
- Hostname `localhost` (couvre le dev local, quel que soit le port)
- Hostname `monportefolio-n7c3.vercel.app` (production)

Je n'ai pas pu le faire moi-même : la clé API serveur n'a pas le scope `platforms.write` (opération réservée à la Console, pas aux clés API).

## Déploiement

Hébergé sur Vercel en tant que site statique (build Vite → `dist/`). Si Vercel ne détecte pas automatiquement le passage de Next.js à Vite après le premier déploiement, changer le "Framework Preset" sur "Vite" dans les réglages du projet Vercel.

Les variables d'environnement sur Vercel doivent utiliser le préfixe `VITE_` (pas `NEXT_PUBLIC_`) — à mettre à jour dans Vercel → Settings → Environment Variables.
