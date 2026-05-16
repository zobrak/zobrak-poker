---
title: "La mise en bluff en NL2"
date: 2026-05-16
description: "Quand bluffer, contre qui, sur quelles textures et à quels sizings aux micro-limites NL2."
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

## Objectif

En NL2, le bluff doit rester **sélectif, simple et exploitant**.

Le but n'est pas de "représenter quelque chose" de manière théorique.
Le but est de faire coucher une partie suffisante de la range adverse pour que la mise gagne plus d'argent que le check.

> En NL2, on bluff moins que la théorie, mais on bluff mieux.

---

## 1. Principe de base

Une mise en bluff est rentable si vilain fold assez souvent.

Formule minimale :

```
Fold equity nécessaire = mise / (pot + mise)
```

| Mise | Pot | FE nécessaire |
|---:|---:|---:|
| 1/3 pot | 1 | 25 % |
| 1/2 pot | 1 | 33 % |
| 2/3 pot | 1 | 40 % |
| Pot | 1 | 50 % |
| 1.5x pot | 1 | 60 % |

- Plus tu mises gros, plus vilain doit folder souvent.
- Contre une calling station, les gros bluffs deviennent vite catastrophiques.
- Contre un reg faible qui overfold, les petits et moyens bluffs impriment beaucoup d'EV.

---

## 2. Règle d'or NL2

### Ne bluffe pas une range, bluffe un profil

En théorie, certaines textures se bluffent naturellement.
En NL2, le profil adverse prime souvent sur la théorie.

### Bons profils à bluffer

- reg nit
- joueur fit-or-fold
- joueur avec Fold to Cbet élevé
- joueur qui call flop puis abandonne turn
- joueur qui protège trop peu sa BB
- joueur qui stab peu quand tu check
- joueur qui sait folder top paire moyenne
- joueur qui multitable et joue mécaniquement

### Mauvais profils à bluffer

- calling station
- joueur 50/10, 60/5, 70/0
- profil "je veux voir"
- joueur qui call any pair
- joueur qui call trop les tirages
- joueur en tilt passif
- joueur short stack récréatif
- joueur qui vient de perdre un gros pot et ne veut plus fold

Contre ces profils, l'argent vient de la value, pas du bluff.

---

## 3. Les meilleurs bluffs en NL2

Un bon bluff a au moins une de ces qualités :

1. **équité directe**
2. **bloqueurs utiles**
3. **bonne visibilité river**
4. **range adverse cappée**
5. **range perçue de Hero forte**
6. **fold equity réelle chez vilain**

---

## 4. Bluff avec équité

Ce sont les bluffs les plus importants en NL2.

### Exemples solides

- tirage couleur
- tirage quinte ouvert
- gutshot + overcards
- backdoor flush + overcard
- deux overcards sur board sec
- combo draw
- A-high avec backdoors

Ces mains peuvent gagner de deux façons :

```
EV = folds immédiats + équité quand payé
```

### Exemple

Hero open BTN, BB call. Flop : **K♠ 7♦ 3♦** — Hero a **A♦ 5♦**

Cbet est très bon :
- nut flush draw
- bloqueurs des calls forts à carreau
- possibilité de barrel beaucoup de turns
- gain possible au showdown contre floats faibles

---

## 5. Bluff pur : à limiter fortement

Un bluff pur sans équité doit être rare.

**Exemple mauvais :** Hero a 9♣ 8♣ — Board A♦ K♠ 4♥ 2♠ — Vilain call flop — Hero barrel turn sans équité.

Problème :
- vilain a souvent Ax, Kx, pocket pair ou tirage
- Hero n'a pas d'outs propres
- en NL2, beaucoup trop de joueurs call "pour voir"

Bluff pur acceptable seulement si :
- vilain overfold clairement
- le board avantage massivement Hero
- vilain est cappé
- ton sizing met une vraie pression
- tu sais quelles rivers continuer ou abandonner

---

## 6. Les textures favorables au bluff

### Très bonnes textures pour cbet bluff

