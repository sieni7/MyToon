# MyToon → SaaS : Étude de faisabilité, contraintes, défis & dette technique

> Analyse du repo `sieni7/MyToon` (branche `master`, état au 31/07/2026)
> Objectif visé : **transformer MyToon en plateforme SaaS capable d'attirer d'autres graphistes**.

---

## 1. Synthèse exécutive

| Question | Verdict |
|---|---|
| Le produit a-t-il un avenir SaaS ? | **Oui**, la proposition de valeur est solide (toon sur mesure, Abidjan, culture streetwear). |
| Le code est-il réutilisable tel quel ? | **Frontend oui (50 %), Backend non (0 %)**. Il n'existe **aucun backend**. |
| Bloqueur n°1 | Les données vivent en **`localStorage`** (par navigateur). Impossible de gérer plusieurs utilisateurs, un admin réel, des graphistes multiples ou des paiements. |
| Bloqueur n°2 | **Aucun système de compte** : ni client, ni designer, ni admin. Le « espace client » est un simple numéro de téléphone stocké en local. |
| Bloqueur n°3 | **Aucun paiement en ligne** (Wave/OM/MTN en mode « paiement à la livraison » déclaré, jamais implémenté). |
| Dette critique | Secret exposé (`VITE_HF_TOKEN`) + passcode admin en clair dans le bundle. |
| Effort estimé | MVP multi-graphistes : **3 à 6 mois** (1 à 2 devs). Marketplace complète : **9 à 12 mois**. |

---

## 2. État actuel du repo

### 2.1 Stack technique

- **Frontend** : React 19.2, React Router 7.18, Vite 8, JSX (pas de TypeScript).
- **Dépendances** : uniquement `react`, `react-dom`, `react-router-dom` (+ outils de build). Aucune lib réseau, état global, formulaire, UI ou test.
- **Déploiement** : statique sur Netlify (`public/_redirects` → SPA fallback, `dist/`).
- **Backend** : **inexistant**. Aucun serveur, aucune API, aucune base de données.
- **Persistance** : 100 % `localStorage` via 3 services :
  - `src/services/orders.js` — CRUD commandes + timeline + variations + imprimeur ;
  - `src/services/session.js` — « login » par numéro de téléphone (stocké en clair) ;
  - `src/services/banner.js` — bandeau promo (admin).
- **Génération d'images** : modèle **manuel/artisan** (« zéro IA »). Les graphistes téléversent 3 déclinaisons dans le dashboard admin. Un moteur Canvas + une intégration HuggingFace existaient dans l'historique git mais ont été supprimés au commit `6cd6284`.

### 2.2 Parcours et pages

- `/` — Landing riche (Hero animé, avant/après, valeurs, produits, réalisations, galerie de styles, phases, témoignages, FAQ, CTA).
- `/commande` — Tunnel 3 étapes : avatar → support (tee 10 000 F / polo 15 000 F) → photo + infos. Récap, confirmation, n° de commande `MT-XXXX`.
- `/suivi` — Suivi par n° de commande + déverrouillage par téléphone. Timeline de 8 statuts, choix parmi 3 déclinaisons.
- `/espace`, `/espace/commandes`, `/espace/commande/:id` — Espace client « le téléphone est l'identité », ré-commande.
- `/admin` — Dashboard protégé par un **passcode en clair** (`mytoon2026`) : statuts, upload des 3 déclinaisons, assignation imprimeur, bandeau promo.

### 2.3 Qualité globale

- **UI/UX : excellente pour le ciblé B2C Abidjan.** Identité forte (orange/or doré, typo Space Grotesk/Poppins), animations soignées, mobile-first, français natif.
- **Code : sain mais non évolutif.** Composants React propres, hooks corrects, pas de règles de lint violées (`npm run lint` → 0 erreur), build OK (bundle JS 333 kB / 96 kB gzip).
- **Absence totale de tests, de typage et d'observabilité.**

---

