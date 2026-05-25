---
title: "NL2 — Le piège du slowplay : quand KK se transforme en bluffcatcher hors de prix"
date: 2026-05-25
draft: false
description: "Un calling station flat KK BTN versus open CO. Hero touche deux paires sur AQ6. Trois rues de value culminant sur un overbet river 1.5x pot. Anatomie d'un slowplay préflop qui coûte très cher."
hero: "Hero"

tags:
  - holdem
  - no-limit
  - cash-game
  - 6-max
  - NL2
  - PokerStars
  - slowplay
  - value-bet
  - overbet
  - calling-station
  - preflop-mistake

limits:
  - NL2

rooms:
  - PokerStars

positions:
  - CO

actions:
  - value-bet
  - overbet-river

streets:
  - preflop
  - flop
  - turn
  - river

formats:
  - 6-max

params:
  hero_position: "CO"
  pot_type: "SRP"
  result_bb: +57
  video_url: "videos/review/20260525-104.webm"
  hand_id: "260923064672"
  players:
    - label: "Hero"
      uuid: "4cd25db6"
      position: "CO"
      stack_bb: 100
      is_hero: true
      avatar: "/avatars/4cd25db6.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
    - label: "a99c6e82"
      uuid: "a99c6e82"
      position: "BTN"
      stack_bb: 100
      is_hero: false
      avatar: "/avatars/a99c6e82.svg"
      vpip: 50.7
      pfr: 0.0
      three_bet: 0.0
      hands: 71
---

```hh
PokerStars Hand #260923064672:  Hold'em No Limit (€0.01/€0.02 EUR) - 2026/05/25 12:40:21 CET
Table 'Anonyme' 6-max Seat #5 is the button
Seat 1: Villain1 (€2.04 in chips)
Seat 2: Villain2 (€3.46 in chips)
Seat 3: Villain3 (€1.52 in chips)
Seat 4: Hero (€2 in chips)
Seat 5: Villain4 (€2.01 in chips)
Seat 6: Villain5 (€0.61 in chips)
Villain5: posts small blind €0.01
Villain1: posts big blind €0.02
*** HOLE CARDS ***
Dealt to Hero [6s Qs]
Villain2: folds
Villain3: folds
Hero: raises €0.04 to €0.06
Villain4: calls €0.06
Villain5: folds
Villain1: folds
*** FLOP *** [Qc Ad 6h]
Hero: bets €0.04
Villain4: calls €0.04
*** TURN *** [Qc Ad 6h] [4c]
Hero: bets €0.17
Villain4: calls €0.17
*** RIVER *** [Qc Ad 6h 4c] [3h]
Hero: bets €0.85
Villain4: calls €0.85
*** SHOW DOWN ***
Hero: shows [6s Qs] (two pair, Queens and Sixes)
Villain4: mucks hand
Hero collected €2.13 from pot
*** SUMMARY ***
Total pot €2.27 | Rake €0.14
Board [Qc Ad 6h 4c 3h]
Seat 5: Villain4 (button) mucked [Kc Kh]
```

> *Certaines mains valent plus qu'un pot gagné. Elles montrent une fuite stratégique entière, presque caricaturale.*

---

Celle-ci est un cas d'école : vilain reçoit {{< cards "Kc Kh" >}} au bouton, face à mon open CO. Il choisit de payer simplement. Pas de 3bet. Pas de pression. Pas de pot construit.

Quelques streets plus tard, il paie un **overbet river** sur un board As-high avec une simple paire de Rois.

Ce n'est pas juste *"il a mal joué KK"*. C'est plus intéressant que ça.

Cette main illustre **trois erreurs fréquentes** en micro-limites :

1. **Slowplay** une premium préflop sans raison stratégique
2. Laisser l'adversaire **réaliser son équité** trop bon marché
3. Rester amoureux de la force préflop d'une main qui a **perdu sa valeur postflop**

Et en NL2, avec le rake, ces erreurs coûtent très cher.

