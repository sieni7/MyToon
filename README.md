# MyToon 🦸

**Ta photo. Ton avatar. Ton tee-shirt.** Boutique streetwear à Abidjan : envoie ta photo, choisis un style (Manga, Comics, Pop Art…), et reçois un t-shirt ou un polo 100 % coton local imprimé avec ton héros — livré en 24-48 h.

## ✨ Fonctionnalités

- **Parcours en 6 étapes** : 1. Choisis → 2. Envoie ta photo → 3. Création (3 déclinaisons, 1 h) → 4. Tu valides → 5. Fichier d'impression → 6. Livraison 24-48 h + suivi
- **3 déclinaisons en 1 h** : l'opérateur crée manuellement 3 versions de ton toon à partir de ta photo — aucune transformation automatique, le rendu est fait par un vrai artiste
- **Suivi de commande en temps réel** avec code public `MT-XXXX` et 7 statuts :
  `recue → en_creation → propositions_pretes → validee → en_impression → expediee → livree`
- **Validation client** : le client choisit sa déclinaison préférée avant impression
- **PDF A4 imprimeur (DTF)** : une fois la déclinaison validée, l'admin génère un PDF A4 (bandeau méta code/client/produit/imprimeur + artwork) via Edge Function, puis le télécharge, copie le lien signé ou l'envoie à l'imprimeur par WhatsApp
- **Espace client** : historique et détails des commandes
- **Atelier (dashboard admin)** : files de travail par statut, dépôt des déclinaisons, assignation d'un imprimeur, fichier d'impression, timeline complète
- **Campagnes saisonnières** : Halloween, Fête des Pères, Noël… activables depuis l'admin (dates, bandeau, couleur d'accent) avec **codes promo** appliqués sur le prix (paiement à la livraison)
- **Preuve sociale** : ticker « En direct » des dernières commandes (anonymisé) et compteur réel de héros créés
- **Paiement à la livraison**, livraison Abidjan 24-48 h
- **Remise promo côté serveur** : un trigger revalide le code promo contre les campagnes actives et force la remise (impossible à falsifier côté client)
- **Pages légales** : CGV, Confidentialité, Livraison & retours (routes dédiées)
- **Performance** : code-splitting par route (`React.lazy`), images des réalisations chargées à la demande, pagination de l'historique client

## 🛠️ Stack technique

| Couche | Techno |
| --- | --- |
| Front | React 19, Vite 8, react-router-dom 7 |
| Backend / BDD | Supabase (PostgreSQL, Auth, Storage) |
| Style | CSS custom (globals.css + responsive.css), tokens via variables CSS |
| Lint | oxlint |
| Tests E2E | Playwright |

## 📁 Structure du projet

```
src/
├── components/
│   ├── common/        # AvatarImage, SignedImage, StyleLightbox, ErrorBoundary
│   ├── cta/           # Section appel à l'action
│   ├── features/      # Features, Phases, Testimonials, FAQ
│   ├── gallery/       # Galerie de styles
│   ├── header/hero/   # SplashScreen, Hero, TeeMockup, Particles
│   ├── home/          # BeforeAfter, LiveTicker, Products, WorksGallery
│   ├── layout/        # Header, Footer, Layout, PromoBanner, SectionDivider
│   └── order/         # OrderView
├── context/           # CampaignProvider + useCampaign (campagne active)
├── hooks/             # useImageUpload
├── lib/               # Client Supabase (supabase.js)
├── pages/             # HomePage, OrderPage, TrackingPage, AdminPage, EspacePage, LegalPages…
├── services/          # orders.js, campaigns.js, banner.js, print.js, session.js
└── utils/             # constants.js (styles, produits, statuts), image.js, phone.js
supabase/
├── functions/
│   ├── _shared/cors.ts          # en-têtes CORS des Edge Functions
│   └── generate-print-pdf/      # génération du PDF A4 d'impression (Deno + pdf-lib)
└── migrations/        # 0001_init … 0009_remediation
ui-test.mjs            # Test Playwright du flux complet (15 checks)
campaign-check.mjs     # Test campagnes + code promo (backend + bandeau)
promo-ui-check.mjs     # Test parcours commande avec promo (prix remisé)
print-check.mjs        # Test de génération du PDF (backend)
print-ui-check.mjs     # Test UI du bloc "Fichier d'impression" dans l'admin
remediation-check.mjs  # Trigger promo, E.164, workflow 7 statuts
```

## 🚀 Démarrage rapide

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production
npm run preview    # prévisualisation du build
npm run lint       # oxlint
```

### Variables d'environnement

Créer un fichier `.env.local` (jamais commité) :

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable_key>
```