Boards secs, hauts, avantage relanceur : `A♣ 7♦ 2♠` · `K♠ 8♥ 3♦` · `Q♦ 6♣ 2♥` · `A♥ K♣ 4♠`

Pourquoi ?
- Hero a plus de top paires fortes
- BB a beaucoup de mains faibles
- petit sizing suffit souvent (25 % à 33 % pot)

### Textures dangereuses à bluffer

Boards connectés, bas, très défendus par BB : `9♠ 8♠ 6♦` · `7♥ 6♣ 5♣` · `T♠ 9♦ 8♦`

Les calls sont nombreux et il faut multibarrel cher pour faire folder.

---

## 7. Le cbet bluff flop

### En position

Cbet bluff profitable quand :
- board favorable à ton range
- vilain fold assez au cbet
- tu as backdoors ou overcards
- ton sizing est petit
- tu peux contrôler la suite

**Exemple standard :** Hero open CO, BB call — Flop A♠ 8♦ 3♣ — Hero a K♦ Q♦. Cbet 1/3 pot : tu représentes Ax, vilain a beaucoup de mains sans paire, KQ a encore un peu d'équité.

### Hors position

Bluff OOP avec plus de prudence :
- cbet moins automatique
- privilégier les mains avec équité
- check/fold plus sereinement les airs complets
- check/raise bluff uniquement contre profils qui stab/fold

---

## 8. Le bluff turn

La turn est souvent la street la plus importante.

En NL2, beaucoup de joueurs call flop trop large puis fold turn quand ils n'ont qu'une hauteur, une pocket pair faible ou un float sans plan.

### Bonnes turns à barrel

Cartes qui renforcent ta range perçue : **A, K, Q**

Cartes qui mettent pression sur les paires moyennes :
- A turn après flop K-high
- K turn après flop Q-high
- Q turn après flop J-high

### Mauvaises turns à bluff

**Exemple dangereux :** Hero cbet A♣ 8♠ 4♠, vilain call, turn **7♠**. Cette carte complète flush draws, 65, 87, paires + draws. Sans bloqueur ni équité forte, give up souvent.

---

## 9. Le bluff river

En NL2, le bluff river doit être très discipliné.

> Bluff river seulement quand la range adverse est faible, cappée, et que ton histoire est crédible.

---

## 10. Bons spots de bluff river

### Spot 1 — Vilain check/call flop, check/check turn, check river

Board K♠ 7♦ 2♣ — BB check, Hero bet, BB call — Turn 4♥ check/check — River A♦ BB check.

Hero peut bluff beaucoup de mains ratées : l'As améliore fortement la range perçue de Hero, vilain a beaucoup de 7x, pocket pairs, Kx faibles.

### Spot 2 — Vilain montre trois streets de faiblesse

Board Q♠ 8♦ 3♣ 2♥ A♣ — Si SB check trois fois, sa range contient énormément de mains faibles. Overbet bluff possible contre reg faible ou joueur fit-or-fold. **Attention : mauvais contre station.**

### Spot 3 — Missed draw évident + bloqueur value adverse

Board K♠ T♠ 4♦ 6♣ 2♠ — Hero a A♠ Q♦ → bloque nut flush. Si ligne cohérente, gros bluff river possible. En NL2, ce spot doit rester rare : beaucoup de joueurs ne foldent pas top paire.

---

## 11. Mauvais spots de bluff river

### Ne bluffe pas quand vilain a une range condensée

Hero bet flop + bet turn, vilain call deux fois, river brique. Si vilain a beaucoup de top pair, overpair, deuxième paire collante : ta fold equity baisse, donne up devient meilleur.

### Ne bluffe pas les scare cards qui améliorent aussi vilain

Board J♠ T♠ 5♦ 8♣ Q♠ — La river complète flush, K9, 97, deux paires. Ce n'est pas automatiquement une bonne carte à bluffer.

### Ne bluffe pas les profils curieux

> S'il est venu jusque river pour regarder, il va souvent payer pour vérifier.

---

## 12. Les bloqueurs utiles

Les bloqueurs servent surtout river.

### Bons bloqueurs