---

## La main en bref

PokerStars NL2, 6-max, **100 BB effectifs**.

| Street | Board | Action Hero | Pot |
|--------|-------|-------------|-----|
| Préflop | — | Open **3 BB** / BTN call | **7.5 BB** |
| Flop | {{< cards "Qc Ad 6h" "sm" >}} | C-bet **2 BB** / call | **11.5 BB** |
| Turn | {{< cards "4c" "sm" >}} | Bet **8.5 BB** / call | **28.5 BB** |
| River | {{< cards "3h" "sm" >}} | Overbet **42.5 BB** / call | — |

{{< tell >}}
**Villain — VPIP 50.7 / PFR 0.0 / 3bet 0.0% — 71 mains**

Il entre dans beaucoup de coups mais ne prend jamais l'initiative. Un joueur qui **paie**. Il call préflop, il call flop, il call turn, et parfois il call river parce que sa main *"a l'air trop belle pour fold"*. Contre ce profil : **value cher, ne pas bluffer**.
{{< /tell >}}

Je suis au CO avec {{< cards "Qs 6s" >}}.

Je raise à **3 BB**. BTN call. Blinds fold. **Pot : 7.5 BB.**

---

## Préflop — mon open Q6s et son flat KK

Commençons par être honnête : Q6s CO n'est pas une main standard d'open.

Dans une stratégie propre, c'est une **adaptation de range exploitante** — les bords d'une range sont flous, et ici le contexte la justifie. Ce n'est pas une main que je veux ouvrir automatiquement contre une table agressive, des blinds compétents ou un bouton capable de 3bet correctement.

Mais ici, le contexte compte.

Derrière moi :

- BTN est **50/0** sur 71 mains
- SB est très récréatif sur petit échantillon
- BB n'a pas l'air de beaucoup 3bet
- La table donne **peu de pression préflop**

Donc l'open devient défendable exploitativement. Pas parce que Q6s serait soudain une main merveilleuse, mais parce que l'environnement permet d'ouvrir un peu plus large, surtout si le plan postflop est clair : ne pas spew quand on rate, value fort quand on touche, punir les profils qui callent trop.

Mais le vrai événement préflop, ce n'est pas mon open.

**C'est son call avec {{< cards "Kc Kh" >}}.**

Avec KK au bouton face à un open CO, vilain a un **3bet automatique** en pratique. La ligne naturelle :

- CO open 3 BB
- BTN **3bet à 9 ou 10 BB**

S'il 3bet et que je fold, il gagne immédiatement :

- **3 BB** d'open + **1.5 BB** de blinds = **4.5 BB nets**

Et surtout, il gagne ce pot **sans rake postflop**, sans variance, sans board As-high, sans décision river absurde.

{{< insight >}}
**Le rake en NL2 : un argument préflop souvent ignoré**

En micro-limites, le rake est proportionnellement élevé sur les pots postflop. Ramasser l'open + les blinds préflop avec KK = **4.5 BB nets, zéro rake**. Jouer un pot de 100+ BB postflop = plusieurs BB de rake ponctionnés. **Gagner le pot préflop avec KK n'est pas un échec** — c'est parfois la meilleure issue.
{{< /insight >}}

Beaucoup de joueurs récréatifs pensent :

> *"J'ai une grosse main, je ne veux pas faire fuir."*

Mais cette phrase contient déjà l'erreur. Le but avec KK n'est pas de garder toute la poubelle adverse dans le coup à n'importe quel prix. **Le but est de faire payer trop cher les mains dominées.**

{{< equity >}}
**KK vs Q6s : ~83% d'équité préflop.**

Cette équité ne vaut quelque chose que si elle est **monétisée**. En flat, vilain me laisse réaliser mon équité pour seulement **3 BB**. C'est précisément ce qu'il ne doit pas faire.
{{< /equity >}}

---

## Le piège mental — "je slowplay pour ne pas faire fold"

