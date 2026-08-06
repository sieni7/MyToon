# 🗺️ Feuille de route — MyToon

> Public : **équipe produit, développeurs, partenaires, investisseurs**.
> Ce document trace l'évolution du produit : ce qui est **livré**, ce qui est **prévu**, et les horizons plus lointains (À compléter).
> Portail : [`docs/README.md`](../README.md)

## Sommaire

- [Vision de la feuille de route](#vision-de-la-feuille-de-route)
- [✅ Livré (version actuelle)](#-livré-version-actuelle)
- [🚧 Court terme](#-court-terme)
- [🔭 Moyen & long terme](#-moyen--long-terme)
- [Principe de mise à jour](#principe-de-mise-à-jour)

---

## Vision de la feuille de route

La feuille de route suit trois axes :

1. **Fiabiliser l'expérience client** (suivi, délais, confiance).
2. **Élargir l'offre créative** (styles, supports, géographie).
3. **Renforcer la plateforme** (authentification, sécurité, performances).

Chaque évolution doit respecter les valeurs produit (voir [`PRODUCT.md`](PRODUCT.md)) et la **Documentation Policy** (voir [`docs/README.md`](../README.md)).

---

## ✅ Livré (version actuelle)

### Parcours & commande
- [x] Parcours de commande en **6 étapes** (style → photo → validation → livraison).
- [x] **3 styles actifs** : Manga 📖, Comics 💥, Pop Art 🎭.
- [x] T-shirt (10 000 FCFA) et polo (15 000 FCFA) coton local.
- [x] Paiement **à la livraison** (Wave, Orange Money, MTN MoMo, espèces).

### Suivi & workflow
- [x] Workflow **7 statuts** + suivi par code **`MT-XXXX`** (page `/suivi`).
- [x] **3 déclinaisons en 1 h**, validation client obligatoire avant impression.
- [x] Espace client : historique, détail, pagination, **ré-commande** avec la même photo.
- [x] Timeline complète visible par le client.

### Atelier admin & impression
- [x] Atelier admin : **4 files de travail**, dépôt des déclinaisons, avatar de référence.
- [x] Assignation **imprimeur partenaire**.
- [x] **PDF A4 imprimeur (DTF)** généré via Edge Function, téléchargeable / lien signé 7 jours / envoi WhatsApp.

### Plateforme & sécurité
- [x] Backend **Supabase** : RLS, RPC, storage privé `media`, sessions anonymes.
- [x] Campagnes saisonnières + codes promo **infalsifiables** (trigger serveur).
- [x] Remédiation sécurité 2026-08-05 : 7 statuts, E.164, `enforce_order_promo`, `verify_jwt`.
- [x] Pages légales : CGV, Confidentialité, Livraison & retours.
- [x] Performance : code-splitting (7 routes), images à la demande, pagination.

---

## 🚧 Court terme

### Styles
- [ ] Activer les styles **Cartoon** 🎨 et **Sketch** ✏️ (badge « ⏳ Bientôt » déjà en place ; avatars désactivés dans `constants.js`).

### Compte & suivi multi-appareils
- [ ] **Connexion par SMS** (numéro + code) pour retrouver ses commandes sur n'importe quel appareil (**Phase B**). Aujourd'hui l'accès à l'espace client est lié à l'**appareil** (session anonyme) — limite documentée dans [`PRODUCT.md`](PRODUCT.md) et [`OPERATIONS.md`](../admin/OPERATIONS.md).

### Exploitation
- [ ] Compléter la **liste des imprimeurs partenaires** et des **artistes actifs** (contacts opérationnels — voir [`OPERATIONS.md`](../admin/OPERATIONS.md)).

---

## 🔭 Moyen & long terme

> ⚠️ Les éléments suivants sont des **pistes**, non engagées. Chaque item doit être validé (contexte produit + impact technique) avant d'entrer dans « Court terme ».

### Produit
- [ ] **À compléter** : extension géographique (livraison au-delà d'Abidjan).
- [ ] **À compléter** : nouveaux supports (hoodie, casquette, accessoires).
- [ ] **À compléter** : programme de fidélité / parrainage.
- [ ] **À compléter** : téléchargement numérique du toon (artwork HD).

### Plateforme
- [ ] **À compléter** : notifications client (SMS/WhatsApp) aux changements de statut.
- [ ] **À compléter** : paiement en ligne (à décider — arbitrage produit DEC-002 à réévaluer).
- [ ] **À compléter** : tableau de bord statistiques admin avancé.
- [ ] **À compléter** : audit d'accessibilité complet et matrice navigateur par version.

### Qualité
- [ ] **À compléter** : CI/CD formelle (lint + build + tests sur chaque PR).
- [ ] **À compléter** : rate limiting sur RPC publiques et Edge Function.
- [ ] **À compléter** : politique de sauvegarde/restauration documentée.

---

## Principe de mise à jour

- Une évolution **livrée** → déplacer la case de « prévu » vers « ✅ Livré » **et** ajouter l'entrée dans le [`CHANGELOG.md`](CHANGELOG.md).
- Un changement de **portée** (décision produit ou technique) → mettre à jour [`DECISIONS.md`](../developers/DECISIONS.md) (nouveau `DEC-XXX`).
- La roadmap est un **document vivant** : à revoir à chaque cycle de développement.

---

## Références croisées

- [PRODUCT.md](PRODUCT.md) — vision, valeurs, promesses
- [CHANGELOG.md](CHANGELOG.md) — historique des évolutions livrées
- [DECISIONS.md](../developers/DECISIONS.md) — arbitrages structurants
- [OPERATIONS.md](../admin/OPERATIONS.md) — limites opérationnelles connues
