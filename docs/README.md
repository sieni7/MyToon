# 📚 Documentation MyToon

> **Un produit, plusieurs publics — un espace de référence pour chacun.**

Ce dossier centralise toute la documentation du projet MyToon : client final, administrateur, développeur, équipe produit. Chaque public dispose de son propre espace, pour que l'information soit trouvée au bon endroit, par la bonne personne.

## 🧭 Commencer ici

| Ressource | Public | Lien |
| --- | --- | --- |
| 🦸 **Vitrine & démarrage** (features, installation, déploiement) | Découverte | [`README.md`](../README.md) |
| ❓ **Centre d'aide** (commander, suivre, dépanner) | Client final | [`users/CENTRE-AIDE.md`](users/CENTRE-AIDE.md) |

## 👥 Par public

| Public | Espace | Documents |
| --- | --- | --- |
| 📘 **Utilisateur** | `docs/users/` | [`CENTRE-AIDE.md`](users/CENTRE-AIDE.md) · [`FAQ.md`](users/FAQ.md) · [`TUTORIELS.md`](users/TUTORIELS.md) |
| 🛠 **Administrateur** | `docs/admin/` | [`GUIDE-ADMIN.md`](admin/GUIDE-ADMIN.md) · [`OPERATIONS.md`](admin/OPERATIONS.md) |
| 👨‍💻 **Développeur & intégrateur** | `docs/developers/` | [`ARCHITECTURE.md`](developers/ARCHITECTURE.md) · [`API.md`](developers/API.md) · [`SECURITY.md`](developers/SECURITY.md) · [`DESIGN-SYSTEM.md`](developers/DESIGN-SYSTEM.md) · [`DECISIONS.md`](developers/DECISIONS.md) · [`CONTRIBUTING.md`](developers/CONTRIBUTING.md) |
| 🚀 **Produit** (équipe, marketing, partenaires) | `docs/product/` | [`PRODUCT.md`](product/PRODUCT.md) · [`ROADMAP.md`](product/ROADMAP.md) · [`CHANGELOG.md`](product/CHANGELOG.md) |

## 🗂 Structure du dossier

```
docs/
  README.md            ← ce portail (navigation par public)
  users/               ← documentation client final
  admin/               ← documentation d'exploitation (opérateurs)
  developers/          ← documentation technique (dev & intégrateurs)
  product/             ← produit, feuille de route, historique
  screenshots/         ← captures d'écran partagées par tous les documents
```

## 📐 Convention de liens

- 📘 Utilisateur → `docs/users/`
- 🛠 Administrateur → `docs/admin/`
- 👨‍💻 Développeur → `docs/developers/`
- 🚀 Produit → `docs/product/`
- 🖼 Captures → `docs/screenshots/`

Tous les liens internes sont **relatifs** : le portail fonctionne à l'identique depuis GitHub, depuis un dépôt cloné ou depuis un futur site documentaire généré depuis ces fichiers Markdown.

## 📖 Documentation Policy

> **Toute modification du comportement fonctionnel, de l'architecture, de la sécurité ou de l'expérience utilisateur doit être accompagnée de la mise à jour des documents concernés avant la fusion de la Pull Request.**
>
> **Le code et la documentation constituent un même livrable.**

## ✅ Règles éditoriales

- **Zéro invention** : chaque fait (prix, délais, statuts, fonctionnalités, RPC, migrations) provient du code, de la base de données ou de la configuration — jamais d'une supposition.
- **À compléter** : toute information non encore produite est explicitement marquée `> **À compléter**` dans le document concerné.
- **Table des matières** : les documents dépassant ~300 lignes commencent par une TOC.
- **Ton par audience** : tutoiement conversationnel pour les clients, direct et technique pour les développeurs.
- **Liens internes** : relatifs, en minuscules, pointant toujours vers la cible exacte.