Le **slowplay préflop** n'est pas toujours mauvais. Flat AA ou KK peut avoir du sens dans certains contextes :

- Un joueur derrière **squeeze trop**
- L'open raiser **4bet énormément**
- Les blinds sont agressives
- Il y a une dynamique de guerre préflop
- Les stacks profonds créent une situation particulière
- L'adversaire spew massivement postflop dès qu'on sous-représente sa main

Mais ici, rien n'indique ça.

BTN est un profil **50/0**. Il ne construit pas de pièges avancés. Il n'a pas de stratégie de flat polarisé. Il ne protège pas une range de call.

Il fait juste ce que beaucoup de joueurs passifs font : il paie avec une grosse main parce qu'il ne veut pas me faire folder.

Sauf que cette passivité a un **coût**.

Quand il 3bet KK, il m'oblige à prendre une décision inconfortable avec le bas de ma range. {{< cards "Qs 6s" >}} devient une main fragile, chère à continuer, dominée, avec **reverse implied odds**.

Quand il flat, il transforme mon erreur potentielle en opportunité.

> *"Tu peux voir le flop avec tout ton bas de range. Si tu rates, tu abandonneras. Si tu touches fort, je risque de te payer."*

C'est une offre que je n'ai aucune raison de refuser.

---

## Flop — Q♣ A♦ 6♥

{{< board "Flop" "Qc Ad 6h" >}}

J'ai **deux paires** avec {{< cards "Qs 6s" >}}.

**Pot : 7.5 BB. Je mise 2 BB (~1/3 pot). Vilain call.**

Ce flop touche énormément la range de call bouton : Ax, Qx, broadways, pockets qui n'ont pas 3bet, parfois des mains suited faibles, quelques slowplays.

Contre un reg solide, je pourrais choisir un sizing plus cher immédiatement. Mais contre ce profil précis, le **petit c-bet** a une utilité : garder toutes ses mains intermédiaires accrochées.

{{< insight >}}
**C-bet small (1/3 pot) contre un profil large-passif**

Sur un board AQ6, un profil **50/0** arrive au flop avec beaucoup de mains moyennes : tops pairs faibles, paires intermédiaires, quelques tirages. Un small c-bet maintient toutes ces mains dans le pot — y compris ses TP et ses paires inférieures, qui sont toutes **battues**. L'objectif : démarrer une construction street par street, pas induire un fold.
{{< /insight >}}

Je ne cherche pas à le faire fold. Je cherche à lui faire **commencer une erreur**.

Son call flop avec {{< cards "Kc Kh" >}} n'est pas encore catastrophique isolément. Face à un petit sizing, avec KK, il peut encore se dire que je c-bet trop large, que je peux avoir une dame, des pockets, des airs.

Mais sa main est déjà devenue une main de **bluffcatch**.

Préflop, KK était une premium. Sur A-Q-6 après c-bet, KK n'est plus une premium. C'est **une paire sous l'As**, battue par tous mes Ax et par mes deux paires.

Et c'est là que beaucoup de joueurs se perdent : ils ne réévaluent pas la force **relative** de leur main.

Ils continuent à jouer *"KK"* au lieu de jouer *"une paire de Rois sur A-Q-6"*.

Ce n'est pas la même main.

{{< insight >}}
**Réévaluer la force de sa main : situations typiques**

La force d'une main n'est pas absolue — elle est **relative au board et à l'action**.

| Situation | Main départ | Réévaluation |
|-----------|-------------|--------------|
| KK sur A-Q-6 après c-bet | Premium | Bluffcatcher — perd contre tout Ax |
| AA sur K-Q-J bicolore vs check-raise | Premium | Overpair vulnérable — range adverse saturée de deux paires, sets, tirages |
| Top pair kicker moyen face à 3-bet flop | Main forte | Potentiellement dominé — souvent derrière sets et deux paires |
| Flush complété en rivière sur board pairé | Tirage accompli | Main forte… mais full house adverse possible |
| Set sur board rainbow sans tirage | Très forte | Reste forte — pas de dévalorisation |

