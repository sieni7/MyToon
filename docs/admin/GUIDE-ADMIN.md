# 🛠️ Guide de l'administrateur — MyToon

> Public : **administrateurs et opérateurs non développeurs** (artistes, imprimeurs, gestionnaire).
> Ce manuel décrit, pas à pas, le travail quotidien dans l'**Atelier MyToon**.
> Portail : [`docs/README.md`](../README.md)

## Sommaire

1. [Se connecter à l'Atelier](#1-se-connecter-à-latelier)
2. [Comprendre le tableau de bord](#2-comprendre-le-tableau-de-bord)
3. [Les 4 files de travail](#3-les-4-files-de-travail)
4. [Créer les 3 déclinaisons](#4-créer-les-3-déclinaisons)
5. [Attendre la validation du client](#5-attendre-la-validation-du-client)
6. [Assigner un imprimeur](#6-assigner-un-imprimeur)
7. [Changer le statut d'une commande](#7-changer-le-statut-dune-commande)
8. [Fichier d'impression (PDF A4 / DTF)](#8-fichier-dimpression-pdf-a4--dtf)
9. [Réglages (bandeau promo)](#9-réglages-bandeau-promo)
10. [Campagnes promo](#10-campagnes-promo)
11. [Dépannage rapide](#11-dépannage-rapide)

> 🖼 **À compléter** : des captures d'écran seront ajoutées dans `docs/screenshots/admin-*.png` pour illustrer chaque étape.

---

## 1. Se connecter à l'Atelier

1. Rends-toi sur l'adresse du site + `/admin` (ex. `https://my-toon.netlify.app/admin`).
2. Renseigne ton **email** et ton **mot de passe** administrateur.
3. Clique sur **« Accéder »**.

> ⚠️ Si tu vois *« Ce compte n'est pas un administrateur MyToon »*, ton compte n'est pas (ou plus) dans la table `admins` — contacte le gestionnaire technique (création via `scripts/seed-admin.mjs`, voir [T5](../users/TUTORIELS.md#t5--créer-un-compte-administrateur-développeur)).

![Connexion admin](../screenshots/admin-login.png) <!-- À compléter -->

---

## 2. Comprendre le tableau de bord

L'**Atelier** affiche :

- Le nombre total de commandes.
- Un bouton **Rafraîchir** (met à jour la liste en temps réel).
- Un bouton **Déconnexion**.
- Trois onglets : **🛠️ Commandes**, **⚙️ Réglages**, **🎉 Campagnes**.

![Atelier](../screenshots/admin-dashboard.png) <!-- À compléter -->

Chaque **carte commande** (cliquable pour se déplier) montre : le code `MT-XXXX`, le style, le produit et le prix (avec remise promo éventuelle), la file courante et le statut.

---

## 3. Les 4 files de travail

| File | Icône | Commandes concernées |
| --- | --- | --- |
| **À traiter** | 🆕 | `recue` |
| **En création** | 🎨 | `en_creation` |
| **En validation client** | ⏳ | `propositions_pretes` |
| **À produire / Livraison** | 🖨️ | `validee`, `en_impression`, `expediee`, `livree` |

Les cartes numérotées en haut (et les filtres sous la barre) permettent de filtrer par file ou par statut précis. Le compteur de chaque file est mis à jour en temps réel.

---

## 4. Créer les 3 déclinaisons

Cette étape est le **cœur du travail d'artiste** dans l'atelier.

1. Ouvre une commande dans la file **À traiter** (`recue`) ou **En création** (`en_creation`).
2. Consulte les 3 blocs d'information :
   - **👤 Client** : nom, téléphone, produit, taille, couleur, quartier/adresse.
   - **📷 Photo du client** : la photo source.
   - **🦸 Avatar de référence** : le style toon à recréer (Manga, Comics ou Pop Art).
3. Clique sur **« Marquer en création »** (pour une commande `recue`) : la commande passe dans la file **En création**.
4. **Dessine les 3 déclinaisons** du style choisi à partir de la photo et de l'avatar de référence.
5. Clique sur **« Déposer les 3 déclinaisons »** et sélectionne les **3 images** (ordre : déclinaison 1, 2, 3).

> ⚠️ Le dépôt des 3 images passe automatiquement la commande au statut **`propositions_pretes`** (file **En validation client**). Un dépôt partiel n'est pas prévu : prépare tes 3 images avant de déposer.

![Dépôt des déclinaisons](../screenshots/admin-variations.png) <!-- À compléter -->

---

## 5. Attendre la validation du client

Quand la commande est en file **En validation client**, un message jaune l'indique :

> ⏳ En attente de la validation du client — Le client consulte ses 3 déclinaisons et choisit sa préférée.

**Rien à faire ici** : tu ne peux pas valider à la place du client (la validation passe par la RPC `choose_variation` côté client, c'est une protection volontaire du workflow). Dès que le client valide, le statut passe à `validee` et la commande apparaît dans la file **À produire / Livraison**.

> 💡 Tu peux rafraîchir la liste pour voir les changements.

---

## 6. Assigner un imprimeur

Dès que la commande est `validee` (ou plus tard) :

1. Ouvre la commande.
2. Dans le bloc **« 🖨️ Imprimeur partenaire »**, saisis le nom ou l'identifiant de l'imprimeur.
3. Clique sur **« Assigner »**.

L'imprimeur assigné apparaît dans le bloc **👤 Client** (`🖨️ {imprimeur}`) et sera **imprimé sur le PDF** (ligne « Imprimeur : … »).

---

## 7. Changer le statut d'une commande

Utilise les boutons d'action proposés sur la carte selon le statut actuel :

| Statut actuel | Bouton | Statut suivant |
| --- | --- | --- |
| `recue` | Marquer en création | `en_creation` |
| `validee` | Passer en impression | `en_impression` |
| `en_impression` | Passer en expédition | `expediee` |
| `expediee` | Marquer comme livrée | `livree` |

Chaque passage est **journalisé** dans la **📜 Timeline** de la commande (date + statut + note), visible aussi par le client sur la page Suivi.

> ⚠️ **Règle d'or** : une commande ne passe en impression que **si le client a validé** sa déclinaison. Si le bouton « Passer en impression » n'apparaît pas, c'est que la commande n'est pas encore `validee`.

---

## 8. Fichier d'impression (PDF A4 / DTF)

Le bloc **« 🖨️ Fichier d'impression (PDF A4 / DTF) »** apparaît dès qu'une déclinaison a été choisie.

### Générer le PDF
Clique sur **« Générer le PDF A4 »** → un PDF est créé côté serveur (bandeau méta : code, client, téléphone, produit, taille, couleur, imprimeur, date + artwork + mention DTF) puis stocké.

### Ensuite, trois actions
| Action | Effet |
| --- | --- |
| **📄 Télécharger** | Télécharge le PDF `impression-{code}.pdf` |
| **🔗 Copier le lien** | Copie une URL signée (valable 7 jours) |
| **💬 Envoyer à l'imprimeur** | Ouvre WhatsApp avec le lien du dossier d'impression pré-rempli |

> ℹ️ Pour un rendu DTF net, l'interface conseille de déposer des images **haute résolution** dans les déclinaisons.

---

## 9. Réglages (bandeau promo)

Onglet **⚙️ Réglages** :

1. Saisis le texte du bandeau (ex. `−10% cette semaine avec le code TOON10`).
2. Coche **Actif** pour l'afficher sur tout le site.
3. Clique sur **« Enregistrer »** (le bouton confirme « ✓ Enregistré »).

Le bandeau s'affiche alors sur toutes les pages publiques.

---

## 10. Campagnes promo

Onglet **🎉 Campagnes** — voir aussi [T2 · Première campagne promo](../users/TUTORIELS.md#t2--première-campagne-promo-admin).

### Créer une campagne
1. Remplis le formulaire **« ➕ Nouvelle campagne »** :
   - **Nom** (ex. « Noël 2026 »)
   - **Code** (identifiant unique, ex. `noel-2026`)
   - **Début / Fin** (fenêtre de validité ; fin vide = illimitée)
   - **Texte du bandeau** (affiché sur tout le site)
   - **Code promo** (ex. `NOEL10`)
   - **Remise (%)** (0 à 100)
   - **Couleur d'accent** (couleur du bandeau)
   - **Activer immédiatement** (optionnel)
2. Clique sur **« Créer la campagne »**.

### Gérer les campagnes existantes
Chaque carte campagne propose :
- **Activer / Désactiver** (interrupteur manuel, à tout moment).
- **Modifier** (pré-remplit le formulaire).
- **Suppr.** (confirmation demandée).

> ⚠️ Une campagne **désactivée** ne s'affiche jamais, même dans sa fenêtre de dates. Le code promo correspondant est alors invalide (recalculé par le serveur).

![Campagnes](../screenshots/admin-campaigns.png) <!-- À compléter -->

---

## 11. Dépannage rapide

| Situation | Cause probable | Action |
| --- | --- | --- |
| Je ne peux pas me connecter | Mauvais identifiants ou compte non admin | Vérifie email/mdp ; compte absent de `admins` → voir [T5](../users/TUTORIELS.md#t5--créer-un-compte-administrateur-développeur) |
| Une commande reste en « En création » | Les 3 déclinaisons ne sont pas déposées | Dépose les 3 images → passage auto à `propositions_pretes` |
| Pas de bouton « Passer en impression » | Commande non validée par le client | Attends la validation client |
| PDF « Non autorisé » (401/403) | Session expirée ou non admin | Reconnecte-toi en admin puis réessaie |
| PDF « Aucune déclinaison validée » | Pas de déclinaison choisie | Vérifie que le client a validé |
| PDF « Commande introuvable » | Code inexistant | Vérifie le code `MT-XXXX` |
| La liste est obsolète | Affichage figé | Clique sur **Rafraîchir** |

> Pour les pannes plus larges (Supabase indisponible, Netlify ne déploie plus…), consulte [`OPERATIONS.md`](OPERATIONS.md).

---

## Références croisées

- [OPERATIONS.md](OPERATIONS.md) — procédures « Que faire si… »
- [FAQ.md](../users/FAQ.md) — section Administration (B)
- [TUTORIELS.md](../users/TUTORIELS.md) — T2, T3
- [API.md](../developers/API.md) — mécanismes sous-jacents
