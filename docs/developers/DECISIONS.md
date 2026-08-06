# 🧭 Décisions — MyToon

> Public : **développeurs, équipe produit, nouveaux contributeurs**.
> Registre des grandes décisions produit et techniques. Format ADR allégé : **Contexte / Décision / Conséquences**. Les identifiants `DEC-XXX` sont stables et référençables dans les autres documents.
> Portail : [`docs/README.md`](../README.md)

## Registre

| ID | Décision | Domaine |
| --- | --- | --- |
| [DEC-001](#dec-001--création-assistée-par-ia-supervisée-par-un-graphiste) | Création assistée par IA, supervisée par un graphiste | Produit |
| [DEC-002](#dec-002--paiement-à-la-livraison) | Paiement à la livraison | Produit |
| [DEC-003](#dec-003--lancement-limité-à-abidjan) | Lancement limité à Abidjan | Produit |
| [DEC-004](#dec-004--choix-de-supabase) | Choix de Supabase | Technique |
| [DEC-005](#dec-005--react--vite) | React + Vite | Technique |
| [DEC-006](#dec-006--sessions-anonymes) | Sessions anonymes | Technique |
| [DEC-007](#dec-007--code-mt-xxxx) | Code `MT-XXXX` | Technique |
| [DEC-008](#dec-008--trigger-enforce_order_promo) | Trigger `enforce_order_promo` | Sécurité |
| [DEC-009](#dec-009--téléphones-au-format-e164) | Téléphones au format E.164 | Technique |
| [DEC-010](#dec-010--pdf-dtf-via-edge-function) | PDF DTF via Edge Function | Technique |
| [DEC-011](#dec-011--verify_jwt-obligatoire) | `verify_jwt` obligatoire | Sécurité |

---

## DEC-001 · Création assistée par IA, supervisée par un graphiste

- **Contexte** : la personnalisation de vêtements à partir d'une photo peut être automatisée par IA. Le marché regorge de filtres génériques.
- **Décision** : MyToon combine **graphiste humain + IA** : le graphiste utilise un **outil de génération par IA** (prompts de style — voir [`public/prompts.txt`](../../public/prompts.txt)) pour créer les **3 déclinaisons toon** à partir de la photo du client (3 déclinaisons en 1 h). L'humain reste maître du rendu : il sélectionne, ajuste et valide chaque toon avant dépôt.
- **Conséquences** : différence qualitative et identitaire forte (rendu personnalisé, pas un filtre générique en 1 clic) ; création non instantanée (1 h) ; coût de création inclus dans le prix ; cohérence de communication exigée (promettre « graphiste + IA », jamais une génération 100 % automatique sans supervision).
- **Sources** : `README.md` (note IA), `PRODUCT.md`.

## DEC-002 · Paiement à la livraison

- **Contexte** : en Côte d'Ivoire, le paiement à la livraison est un usage dominant et rassurant (confiance, mobile money).
- **Décision** : aucun prépaiement en ligne ; le paiement s'effectue à la réception (**Wave, Orange Money, MTN MoMo ou espèces**).
- **Conséquences** : taux de confiance accru ; risque de non-encaissement à assumer ; pas de gatekeeper de paiement en ligne.
- **Sources** : `constants.js` (FAQ), `LegalPages.jsx` (CGV §3), `PRODUCT.md`.

## DEC-003 · Lancement limité à Abidjan

- **Contexte** : production et logistique de proximité nécessaires pour tenir les délais annoncés.
- **Décision** : livraison **24-48 h sur Abidjan uniquement** (du lundi au samedi, gratuite).
- **Conséquences** : promesse de délai tenable ; limitation géographique assumée ; horizon d'extension ouvert (voir `ROADMAP.md`).
- **Sources** : `LegalPages.jsx` (CGV §4, Livraison §1), `constants.js`.

## DEC-004 · Choix de Supabase

- **Contexte** : besoin d'une base PostgreSQL, d'une authentification, d'un storage privé et d'Edge Functions sans opérer de serveur.
- **Décision** : **Supabase** (PostgreSQL 15, Auth, Storage bucket privé `media`, Edge Functions Deno) hébergé dans le cloud.
- **Conséquences** : RLS et RPC `security definer` comme briques de sécurité ; pas de serveur applicatif custom ; coût d'abonnement cloud ; dépendance à la disponibilité du service.
- **Sources** : `supabase/migrations/*`, `ARCHITECTURE.md`.

## DEC-005 · React + Vite

- **Contexte** : SPA multi-pages avec besoin de code-splitting et d'une ergonomie fluide.
- **Décision** : **React 19 + Vite 8** + `react-router-dom@7`, styles CSS custom (tokens dans `globals.css`).
- **Conséquences** : bundle réduit (lazy sur 7 routes, ~485 kB avant optimisations) ; pas de lib CSS/framework UI (design system maison) ; lint via oxlint.
- **Sources** : `package.json`, `src/`, `DESIGN-SYSTEM.md`.

## DEC-006 · Sessions anonymes

- **Contexte** : la commande ne doit pas exiger de création de compte (friction), tout en rattachant les commandes à un propriétaire.
- **Décision** : session **anonyme** (`auth.signInAnonymously`) liée à l'**appareil** ; `owner_user_id` référence la commande.
- **Conséquences** : friction d'inscription supprimée ; accès aux commandes lié à l'appareil (connexion SMS prévue en Phase B pour s'affranchir de cette limite — `ROADMAP.md`) ; activation d'Auth → Anonymous requise dans Supabase.
- **Sources** : `src/lib/supabase.js` (`ensureSession`), `ARCHITECTURE.md`.

## DEC-007 · Code MT-XXXX

- **Contexte** : le client doit pouvoir suivre sa commande simplement, sans compte.
- **Décision** : code de commande **`MT-XXXX`** (séquentiel, atomique via RPC `next_order_code` sur une table `counters`).
- **Conséquences** : suivi par code sur `/suivi` ; unicité garantie ; compteur atomique sans course.
- **Sources** : `0002_order_code_rpc.sql`, `src/services/orders.js`.

## DEC-008 · Trigger `enforce_order_promo`

- **Contexte** : les codes promo sont saisis côté client ; il faut empêcher la falsification de la remise.
- **Décision** : un trigger `BEFORE INSERT OR UPDATE` sur `orders` **revalide** le code contre `campaigns` (actif + dates) et **force** la remise calculée côté serveur ; toute promo invalide est neutralisée (`NULL`).
- **Conséquences** : le serveur est l'autorité du prix ; `validate_promo` ne sert qu'à l'affichage ; aucune remise forgée côté client.
- **Sources** : `0009_remediation.sql`, `SECURITY.md`, `API.md`.

## DEC-009 · Téléphones au format E.164

- **Contexte** : les numéros ivoiriens sont saisis sous plusieurs formats (10 chiffres, préfixe 225, ponctuation).
- **Décision** : normalisation **E.164** (`+225…`) via `src/utils/phone.js` à la création de commande ; backfill des anciennes lignes en `0009_remediation.sql`.
- **Conséquences** : numéros exploitables pour l'exploitation (imprimeur, relances) ; format unifié en base.
- **Sources** : `src/utils/phone.js`, `0009_remediation.sql`.

## DEC-010 · PDF DTF via Edge Function

- **Contexte** : le fichier d'impression doit être généré côté serveur (artwork + métadonnées), stocké et partageable à l'imprimeur.
- **Décision** : **Edge Function** `generate-print-pdf` (Deno + pdf-lib) qui construit un **PDF A4** (bandeau méta + artwork centré), l'upload en `media/print/{code}.pdf`, et met à jour `orders.print_pdf_path`.
- **Conséquences** : PDF téléchargeable / lien signé 7 jours / envoi WhatsApp ; dépendance à la disponibilité de la fonction ; le client ne peut pas générer le PDF (admin requis).
- **Sources** : `supabase/functions/generate-print-pdf/index.ts`, `src/services/print.js`.

## DEC-011 · `verify_jwt` obligatoire

- **Contexte** : l'Edge Function produit un PDF lié à des données client ; elle ne doit être appelable que par des administrateurs.
- **Décision** : `verify_jwt = true` dans `supabase/config.toml` **et** contrôle interne de présence dans `admins` (403 sinon).
- **Conséquences** : 401 sans JWT valide ; 403 pour un utilisateur non admin ; couche de sécurité en plus du contrôle applicatif.
- **Sources** : `supabase/config.toml`, `index.ts`, `SECURITY.md`.

---

## Ajouter une nouvelle décision

1. Attribue l'**ID suivant** (`DEC-012`, …).
2. Remplis **Contexte / Décision / Conséquences** en t'appuyant sur le code ou la configuration (jamais d'invention).
3. Référence les **sources** (fichiers, migrations, commits).
4. Ajoute la ligne au **registre** en haut du document.
5. Cite l'ID dans les autres documents concernés (ex. `DECISIONS.md — DEC-008`).

> ⚠️ Toute nouvelle décision modifiant un comportement fonctionnel, l'architecture, la sécurité ou l'UX déclenche la **Documentation Policy** (mise à jour des documents concernés avant fusion de la PR — voir [`docs/README.md`](../README.md)).

---

## Références croisées

- [ARCHITECTURE.md](ARCHITECTURE.md) — mise en œuvre technique
- [SECURITY.md](SECURITY.md) — DEC-008, DEC-011 en détail
- [API.md](API.md) — DEC-007, DEC-010
- [PRODUCT.md](../product/PRODUCT.md) — DEC-001 à DEC-003 en détail