**La règle** : après chaque carte, après chaque action adverse, reformuler. Non plus *"j'ai KK"*, mais *"j'ai une paire de Rois sur ce board précis, face à cette action précise."* C'est cette reformulation qui sépare les bons joueurs des joueurs qui paient river par fidélité à leur main préflop.
{{< /insight >}}

---

## Turn — 4♣

{{< board "Turn" "4c" >}}

**Pot : 11.5 BB. Je mise 8.5 BB (~3/4 pot). Vilain call.**

Ce sizing change la nature du coup. Flop, il pouvait encore payer petit avec beaucoup de mains. Turn, quand je mise environ **trois quarts pot**, j'annonce que je veux construire un vrai pot.

Ce que je représente principalement :

- **Ax solide** — AQ, A6, AK
- **Sets** — 66, QQ, AA slowplay
- **Draws à trèfle** apparus sur le turn
- Quelques bluffs, mais pas tant que ça

De son point de vue, {{< cards "Kc Kh" >}} devient très inconfortable.

Il ne bat plus mes mains de value naturelles. Il **bloque peu mes bluffs**. Il n'a pas d'amélioration claire river, sauf toucher un Roi.

Mais il call encore.

Et là, on voit bien l'enchaînement causé par son erreur préflop. S'il avait 3bet, il aurait eu l'initiative. Il aurait fait folder une partie de mon bas de range. Il aurait construit le pot quand il **dominait**.

En flat, il a créé un pot où il ne sait plus situer sa main.

{{< key >}}
**Le pire des deux mondes :**

Il ne prend pas la value préflop — et il ne trouve pas le fold postflop.
{{< /key >}}

---

## River — 3♥

{{< board "River" "3h" >}}

Board final : {{< cards "Qc Ad 6h 4c 3h" >}}

**Pot : 28.5 BB. Je mise 42.5 BB. Overbet 1.5× pot.**

Vilain call.

Je montre {{< cards "Qs 6s" >}}. Vilain muck {{< cards "Kc Kh" >}}.

Je remporte un pot de **106.5 BB** — gain net : **+57 BB**. Rake payé : **7 BB**.

---

## L'overbet river — value ou excès ?

C'est la décision intéressante de mon côté.

Avec Q6, je n'ai pas les **nuts**. Je suis battu par une partie de sa range : AA, QQ, 66, AQ, A6, A4, A3, 44, 33, parfois 52s.

Donc contre un joueur solide, mon overbet serait beaucoup plus discutable. Un bon reg ne va pas payer **1.5× pot** river avec KK ici. Il va aussi folder beaucoup d'Ax moyens.

Mais ici, la question n'est pas *"Est-ce que mon sizing est équilibré ?"*

La vraie question est :

> *"Contre ce joueur précis, combien de mains moins bonnes vont payer ?"*

Et la réponse est : **probablement beaucoup trop**.

Ce profil peut payer avec AK, AJ, AT, A9, Ax quelconque, KK, parfois Qx, parfois une main complètement irrationnelle.

{{< equity >}}
**Overbet de value contre un profil sticky : la logique exploitante**

Contre un joueur sans fold equity (**50/0**, aucun historique de fold postflop), l'overbet river n'est pas un sizing *équilibré* — c'est un sizing **exploitant**. Il paie trop souvent avec des mains battues. Plus on mise gros, plus l'EV augmente contre ce profil.

L'équilibre GTO ne s'applique pas ici. On maximise face à quelqu'un qui **ne fold pas**.
{{< /equity >}}

Le call avec {{< cards "Kc Kh" >}} révèle une information énorme : vilain n'arrive pas à folder une grosse main préflop, même quand le board et l'action lui **hurlent** qu'elle a perdu sa valeur.

Donc l'overbet river n'est pas un bouton de panique. C'est une **exploitation directe** d'un profil sticky.

