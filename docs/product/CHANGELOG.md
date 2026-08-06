# 📜 Changelog — MyToon

> Public : **mainteneurs, développeurs, équipe produit**.
> Toutes les évolutions notables du projet sont documentées dans ce fichier.
> Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Les entrées sont **datées** et issues de l'historique git ; aucune version sémantique n'est publiée pour le moment (`package.json` = `0.0.0`). Les sections suivront la convention **Unreleased / dates**.

## [Unreleased]

### Portail documentaire (en cours)

**Docs**
- Portail documentaire `docs/` organisé par public (utilisateurs, admin, développeurs, produit) + index `docs/README.md`.
- README allégé en vitrine + section Documentation.
- Nouveaux documents développeurs : `ARCHITECTURE.md`, `API.md`, `DESIGN-SYSTEM.md`, `SECURITY.md`, `DECISIONS.md`, `CONTRIBUTING.md`.
- Nouveaux documents utilisateurs : `TUTORIELS.md`, `FAQ.md`.
- Nouveaux documents admin : `GUIDE-ADMIN.md`, `OPERATIONS.md`.
- Nouveaux documents produit : `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md`.
- Correction du récit création : le graphiste utilise un **outil de génération par IA** (prompts de style — `public/prompts.txt`) pour créer les **3 déclinaisons**, sous supervision humaine (DEC-001 revu). Documents alignés : `README.md`, `PRODUCT.md`, `FAQ.md`, `CENTRE-AIDE.md`, `GUIDE-ADMIN.md`, `OPERATIONS.md`, `DECISIONS.md`.

---

## Historique

### 2026-08-06 — Documentation initiale

**Docs**
- README complet (27 sections, diagrammes Mermaid, design system, workflow, tests) — `54a4df3`.
- Centre d'aide utilisateur complet (11 sections) — `d4c1f69`.

### 2026-08-06 — Hygiène & outillage

**Chore**
- Retrait du `.env` du suivi git, variables Netlify posées, ajout de `netlify-cli` — `cb07c91`.

### 2026-08-05 — Remédiation audit 2026-08-05

**Security / Changed**
- Workflow **7 statuts** (retrait du statut `validation_attente`).
- Backfill des téléphones `owner_phone` au format **E.164**.
- Trigger **`enforce_order_promo`** : prix promo autoritaire côté serveur (infalsifiable client).
- `recent_feed` mis à jour (filtre sur les nouveaux statuts) — `fca9666`.

### 2026-08-05 — Workflow imprimeur

**Added**
- Workflow imprimeur **PDF A4 (DTF)** via Edge Function + refonte de la home en 6 étapes — `8444672`.

**Fixed**
- Fetch direct de l'Edge Function pour un message d'erreur clair (les 404 métier étaient masqués) — `4508444`.
- Masquage du footer dans le dashboard admin — `04b3200`.

**Chore**
- Commit du `.env` avec clés publiques (Vite/Netlify les lisent au build) — `583d681` *(historique ; le fichier a depuis été retiré du suivi git)*.

### 2026-08-05 — Campagnes

**Added**
- Campagnes saisonnières : table `campaigns` + RPC (`get_active_campaign`, `validate_promo`), promos avec remise, thémage bandeau/header, onglet admin, tests — `9d30b47`.

### 2026-08-04 — Nettoyage

**Chore**
- Suppression des fichiers obsolètes (analyse pré-backend + tests one-off) — `dbeaf80`.

### 2026-08-01 — Home & vitrine

**Added**
- Ticker vivant des dernières commandes (RPC publique anonymisée) + test — `21bf848`.
- Lignes de séparation dégradées entre sections + nouvelles formulations hero/footer — `f7dda33`.

**Changed**
- SplashScreen sobre (logo MyToon + tagline), 1,9 s, une seule fois par session — `7bbf1ce`.

**Fixed**
- Espacement des séparateurs réduit à 20 px — `c4de5eb`.
- Padding vertical autour des lignes de séparation — `29b8e0e`.

**Docs**
- README pro (features, stack, setup, BDD, tests, déploiement) — `df7722b`.

### 2026-07-31 — Backend & atelier

**Added**
- Phase A Supabase : vrai backend RLS (tables, policies, storage `media`) — `3608ee8`.
- Atelier MyToon : **4 files de travail**, avatar de référence, réglages séparés — `625cc65`.
- Menu « Atelier » dédié dans le header — `74d0b7c`.
- Hero enrichi : avant/après photo→toon, compteur réel, badges de confiance, carrousel de styles — `888b8f4`.
- Espace client sans friction (téléphone = identité) — `d3ce3fd`.
- Footer enrichi (promesses, contact, paiements, survol doré, mobile) — `98fc87d`.
- Test UI Playwright du flux complet (15 checks) — `22ffab3`.
- Vrais contacts OULAI Siéni dans le footer — `f73bd86`.

**Fixed**
- Récursion RLS sur `admins` résolue via la fonction `is_admin()` — `5c69bb9`.
- Code `MT-XXXX` affiché + retour visuel après validation client — `b6bb350`.
- Durcissement du fonctionnement sans backend — `1c53787`.
- Import manquant `ACTIVE_STYLES` dans la Gallery — `843bcd7`.

**Changed**
- Nouveau concept MyToon : commande manuelle, suivi de commande, dashboard (**zéro IA**) — `6cd6284`.

### 2026-07-30 — Prototype & refonte

**Added**
- Moteur cartoon Canvas local (zéro API, hors-ligne) — `69db9ef`.
- Moteur Canvas v2 : pipeline multicouche, filtre bilatéral, contours Sobel, textures — `f5ce5ff`.
- Expérience immersive MyToon v2 : 20 améliorations UI/UX — `a90a50f`.
- **Initial MyToon — Abidjan Street Wear** — `c79b909`.

**Fixed**
- Variable shadow `w`, bug `composeWithEdges`, hook `cartoonizer` local — `f75f299`.
- Proxy Vite + DNS Google pour contourner le blocage HF en CI — `22124fe`.
- Désinscription des service workers obsolètes (erreur MIME) — `686200e`, `c27d4aa`.
- SplashScreen : styles de coins manquants (`cornerTRStyle`) — `189271d`.

**Chore**
- Trigger redeploy Netlify — `c79a38a`.

---

## Ajouter une entrée

1. Ajoute ton changement en haut de la section **[Unreleased]** (catégories : `Added` / `Changed` / `Fixed` / `Removed` / `Security` / `Docs` / `Chore`).
2. Référence l'ID court du commit si connu.
3. Lors d'une publication future, déplace les entrées dans une section datée et nomme la version.

---

## Références croisées

- [ROADMAP.md](ROADMAP.md) — à venir
- [DECISIONS.md](../developers/DECISIONS.md) — arbitrages
- [CONTRIBUTING.md](../developers/CONTRIBUTING.md) — comment contribuer
