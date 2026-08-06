# 🔌 API — MyToon

> Public : **développeurs, intégrateurs, mainteneurs**.
> MyToon n'expose pas d'API publique HTTP : l'intégration passe par les **RPC PostgreSQL** (via Supabase), les **policies RLS**, le **Storage** (URLs signées) et une **Edge Function** (`generate-print-pdf`). Ce document décrit chaque surface d'appel, ses paramètres, ses retours et ses droits.

## Sommaire

1. [Conventions](#1-conventions)
2. [RPC PostgreSQL](#2-rpc-postgresql)
3. [Edge Function `generate-print-pdf`](#3-edge-function)
4. [Tables & colonnes](#4-tables--colonnes)
5. [Storage](#5-storage)
6. [Exemples d'appels](#6-exemples-dappels)

---

## 1. Conventions

- **Client officiel** : `@supabase/supabase-js` (voir `src/lib/supabase.js`).
- **Authentification** : toutes les RPC sont exécutées avec le JWT de la session (anonyme client ou email/mdp admin).
- **RPC `security definer`** : elles contournent la RLS pour exécuter une logique métier contrôlée, puis exposent un résultat limité et anonymisé.
- **Erreurs** : les RPC lèvent des exceptions avec message en français ; `supabase-js` les retourne dans `error.message`.
- **Codes statuts** : workflow complet dans [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 2. RPC PostgreSQL

### 2.1 `next_order_code()`

Génère un code `MT-XXXX` séquentiel et atomique.

| Élément | Valeur |
| --- | --- |
| Signature | `next_order_code() → text` |
| Droits | `authenticated` |
| Retour | `MT-0001`, `MT-0002`, … |
| Source | `0002_order_code_rpc.sql` |

Implémentation : `INSERT … ON CONFLICT (key) DO UPDATE SET value = value + 1 RETURNING value` sur `counters('orders')`, formaté `MT-` + 4 chiffres.

### 2.2 `choose_variation(order_code text, variation_index int)`

Validation d'une déclinaison par le **client propriétaire**.

| Élément | Valeur |
| --- | --- |
| Signature | `choose_variation(text, int) → void` |
| Droits | `authenticated` |
| Paramètres | `order_code`, `variation_index` (0-based) |
| Source | `0001_init.sql`, re-définie en `0009_remediation.sql` |

Contrôles (dans l'ordre) :
1. la commande existe (sinon `commande introuvable`) ;
2. `owner_user_id = auth.uid()` (sinon `cette commande ne t'appartient pas`) ;
3. `status = 'propositions_pretes'` (sinon `commande pas en attente de validation`) ;
4. index dans les bornes du tableau `variations` (sinon `déclinaison invalide`).

Effet : `chosen_variation = variations[index]`, `status = 'validee'`, entrée de timeline.

> ℹ️ Depuis la remédiation `0009`, le statut `validation_attente` n'est plus accepté : seul `propositions_pretes` l'est.

### 2.3 `order_stats()`

Compteurs publics (preuve sociale, hero).

| Élément | Valeur |
| --- | --- |
| Signature | `order_stats() → jsonb` |
| Droits | `anon`, `authenticated` |
| Source | `0004_public_stats.sql` |

Retour :

```json
{ "orders": 42, "validated": 18 }
```

- `orders` : total de commandes.
- `validated` : commandes au statut `validee`, `en_impression`, `expediee` ou `livree`.

### 2.4 `recent_feed(n int default 8)`

Dernières commandes « visibles » pour le ticker social, **anonymisées**.

| Élément | Valeur |
| --- | --- |
| Signature | `recent_feed(int) → jsonb` |
| Droits | `anon`, `authenticated` |
| Paramètre | `n` (nombre de lignes, défaut 8) |
| Source | `0005_recent_feed.sql`, re-définie en `0009_remediation.sql` |

Retour : tableau `[{ name, quartier, style, status }]`.

- `name` : **prénom uniquement** (`split_part(client->>'nom', ' ', 1)`), repli « Un client ».
- `quartier` : repli « Abidjan ».
- `style` : `avatar ->> 'style'`.
- `status` : statut courant.
- Filtre : seuls les statuts visibles (`propositions_pretes` → `livree`) — aucun numéro de téléphone ni adresse n'est exposé.

### 2.5 `get_active_campaign()`

Campagne active « maintenant », déterminée par le serveur.

| Élément | Valeur |
| --- | --- |
| Signature | `get_active_campaign() → jsonb` |
| Droits | `anon`, `authenticated` |
| Source | `0006_campaigns.sql` |

Critères : `active = true` **et** `start_date <= now()` **et** (`end_date IS NULL` ou `end_date >= now()`). La plus ancienne (`created_at ASC`) est renvoyée.

Retour (ou `null`) :

```json
{
  "id": "…",
  "code": "halloween-2026",
  "name": "Halloween",
  "banner_text": "🎃 Halloween : -15% avec le code HALLOWEEN15",
  "accent_color": "#ff6b35",
  "promo_code": "HALLOWEEN15",
  "promo_discount": 15
}
```

### 2.6 `validate_promo(p_code text)`

Valide un code promo saisi par le client (affichage de la remise).

| Élément | Valeur |
| --- | --- |
| Signature | `validate_promo(text) → jsonb` |
| Droits | `anon`, `authenticated` |
| Paramètre | `p_code` (insensible à la casse) |
| Source | `0006_campaigns.sql` |

Retour (ou `null`) : `{ campaign_code, campaign_name, discount }`.

> ⚠️ `validate_promo` sert à **l'affichage**. Le **prix appliqué** est toujours recalculé par le trigger `enforce_order_promo` au moment de l'INSERT/UPDATE — voir [`SECURITY.md`](SECURITY.md).

### 2.7 `is_admin()`

Indique si le JWT courant correspond à un admin.

| Élément | Valeur |
| --- | --- |
| Signature | `is_admin() → boolean` |
| Droits | `authenticated` |
| Source | `0003_fix_admin_policy.sql` |

Implémentation `security definer` : `exists(select 1 from admins a where a.id = auth.uid())`. C'est la **base de toutes les policies admin** (corrige la récursion RLS).

---

## 3. Edge Function

### 3.1 `generate-print-pdf`

Génère le **PDF A4 imprimeur (DTF)** de la déclinaison validée d'une commande.

| Élément | Valeur |
| --- | --- |
| URL | `POST {SUPABASE_URL}/functions/v1/generate-print-pdf` |
| Auth | Header `Authorization: Bearer <admin JWT>` |
| `verify_jwt` | `true` (`supabase/config.toml`) |
| CORS | `_shared/cors.ts` (`*`, GET/POST/OPTIONS) |
| Source | `supabase/functions/generate-print-pdf/index.ts` |

**Requête**

```http
POST /functions/v1/generate-print-pdf HTTP/1.1
Authorization: Bearer <admin JWT>
Content-Type: application/json

{ "code": "MT-0001" }
```

**Réponses**

| Statut | Corps | Cas |
| --- | --- | --- |
| `200` | `{ "ok": true, "path": "print/mt-0001.pdf" }` | PDF généré et stocké |
| `400` | `{ "error": "code manquant" }` / `{ "error": "Aucune déclinaison validée" }` | Requête invalide |
| `401` | `{ "error": "Non connecté" }` / `{ "error": "JWT invalide" }` | JWT absent/invalide |
| `403` | `{ "error": "Non autorisé (admin requis)" }` | JWT valide mais pas admin |
| `404` | `{ "error": "Commande introuvable" }` | Code inconnu |
| `405` | `{ "error": "POST requis" }` | Méthode non supportée |
| `500` | `{ "error": "Échec enregistrement PDF…" }` | Upload / update échoué |
| `502` | `{ "error": "Impossible de charger l'image" }` | Image de la déclinaison injoignable |

**Comportement**

1. Vérifie le JWT (`getUser`) puis la présence dans `admins`.
2. Charge la commande (`code` normalisé : `trim().toUpperCase()`).
3. Exige `chosen_variation` non vide.
4. Crée une URL signée (3600 s) sur la déclinaison.
5. Construit le PDF A4 (595.28 × 841.89 pt) : bandeau méta (code, client, téléphone, produit, taille, couleur, imprimeur, date, mention DTF) + artwork au ratio conservé.
6. Upload `media/print/{code}.pdf` (upsert) et met à jour `orders.print_pdf_path`.

**Appel côté SPA** : `src/services/print.js` (`generatePrintPdf`, `getPrintPdfUrl`, `downloadPrintPdf`).

---

## 4. Tables & colonnes

Le détail des colonnes figure dans [`ARCHITECTURE.md`](ARCHITECTURE.md#4-schéma-de-base-de-données).

| Table | Accès client | Accès admin | Notes |
| --- | --- | --- | --- |
| `orders` | INSERT propre + SELECT propre (RLS) | SELECT/UPDATE tout | Pas d'UPDATE client direct |
| `admins` | — | SELECT (via `is_admin()`) | |
| `settings` | SELECT public | INSERT/UPDATE | Bandeau `promo` |
| `campaigns` | SELECT public | INSERT/UPDATE/DELETE | |
| `counters` | — | — | Utilisé par `next_order_code` |

---

## 5. Storage

Bucket `media` (privé). Chemins et droits : [`ARCHITECTURE.md`](ARCHITECTURE.md#6-storage).

Accès via `createSignedUrl` :

```js
const { data } = await supabase.storage.from('media').createSignedUrl(path, 3600)
```

- Déclinaisons : URL signée **1 h** (dans l'Edge Function).
- PDF imprimeur : URL signée **7 jours** (`getPrintPdfUrl`, `expiresIn = 60*60*24*7`).

---

## 6. Exemples d'appels

### RPC avec `supabase-js`

```js
// Code de commande
const { data: code } = await supabase.rpc('next_order_code')

// Valider la déclinaison 1 (0-based) de MT-0001
const { error } = await supabase.rpc('choose_variation', {
  order_code: 'MT-0001',
  variation_index: 0,
})

// Compteurs publics
const { data: stats } = await supabase.rpc('order_stats')

// Ticker social (5 entrées)
const { data: feed } = await supabase.rpc('recent_feed', { n: 5 })

// Campagne active
const { data: campaign } = await supabase.rpc('get_active_campaign')

// Valider un code promo
const { data: promo } = await supabase.rpc('validate_promo', { p_code: 'NOEL10' })
```

### Edge Function

```js
const resp = await fetch(`${supabaseUrl}/functions/v1/generate-print-pdf`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'MT-0001' }),
})
const body = await resp.json()
if (!resp.ok || !body?.ok) throw new Error(body?.error || 'Échec')
console.log(body.path) // print/mt-0001.pdf
```

### Créer une commande (résumé, `services/orders.js`)

```js
const { data, error } = await supabase
  .from('orders')
  .insert({
    code, owner_user_id: user.id, owner_phone: normalizePhone(client.telephone),
    client, product, avatar, options,
    photo_path, status: 'recue',
    timeline: [{ status: 'recue', date: new Date().toISOString(), note: 'Commande enregistrée' }],
    variations: [], chosen_variation: null, printer_id: null, promo,
  })
  .select()
  .single()
```

---

## Références croisées

- [ARCHITECTURE.md](ARCHITECTURE.md) — flux et schéma
- [SECURITY.md](SECURITY.md) — RLS, trigger, JWT
- [DECISIONS.md](DECISIONS.md) — arbitrages (DEC-004, DEC-007, DEC-008, DEC-010, DEC-011)