- avoir l'As de la couleur sur board flush possible
- avoir un Roi quand tu représentes AK/KQ
- avoir une carte qui bloque la quinte max
- avoir une carte qui bloque les fulls ou top two

### Mauvais bloqueurs

Si tu bloques des draws ratés chez vilain, tu bloques ses mains qui foldent → ton bluff devient moins bon. En bluff river, tu préfères bloquer sa value, pas ses folds.

---

## 13. Sizing de bluff en NL2

### Petit sizing (25 % à 33 % pot)

- cbet range sur board sec
- pression légère sur air complet adverse
- bon rendement en NL2

### Moyen sizing (50 % à 75 % pot)

- barrel turn
- faire fold pocket pairs et floats

### Gros sizing (pot à overbet)

Utilisation rare :
- range adverse cappée
- Hero a nut advantage clair
- vilain sait folder
- bloqueurs forts + line très crédible

> En NL2, overbet bluff contre mauvais profil = brûlage de cave.

---

## 14. Fréquences recommandées en NL2

### Flop
- petit cbet fréquent sur A-high/K-high secs
- bluff avec backdoors IP
- give up sur boards connectés

### Turn
- continuer avec équité ou bonnes scare cards
- abandonner les airs sans bloqueur
- punir les profils qui call flop/fold turn

### River
- bluffer peu mais fort dans les bons spots
- éviter les bluffs automatiques
- ne pas "finir l'histoire" par ego
- bluffer surtout les ranges cappées

---

## 15. Erreurs fréquentes

### Erreur 1 — Bluff parce qu'on ne peut pas gagner au showdown

La vraie question : **Est-ce que vilain fold assez souvent ?** Une main faible peut juste abandonner.

### Erreur 2 — Bluff une calling station

Contre station : moins de bluff, plus de value, thin value élargie, bluffs quasi supprimés.

### Erreur 3 — Barrel sans plan river

Avant de bet turn, savoir : quelles rivers bluff / give up / value / check back. Sans plan, le bet turn devient souvent spewy.

### Erreur 4 — Confondre scare card et bonne carte à bluffer

Une carte effrayante n'est bonne que si elle avantage ta range, n'améliore pas trop vilain, et vilain peut folder.

### Erreur 5 — Surestimer les bloqueurs

Un bloqueur ne transforme pas automatiquement un mauvais bluff en bon bluff. Il faut aussi un profil qui fold, une line cohérente, un sizing crédible.

---

## 16. Plan de bluff simple pour NL2

### Flop

**Bluff :** boards A-high/K-high secs, mains avec backdoors, tirages forts, IP principalement.

**Check/give up :** air total, boards très connectés, multiway pots, profils collants.

### Turn

**Barrel :** amélioration d'équité, overcard favorable, scare card crédible, vilain fold trop turn.

**Give up :** brique neutre, carte qui aide vilain, aucun bloqueur, profil calling station.

### River

**Bluff :** vilain cappé, line cohérente, bloqueur utile, profil capable de fold.

**Check/fold :** vilain a call deux streets sur runout neutre, profil collant, tu bloques ses folds.

---

## 17. Check-list avant de bluffer

Avant de cliquer bet, répondre vite :

1. Quelle main meilleure je veux faire folder ?
2. Est-ce que cette main existe beaucoup chez vilain ?
3. Est-ce qu'il est capable de la folder ?
4. Quelle value je représente ?
5. Mon sizing met-il assez de pression ?
6. Ai-je de l'équité ou un bloqueur utile ?
7. Si je suis payé, quelle est ma suite ?

Si deux ou trois réponses sont floues, le bluff est souvent mauvais.

---

## 18. Adaptations par profil

### Contre nit
- cbet souvent petits sizings
- barrel scare cards
- overbet river possible quand cappé
- attention quand il raise : range très forte

### Contre TAG faible
- bluff les bons boards
- attaquer les ranges cappées
- utiliser bloqueurs river
- éviter les bluffs absurdes sur runouts neutres

### Contre LAG agressif
- moins de bluff pur
- plus de check/call avec bluffcatchers
- laisser spew, value plus thin

