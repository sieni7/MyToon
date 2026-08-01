# MyToon 🦸

**Ta photo. Ton avatar. Ton tee-shirt.** Boutique streetwear à Abidjan : envoie ta photo, choisis un style (Manga, Comics, Pop Art…), et reçois un t-shirt ou un polo 100 % coton local imprimé avec ton héros — livré en 24-48 h.

## ✨ Fonctionnalités

- **Commande en 3 étapes** : photo → style/avatar → t-shirt ou polo (10 000 / 15 000 FCFA)
- **3 déclinaisons en 1 h** : l'opérateur crée manuellement 3 versions de ton toon à partir de ta photo — aucune transformation automatique, le rendu est fait par un vrai artiste
- **Suivi de commande en temps réel** avec code public `MT-XXXX` et 8 statuts :
  `recue → en_creation → propositions_pretes → validation_attente → validee → en_impression → expediee → livree`
- **Validation client** : le client choisit sa déclinaison préférée avant impression
- **Espace client** : historique et détails des commandes
- **Atelier (dashboard admin)** : files de travail par statut, dépôt des déclinaisons, assignation d'un imprimeur, timeline complète
- **Preuve sociale** : ticker « En direct » des dernières commandes (anonymisé) et compteur réel de héros créés
- **Paiement à la livraison**, livraison Abidjan 24-48 h

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
│   ├── common/        # AvatarImage, SignedImage, StyleLightbox
│   ├── cta/           # Section appel à l'action
│   ├── features/      # Features, Phases, Testimonials, FAQ
│   ├── gallery/       # Galerie de styles
│   ├── header/hero/   # SplashScreen, Hero, TeeMockup, Particles
│   ├── home/          # BeforeAfter, LiveTicker, Products, WorksGallery
│   ├── layout/        # Header, Footer, Layout, PromoBanner, SectionDivider
│   └── order/         # OrderView
├── hooks/             # useImageUpload
├── lib/               # Client Supabase (supabase.js)
├── pages/             # HomePage, OrderPage, TrackingPage, AdminPage, EspacePage…
├── services/          # orders.js, banner.js, session.js
└── utils/             # constants.js (styles, produits, statuts), image.js
supabase/
└── migrations/        # 0001_init … 0005_recent_feed
ui-test.mjs            # Test Playwright du flux complet (15 checks)
hero-check.mjs         # Test du hero
ticker-check.mjs       # Test du ticker
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

## 🗄️ Base de données (Supabase)

Le schéma est versionné dans `supabase/migrations/` et appliqué via la CLI Supabase :

```bash
supabase db push
```

- **Tables** : `orders` (commande, client, produit, avatar, options, statut, timeline, variations, imprimeur), `admins`, `settings`
- **RLS (Row Level Security)** : un client ne voit que ses propres commandes (`owner_user_id`) ; l'admin voit tout via la fonction `is_admin()`. **Aucun secret exposé côté client.**
- **Storage** : bucket privé `media` — photos clients (`photos/{uid}/…`) et déclinaisons (`variations/{code}/1.jpg…3.jpg`), servies via URLs signées (`SignedImage`).
- **RPC publiques (security definer, anonymisées)** :
  - `next_order_code()` → génère les codes `MT-XXXX`
  - `choose_variation()` → validation d'une déclinaison par le client
  - `order_stats()` → compteur de héros créés (public)
  - `recent_feed()` → ticker anonymisé (prénom + quartier + style + statut)
- **Auth** : session anonyme automatique pour les clients ; admin par email/mot de passe.

## 🧪 Tests

Tests Playwright (Chromium requis : `npx playwright install chromium` puis lancer le serveur de dev) :

```bash
npm run dev &
node ui-test.mjs        # Flux complet client + admin (15 checks)
node hero-check.mjs     # Hero, mockup, carrousel, redirection
node ticker-check.mjs   # Ticker « En direct »
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
