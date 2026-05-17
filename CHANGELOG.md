# Changelog

Tous les changements notables de ce projet sont documentés ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Versionnage : [Semantic Versioning](https://semver.org/).

---

## [0.8.2] — 2026-05-17

### Corrigé
- `ranges-ui.js` : `renderRangeGrid` et `renderLegend` acceptent maintenant un conteneur optionnel (fix popup range-ref sur pages hors /ranges/)
- `ranges-ui.js` : `RM_FILE_URL` exporté en global (fix "fichier de ranges non configuré" sur pages review/stratégie)
- `range-ref.js` : la légende est rendue dans un élément dédié (ne détruit plus la grille)

## [0.8.1] — 2026-05-17

### Modifié
- `range-ref.js` : syntaxe simplifiée `[N/M]` (index numérique) au lieu de `[action/position]` — N = catégorie (haut→bas), M = onglet (gauche→droite)
- Le popup affiche le vrai nom catégorie/onglet une fois chargé

---

## [0.8.0] — 2026-05-17

### Ajouté
- Affichage des mises en Big Blinds dans les reviews (format PokerStars natif)
- Tags de range inline `[action/position]` dans les articles (review et stratégie)
- Carte de navigation **Stratégie** sur la page d'accueil (3 cartes : Ranges / Review / Stratégie)
- Section **Derniers articles** sur la page d'accueil (5 articles les plus récents toutes sections)
- Symboles de couleurs (♠ ♥ ♦) sur les cartes de navigation
- Effets néon (glow CSS) sur le logo et au survol des cartes
- Styles popup range-ref avec effet néon vert

### Modifié
- `hh-render.js` : conversion automatique des montants currency → BB pour format PS natif
- `index.html` : grille nav-cards 3 colonnes + section derniers articles
- `main.css` : variables `--neon` / `--neon-gold`, dégradé de fond enrichi, styles range-ref

---

## [0.7.0] — 2026-05-10

### Ajouté
- `deploy.sh` : menu interactif avec bannière ASCII (paire d'as), 6 actions
- `build_ranges.sh` : remplace `update-ranges.sh`, lecture implicite depuis `ranges/`
- Dossiers locaux `.gitignore` : `videos/`, `txt/`, `ranges/`
- Résolution implicite `video_url: "nom.webm"` → `/videos/nom.webm` dans les templates
- `do_mime()` dans `deploy.sh` : snippet MIME lighttpd pour `.webm`
- `anonymize-hh.py` : anonymisation des noms adversaires (Villain1/2…), auto-détection Hero
- `new-review.py` : génération automatique d'articles Hugo depuis une hand history brute
- `README.md` : documentation complète (ranges, reviews, anonymisation, deploy)

### Modifié
- Templates `review/single.html` et `_default/single.html` : `<source type="video/webm|mp4|ogg">` correct
- `anonymize-hh.py` : suppression anonymisation table et numéro de main (non pertinents)

---

## [0.6.0] — 2026-05-08

### Ajouté
- Section **Stratégie** : layout sticky sidebar + panneau de contenu, responsive
- Navigation latérale avec table des matières dans les fiches stratégie
- Toggle mobile sidebar (bouton flottant)

### Modifié
- `strategie/single.html` : layout grid 256px + 1fr avec sidebar sticky

---

## [0.5.0] — 2026-05-05

### Ajouté
- Affichage inline des hand histories (blocs ` ```hh ```) via `hh-render.js`
- Parser `hh-parser.js` : supporte PT4 et PokerStars natif
- Cartes visuelles via `cards-ui.js`
- Attribut `data-hero` sur l'article pour passer le nom du hero au JS (évite double-encodage Hugo)

### Corrigé
- URLs relatives via `.RelPermalink` (site servi en HTTP local)

---

## [0.4.0] — 2026-05-01

### Ajouté
- Section **Review** : liste des mains, page individuelle avec vidéo et HH
- Intégration vidéo (WebM/MP4/OGG) dans les articles review
- Script `deploy.sh` initial

---

## [0.3.0] — 2026-04-25

### Ajouté
- Section **Ranges** : sidebar verticale catégories + onglets horizontaux
- `ranges-ui.js` : chargement et rendu de la grille 13×13 depuis fichier `.rm`
- `build_ranges.sh` / `update-ranges.sh` : mise à jour du fichier de ranges

---

## [0.2.0] — 2026-04-15

### Ajouté
- Thème sombre premium (palette poker : vert feutré, or, néon vert)
- Header sticky, footer, navigation principale
- Recherche full-text côté client (`search-ui.js`)

---

## [0.1.0] — 2026-04-10

### Ajouté
- Initialisation du site Hugo (`poker/`)
- Structure de base : layouts, CSS, assets
- `.gitignore` initial