Le client est désactivé proprement si ces variables sont absentes (le site reste navigable).

> ⚠️ **Hygiène des secrets** : `.env` est ignoré par git (`.gitignore`). Les clés sont publiques par conception (publishable), mais tout secret futur ne doit **jamais** y être ajouté. Les variables sont à déclarer dans le dashboard **Netlify** (Build & deploy → Environment) pour le build en ligne. Si `.env` est encore suivi par git, le retirer une fois les variables Netlify posées :
> ```bash
> git rm --cached .env
> ```

## 🗄️ Base de données (Supabase)

Le schéma est versionné dans `supabase/migrations/` et appliqué via la CLI Supabase :

```bash
supabase db push
```

- **Tables** : `orders` (commande, client, produit, avatar, options, statut, timeline, variations, imprimeur, promo), `admins`, `settings`, `campaigns`
- **RLS (Row Level Security)** : un client ne voit que ses propres commandes (`owner_user_id`) ; l'admin voit tout via la fonction `is_admin()`. **Aucun secret exposé côté client.**
- **Trigger `enforce_order_promo`** : `BEFORE INSERT OR UPDATE` revalide le code promo contre `campaigns` (actif + dates) et force la remise — un client ne peut pas falsifier la réduction.
- **Normalisation téléphone E.164** : `utils/phone.js` (10 chiffres → `+225…`, 13 chiffres `225…` conservés) ; `owner_phone` backfillé par la migration `0009`.
- **Storage** : bucket privé `media` — photos clients (`photos/{uid}/…`), déclinaisons (`variations/{code}/1.jpg…3.jpg`) et fichiers d'impression (`print/{code}.pdf`), servies via URLs signées (`SignedImage`).
- **RPC publiques (security definer, anonymisées)** :
  - `next_order_code()` → génère les codes `MT-XXXX`
  - `choose_variation()` → validation d'une déclinaison (autorise uniquement le statut `propositions_pretes`)
  - `order_stats()` → compteur de héros créés (public)
  - `recent_feed()` → ticker anonymisé (prénom + quartier + style + statut)
  - `get_active_campaign()` → campagne saisonnière active (automatique par date, admin = toggle)
  - `validate_promo(code)` → valide un code promo actif et renvoie la remise
- **Auth** : session anonyme automatique pour les clients ; admin par email/mot de passe.
- **Edge Function `generate-print-pdf`** déployée avec `verify_jwt = true` (config dans `supabase/config.toml`) + contrôle admin interne.

## 🧪 Tests

Tests Playwright (Chromium requis : `npx playwright install chromium` puis lancer le serveur de dev) :

```bash
npm run dev &
node ui-test.mjs           # Flux complet client + admin (15 checks)
node campaign-check.mjs    # Campagne active + validation code promo
node promo-ui-check.mjs    # Parcours commande avec code promo (prix remisé)
node print-check.mjs       # Génération du PDF A4 (backend)
node print-ui-check.mjs    # Bloc "Fichier d'impression" dans l'admin
node remediation-check.mjs # Trigger promo, E.164, workflow 7 statuts
```

## 🖨️ Workflow imprimeur (PDF A4 / DTF)

Quand une commande est `validee` (déclinaison choisie), un bloc **« Fichier d'impression »** apparaît dans l'admin :

1. **Générer le PDF A4** → Edge Function `generate-print-pdf` (Deno + pdf-lib) : télécharge la déclinaison, construit un A4 (bandeau méta : code, client, téléphone, produit, taille, couleur, imprimeur, date + mention DTF + boîte artwork), l'uploade dans `media/print/{code}.pdf` et met à jour `orders.print_pdf_path`.
2. **📄 Télécharger** / **Copier le lien** (URL signée 7 jours) / **💬 Envoyer à l'imprimeur** (WhatsApp avec lien).

CORS des Edge Functions géré via `supabase/functions/_shared/cors.ts` (préflight OPTIONS requis côté navigateur). Redéploiement (JWT vérifié par la gateway, config `supabase/config.toml`) :

```bash
npx supabase functions deploy generate-print-pdf --project-ref xgfageatdfugxeincfgc
```

## 🌍 Déploiement

Déployé automatiquement sur **Netlify** à chaque push sur `master`.

- `public/_redirects` gère le routing SPA (`/* /index.html 200`)
- La CLI Supabase est liée dans `supabase/.temp/` (non commité)

## 📞 Contact

- **Téléphone** : +225 07 16 53 55 80
- **WhatsApp** : +225 05 45 29 82 80
- **Adresse** : Abidjan, Côte d'Ivoire

---

_Né à Abidjan, taillé pour les héros._ 🔥