---

## Ce que ma ligne raconte

J'open CO, je c-bet flop, je mise gros turn, puis j'overbet river. Même si vilain ne raisonne pas comme un reg, il perçoit forcément quelque chose : **je montre de la force sur trois streets**.

Ma ligne représente surtout :

- **Value forte** : AQ, A6, 66, AA, QQ, parfois A4/A3
- **Value thin** : AK, AJ selon profil
- **Bluffs possibles** : missed clubs, quelques mains transformées en bluff

Mais en NL2, contre un joueur passif, cette lecture n'est souvent pas faite en combos. Il ne se demande pas combien de bluffs naturels j'ai, quels bloqueurs il possède, quelle fréquence minimale de défense il doit atteindre.

Il fait quelque chose de beaucoup plus simple :

> *"J'ai KK. Il peut bluffer. Je call."*

C'est brutal, mais c'est souvent comme ça que l'argent circule en micro-limites. Contre un joueur qui ne fold pas KK ici, **la meilleure adaptation n'est pas de construire une range équilibrée de bluff river. C'est de value plus cher.**

---

## Le vrai coût du slowplay

Beaucoup de joueurs sous-estiment le coût du slowplay parce qu'ils regardent seulement le résultat immédiat. Ils pensent :

> *"Si je 3bet, il fold, je gagne seulement 4.5 BB. Si je call, je peux gagner plus."*

Cette phrase semble logique, mais elle est **incomplète**. Il faut ajouter :

- Si je call, je laisse toutes ses mains **réaliser leur équité**
- Si un As tombe, KK devient difficile
- Si le board connecte avec son bas de range, je peux **perdre un gros pot**
- Si je suis incapable de fold postflop, je transforme mon slowplay en **piège contre moi-même**

Le problème n'est pas que vilain ait perdu contre Q6s. Ça arrivera parfois même en jouant bien.

Le problème, c'est qu'il a choisi une ligne qui maximise mes chances de réaliser mon équité tout en conservant chez lui une tendance à **payer trop cher après coup**. C'est exactement la combinaison perdante.

{{< insight >}}
**Slowplay réussi = deux compétences combinées**

1. Savoir *pourquoi* on sous-représente sa main (squeeze derrière, adversaire 4bet souvent, stacks profonds…)
2. Savoir **réévaluer sa main** quand le board change — KK n'est plus KK sur A-Q-6

Sans les deux, le slowplay ne piège pas l'adversaire. Il piège celui qui le joue.
{{< /insight >}}

Vilain a caché KK préflop, puis il l'a joué comme si tout le monde devait encore **respecter KK river**.

---

## L'impact du rake

En NL2, le rake rend cette main encore plus parlante.

Quand il 3bet et que je fold préflop, il gagne **4.5 BB sans rake postflop**.

Quand il flat et joue un gros pot postflop, le rake entre dans l'équation. Ici, le pot final subit **7 BB de rake**. C'est énorme.

Le rake punit les pots postflop marginaux et les lignes passives qui ne prennent pas l'EV disponible préflop. La mentalité *"je veux absolument rentabiliser ma premium"* pousse beaucoup de joueurs à faire exactement l'inverse de ce qui **imprime de l'argent**.

Ils refusent un gain propre préflop, puis se retrouvent dans un pot raked, avec une main dégradée, face à des décisions qu'ils ne savent pas prendre.

---

## Ma note sur vilain

Cette main produit une note extrêmement rentable :

{{< tell >}}
Flat {{< cards "Kc Kh" >}} BTN vs open CO. Call flop A-high, call gros barrel turn, call overbet **1.5× pot** river sur A♦Q♣6♥4♣3♥. Très **sticky** avec overpair / grosse main préflop. **Value très cher. Éviter les bluffs.**
{{< /tell >}}

Contre lui, à l'avenir :

