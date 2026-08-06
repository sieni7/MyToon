# 🔒 Sécurité — MyToon

> Public : **développeurs, mainteneurs, auditeurs**.
> Vue d'ensemble : [`ARCHITECTURE.md`](ARCHITECTURE.md) · Portail : [`docs/README.md`](../README.md)

MyToon applique une défense en profondeur : RLS sur toutes les tables, RPC `security definer` pour la logique sensible, trigger serveur pour les prix, `verify_jwt` sur l'Edge Function, storage privé avec URLs signées, et hygiène stricte des secrets.

## Sommaire

1. [Modèle de confiance](#1-modèle-de-confiance)
2. [Row Level Security (RLS)](#2-row-level-security)
3. [Fonction `is_admin()`](#3-fonction-is_admin)
4. [RPC sécurisées](#4-rpc-sécurisées)
5. [Trigger `enforce_order_promo`](#5-trigger-enforce_order_promo)
6. [Edge Function & JWT](#6-edge-function--jwt)
7. [Storage privé](#7-storage-privé)
8. [Normalisation téléphone (E.164)](#8-normalisation-téléphone-e164)
9. [Hygiène des secrets](#9-hygiène-des-secrets)
10. [Modèle de menaces](#10-modèle-de-menaces)
11. [À compléter](#11-à-compléter)

---

## 1. Modèle de confiance

| Acteur | Identité | Périmètre |
| --- | --- | --- |
| **Client anonyme** | JWT de session anonyme (`auth.signInAnonymously`) | INSERT/SELECT sur ses propres commandes, RPC publiques, URL signées sur ses fichiers |
| **Client (session)** | JWT anonyme ou session restaurée | Idem, lié à `owner_user_id` |
| **Admin** | Email + mot de passe, présent dans `admins` | Tout sur `orders`, `settings`, `campaigns`, storage, Edge Function |
| **Public (anon)** | Pas de session | `settings` (lecture), `campaigns` (lecture), RPC `order_stats`, `recent_feed`, `get_active_campaign`, `validate_promo` |

**Règle d'or** : le client n'**écrit jamais** directement sur les tables métier. Les mises à jour passent par des RPC validées (ex. `choose_variation`) ou par l'admin.

---

## 2. Row Level Security

Activation : `0001_init.sql` (`alter table … enable row level security`) pour `orders`, `admins`, `settings` ; `0006_campaigns.sql` pour `campaigns`.

### Matrice des policies

| Table | Policy | Détail |
| --- | --- | --- |
| `orders` | `orders: insert own` | INSERT si `owner_user_id = auth.uid()` |
| `orders` | `orders: select own` | SELECT si `owner_user_id = auth.uid()` |
| `orders` | `orders: admins all` | ALL si `is_admin()` (via `0003`) |
| `admins` | `admins: select self` | SELECT si `is_admin()` |
| `settings` | `settings: public read` | SELECT pour `anon, authenticated` |
| `settings` | `settings: admins write` | ALL si `is_admin()` |
| `campaigns` | `campaigns: public read` | SELECT pour `anon, authenticated` |
| `campaigns` | `campaigns: admins write` | ALL si membre de `admins` |
| `counters` | — | Non exposée ; utilisée par RPC |

> ⚠️ **Aucune policy d'UPDATE/DELETE pour le client sur `orders`** : la validation de déclinaison passe obligatoirement par `choose_variation`.

---

## 3. Fonction `is_admin()`

`0003_fix_admin_policy.sql` corrige une **récursion RLS infinie** : les policies qui testaient `exists(select … from admins …)` sur la table `admins` elle-même bouclaient.

```sql
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public
as $$ select exists (select 1 from public.admins a where a.id = auth.uid()) $$;
```

- `security definer` : exécutée avec les droits du propriétaire → contourne la RLS de `admins`, plus de boucle.
- `set search_path = public` : évite le détournement `search_path`.
- Toutes les policies admin sont ensuite basées sur `is_admin()` (orders, settings, storage).

---

## 4. RPC sécurisées

Toutes sont `security definer` avec `set search_path = public`. Elles exécutent une logique contrôlée et n'exposent que des données **limitées et anonymisées**.

| RPC | Protection |
| --- | --- |
| `next_order_code()` | Compteur atomique (`ON CONFLICT DO UPDATE`), aucune donnée exposée |
| `choose_variation(code, idx)` | Vérifie propriété (`owner_user_id = auth.uid()`) **et** statut `propositions_pretes` **et** bornes de l'index |
| `order_stats()` | Ne renvoie que des **compteurs** agrégés (jamais de lignes) |
| `recent_feed(n)` | Ne renvoie que prénom + quartier + style + statut (anonymisé) |
| `get_active_campaign()` | Champs public d'une campagne, validés par dates |
| `validate_promo(code)` | Ne renvoie que `{ campaign_code, campaign_name, discount }` |

Détails et signatures : [`API.md`](API.md).

---

## 5. Trigger `enforce_order_promo`

`0009_remediation.sql` — **la promo est autoritaire côté serveur**.

- `BEFORE INSERT OR UPDATE ON orders`.
- Revalide `NEW.promo->>'code'` contre `campaigns` (code actif, dates valides).
- Écrase `NEW.promo` avec le discount **calculé par la base** :
  ```sql
  new.promo := jsonb_build_object('code', upper(btrim(...)), 'discount', c.promo_discount);
  ```
- Si le code est absent/invalide → `new.promo := null`.

**Conséquence** : un client qui falsifie la remise dans son payload voit sa promo neutralisée ou recalculée. Le prix affiché est recalculé via `priceWithPromo` dans `constants.js`, mais l'autorité finale reste la base.

---

## 6. Edge Function & JWT

`supabase/functions/generate-print-pdf/index.ts`

| Mesure | Implémentation |
| --- | --- |
| `verify_jwt = true` | `supabase/config.toml` → `[functions.generate-print-pdf]` |
| JWT requis | `401` si header `Authorization` absent ou JWT invalide |
| Contrôle admin | `403` si l'utilisateur n'est pas dans `admins` |
| CORS | `_shared/cors.ts` (`*`, GET/POST/OPTIONS) |
| Données | Aucun log sensible ; l'image est chargée via URL signée (1 h) |

---

## 7. Storage privé

Bucket **`media`** créé en `public = false` (`0001_init.sql`).

Policies storage :

| Policy | Chemin | Règle |
| --- | --- | --- |
| `media: upload own photo` | `photos/{uid}/…` | INSERT si `[1] = photos` et `[2] = auth.uid()` |
| `media: admin upload variations` | `variations/{code}/…` | INSERT si `[1] = variations` et `is_admin()` |
| `media: read own photo` | `photos/{uid}/…` | SELECT si `[2] = auth.uid()` |
| `media: read own variations` | `variations/{code}/…` | SELECT si la commande du code appartient au client |
| `media: admins all` | `media` | ALL si `is_admin()` |

- Le navigateur ne reçoit **jamais** de fichier brut : uniquement des **URLs signées** (`createSignedUrl`).
- Durées : déclinaisons 1 h (Edge), PDF imprimeur 7 jours (`print.js`).
- Chemin `print/{code}.pdf` : accessible uniquement via URL signée ; aucun policy de lecture directe pour `anon`.

---

## 8. Normalisation téléphone (E.164)

`src/utils/phone.js` :

```js
normalizePhone('0716535580')   // → '+2250716535580' (10 chiffres → préfixe +225)
normalizePhone('2250716535580') // → '+2250716535580' (13 chiffres 225… conservés)
```

- Appliqué à `orders.owner_phone` à l'insertion (`services/orders.js`).
- `0009_remediation.sql` a **backfillé** les lignes existantes depuis `client.telephone` (mêmes règles, repli `+<chiffres>`).
- Usage : contact opérationnel (imprimeur, relances).

---

## 9. Hygiène des secrets

| Règle | État |
| --- | --- |
| `.env`, `.env.local` ignorés | `.gitignore` |
| `.env` retiré du suivi git | Commit `cb07c91` (`git rm --cached .env`) |
| Clés `VITE_SUPABASE_*` en production | Variables **Netlify** (dashboard ou `netlify env:import`) |
| Clé **service** (`SUPABASE_SECRET_KEY`) | Jamais dans le repo ; réservée aux scripts backend (`scripts/seed-admin.mjs`, tests) |
| RPC `next_order_code` | Vérifie l'authentification, compteur atomique |
| Edge Function | N'utilise que les variables d'env Supabase standard (jamais de secret custom dans le bundle) |

> ⚠️ Vérification conseillée : `git log -p -- .env` pour s'assurer qu'aucun secret n'est resté dans l'historique. **À compléter** : rotation des clés (voir [`OPERATIONS.md`](../admin/OPERATIONS.md)).

---

## 10. Modèle de menaces

| Menace | Atténuation |
| --- | --- |
| Client lit les commandes d'autrui | RLS `select own` + `owner_user_id` |
| Client modifie sa commande (prix, statut) | Pas d'UPDATE client ; `choose_variation` strict ; trigger promo |
| Client force une promo | Trigger `enforce_order_promo` (recalcul serveur) |
| Accès aux fichiers d'autrui | Storage privé + URLs signées + policies par chemin |
| Exfiltration du ticker (données privées) | `recent_feed` anonymisé (prénom + quartier + style + statut) |
| Appel à l'Edge Function sans droit | `verify_jwt` + contrôle `admins` (401/403) |
| Récursion RLS / escalade admin | `is_admin()` `security definer` + `search_path` fixé |
| Secret commité | `.gitignore`, `git rm`, variables Netlify, revue d'historique |
| Injection SQL | Paramétrage via Supabase (client), fonctions SQL à requêtes préparées |

---

## 11. À compléter

- [ ] Audit RLS externe (revue par un tiers).
- [ ] Rotation périodique des clés (Supabase / Netlify).
- [ ] Rate limiting sur les RPC publiques et l'Edge Function.
- [ ] `security.txt` (point de contact sécurité) + politique de divulgation.
- [ ] Revue de l'historique git pour secrets résiduels.
- [ ] Tests de pénétration (OWASP Top 10) sur le flux de commande.

---

## Références croisées

- [ARCHITECTURE.md](ARCHITECTURE.md) — schéma, storage, auth
- [API.md](API.md) — signatures et droits des RPC
- [DECISIONS.md](DECISIONS.md) — DEC-008 (trigger), DEC-011 (verify_jwt)
- [OPERATIONS.md](../admin/OPERATIONS.md) — procédures en cas d'incident
