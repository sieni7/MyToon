# 🚨 Exploitation & opérations — MyToon

> Public : **administrateurs, mainteneurs, équipe d'exploitation**.
> Ce document rassemble les procédures « Que faire si… » pour l'exploitation quotidienne du produit en production.
> Portail : [`docs/README.md`](../README.md)

**Légende des niveaux** : 🔴 Critique (à traiter immédiatement) · 🟠 Élevé (sous 1 h) · 🟡 Normal (sous 24 h) · 🟢 Routine.

## Sommaire

- [Règles générales](#règles-générales)
- [O1 · Supabase est indisponible](#o1--supabase-est-indisponible)
- [O2 · Netlify ne déploie plus](#o2--netlify-ne-déploie-plus)
- [O3 · L'Edge Function échoue](#o3--ledge-function-échoue)
- [O4 · Un PDF ne se génère pas](#o4--un-pdf-ne-se-génère-pas)
- [O5 · Un client perd sa commande](#o5--un-client-perd-sa-commande)
- [O6 · Un imprimeur est indisponible](#o6--un-imprimeur-est-indisponible)
- [O7 · Un artiste est absent](#o7--un-artiste-est-absent)
- [O8 · Une campagne promo doit être désactivée](#o8--une-campagne-promo-doit-être-désactivée)
- [O9 · Mises à jour et maintenance](#o9--mises-à-jour-et-maintenance)
- [Contacts opérationnels](#contacts-opérationnels)

---

## Règles générales

1. **Toujours documenter** l'incident et sa résolution dans le [`CHANGELOG.md`](../product/CHANGELOG.md) si une correction de code est impliquée.
2. **Ne jamais modifier** une migration déjà appliquée en production (voir [`ARCHITECTURE.md`](../developers/ARCHITECTURE.md)).
3. **Ne jamais exposer** de secret dans les logs, le support client ou les issues.
4. En cas de doute entre l'état du code et la base, **la base de données est l'autorité** (prix, statuts, campagnes).
5. Avant de redéployer un correctif, appliquer la **Documentation Policy** (voir [`docs/README.md`](../README.md)).

---

## O1 · Supabase est indisponible

**Niveau** : 🟠 · **Durée estimée** : 10-30 min · **Symptômes** : le site reste navigable (statiques Netlify) mais la commande/suivi/atelier échouent ; erreurs réseau sur les appels `supabase.*`.

### Étapes

1. **Vérifier l'état** : https://status.supabase.com
2. **Tester la connexion** :
   ```bash
   curl -s https://<project>.supabase.co/rest/v1/ | head
   ```
   Réponse `401` → l'API répond (auth requise, normal). Absence de réponse / timeout → incident.
3. **Vérifier les identifiants** : `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` (Netlify). Une variable vide provoque un « site navigable mais commande impossible ».
4. **Atténuation immédiate** :
   - Le site **reste consultable** (contenu statique).
   - L'atelier ne peut plus traiter : préviens l'équipe, note les commandes arrivées hors-ligne pour traitement différé.
5. **Après retour à la normale** : re-teste une commande de bout en bout, puis `Rafraîchir` dans l'atelier.

> ℹ️ L'architecture découple Netlify (statiques) et Supabase (données) : une panne de l'un ne fait pas tomber l'autre entièrement.

---

## O2 · Netlify ne déploie plus

**Niveau** : 🟠 · **Durée estimée** : 15-60 min · **Symptômes** : push `master` OK mais aucun nouveau déploiement ; build rouge ; site en version précédente.

### Étapes

1. **Vérifier le build** : Netlify → Deploys → dernier déploiement → logs. Cause fréquente : échec `npm run build` ou lint.
2. **Reproduire localement** :
   ```bash
   npm install
   npm run lint
   npm run build
   ```
3. **Vérifier les variables d'env** : `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` absentes → le build passe mais l'app est dégradée. Les déclarer et **retrigger** le déploiement (Deploys → Clear cache and deploy site).
4. **Si le build passe localement mais échoue sur Netlify** : vérifie la version Node (Netlify → Build settings) et le dossier `dist/` (build command `npm run build`, publish directory `dist`).
5. **Contournement** : `git revert` du dernier commit fautif puis push (déclenche un nouveau déploiement).

> ⚠️ Vérifie aussi `public/_redirects` : un SPA fallback cassé rend les routes profondes en 404 (voir [T6](../users/TUTORIELS.md#t6--déployer-sur-netlify-développeur)).

---

## O3 · L'Edge Function échoue

**Niveau** : 🟠 · **Durée estimée** : 15-45 min · **Symptômes** : erreurs 4xx/5xx sur `/functions/v1/generate-print-pdf` ; PDF non générés.

### Étapes

1. **Identifier le code d'erreur** (voir [`API.md`](../developers/API.md#3-edge-function)) :
   - `401` / `403` → problème d'authentification admin (session expirée, compte non admin).
   - `400` « Aucune déclinaison validée » → comportement normal si commande non validée.
   - `404` « Commande introuvable » → code incorrect.
   - `500` / `502` → erreur serveur : lecture des logs.
2. **Lire les logs** :
   ```bash
   npx supabase functions logs generate-print-pdf --project-ref xgfageatdfugxeincfgc
   ```
3. **Vérifier le déploiement** :
   ```bash
   npx supabase functions list --project-ref xgfageatdfugxeincfgc
   ```
   La fonction doit apparaître avec `verify_jwt: true` (défini dans `supabase/config.toml`).
4. **Si la config a changé** : redéploie :
   ```bash
   npx supabase functions deploy generate-print-pdf --project-ref xgfageatdfugxeincfgc
   ```

> ℹ️ Depuis le fix `4508444`, les 404 métiers ne sont plus masqués : le message d'erreur affiché correspond à la vraie cause.

---

## O4 · Un PDF ne se génère pas

**Niveau** : 🟡 · **Durée estimée** : 15-30 min · **Symptômes** : erreur affichée dans le bloc « Fichier d'impression » de l'atelier.

### Étapes

1. **Vérifier l'état de la commande** : doit être `validee` **avec** une `chosen_variation`. Sinon : `Aucune déclinaison validée` (normal).
2. **Vérifier la déclinaison** : l'image doit être joignable (URL signée 1 h côté Edge). Une image supprimée/expirée → `Image introuvable` ou `Impossible de charger l'image` (502).
3. **Vérifier les droits admin** : re-connecte-toi dans l'atelier (JWT expiré → 401/403).
4. **Re-test après correction** : clique à nouveau sur **« Générer le PDF A4 »**.
5. **Si le stockage est plein / en échec** : vérifie le bucket `media` dans Supabase Storage (le PDF est uploadé en `print/{code}.pdf` en mode `upsert`).

---

## O5 · Un client perd sa commande

**Niveau** : 🟡 · **Durée estimée** : 20-60 min · **Symptômes** : le client n'a plus accès à ses commandes (changement d'appareil, session effacée) ; il contacte le support avec ou sans son code `MT-XXXX`.

### Étapes

1. **Avec le code `MT-XXXX`** : le client peut **suivre** sa commande sur `/suivi` sans session. Guide-le vers cette page.
2. **Sans le code** : retrouve la commande dans l'**Atelier** (`/admin`) par nom ou téléphone (colonne **👤 Client**).
3. **Redonner l'accès** : la commande est liée à `owner_user_id` (session anonyme de l'appareil). Sans connexion SMS (Phase B, voir [`ROADMAP.md`](../product/ROADMAP.md)), l'accès à l'espace client **depuis un nouvel appareil n'est pas encore possible** — c'est une limitation connue **À compléter**.
4. **Actions possibles** :
   - Indiquer au client le statut et les prochaines étapes par téléphone/WhatsApp.
   - S'il est en attente de validation (`propositions_pretes`), lui envoyer les **3 déclinaisons** manuellement (télécharger les images depuis l'atelier) et recueillir son choix par téléphone, puis le renseigner via la RPC `choose_variation` (côté technique) — sinon le client peut utiliser `/suivi` avec son code.

> ⚠️ Ne **jamais** modifier le prix ou le statut sans trace : chaque mise à jour passe par les services existants et alimente la timeline.

---

## O6 · Un imprimeur est indisponible

**Niveau** : 🟡 · **Durée estimée** : 15-30 min · **Symptômes** : l'imprimeur assigné ne peut pas produire à temps ; le client attend.

### Étapes

1. **Identifier les commandes concernées** : filtre l'atelier sur `validee` / `en_impression` avec le `printer_id` de l'imprimeur.
2. **Réassigner** : ouvre chaque commande → bloc **« 🖨️ Imprimeur partenaire »** → nouveau nom → **Assigner**.
3. **Regénérer le PDF** si nécessaire : le PDF porte le nom de l'imprimeur dans son bandeau — clique sur **« Générer le PDF A4 »** puis **« 💬 Envoyer à l'imprimeur »** au nouveau prestataire.
4. **Prévenir le client** : l'objectif reste la livraison en **24-48 h** après validation ; en cas de dépassement, informe par téléphone/WhatsApp et documente.

---

## O7 · Un artiste est absent

**Niveau** : 🟡 · **Durée estimée** : variable · **Symptômes** : des commandes restent en file **En création** sans déclinaisons déposées.

### Étapes

1. **Identifier les commandes en attente** : file **En création** (`en_creation`) et **À traiter** (`recue`).
2. **Répartition** : assigne les commandes à un autre artiste.
3. **Traitement manuel** : chaque artiste ouvre la commande, consulte photo + avatar de référence, puis **« Déposer les 3 déclinaisons »**.
4. **Si aucun artiste n'est disponible** : préviens le gestionnaire pour **désactiver temporairement** la création (ou allonger les promesses de délai). Le site reste fonctionnel pour la prise de commande ; documente le ralentissement.
5. **Retard** : les créations promises en **1 heure** doivent être respectées ; en cas d'incapacité, contacte les clients concernés avec les nouveaux délais.

> 🖼 **À compléter** : liste des artistes actifs et leurs rôles (voir Contacts opérationnels).

---

## O8 · Une campagne promo doit être désactivée

**Niveau** : 🟢 (routine) · **Durée estimée** : < 5 min · **Symptômes** : la campagne doit s'arrêter avant la fin prévue (erreur de saisie, stock, litige).

### Étapes

1. Atelier → onglet **🎉 Campagnes**.
2. Sur la carte de la campagne concernée, clique sur **« Désactiver »**.
3. **Vérifier l'effet** :
   - Le bandeau disparaît du site public.
   - `get_active_campaign()` renvoie `null` si c'était la campagne active.
   - `validate_promo(code)` renvoie `null` : le code promo devient **invalide** à la commande.
   - Les commandes **déjà enregistrées** gardent leur remise (le trigger revalide à l'écriture, pas après coup).

> ⚠️ La désactivation manuelle **prime sur les dates** : une campagne `active = false` n'est jamais servie, même dans sa fenêtre.

---

## O9 · Mises à jour et maintenance

**Niveau** : 🟢 · **Régularité** : à chaque évolution.

### Appliquer un changement de schéma (Supabase)
```bash
npx supabase db push
```

### Déployer un changement d'Edge Function
```bash
npx supabase functions deploy generate-print-pdf --project-ref xgfageatdfugxeincfgc
```

### Vérifier les secrets après chaque recrutement / rotation
- Rotation des clés : `netlify env:unset` puis `netlify env:set` (ou rotation côté Supabase). **À compléter** : calendrier de rotation.
- Vérifier qu'aucun `.env` n'est suivi : `git ls-files | findstr env` (vide attendu).

### Sauvegarde
- Supabase gère la sauvegarde du projet (point-in-time). **À compléter** : politique de restauration documentée.

---

## Contacts opérationnels

| Rôle | Contact | Remarque |
| --- | --- | --- |
| Support / WhatsApp | +225 05 45 29 82 80 | Fil WhatsApp officiel |
| Téléphone | +225 07 16 53 55 80 | Ligne principale |
| Atelier / Admin | via `/admin` | Connexion email/mdp |
| **Artistes actifs** | **À compléter** | Liste et répartition |
| **Imprimeurs partenaires** | **À compléter** | Liste, délais, zone de livraison |
| **Horaires d'exploitation** | **À compléter** | Plages de prise en charge des commandes |

---

## Références croisées

- [GUIDE-ADMIN.md](GUIDE-ADMIN.md) — manuel opérateur détaillé
- [API.md](../developers/API.md) — codes d'erreur Edge Function
- [SECURITY.md](../developers/SECURITY.md) — hygiène des secrets, rotation
- [CHANGELOG.md](../product/CHANGELOG.md) — journal des évolutions
- [ROADMAP.md](../product/ROADMAP.md) — limitations connues (connexion SMS)
