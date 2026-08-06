# ❓ FAQ — MyToon

> Public : **clients, administrateurs, développeurs**. FAQ maîtresse, catégorisée et orientée recherche.
> Parcours guidé (clients) : [`CENTRE-AIDE.md`](CENTRE-AIDE.md) · Portail : [`docs/README.md`](../README.md)

## Sommaire

- [A. Clients](#a-clients)
- [B. Administration](#b-administration)
- [C. Technique & développement](#c-technique--développement)

---

## A. Clients

### A1. Comment ça fonctionne ?
Tu choisis un style toon (Manga, Comics, Pop Art), tu envoies ta photo et tu commandes. Nos artistes te préparent **3 déclinaisons** de ton toon en **1 heure**. Tu valides ta préférée, puis c'est imprimé et livré en **24-48 h**.

### A2. Quels sont les délais ?
- **Création du toon** : 1 heure chrono.
- **Impression + livraison** : 24-48 h à partir de la validation de ta déclinaison.

### A3. Quels sont les prix ?
- **T-shirt coton local** : 10 000 FCFA.
- **Polo coton local** : 15 000 FCFA.
- La création du toon est **incluse**.

### A4. Comment payer ?
Paiement **à la livraison** : **Wave**, **Orange Money**, **MTN MoMo** ou **espèces**. Aucun paiement en ligne demandé au moment de la commande.

### A5. Puis-je suivre ma commande ?
Oui. Tu reçois un numéro **`MT-XXXX`** que tu peux consulter à tout moment sur la page **Suivi** pour voir l'évolution (7 statuts visibles en temps réel).

### A6. Que reçoit-on exactement ?
Un vêtement imprimé (t-shirt ou polo) avec **ta déclinaison toon** choisie. Le fichier d'impression est préparé pour l'imprimeur (PDF DTF). Il n'y a pas de téléchargement numérique **À compléter** : la livraison est le support physique.

### A7. Quelle photo envoyer ?
Une photo **nette, bien éclairée**, visage dégagé, de préférence de face. Voir « Les meilleures photos » dans le [`CENTRE-AIDE.md`](CENTRE-AIDE.md).

### A8. Puis-je changer d'avis sur ma déclinaison ?
Oui, **tant que tu n'as pas validé**. Quand les 3 propositions sont prêtes (statut `✨`), tu choisis ta préférée. **Une fois validée**, l'impression démarre : plus de changement possible.

### A9. Puis-je commander à nouveau avec la même photo ?
Oui. Depuis ton espace client (`/espace/commandes`), la **ré-commande** réutilise ta photo (copie sécurisée dans un nouveau chemin).

### A10. Et si je change d'appareil ?
Tes commandes sont liées à l'**appareil** (session anonyme) et au code `MT-XXXX`. Avec le code, tu peux toujours **suivre** ta commande. La **connexion SMS** (retrouver ses commandes sur n'importe quel appareil) est prévue en Phase B — voir [`ROADMAP.md`](../product/ROADMAP.md).

### A11. Pourquoi ma photo est-elle refusée ?
Erreurs fréquentes : image trop lourde (la compression automatique limite à 1200 px), format non supporté, ou photo illisible. Réessaie avec une image plus légère et un format standard (JPG/PNG).

### A12. Pourquoi l'impression n'a-t-elle pas commencé ?
Parce que la commande attend **ta validation**. Une commande ne passe jamais en impression avant que tu aies choisi ta déclinaison.

### A13. Où livrez-vous ?
**Abidjan uniquement** (livraison 24-48 h). D'autres villes sont envisagées **À compléter**.

### A14. Les artistes sont-ils des IA ?
Non. Chaque toon est **dessiné à la main par un artiste humain** à partir de ta photo. C'est la différence qualitative du produit (voir [`DECISIONS.md`](../developers/DECISIONS.md), DEC-001).

### A15. Mes données sont-elles protégées ?
Oui. Photos et données sont stockées dans un espace **privé** (URLs signées, accès limité). Voir la section Confidentialité du [`CENTRE-AIDE.md`](CENTRE-AIDE.md) et [`SECURITY.md`](../developers/SECURITY.md).

---

## B. Administration

### B1. Comment accéder à l'atelier ?
Rends-toi sur `/admin` et connecte-toi avec ton **compte administrateur** (email + mot de passe). Le compte se crée via `scripts/seed-admin.mjs` — voir [T5 · Créer un compte admin](../users/TUTORIELS.md#t5--créer-un-compte-administrateur-développeur).

### B2. Comment déposer les 3 déclinaisons ?
Ouvre la commande (statut `recue` ou `en_creation`) → bouton **« Déposer les 3 déclinaisons »** → sélectionne les 3 images. Le dépôt passe automatiquement la commande à `propositions_pretes`.

### B3. Comment changer le statut d'une commande ?
Chaque statut propose une action : « Marquer en création », « Passer en impression », « Passer en expédition », « Marquer comme livrée ». Voir [T3 · Changer le statut](../users/TUTORIELS.md#t3--changer-le-statut-dune-commande-admin).

### B4. Pourquoi je ne peux pas passer une commande en impression ?
La commande doit être **`validee`** (client a choisi sa déclinaison) et le bouton n'apparaît qu'à ce moment-là. C'est volontaire : interdiction d'imprimer avant validation client.

### B5. Comment générer le fichier d'impression ?
Une fois la déclinaison validée, le bloc **« Fichier d'impression (PDF A4 / DTF) »** apparaît : clique sur **« Générer le PDF A4 »**, puis 📄 Télécharger / 🔗 Copier le lien / 💬 Envoyer à l'imprimeur.

### B6. Comment créer une campagne promo ?
Onglet **🎉 Campagnes** → « ➕ Nouvelle campagne » → renseigne nom, dates, bandeau, code promo, remise, couleur → active. Voir [T2 · Première campagne](../users/TUTORIELS.md#t2--première-campagne-promo-admin).

### B7. Comment modifier le bandeau promo ?
Onglet **⚙️ Réglages** → champ « ⚡ Bandeau promo » → texte + case « Actif » → **Enregistrer**. Le bandeau s'affiche sur tout le site.

### B8. Pourquoi une commande est restée en « En validation client » ?
Le client n'a pas encore choisi sa déclinaison. C'est la file **« En validation client »** (`propositions_pretes`). Un message jaune l'indique sur la carte.

### B9. Comment assigner un imprimeur ?
Sur une commande `validee`/`en_impression`/`expediee`, le bloc **« 🖨️ Imprimeur partenaire »** permet de saisir un nom/id et **Assigner**. L'info apparaît ensuite dans le PDF.

### B10. Que faire si une commande est bloquée ?
Voir [`OPERATIONS.md`](../admin/OPERATIONS.md) — procédures « Que faire si… » (imprimeur absent, PDF en échec, etc.).

---

## C. Technique & développement

### C1. Pourquoi « Active la session anonyme » ?
La commande exige une session anonyme (`auth.signInAnonymously`). Dans le dashboard Supabase : **Auth → Providers → Anonymous** doit être activé.

### C2. Le site est navigable mais la commande échoue. Pourquoi ?
Variables d'env absentes : renseigne `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` dans `.env.local` et dans les variables **Netlify**.

### C3. Le PDF renvoie « Non autorisé » (401/403) ?
La fonction exige un **JWT admin** (`verify_jwt = true` + contrôle `admins`). Connecte-toi en admin avant de générer.

### C4. Le PDF renvoie « Aucune déclinaison validée » ?
La commande n'est pas encore `validee` ou n'a pas de `chosen_variation`. C'est le comportement attendu tant que le client n'a pas validé.

### C5. Comment un code promo est-il vérifié ?
Le client appelle `validate_promo` (affichage). À l'INSERT/UPDATE, le **trigger `enforce_order_promo`** revalide le code et force la remise côté serveur. Falsifier la remise côté client est inopérant.

### C6. Comment le numéro MT-XXXX est-il généré ?
RPC `next_order_code()` : compteur atomique (`counters`) formaté `MT-` + 4 chiffres. Voir [`API.md`](../developers/API.md).

### C7. Quelles sont les RPC disponibles ?
`next_order_code`, `choose_variation`, `order_stats`, `recent_feed`, `get_active_campaign`, `validate_promo`, `is_admin`. Signatures dans [`API.md`](../developers/API.md).

### C8. Comment appliquer les migrations ?
`npx supabase db push` (ordre 0001 → 0009). Ne jamais modifier une migration appliquée en production.

### C9. Comment déployer l'Edge Function ?
`npx supabase functions deploy generate-print-pdf --project-ref <ref>`. Voir [T7](../users/TUTORIELS.md#t7--déployer-les-migrations-et-ledge-function-supabase-développeur).

### C10. Comment exécuter les tests ?
`npm run dev` puis les suites Playwright en racine (`ui-test.mjs`, `campaign-check.mjs`, `promo-ui-check.mjs`, `print-check.mjs`, `print-ui-check.mjs`, `remediation-check.mjs`). Voir [`CONTRIBUTING.md`](../developers/CONTRIBUTING.md).

### C11. Où sont les clés ? Ne sont-elles pas commitées ?
Les `.env` sont ignorés par git ; les clés `VITE_*` publiques vivent dans Netlify ; la clé **service** n'existe que dans les variables de script. Voir [`SECURITY.md`](../developers/SECURITY.md).

---

## Références croisées

- [CENTRE-AIDE.md](CENTRE-AIDE.md) — parcours et dépannage client
- [GUIDE-ADMIN.md](../admin/GUIDE-ADMIN.md) — manuel opérateur
- [API.md](../developers/API.md) — signatures et exemples
- [SECURITY.md](../developers/SECURITY.md) — sécurité, RLS, secrets
- [TUTORIELS.md](TUTORIELS.md) — procédures pas à pas