### Contre fish passif
- quasi pas de bluff
- cbet value large, 2-barrel value cher
- check back les airs

### Contre maniaque
- bluffer peu, trap plus
- value plus thin, induce
- ne pas entrer dans une guerre d'ego

---

## 19. Multiway pots

En multiway, bluff beaucoup moins : plus de ranges connectées, moins de fold equity globale, les joueurs NL2 call trop large.

> **Multiway = value heavy.**

Bluff seulement avec équité forte, gros avantage de range, ou faiblesse massive montrée par tous.

---

## 20. Pots 3-bet

### En tant que 3-betteur

Bons bluffs : Axs avec backdoors, KQs/KJs selon board, gutshots + overcards, blockers sur A-high/K-high.

Boards favorables : A-high dry · K-high dry · Q-high disconnected.

**Attention :** en NL2, vilain call 3bet souvent trop broadway/pocket pair. Il peut ne jamais folder top pair.

### En tant que caller du 3-bet

Bluff moins OOP. IP : float possible contre cbet trop automatique.

Bons spots : vilain cbet petit range puis check turn, turn améliore fortement ta range de call.

---

## 21. Overbet bluff

L'overbet bluff est une arme, pas une routine.

Conditions nécessaires :
- Range adverse cappée
- Hero a nut advantage
- Vilain peut fold
- Bloqueur utile
- Line crédible

**Bon spot :** Vilain check trois fois — River complète une carte très favorable à Hero — Vilain a rarement nuts — Hero bloque une partie de sa calling range forte.

**Mauvais spot :** Vilain call flop + turn sur board drawy — River brique — Hero overbet bluff sans bloqueur. En NL2, c'est souvent un punt.

---

## 22. Ligne exploitante recommandée

### Contre field inconnu NL2

```
Flop : bluffs petits et fréquents sur bons boards
Turn : bluffs filtrés, avec équité ou scare card
River : bluffs rares, ciblés, profil-dépendants
```

> **Value > semi-bluff > bluff pur**

---

## 23. Indicateurs HUD utiles

### Fold to Flop Cbet
- > 55 % : cbet bluff profitable souvent
- 40–55 % : standard
- < 40 % : réduire bluffs, value plus

### Fold to Turn Cbet
- > 50 % : très bon candidat à 2-barrel
- 35–50 % : sélectionner
- < 35 % : value heavy

### WTSD
- élevé : bluff moins · bas : bluff plus

### WWSF
- faible : joueur fit-or-fold, bluff plus
- élevé : joueur combatif, réduire bluff pur

**Attention :** en NL2, les samples sont souvent trop faibles. Ne pas suradapter sur 40 mains.

---

## 24. Routine de review des bluffs

Après session, marquer les mains où :
- tu as bluff river
- tu as 2-barrel sans équité
- tu as overbet bluff
- vilain a call avec une main faible
- vilain a fold sur une mise moyenne/grosse

Pour chaque main :

1. Quel profil ?
2. Quelle range adverse arrive river ?
3. Quelle partie fold ? Quelle partie call ?
4. Quels bloqueurs avais-je ?
5. Quelle value représentais-je ?
6. Mon sizing était-il adapté ?
7. Le bluff était-il nécessaire ou émotionnel ?

But : distinguer les bons bluffs perdants des mauvais bluffs gagnants.

---

## 25. Synthèse opérationnelle

### À faire

- bluffer surtout IP
- bluffer avec équité
- utiliser petits sizings flop
- barrel les bonnes turns
- attaquer les ranges cappées
- choisir les profils
- utiliser les bloqueurs river
- abandonner sans ego
- value thin contre les mauvais callers

### À éviter

- bluff pur sans fold equity
- bluff river par frustration
- bluff calling station
- overbet sans bloqueur
- barrel les cartes qui aident vilain
- bluffer multiway sans équité
- raconter une histoire que ta range ne peut pas avoir

---

## 26. Phrase de discipline

> Un bluff n'a pas besoin d'être courageux. Il doit seulement être rentable.

En NL2, la plupart de l'argent vient de la value. Le bluff sert à compléter la stratégie, pas à prouver qu'on sait jouer.