## 3. Faisabilité SaaS — verdict

**Faisable, mais c'est un changement de paradigme, pas une amélioration.**

Le modèle actuel est un **commerce B2C mono-opérateur** : `client → (1) admin`. Un SaaS multi-graphistes est un **marketplace** : `client → plateforme → plusieurs graphistes`, avec comptes, rôles, file d'ordres, partage de revenus et réputation.

Le code exploitable :
- tout le parcours client (landing, tunnel de commande, suivi, espace) ;
- la modélisation des statuts / timeline de commande ;
- l'identité visuelle.

Le code à remplacer :
- toute la couche de données (localStorage → API + BDD) ;
- le dashboard admin mono-opérateur (→ rôles graphiste / admin / financier) ;
- le modèle « 1 admin = 1 machine » (impossible à multi-utilisateur aujourd'hui).

---

## 4. Contraintes

1. **Multi-tenant / multi-utilisateur impossible** : les commandes n'existent que dans le navigateur de l'admin. Deux admins ne voient pas les mêmes données. La perte d'un cache = perte de commandes.
2. **Aucune identification fiable** : le « login » par téléphone n'est jamais vérifié (pas de SMS). N'importe qui peut voir les commandes d'un numéro qu'il connaît.
3. **Paiement à la livraison déclaré mais non implémenté** : aucun flux Wave/Orange/MTN, pas de gestion des acomptes, pas de commission automatique pour les graphistes.
4. **Marché local** : monnaie (FCFA), livraison Abidjan, SMS/WhatsApp natifs. Un SaaS doit rester hyper-local pour se différencier.
5. **Infrastructure réseau (Côte d'Ivoire)** : l'historique git montre des contournements DNS/CORS pour atteindre HuggingFace — à anticiper pour toute API externe (paiements, SMS, IA).
6. **Promesse « 1 heure »** : tenable avec 1 artiste, risquée avec un pool de graphistes sans file d'attente ni SLA.
7. **Légal** : photos de visage + numéros de téléphone = données personnelles → conformité RGPD locale, consentement, droit à l'effacement. Les liens CGV / Confidentialité sont des placeholders `#`.

---

## 5. Défis

1. **Désigner la plateforme** : comment les graphistes trouvent-ils du travail ? File d'attente FIFO, tirage au sort, « premier arrivé », enchères, ou système de réputation ? → décision produit critique.
2. **Répartition de la valeur** : commission plateforme, prix minimum par style, paiement au graphiste (Wave/OM), litiges, remboursements.
3. **Qualité & réputation** : notation clients, portfolio public, style tags, pénalités de retard — indispensable pour attirer ET retenir les graphistes.
4. **Économie unitaire** : le tarif actuel (10–15 000 F) doit financer le graphiste + l'impression + la livraison + la marge plateforme. À re-modéliser.
5. **Paiements mobiles** : s'agréer auprès de Wave / Orange Money / MTN MoMo (contrats, comptes marchands, webhooks, frais).
6. **Notifications** : SMS/WhatsApp à chaque statut (aujourd'hui, rien n'est notifié ; le client doit revenir de lui-même).
7. **Passage de témoin des données** : aucune migration possible — il faut repartir de zéro sur la couche données.

---

## 6. Dette technique — Frontend

| Niveau | Dette | Impact |
|---|---|---|
| 🔴 Critique | **Pas de backend / pas de multi-utilisateur** (localStorage) | Bloque le SaaS. |
| 🔴 Critique | **Aucun test** (0 fichier de test, aucun framework) | Impossible de refactorer sereinement. |
| 🔴 Critique | **Passcode admin en clair** dans `constants.js`, embarqué dans le bundle JS (public) | N'importe qui lit le bundle et entre dans l'admin. |
| 🟠 Élevé | **`VITE_HF_TOKEN` (token HuggingFace réel) présent dans `.env.local`** et traces dans l'historique git | Fuite de secret. À révoquer sur HF et purger l'historique. |
| 🟠 Élevé | **Styles dupliqués** : ~2 000 lignes de `style={{...}}` inline dans les composants + classes CSS globales | Maintenance pénible, cohérence fragile. |
| 🟠 Élevé | **`!important` systématique** dans `responsive.css` | CSS cassable, ordre d'application opaque. |
| 🟠 Élevé | **Images en base64 dans `localStorage`** (photo + 3 déclinaisons par commande) | Quota 5–10 Mo dépassé dès quelques commandes ; risque de corruption. |
| 🟠 Élevé | **Compteur d'ID local** (`MT-XXXX`) | Collisions entre appareils, pas d'unicité globale. |
| 🟠 Élevé | **Témoignages et compteur « 512 héros » fake** (incrémenté aléatoirement) | Trompeur, interdit en SaaS crédible. |
| 🟠 Élevé | **Code mort / incohérent** : message « Analyse en cours… » alors qu'aucune analyse n'existe ; `validateCode()` jamais réellement appliqué ; historique git plein de moteurs abandonnés (cartoonizer 583 l, huggingface.js, useCartoonize.js) | Confusion, dette cognitive. |
| 🟡 Moyen | Pas de TypeScript | Sécurité et refactors plus risqués. |
| 🟡 Moyen | Pas d'état global (tout en `useState` + localStorage) | Devient ingérable avec le multi-rôle. |
| 🟡 Moyen | Pas de système de design, pas d'UI kit | Incohérences, temps d'onboarding dev allongé. |
| 🟡 Moyen | Pas de SEO (1 `index.html`, pas de meta/og, pas de sitemap) | Frein acquisition B2B (graphistes recherchent). |
| 🟡 Moyen | Pas d'analytics, pas de suivi d'erreurs (Sentry), pas de logs | Aveugle une fois la plateforme lancée. |
| 🟡 Moyen | Fichiers non versionnés (`banner.js`, `PromoBanner.jsx`, `WorksGallery.jsx`, `assets/works/*`) | Un clone = build cassé. À committer. |
| 🟢 Faible | Bundle déjà optimisé (96 kB gzip), React 19, pas de libs superflues | Bon point de départ. |

---

## 7. Dette technique — Backend

> Il n'y a **aucun backend**. La « dette backend » est donc **tout ce qu'il reste à construire**.

Ce qu'un MVP SaaS multi-graphistes exige :

1. **API** (Node/NestJS ou Supabase/Firebase en accélération) avec auth JWT, rôles (`client`, `graphiste`, `admin`, `finance`).
2. **Base de données relationnelle** : `users`, `designers`, `orders`, `order_statuses`, `variations`, `products`, `styles`, `reviews`, `payouts`, `banners`.
3. **Stockage d'images** : S3/Cloudinary (photo + déclinaisons), jamais en base64.
4. **Paiements** : intégration Wave / Orange Money / MTN MoMo (compte marchand, webhooks, split automatique plateforme ↔ graphiste).
5. **SMS/WhatsApp** : Twilio / termii.io / Meta Cloud API pour les notifications de statut.
6. **File d'ordres graphistes** : assignation, SLA « 1h », remise, refus, escalade.
7. **Observabilité** : logs, erreurs, métriques, sauvegardes, recovery.
8. **Conformité** : consentement RGPD, suppression de compte, export de données, journaux d'accès admin.

---

## 8. Sécurité (à traiter avant tout)

- **Révoguer `VITE_HF_TOKEN`** sur HuggingFace (token réel en clair dans `.env.local` et historique git). Puis nettoyer l'historique (filter-branch / BFG) et révoquer aussi le passcode.
- **Supprimer le passcode en clair** (`mytoon2026`) : toute l'auth doit passer par le backend.
- **Vérification téléphone réelle** (SMS OTP) avant de déverrouiller les données client.
- **HTTPS + en-têtes de sécurité** via Netlify (`security.txt`, CSP, `X-Content-Type-Options`).
- **Ne jamais stocker de photos/violations côté client** ; chiffrement au repos et en transit côté backend.

---

## 9. Feuille de route recommandée

### Phase 0 — Sécurité & hygiène (1 semaine)
Révoguer les secrets, purger l'historique git, committer les fichiers orphelins, ajouter analytics + Sentry, tests de fumée.

### Phase 1 — Backend + comptes (4–6 semaines)
API + BDD + auth OTP SMS. Comptes client, admin, **graphiste**. Migration du flux commande (création, suivi, validation, statuts) vers l'API. Stockage fichiers.

### Phase 2 — Espace graphiste (4–6 semaines)  ← cœur de l'objectif
- **Dashboard graphiste** : file d'ordres assignée, upload des 3 déclinaisons, chat client, SLA.
- **Portfolio public** + profils vérifiés (« Rejoint en… », styles maîtrisés, note moyenne).
- **Suivi des gains** : commandes livrées, commission, solde, paiement vers Wave/OM.
- **Admin étendu** : supervision multi-graphistes, allocation des commandes, gestion des litiges.

### Phase 3 — Paiements & notifications (4–6 semaines)
Agrément Wave/OM/MTN, paiement à la commande (acompte ou 100 %), split automatique, webhooks, SMS/WhatsApp à chaque statut.

### Phase 4 — Marketplace & croissance (8–12 semaines)
Notation clients ↔ graphistes, marketplace de **styles proposés par les graphistes** (chaque graphiste vend son univers), badges, classement, onboarding fluide, référentiel local (écoles d'art, réseaux Instagram/TikTok).

---

## 10. Architecture cible (schéma)

```
React SPA (existant, adapté)
   │  HTTPS / JWT
   ▼
API (Node/NestJS ou Supabase Functions)
   │
   ├─ Postgres : users · designers · orders · variations · reviews · payouts
   ├─ Object Storage : photos & déclinaisons (S3/Cloudinary)
   ├─ Payment Provider : Wave · Orange Money · MTN MoMo (webhooks)
   ├─ SMS/WhatsApp : Termii / Twilio / Meta Cloud API
   └─ Workers : SLA 1h, expirations, rappels, exports
```

Le frontend actuel peut être conservé à 80 % **en tant que couche client** ; seuls `orders.js`, `session.js`, `banner.js` et `AdminPage.jsx` doivent être réécrits contre l'API.

---

## 11. Comment attirer les graphistes — leviers clés

1. **Revenus clairs et rapides** : solde visible, paiement automatique Wave/OM après livraison, commission affichée.
2. **Travail garanti au début** : file d'ordres à volume contrôlé pour que les 10 premiers graphistes vivent l'expérience réelle.
3. **Valorisation du travail** : portfolio public, signature sur les créations, « créé par @pseudo » sur la landing.
4. **Réputation** : note, badges (rapidité, qualité), classements par style.
5. **Zéro friction** : onboarding sans CV (envoi de 3 œuvres + test), versement des gains sans paperasse lourde.
6. **Communauté** : Discord/WhatsApp graphistes, challenges mensuels, ateliers, mise en avant locale (écoles d'art, réseaux).

---

## 12. Conclusion

MyToon a **une marque et une UX de vente déjà fortes**, mais **zéro socle technique multi-utilisateur**. Le passage au SaaS n'est pas une couche ajoutée : il faut construire le backend, les comptes et le paiement **avant** de pouvoir attirer des graphistes. Le frontend client est réutilisable ; le dashboard admin et toute la couche données doivent être réécrits. La promesse de différenciation (toon local, 1h, culture ivoirienne) reste l'avantage compétitif à préserver et à transformer en marketplace de talents.

**Prochaine étape recommandée** : Phase 0 (sécurité) puis un backend minimal (Phase 1) avec **un espace graphiste fonctionnel** comme premier jalon démontrable — c'est ce qui permettra d'embaucher de vrais graphistes et de valider le modèle économique.
