# 🎨 Design System — MyToon

> Public : **développeurs, designers, intégrateurs**.
> Version courte dans le [`README.md`](../../README.md). Portail : [`docs/README.md`](../README.md)

Le design system de MyToon vit dans `src/styles/globals.css` (tokens, composants, keyframes) et `src/styles/responsive.css` (breakpoints). Ce document en est la référence : chaque élément cité provient du code.

## Sommaire

1. [Tokens couleurs](#1-tokens-couleurs)
2. [Typographie](#2-typographie)
3. [Boutons](#3-boutons)
4. [Surfaces & effets](#4-surfaces--effets)
5. [Textes dégradés](#5-textes-dégradés)
6. [Badges & états](#6-badges--états)
7. [Animations](#7-animations)
8. [Layout & grilles](#8-layout--grilles)
9. [Breakpoints responsive](#9-breakpoints-responsive)
10. [Icônes](#10-icônes)

---

## 1. Tokens couleurs

Déclarés dans `:root` (`src/styles/globals.css`).

### Neutres (thème sombre)
| Token | Valeur | Usage |
| --- | --- | --- |
| `--black` | `#0a0a0a` | Fond principal |
| `--black-2` | `#111111` | Surfaces |
| `--black-3` | `#1a1a1a` | Cartes |
| `--black-4` | `#222222` | Surfaces hautes |
| `--white` | `#ffffff` | Texte principal |

### Accents
| Token | Valeur | Usage |
| --- | --- | --- |
| `--orange` | `#ff6b35` | Accent principal, CTA, badges |
| `--orange-light` | `#ff8c5a` | Hover / dégradés |
| `--orange-dark` | `#e55a2b` | Fond des dégradés |
| `--yellow` | `#fbbf24` | Secondaire, étapes, succès |
| `--yellow-light` | `#fcd34d` | Variante |

### Premium & styles
| Token | Valeur | Usage |
| --- | --- | --- |
| `--gold` | `#d4af37` | Premium, bordures |
| `--gold-light` | `#f0d98c` | Texte doré |
| `--gold-dim` | `rgba(212,175,55,0.22)` | Bordures cartes dorées |
| `--gold-halo` | `rgba(212,175,55,0.06)` | Halos d'ombre |
| `--purple` | `#7c3aed` | Style Sketch |
| `--pink` | `#ec4899` | Style Cartoon |
| `--cyan` | `#06b6d4` | Style Pop Art |

### Textes secondaires
| Token | Valeur |
| --- | --- |
| `--gray-400` | `#a3a3a3` |
| `--gray-500` | `#737373` |
| `--gray-600` | `#525252` |

> Les couleurs des **styles** sont aussi déclarées dans `src/utils/constants.js` (`STYLES[].color` et `.bg` — dégradés `linear-gradient`). Sources de vérité : `--yellow` (Manga), `--orange` (Comics), `--pink` (Cartoon), `--cyan` (Pop Art), `--purple` (Sketch).

---

## 2. Typographie

Chargées via Google Fonts :

| Police | Graisses | Usage |
| --- | --- | --- |
| **Poppins** | 400 → 900 | Texte, interfaces, boutons |
| **Space Grotesk** | 400 → 700 | Titres, logo, prix, numéros |

Baseline : `font-size: 16px`, `line-height: 1.6`, `-webkit-font-smoothing: antialiased`.

Tailles de titres en usage (responsive) :
- `.section-title` — défaut ~36 px, 28 px sous 768 px, 28 px sous 480 px.
- `.hero-title` — 36 px sous 768 px, 28 px sous 480 px.
- `.cta-title` — 26 px sous 768 px.

---

## 3. Boutons

| Classe | Rendu | Usage |
| --- | --- | --- |
| `.btn` | Base : flex, padding 16/36, radius 12, `font-weight 700`, majuscules | Tous les boutons |
| `.btn-primary` | Dégradé orange → orange-dark ; hover lift + shadow `rgba(255,107,53,.4)` | Action principale |
| `.btn-secondary` | Transparent, bordure `--gray-600` ; hover bordure+texte orange | Action secondaire |
| `.btn-portal` | Dégradé orange → yellow, texte noir, `font-weight 800`, radius 16, **animation `pulse-portal`** + halo animé (`border-rotate`), hover scale + double glow | CTA hero « Activer mon pouvoir » |
| `.btn:disabled` | Opacité 0.45, `cursor: not-allowed`, grayscale, aucune animation | États de chargement/blocage |

---

## 4. Surfaces & effets

### Glassmorphism
| Classe | Propriétés |
| --- | --- |
| `.glass` | `background rgba(20,20,20,.5)`, `backdrop-filter blur(18px)`, bordure `rgba(255,255,255,.08)` |
| `.glass-strong` | `background rgba(17,17,17,.72)`, `backdrop-filter blur(24px)`, bordure `rgba(255,255,255,.1)` |

### Cartes dorées
`.card-gold` : bordure `--gold-dim`, halo `0 0 28px var(--gold-halo)`, hover : bordure renforcée + halo `0 0 44px` + `translateY(-4px)`.

### Zone d'upload
`.upload-dropzone` : drag & drop (hauteur 240 px sous 768 px), préview intégrée (`UploadArea.jsx`).

---

## 5. Textes dégradés

| Classe | Rendu |
| --- | --- |
| `.gradient-text` | Dégradé `linear-gradient(135deg, var(--orange), var(--yellow))`, texte transparent (clip) |
| `.gold-text` | Dégradé `linear-gradient(135deg, var(--gold-light), var(--gold))` |

Utilisés systématiquement pour les mots-clés des titres (ex. « Ton parcours de **héros** », « Mon **espace** »).

---

## 6. Badges & états

| Classe | Rendu | Usage |
| --- | --- | --- |
| `.badge-bientot` | Texte `--gold-light`, fond `rgba(212,175,55,.12)`, bordure dorée, radius 100px, uppercase | Styles Cartoon / Sketch « ⏳ Bientôt » |
| `.style-disabled` | Opacité 0.7, `cursor: not-allowed`, hover `translateY(-2px)` | Styles non actifs |

---

## 7. Animations

Toutes les `@keyframes` déclarées dans `globals.css` :

| Keyframe | Usage |
| --- | --- |
| `spin` | Loaders (rotation) |
| `float` | Mockup t-shirt du hero (`translateY ±12px`) |
| `pulse-portal` | Glow du CTA hero (`0 0 60px` orange + jaune) |
| `border-rotate` | Halo rotatif du `.btn-portal` (hue-rotate + blur) |
| `reveal` | Apparition scale (`0.8 → 1`) |
| `typewriter` + `blink` | Effet machine à écrire |
| `pop` | Succès (scale `1 → 1.2 → 1`) |
| `twinkle` | Particules/étoiles (opacité + scale) |
| `slide-up` | Entrées de sections (`translateY(40px) → 0`) |
| `shimmer` | Skeleton / reflets |
| `count-up` | Compteurs (fade + slide) |
| `progress-fill` | Barres de progression (largeur `0 → auto`) |
| `lightning-flash` | Effet éclair (scaleY + opacité) |
| `pulse` | Ticker « En direct » (opacité + scale) |
| `ticker-in` | Entrée des lignes du ticker (`translateY(8px)`) |

---

## 8. Layout & grilles

| Classe / sélecteur | Rôle |
| --- | --- |
| `.container` | Max-width 1200 px, padding 0 24 px, centré |
| `.section` | Padding vertical 100 px (60 px sous 768 px) |
| `.section-title` | Titre de section |
| `.hero-grid` | Hero : 2 colonnes (texte / mockup) |
| `.gallery-grid` | Galerie des styles |
| `.products-grid` | Produits (tee / polo) |
| `.features-grid` | Valeurs, témoignages |
| `.beforeafter-grid` + `.ba-arrow` | Avant/après avec flèche (rotation 90° en mobile) |
| `.order-form` | Formulaire de commande (2 colonnes → 1) |
| `.variations-grid` | Choix de la déclinaison |
| `.tracking-photo-row` | Photo + infos du suivi |
| `.admin-stats` | Cartes statistiques admin (2 colonnes sous 768 px) |
| `.admin-grid-row` | Ligne de commande admin (1 colonne sous 768 px) |
| `.cta-card` / `.cta-content` / `.cta-title` | Section appel à l'action finale |
| `.nav-desktop` / `.hamburger-btn` | Navigation desktop / menu mobile |
| `.style-lightbox` | Lightbox détail d'un style |
| `.footer-inner` / `.footer-links` / `.footer-social` / `.footer-pay` / `.footer-bottom` | Pied de page |

> ℹ️ La majorité des composants appliquent un **style inline** (objets `style={…}` dans les `.jsx`) en plus des classes utilitaires ; les tokens CSS servent de palette cohérente.

---

## 9. Breakpoints responsive

`src/styles/responsive.css` :

| Breakpoint | Comportements clés |
| --- | --- |
| **≤ 768 px** | Hero en une colonne (mockup au-dessus), menu hamburger, grilles en 1 colonne (gallery en 2), `.section` padding 60 px, `order-form`/`variations-grid`/`admin-grid-row` en 1 colonne, `admin-stats` en 2 colonnes, `.btn-portal` réduit (15/32) |
| **≤ 480 px** | `.hero-title` 28 px, `gallery-grid` en 1 colonne |

---

## 10. Icônes

MyToon n'utilise pas de bibliothèque d'icônes : les icônes sont des **emojis** (voir `src/utils/constants.js` : statuts 📩🎨✨✅🖨️🚚📦, styles 📖💥🎨🎭✏️, étapes 👕📷🎨✅📄🚚) et quelques symboles texte (➜).

---

## Références croisées

- [ARCHITECTURE.md](ARCHITECTURE.md) — structure des composants (`src/components/`)
- [PRODUCT.md](../product/PRODUCT.md) — direction artistique (streetwear abidjanais)
- [DECISIONS.md](DECISIONS.md) — DEC-005 (React+Vite, CSS custom)
