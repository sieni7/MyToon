# 🤝 Contribution — MyToon

> Public : **contributeurs, développeurs**.
> Ce guide est la **source de vérité** sur la manière de contribuer au projet. Le fichier `CONTRIBUTING.md` à la racine pointe ici.
> Portail : [`docs/README.md`](../README.md)

## Sommaire

1. [Code de conduite](#1-code-de-conduite)
2. [Où commencer](#2-où-commencer)
3. [Workflow de contribution](#3-workflow-de-contribution)
4. [Convention de commits](#4-convention-de-commits)
5. [Setup de développement](#5-setup-de-développement)
6. [Code style](#6-code-style)
7. [Tests](#7-tests)
8. [Documentation Policy](#8-documentation-policy)
9. [Revue de code](#9-revue-de-code)

---

## 1. Code de conduite

- Sois respectueux et constructif : les revues portent sur le **code**, jamais sur la personne.
- Signale les **failles de sécurité** en privé (voir [`SECURITY.md`](SECURITY.md), section « À compléter » pour le canal officiel) — ne les expose pas dans une issue publique.
- Ne **jamais** commiter de secret (`.env`, clé service, mot de passe).

## 2. Où commencer

- Lis le [`README.md`](../../README.md) (vitrine) et le [`docs/README.md`](../README.md) (portail).
- Consulte le [`ROADMAP.md`](../product/ROADMAP.md) et le [`CHANGELOG.md`](../product/CHANGELOG.md) pour les axes en cours.
- Lis les décisions structurantes dans [`DECISIONS.md`](DECISIONS.md) avant de proposer un changement d'architecture.
- Pour une première contribution : corrige un bug documenté, améliore la doc, ou traite une issue étiquetée « good first issue » (lorsqu'elles existeront).

## 3. Workflow de contribution

1. **Fork** le dépôt sur GitHub.
2. Crée une branche dédiée depuis `master` :
   ```bash
   git checkout -b feat/ma-fonctionnalite
   # ou : fix/..., docs/..., refactor/..., chore/...
   ```
3. Fais des commits **atomiques** et **descriptifs** (voir convention ci-dessous).
4. Vérifie **localement** : lint + build + tests (sections 5-7).
5. Pousse ta branche :
   ```bash
   git push -u origin feat/ma-fonctionnalite
   ```
6. Ouvre une **Pull Request** vers `master` en décrivant :
   - le **problème** (avec issue liée si applicable),
   - la **solution**,
   - les **tests** effectués,
   - les **documents mis à jour** (Documentation Policy).

> 💡 Branches courtes (peu de jours) et PR petites : plus faciles à revoir et à fusionner.

## 4. Convention de commits

Format : `type(portée): description` (conventional commits).

| Type | Usage | Exemple réel |
| --- | --- | --- |
| `feat` | Nouvelle fonctionnalité | `feat(campagnes): backend campaigns + codes promo` |
| `fix` | Correction de bug | `fix(home): espacement des séparateurs` |
| `docs` | Documentation uniquement | `docs: README pro (features, stack, setup)` |
| `refactor` | Restructuration sans changement de comportement | `refactor(splash): sobre (logo + tagline)` |
| `chore` | Tâche technique (deps, nettoyage) | `chore: suppression fichiers obsolètes` |

- Message à l'**impératif** et en français de préférence (« ajoute », « corrige »).
- Une ligne de sujet si possible ; description en corps si nécessaire.

## 5. Setup de développement

```bash
git clone https://github.com/sieni7/MyToon.git
cd MyToon
npm install
```

Crée `.env.local` (jamais commité) :

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable_key>
```

Lancement :

```bash
npm run dev       # développement sur http://localhost:5173
npm run build     # build de production (dist/)
npm run lint      # oxlint
```

> ℹ️ Le client Supabase est désactivé proprement si les variables sont absentes : le site reste navigable sans backend.

## 6. Code style

- **Composants** : React fonctionnels + hooks (`useState`, `useEffect`, `React.lazy` + `Suspense`).
- **Logique métier** : dans `src/services/` (jamais dans les pages).
- **Constantes** : centralisées dans `src/utils/constants.js` (styles, produits, statuts, journey, FAQ).
- **Design** : utiliser les tokens CSS (`globals.css`) plutôt que des couleurs en dur.
- **Erreurs** : messages en français, affichage inline dans le formulaire concerné.
- **Lint** : `npm run lint` (oxlint, plugins `react`, `oxc`, règles hooks) doit passer.

## 7. Tests

Prérequis : `npx playwright install chromium`, serveur de dev lancé, variables d'env de test (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

```bash
npm run dev &
node ui-test.mjs           # Flux complet client + admin (15 checks)
node campaign-check.mjs    # Campagne active + validation code promo
node promo-ui-check.mjs    # Parcours commande avec promo (prix remisé)
node print-check.mjs       # Génération PDF A4 (backend, 3 checks)
node print-ui-check.mjs    # Bloc "Fichier d'impression" dans l'admin
node remediation-check.mjs # Trigger promo, E.164, workflow 7 statuts (8 checks)
```

**Règle** : toute PR qui touche au comportement doit inclure ou mettre à jour les tests correspondants. Si une nouvelle suite est ajoutée, documente-la dans le [`README.md`](../../README.md) (§ Tests) et le [`CHANGELOG.md`](../product/CHANGELOG.md).

## 8. Documentation Policy

> **Toute modification du comportement fonctionnel, de l'architecture, de la sécurité ou de l'expérience utilisateur doit être accompagnée de la mise à jour des documents concernés avant la fusion de la Pull Request.**
> **Le code et la documentation constituent un même livrable.**

Avant de fusionner, vérifie :
- [ ] les documents du portail affectés ont été mis à jour (`docs/developers/*`, `docs/admin/*`, `docs/users/*`, `docs/product/*`) ;
- [ ] les `DEC-XXX` concernés sont mis à jour dans [`DECISIONS.md`](DECISIONS.md) (ou une nouvelle décision ajoutée) ;
- [ ] le [`CHANGELOG.md`](../product/CHANGELOG.md) reflète le changement ;
- [ ] le [`README.md`](../../README.md) reste exact (vitrine).

## 9. Revue de code

- Chaque PR est revue par au moins **une personne** avant fusion.
- Critères : exactitude, sécurité (RLS/RPC), respect des conventions, tests, documentation.
- Les suggestions `nit` (cosmétiques) ne bloquent pas la fusion ; les problèmes de **sécurité** ou de **comportement** la bloquent.

---

## Références croisées

- [README.md](../../README.md) — vitrine et § Tests
- [DECISIONS.md](DECISIONS.md) — arbitrages structurants
- [SECURITY.md](SECURITY.md) — règles de sécurité pour les contributions
- [API.md](API.md) — surface d'appels existante
