# ZobraK Poker

Site statique personnel de travail poker. Construit avec [Hugo](https://gohugo.io/), servi par Lighttpd. Aucun tracking, aucune dépendance externe à l'exécution.

**URL de production :** `https://poker.zobrak.net/`
**Langue :** Français
**Thème :** Dark poker (vert feutrine / or)

---

## Sommaire

1. [Architecture du projet](#1-architecture-du-projet)
2. [Prérequis & installation](#2-prérequis--installation)
3. [Workflow de développement](#3-workflow-de-développement)
4. [Déploiement en production](#4-déploiement-en-production)
5. [Mettre à jour les ranges](#5-mettre-à-jour-les-ranges)
6. [Poster une review de main](#6-poster-une-review-de-main)
7. [Écrire une fiche stratégique](#7-écrire-une-fiche-stratégique)
8. [Format Hand History (`hh`)](#8-format-hand-history-hh)
9. [Taxonomies & frontmatter de référence](#9-taxonomies--frontmatter-de-référence)
10. [Architecture technique avancée](#10-architecture-technique-avancée)

---

## 1. Architecture du projet

```
zobrak-poker/
├── deploy.sh                  # Script de déploiement (serveur)
└── poker/                     # Racine Hugo
    ├── hugo.toml              # Configuration Hugo
    ├── archetypes/            # Modèles de contenu
    ├── assets/
    │   ├── css/main.css       # Feuille de styles unique (dark theme)
    │   └── js/
    │       ├── cards-ui.js    # Rendu visuel des cartes
    │       ├── hh-parser.js   # Parser hand history (PokerStars + PT4)
    │       ├── hh-render.js   # Injection HTML des blocs HH dans les articles
    │       ├── ranges-ui.js   # Lecteur de fichiers .rm (Range Manager)
    │       ├── review-ui.js   # UI spécifique aux reviews
    │       └── search-ui.js   # Recherche plein texte client-side
    ├── content/
    │   ├── _index.md          # Page d'accueil
    │   ├── ranges/_index.md   # Section ranges
    │   ├── review/            # Reviews de mains
    │   │   └── examples/      # Sous-dossier d'exemples
    │   └── strategie/         # Fiches stratégiques
    │       └── nlhe-micro/    # Sous-section NLHE micro-limites
    ├── layouts/
    │   ├── _default/          # Templates génériques (baseof, list, single)
    │   ├── index.html         # Template page d'accueil
    │   ├── partials/          # En-tête, pied de page, SEO
    │   ├── ranges/            # Template section ranges
    │   ├── review/            # Templates list + single review
    │   └── strategie/         # Templates list + single stratégie (sidebar + TOC)
    └── static/
        └── data/ranges/       # Fichiers .rm (Range Manager JSON)
```

### Sections du site

| Section | URL | Description |
|---------|-----|-------------|
| Accueil | `/` | Recherche + cards de navigation |
| Ranges | `/ranges/` | Visualiseur interactif de ranges NL2 |
| Review | `/review/` | Reviews de mains avec parsing hand history |
| Stratégie | `/strategie/` | Fiches stratégiques avec sidebar + TOC |

---

## 2. Prérequis & installation

### Serveur de production

- **OS :** Debian/Ubuntu
- **Hugo :** `apt install hugo` (ou binaire depuis [github.com/gohugoio/hugo](https://github.com/gohugoio/hugo/releases))
- **Lighttpd :** `apt install lighttpd`
- **Répertoire de destination :** `/var/www/poker`

### Poste de développement local

```bash
# Cloner le dépôt
git clone <url-du-depot> zobrak-poker
cd zobrak-poker/poker

# Lancer le serveur de développement (hot-reload)
hugo server -D
# → http://localhost:1313/
```

> **Note :** `-D` inclut les brouillons (`draft: true`). Ne jamais pousser en prod avec `draft: true`.

---

## 3. Workflow de développement

```
[Édition locale] → hugo server → [Vérification] → git commit → git push → ./deploy.sh
```

### Commandes hugo utiles

```bash
# Serveur local avec brouillons
hugo server -D

# Build local (vérification avant push)
hugo --minify

# Nouveau contenu depuis un archétype
hugo new review/ma-main.md
hugo new strategie/nlhe-micro/mon-article.md

# Lister les pages générées
hugo list all
```

### Branches git

- `main` — branche de production, déployée par `./deploy.sh`
- Développement libre sur d'autres branches, merge sur `main` avant déploiement

---

## 4. Déploiement en production

Le script `deploy.sh` (à la racine du dépôt) automatise tout. Il doit être exécuté **sur le serveur** avec les droits root (ou sudo).

```bash
# Déploiement standard (git pull + build + reload Lighttpd)
./deploy.sh

# Build seul, sans git pull (si modifications locales sur le serveur)
./deploy.sh --no-pull
```

### Ce que fait le script

1. `git pull origin main` — récupère les derniers commits
2. `hugo --minify` — compile le site dans `/var/www/poker`
3. `chown/chmod` — applique les permissions `www-data:www-data`
4. `service lighttpd force-reload` — recharge le serveur web

### En cas d'erreur Hugo au build

```bash
# Build avec sortie verbeuse
cd poker && hugo -v
```

Les erreurs les plus fréquentes :
- **Fichier .md mal formé** : vérifier le frontmatter YAML (indentation, guillemets)
- **Template introuvable** : vérifier que le type de contenu correspond à un dossier dans `layouts/`
- **Lien cassé** : toujours utiliser `.RelPermalink` dans les templates, jamais `.Permalink` (le site est servi en HTTP, `.Permalink` génère des URLs `https://`)

---

## 5. Mettre à jour les ranges

Les ranges sont stockées dans des fichiers `.rm` (format Range Manager — JSON propriétaire). Le lecteur JavaScript les charge côté client.

### Script `update-ranges.sh` (méthode recommandée)

Un script CLI à la racine du projet automatise toute la procédure :

```bash
./update-ranges.sh <fichier.rm> <limite>
```

**Exemples :**

```bash
# Mettre à jour les ranges NL2 avec un nouveau fichier
./update-ranges.sh ~/Downloads/Ranges_NL2_v4.rm NL2

# Mettre à jour les ranges NL5
./update-ranges.sh /tmp/my_ranges.rm NL5
```

**Ce que fait le script, dans l'ordre :**

1. Vérifie que le fichier source existe et est du JSON valide
2. Renomme l'ancien fichier actif `ranges_<limite>.rm` → `ranges_<limite>.old` (sauvegarde)
3. Copie le nouveau fichier sous `poker/static/data/ranges/ranges_<limite>.rm`
4. Met à jour la variable `RM_FILE_URL` dans `ranges-ui.js`
5. Propose de committer et pousser immédiatement

**Convention de nommage appliquée automatiquement :**

```
poker/static/data/ranges/
├── ranges_NL2.rm      # fichier actif chargé par le site
└── ranges_NL2.old     # sauvegarde de la version précédente
```

Quel que soit le nom du fichier source passé en argument, le fichier de destination est toujours `ranges_<limite>.rm`.

### Procédure manuelle (si besoin)

```bash
# 1. Copier et renommer
cp /chemin/vers/nouveau.rm poker/static/data/ranges/ranges_NL2.rm

# 2. Mettre à jour ranges-ui.js (ligne RM_FILE_URL)
#    var RM_FILE_URL = '/data/ranges/ranges_NL2.rm';

# 3. Commit + push
git add poker/static/data/ranges/ranges_NL2.rm poker/assets/js/ranges-ui.js
git commit -m "Ranges: mise à jour NL2"
git push origin main

# 4. Déployer sur le serveur
./deploy.sh
```

### Structure d'un fichier `.rm`

C'est du JSON avec la structure suivante :

```json
{
  "categories": [
    {
      "name": "UTG",
      "tabs": [
        {
          "name": "Open",
          "range": "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,AKo"
        }
      ]
    }
  ]
}
```

- **`categories`** : positions ou situations (UTG, HJ, CO, BTN, SB, BB…)
- **`tabs`** : actions dans cette situation (Open, 3bet, Call, Fold…)
- **`range`** : mains en notation standard (virgule comme séparateur)

---

## 6. Poster une review de main

### Emplacement

```
poker/content/review/
└── <nom-du-fichier>.md
```

Les sous-dossiers sont autorisés (ex. `review/exemples/`, `review/tournois/`). Ils créent une hiérarchie dans l'URL mais partagent le même template.

### Frontmatter complet

```yaml
---
title: "AA CO — 3bet pot, value bet river"
date: 2026-05-16
draft: false
description: "Hero CO avec AA, 3bet préflop, value bet sur trois streets."

# Identification du Hero pour le parser hand history
hero: "VotreNomJoueur"

# Taxonomies (permettent le filtrage dans la liste)
tags:
  - holdem
  - no-limit
  - cash-game
  - 6-max
  - NL2
  - PokerStars
  - 3bet
  - value

limits:
  - NL2

rooms:
  - PokerStars

positions:
  - CO

actions:
  - 3bet
  - value-bet

streets:
  - preflop
  - flop
  - turn
  - river

formats:
  - 6-max

# Métadonnées affichées dans la liste et l'en-tête
params:
  hero_position: "CO"
  pot_type: "3bet pot"
  result_bb: 12.5        # positif = gain, négatif = perte (en BB)
  video_url: ""          # URL d'une vidéo (optionnel, laisser vide si absent)
---
```

### Corps de l'article

```markdown
```hh
PokerStars Hand #260824466012:  Hold'em No Limit (€0.01/€0.02 EUR) - 2026/05/16 11:49:31 CET
Table 'Alemannia VII' 6-max Seat #3 is the button
Seat 1: Villain1 (€2.09 in chips)
Seat 3: VotreNomJoueur (€2.00 in chips)
...
*** HOLE CARDS ***
Dealt to VotreNomJoueur [As Ad]
...
```​

## Analyse

### Préflop
...

### Flop
...
```

Le bloc de code avec le langage `hh` est automatiquement parsé et rendu sous forme de tableau structuré par le JavaScript (`hh-parser.js` + `hh-render.js`). Voir la [section 8](#8-format-hand-history-hh) pour les formats supportés.

### Valeurs pour `result_bb`

| Valeur | Signification |
|--------|--------------|
| `12.5` | Gain de 12.5 BB |
| `-8.0` | Perte de 8 BB |
| `0` | Breakeven |

La liste des reviews affiche automatiquement `+12.5 BB` ou `-8 BB` avec couleur correspondante.

### Publication rapide (sans brouillon)

```bash
# Créer et éditer directement
vim poker/content/review/ma-main.md

# Vérifier que draft: false est bien dans le frontmatter
grep "draft" poker/content/review/ma-main.md

# Commit + push
git add poker/content/review/ma-main.md
git commit -m "Review: AA CO 3bet pot NL2 PokerStars"
git push origin main

# Déployer
./deploy.sh
```

---

## 7. Écrire une fiche stratégique

### Emplacement

```
poker/content/strategie/
└── <sous-section>/
    ├── _index.md          # Page d'index de la sous-section (obligatoire)
    └── <nom-article>.md   # La fiche
```

Pour créer une nouvelle sous-section, créer le dossier et son `_index.md`. La sidebar de navigation se met à jour automatiquement.

### Créer une nouvelle sous-section

```bash
mkdir -p poker/content/strategie/omaha-micro

cat > poker/content/strategie/omaha-micro/_index.md << 'EOF'
---
title: "Omaha Micro limites — PLO2 / PLO5"
description: "Stratégies et exploits pour les micro-limites Pot-Limit Omaha."
---
EOF
```

### Frontmatter d'un article stratégique

```yaml
---
title: "Le bluff en NL2 : principes et application"
date: 2026-05-16
description: "Quand bluffer, contre qui, sur quelles textures et à quels sizings."
tags:
  - NL2
  - bluff
  - stratégie
  - cash-game
  - micro-limites
limits:
  - NL2
  - NL5
---
```

### Mise en forme du contenu

Les titres `##` (H2) et `###` (H3) sont automatiquement indexés dans la **table des matières** affichée dans la sidebar (configurable dans `hugo.toml` via `[markup.tableOfContents]`).

```markdown
## 1. Principe de base

Texte introductif.

### 1.1 Calcul de la fold equity

| Mise | Pot | FE nécessaire |
|---:|---:|---:|
| 1/3 pot | 1 | 25 % |
| 1/2 pot | 1 | 33 % |

## 2. Profiling des adversaires
```

**Éléments supportés :**
- Tableaux Markdown (`|---|`)
- Blockquotes (`>`) — mis en valeur avec bordure accent
- Code inline (`` `code` ``) et blocs de code (``` ``` ```)
- Listes à puces et numérotées
- Texte en gras (`**texte**`) et italique (`*texte*`)
- Séparateurs horizontaux (`---`) — style fin, couleur border
- Blocs hand history (``` ```hh ```) — voir section 8

### Navigation latérale (sidebar)

La sidebar est **générée automatiquement** depuis la structure `content/strategie/`. Elle affiche :
- Le lien racine "Stratégie"
- Les sous-sections avec leurs articles

Aucune configuration manuelle n'est requise. Ajouter un fichier dans une sous-section le fait apparaître automatiquement.

---

## 8. Format Hand History (`hh`)

Le parser supporte deux formats. Il détecte automatiquement lequel utiliser.

### Format PokerStars natif (recommandé)

Copier-coller directement depuis le client PokerStars ou le Hand History Viewer :

````markdown
```hh
PokerStars Hand #260824466012:  Hold'em No Limit (€0.01/€0.02 EUR) - 2026/05/16 11:49:31 CET
Table 'Alemannia VII' 6-max Seat #3 is the button
Seat 1: Villain (€2.09 in chips)
Seat 5: VotreNom (€2.00 in chips)
Villain: posts small blind €0.01
VotreNom: posts big blind €0.02
*** HOLE CARDS ***
Dealt to VotreNom [Ah Kh]
Villain: raises €0.04 to €0.06
VotreNom: raises €0.22 to €0.28
Villain: folds
VotreNom collected €0.13 from pot
*** SUMMARY ***
Total pot €0.13 | Rake €0
Seat 5: VotreNom (big blind) collected (€0.13)
```
````

**Champ `hero` obligatoire dans le frontmatter** pour que le parser identifie Hero dans la hand history :

```yaml
hero: "VotreNom"   # doit correspondre exactement au nom du joueur dans la HH
```

### Format PokerTracker 4 (PT4)

Format exporté depuis PokerTracker 4. Commence par `Game #` :

````markdown
```hh
Game #12345678: Hold'em No Limit ($0.01/$0.02) - 2026/05/16
Table: My Table (6 max)
Seat 1: Villain ($2.00)
Seat 2: Hero ($2.00)
Hero posts BB $0.02
...
```
````

Dans ce format, le joueur nommé `Hero` est automatiquement reconnu sans avoir besoin du champ `hero` dans le frontmatter.

### Ce que le rendu affiche

- **En-tête** : salle, stakes, format, position Hero
- **Main Hero** : cartes avec rendu visuel (couleur par enseigne)
- **Actions par street** : Préflop → Flop → Turn → River, avec pot en BB
- **Résultat** : gagnant et montant
- **Stats HUD** : si présentes dans le format PT4

---

## 9. Taxonomies & frontmatter de référence

Hugo génère des pages de taxonomie automatiquement pour chaque valeur renseignée.

### Taxonomies disponibles

| Clé frontmatter | URL générée | Exemple de valeurs |
|----------------|-------------|-------------------|
| `tags` | `/tags/<valeur>/` | holdem, no-limit, cash-game, 6-max, NL2 |
| `limits` | `/limits/<valeur>/` | NL2, NL5, NL10, NL25 |
| `rooms` | `/rooms/<valeur>/` | PokerStars, Winamax, GGPoker |
| `positions` | `/positions/<valeur>/` | UTG, HJ, CO, BTN, SB, BB |
| `actions` | `/actions/<valeur>/` | open, 3bet, 4bet, call, squeeze, fold |
| `streets` | `/streets/<valeur>/` | preflop, flop, turn, river |
| `formats` | `/formats/<valeur>/` | 6-max, full-ring, heads-up |

### Paramètres spéciaux (reviews uniquement)

Ces champs s'affichent sous forme de badges dans la liste et l'en-tête de l'article :

```yaml
params:
  hero_position: "BB"       # Affiche "BB" dans les badges
  pot_type: "3bet pot"      # Type de pot (affiché en badge)
  result_bb: -8.5           # Résultat en BB (rouge si négatif, vert si positif)
  video_url: ""             # Lien vers une vidéo (balise <video> embarquée)
```

### Valeurs `result_bb`

Le badge s'affiche en vert si positif, sans couleur spéciale si nul ou négatif (CSS `.result-chip`).

---

## 10. Architecture technique avancée

### Génération du site

Hugo compile les templates `layouts/` avec le contenu `content/` et produit du HTML statique. Aucun backend, aucune base de données.

```
content/*.md  +  layouts/*.html  →  hugo --minify  →  /var/www/poker/*.html
```

### Gestion des assets JS

Les fichiers JS dans `assets/js/` sont référencés via `resources.Get` dans les templates Hugo. Ils sont copiés tels quels (pas de bundling). Ordre de chargement dans `review/single.html` :

```
cards-ui.js  →  hh-parser.js  →  hh-render.js
```

`hh-render.js` appelle `renderHandHistories()` au `DOMContentLoaded`. Cette fonction :
1. Cherche tous les blocs `<code class="language-hh">` ou `<code data-lang="hh">`
2. Lit l'attribut `data-hero` sur `<article>` pour identifier Hero
3. Parse via `parseHandHistory()` (auto-détecte PokerStars vs PT4)
4. Remplace le bloc `<pre>` par un `<div class="hh-block">` stylisé

### Recherche plein texte

`search-ui.js` charge `/search-index.json` (généré par Hugo via `layouts/index.json`) et effectue une recherche textuelle côté client. L'index contient titre, description et contenu de toutes les pages.

### Pourquoi `.RelPermalink` et pas `.Permalink`

`hugo.toml` définit `baseURL = "https://poker.zobrak.net/"`. Le site est servi en HTTP local. `.Permalink` génère une URL absolue avec `https://`, inaccessible depuis le réseau local. **Toujours utiliser `.RelPermalink`** dans les templates pour des chemins relatifs compatibles HTTP et HTTPS.

### Coloration syntaxique (Chroma)

Hugo utilise Chroma pour les blocs de code. Pour le langage `hh` (inconnu de Chroma), il génère :

```html
<div class="highlight">
  <pre class="chroma">
    <code class="language-hh" data-lang="hh">...</code>
  </pre>
</div>
```

Le sélecteur JS couvre les deux cas (Goldmark sans Chroma et Chroma) :

```js
document.querySelectorAll('code.language-hh, code[data-lang="hh"]')
```

Le remplacement DOM supprime également le `<div class="highlight">` parent si présent.

### Ajout d'une nouvelle section (type de contenu)

1. Créer le dossier `poker/content/<section>/` avec `_index.md`
2. Créer les templates `poker/layouts/<section>/list.html` et `single.html`
3. Ajouter le lien dans `poker/layouts/partials/header.html`
4. Si taxonomies spécifiques, les déclarer dans `hugo.toml` sous `[taxonomies]`

---

## Licence

CC-BY-NC-SA 2026 — ZobraK PokeR. Usage personnel, pas de tracking.
