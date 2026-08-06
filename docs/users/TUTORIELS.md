# 🧭 Tutoriels — MyToon

> Public : **utilisateurs, administrateurs, développeurs**. Chaque tutoriel est numéroté et indique son public, ses prérequis et le résultat attendu.
> Portail : [`docs/README.md`](../README.md)

## Sommaire

- [T1 · Première commande (client)](#t1--première-commande-client)
- [T2 · Première campagne promo (admin)](#t2--première-campagne-promo-admin)
- [T3 · Changer le statut d'une commande (admin)](#t3--changer-le-statut-dune-commande-admin)
- [T4 · Ajouter un nouveau style (développeur)](#t4--ajouter-un-nouveau-style-développeur)
- [T5 · Créer un compte administrateur (développeur)](#t5--créer-un-compte-administrateur-développeur)
- [T6 · Déployer sur Netlify (développeur)](#t6--déployer-sur-netlify-développeur)
- [T7 · Déployer les migrations et l'Edge Function Supabase (développeur)](#t7--déployer-les-migrations-et-ledge-function-supabase-développeur)

---

## T1 · Première commande (client)

**Public** : client · **Durée** : < 5 minutes · **Résultat** : un code `MT-XXXX`.

### Étapes

1. Rends-toi sur la page d'accueil et clique sur **« Activer mon pouvoir »** (ou directement sur « Commander »).
2. **Étape 1 — Avatar** : choisis ton style toon (Manga, Comics, Pop Art) et la référence d'avatar qui te plaît.
3. **Étape 2 — Support** : choisis le produit (**T-shirt 10 000 FCFA** ou **Polo 15 000 FCFA**), la taille et la couleur.
4. **Étape 3 — Photo + infos** : dépose une photo nette de ton visage, renseigne ton nom, ton téléphone et ton adresse de livraison à Abidjan.
   - (Option) saisis un **code promo** s'il est actif — la remise est recalculée côté serveur.
5. Valide → tu reçois ton **numéro de commande `MT-XXXX`** (page de confirmation).

### Résultat attendu

- Un numéro de commande commençant par `MT-`.
- Ta commande est au statut `📩 Commande reçue`.
- Tes **3 déclinaisons** seront prêtes sous **1 heure** (statut `✨ 3 propositions prêtes`), à choisir sur la page `/suivi`.

### Après

- Suis ta commande : `/suivi` → saisis `MT-XXXX`.
- Quand les propositions sont prêtes : choisis ta préférée (ta validation lance l'impression).
- Paiement **à la livraison** (Wave, Orange Money, MTN MoMo, espèces).

> 💡 Détails dans le [`CENTRE-AIDE.md`](CENTRE-AIDE.md).

---

## T2 · Première campagne promo (admin)

**Public** : administrateur · **Durée** : ~3 minutes · **Résultat** : un bandeau + un code promo actifs sur le site.

### Étapes

1. Connecte-toi à l'**Atelier** (`/admin`) avec ton compte administrateur.
2. Ouvre l'onglet **🎉 Campagnes**.
3. Clique sur **« ➕ Nouvelle campagne »** (formulaire en bas de page).
4. Remplis :
   - **Nom** : ex. « Noël 2026 »
   - **Code** : identifiant unique en minuscules, ex. `noel-2026`
   - **Début / Fin** : fenêtre de validité (dates et heures) — la fin peut rester vide pour une campagne illimitée
   - **Texte du bandeau** : ex. `🎄 Noël : -10% avec le code NOEL10`
   - **Code promo** : ex. `NOEL10` (insensible à la casse côté client)
   - **Remise (%)** : ex. `10`
   - **Couleur d'accent** : couleur du bandeau (défaut `#ff6b35`)
   - **Activer immédiatement** : coche pour rendre la campagne active tout de suite
5. Clique sur **« Créer la campagne »**.

### Résultat attendu

- Le bandeau s'affiche sur **tout le site** avec la couleur d'accent choisie.
- Le code promo est accepté à la commande (remise affichée et **recalculée côté serveur** par le trigger `enforce_order_promo`).

### Activer / désactiver ensuite

Sur la carte de la campagne, utilise **Activer / Désactiver** (à tout moment), **Modifier** ou **Suppr.** (confirmation requise).

> ⚠️ La désactivation manuelle prime sur les dates : une campagne `active = false` n'est jamais servie, même dans sa fenêtre. Voir [`OPERATIONS.md`](../admin/OPERATIONS.md).

---

## T3 · Changer le statut d'une commande (admin)

**Public** : administrateur · **Résultat** : la commande avance dans le workflow 7 statuts.

### Les transitions possibles depuis la carte commande

| Statut actuel | Action proposée | Statut suivant |
| --- | --- | --- |
| `recue` | « Marquer en création » | `en_creation` |
| `validee` | « Passer en impression » | `en_impression` |
| `en_impression` | « Passer en expédition » | `expediee` |
| `expediee` | « Marquer comme livrée » | `livree` |

### Étapes

1. Atelier (`/admin`) → onglet **🛠️ Commandes**.
2. Ouvre la carte de la commande (clic sur l'en-tête).
3. Selon le statut, clique sur l'action proposée (ex. **« Marquer en création »** pour une commande `recue`).

### Notes importantes

- **`en_creation` → `propositions_pretes`** : ce passage se fait automatiquement quand tu **déposes les 3 déclinaisons** (bouton « Déposer les 3 déclinaisons »). Tu n'as pas de bouton dédié.
- **`propositions_pretes` → `validee`** : réservé au **client** (RPC `choose_variation`). L'admin attend que le client choisisse.
- Le bouton **« Passer en impression »** n'apparaît que lorsque la commande est `validee` **et** que la déclinaison a été choisie.
- Chaque transition ajoute une entrée dans la **timeline** de la commande (visible par le client sur `/suivi`).

> 💡 Rappel : une commande ne peut **jamais** être imprimée avant la validation du client (défense du workflow).

---

## T4 · Ajouter un nouveau style (développeur)

**Public** : développeur · **Prérequis** : accès au repo · **Résultat** : un nouveau style sélectionnable dans la galerie.

### Étapes

1. Ouvre `src/utils/constants.js`.
2. Ajoute une entrée dans `STYLES` :
   ```js
   {
     id: 'mon-style', name: 'Mon Style', emoji: '🔥', color: '#ff0000',
     desc: 'Courte description',
     bg: 'linear-gradient(135deg, #ff0000, #ff8800)',
     details: 'Longue description pour la lightbox.',
     particularites: ['Point 1', 'Point 2'],
     origine: 'Source d\'inspiration',
     date: 'Bientôt disponible', // ou une date réelle
   },
   ```
3. Ajoute un avatar actif associé dans `AVATARS` :
   ```js
   { id: 'monstyle-01', style: 'mon-style', image: '/avatars/avatar-monstyle-01.jpg', name: 'Toon Mon Style 01', enabled: true },
   ```
   et place le fichier image dans `public/avatars/`.
4. `ACTIVE_STYLES` et `GALLERY_STYLES` se calculent automatiquement (filtre sur `enabled`).
5. **Aucune migration nécessaire** tant que le style est géré en front (l'`avatar.style` est stocké en jsonb dans `orders.avatar`).

### Résultat attendu

- Le style apparaît dans la galerie (trié : actifs en premier, badge **⏳ Bientôt** si `enabled: false`).
- L'avatar avec `enabled: true` est proposé à la commande.

### Vérifier

```bash
npm run lint
npm run build
```

> ⚠️ Respecte les conventions d'ID : minuscules, tirets (`manga`, `pop-art`…). L'ID est stocké dans les commandes : ne le renomme pas sans migration de données.

---

## T5 · Créer un compte administrateur (développeur)

**Public** : développeur · **Prérequis** : variables d'env avec clé service · **Résultat** : un compte admin connectable sur `/admin`.

### Étapes

1. Définis les variables d'environnement (jamais dans le repo) :
   ```powershell
   $env:SUPABASE_URL="https://<project>.supabase.co"
   $env:SUPABASE_SECRET_KEY="sb_secret_..."
   $env:ADMIN_EMAIL="ton@email.com"
   $env:ADMIN_PASSWORD="un-mot-de-passe-fort"
   ```
2. Exécute le script :
   ```bash
   node scripts/seed-admin.mjs
   ```
3. La sortie attendue : `✅ Administrateur créé : ton@email.com`.

### Ce que fait le script

- Crée l'utilisateur Auth (`email_confirm: true`).
- Insère son `id` dans la table `admins` (ce qui le rend administrateur selon `is_admin()`).

### Vérifier

Connecte-toi sur `https://<site>/admin` avec l'email/mot de passe → le dashboard **Atelier** s'ouvre.

> ⚠️ Un compte **non présent** dans `admins` voit « Ce compte n'est pas un administrateur MyToon » après connexion.
> Alternative : créer l'utilisateur dans le dashboard Supabase puis insérer `admins(id, email)` via le SQL Editor.

---

## T6 · Déployer sur Netlify (développeur)

**Public** : développeur · **Prérequis** : dépôt sur GitHub + compte Netlify lié · **Résultat** : site en ligne après un push.

### Étapes

1. **Lier le dépôt** : Netlify → Add new site → Import from Git → `github.com/sieni7/MyToon` → branche `master`, commande de build `npm run build`, dossier `dist`.
2. **Variables d'environnement** (Build & deploy → Environment, ou CLI) :
   ```bash
   netlify env:set VITE_SUPABASE_URL https://<project>.supabase.co
   netlify env:set VITE_SUPABASE_PUBLISHABLE_KEY sb_publishable_...
   ```
   ou import depuis un fichier :
   ```bash
   netlify env:import .env
   ```
3. **Routing SPA** : le fichier `public/_redirects` (`/* /index.html 200`) est inclus automatiquement dans le build.
4. **Pousse** sur `master` :
   ```bash
   git push origin master
   ```

### Résultat attendu

- Un déploiement Netlify démarre automatiquement à chaque push.
- Les routes profondes (`/commande`, `/suivi`, `/admin`…) fonctionnent au rechargement (fallback SPA).

### Vérifier

```bash
netlify open --site
# ou
curl -s https://my-toon.netlify.app/ | head
```

> ⚠️ **Hygiène des secrets** : `.env` est dans `.gitignore`. Ne commite jamais `.env` ni de clé service. Voir [`SECURITY.md`](../developers/SECURITY.md).

---

## T7 · Déployer les migrations et l'Edge Function Supabase (développeur)

**Public** : développeur · **Prérequis** : CLI Supabase liée au projet · **Résultat** : schéma à jour + Edge Function en ligne.

### Étapes

1. **Lier la CLI au projet** (une fois) :
   ```bash
   npx supabase link --project-ref xgfageatdfugxeincfgc
   ```
2. **Appliquer les migrations** (0001 → 0009, dans l'ordre) :
   ```bash
   npx supabase db push
   ```
   > ⚠️ Ne modifie jamais une migration déjà appliquée en production : ajoute `0010_….sql`.

3. **Déployer l'Edge Function** (`verify_jwt = true` dans `supabase/config.toml`) :
   ```bash
   npx supabase functions deploy generate-print-pdf --project-ref xgfageatdfugxeincfgc
   ```

### Résultat attendu

- Tables `orders`, `admins`, `settings`, `campaigns`, `counters` créées, RLS actives.
- RPC disponibles (`next_order_code`, `choose_variation`, `order_stats`, `recent_feed`, `get_active_campaign`, `validate_promo`, `is_admin`).
- Trigger `enforce_order_promo` actif sur `orders`.
- `https://<project>.supabase.co/functions/v1/generate-print-pdf` répond (au minimum `401` sans JWT).

### Vérifier

```bash
npx supabase functions list --project-ref xgfageatdfugxeincfgc
```

> ⚠️ La génération PDF exige une commande `validee` avec déclinaison choisie — un `400` « Aucune déclinaison validée » est le comportement normal si ce n'est pas le cas.

---

## Références croisées

- [CENTRE-AIDE.md](CENTRE-AIDE.md) — parcours client
- [GUIDE-ADMIN.md](../admin/GUIDE-ADMIN.md) — manuel opérateur
- [API.md](../developers/API.md) — signatures RPC et Edge Function
- [SECURITY.md](../developers/SECURITY.md) — bonnes pratiques de déploiement