- J'open/iso **plus cher** en value
- Je bluff **beaucoup moins**
- Je c-bet mes bonnes mains **plus cher**
- Je **value thin** river
- Je respecte fortement ses raises soudains — un passif qui se réveille a souvent très lourd
- Je ne cherche pas à le faire folder une main qu'il aime

S'il peut payer {{< cards "Kc Kh" >}} ici, il peut payer beaucoup trop large ailleurs.

---

## Ce que je retiens pour mon propre jeu

Cette main confirme aussi un principe important pour ma propre stratégie. Je ne dois pas tomber dans le piège inverse : croire que, parce que j'ai gagné avec Q6s, l'open devient automatiquement excellent.

L'open **{{< cards "Qs 6s" >}} CO** dépend de la table. Il est acceptable ici parce que les profils derrière rendaient le spot exploitable. Sur une table plus agressive, contre un bouton qui 3bet correctement, c'est un fold très simple.

La bonne conclusion n'est donc pas :

> *"Q6s CO, ça imprime."*

La bonne conclusion est :

> *"Contre des profils passifs qui ne punissent pas préflop et paient trop postflop, on peut élargir intelligemment — mais il faut garder une discipline stricte quand on rate."*

**L'argent vient de l'adaptation, pas de la fantaisie.**

---

## Conclusion

Vilain avait {{< cards "Kc Kh" >}} au bouton face à un open CO. Il pouvait 3bet, prendre **4.5 BB** immédiatement sans rake, ou jouer un pot plus gros en position avec une main qui domine ma range.

Il a choisi de flat.

Ce choix m'a permis de voir un flop bon marché avec {{< cards "Qs 6s" >}}. J'ai touché deux paires. Il n'a jamais réussi à abandonner sa main.

Ce n'est pas le bad beat d'un joueur malchanceux. C'est la **conséquence logique** d'une mauvaise construction stratégique.

KK est une premium préflop. Mais sur **A-Q-6-4-3**, après bet flop, gros bet turn et overbet river, KK n'est plus qu'un **bluffcatcher cher**.

Et en NL2, payer très cher avec un bluffcatcher mal choisi, c'est exactement le genre d'erreur qui **finance les winrates adverses**.

{{< key >}}
Une premium slowplayée sans plan ne piège pas l'adversaire. Elle piège souvent celui qui la détient.

En micro-limites, surtout contre des joueurs qui paient trop : **value. Fort. Simplement. Sans romantisme.**
{{< /key >}}

---

{{< glossary >}}
Slowplay :: Jouer une main forte passivement (check/call) pour dissimuler sa valeur. Objectif : induire des mises adverses. Requiert de savoir *pourquoi* on sous-représente sa main **et** de savoir réévaluer quand le board change.
Bluffcatcher :: Main capable de battre les bluffs adverses, mais pas ses mains de valeur. KK sur A-Q-6 : bat les bluffs, perd contre tout Ax et les deux paires.
C-bet :: *Continuation bet.* Mise de l'agresseur préflop au flop, dans la continuité de son initiative. Peut être faite en value ou en bluff.
Overbet :: Mise supérieure au pot en cours (généralement > 1× pot). En value contre un profil sticky, maximise l'extraction sur les mains battues qui payent trop.
Equity :: Part du pot revenant statistiquement à une main, exprimée en %. KK a ~83% d'équité préflop contre Q6s — mais cette équité ne vaut que si elle est monétisée.
Sticky :: Joueur qui a du mal à se défausser d'une main forte, même face à une représentation adverse très puissante. Exploiter : value bet maximal, éviter les bluffs.
Rake :: Commission prélevée par la salle sur chaque pot joué postflop. En NL2, punit sévèrement les lignes passives et les pots marginaux. Un gain préflop sans rake est souvent supérieur à un gros pot postflop raked.
Reverse implied odds :: Risque de payer cher quand on est dominé. Q6s face à un éventuel 3bet KK : si le flop tombe KK4, les implied odds négatifs s'exercent pleinement.
{{< /glossary >}}
