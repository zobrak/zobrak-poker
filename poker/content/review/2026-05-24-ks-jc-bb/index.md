---
title: "Gagner un pot qu'on ne peut pas gagner à l'abattage"
date: 2026-05-24
draft: false
description: "222TT au tableau : tout le monde a la même main. Hero, qui ne peut au mieux que partager le pot, transforme un min-donk turn et un check-raise river en bluff pur sur une table de regs de nuit. Anatomie d'un move qui n'a de sens que par le profil adverse — probe d'information, image fishy, story crédible et seuil de fold equity."
hero: "Hero"

tags:
  - holdem
  - no-limit
  - cash-game
  - 6-max
  - NL2
  - PokerStars
  - multiway
  - limped-pot
  - bluff
  - check-raise
  - blocker
  - exploit

limits:
  - NL2

rooms:
  - PokerStars

positions:
  - BB

actions:
  - donk-bet
  - check-raise
  - bluff-shove

streets:
  - preflop
  - flop
  - turn
  - river

formats:
  - 6-max

params:
  hero_position: "BB"
  pot_type: "limped + iso"
  result_bb: +76
  hand_id: "260908927812"
  video_url: "videos/review/20260524-01.webm"
  players:
    - label: "Hero"
      uuid: "4cd25db6"
      position: "BB"
      stack_bb: 104
      is_hero: true
      avatar: "/avatars/4cd25db6.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
    - label: "9bc62b9a"
      uuid: "9bc62b9a"
      position: "BTN"
      stack_bb: 98
      is_hero: false
      avatar: "/avatars/9bc62b9a.svg"
      vpip: 27
      pfr: 18
      three_bet: 5.1
      hands: 124
    - label: "0a3bd273"
      uuid: "0a3bd273"
      position: "HJ"
      stack_bb: 112
      is_hero: false
      avatar: "/avatars/0a3bd273.svg"
      vpip: 38
      pfr: 25
      three_bet: 0.0
      hands: 8
    - label: "a9387b6b"
      uuid: "a9387b6b"
      position: "CO"
      stack_bb: 125
      is_hero: false
      avatar: "/avatars/a9387b6b.svg"
      vpip: 20
      pfr: 12
      three_bet: 4.9
      hands: 240
    - label: "117727ea"
      uuid: "117727ea"
      position: "UTG"
      stack_bb: 37
      is_hero: false
      avatar: "/avatars/117727ea.svg"
      vpip: 40
      pfr: 0
      three_bet: 0.0
      hands: 5
    - label: "78965d02"
      uuid: "78965d02"
      position: "SB"
      stack_bb: 68
      is_hero: false
      avatar: "/avatars/78965d02.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
---

```hh
PokerStars Hand #260908927812:  Hold'em No Limit (€0.01/€0.02 EUR) - 2026/05/24 2:49:29 CET
Table 'Anonyme' 6-max Seat #6 is the button
Seat 1: 78965d02 (€1.37 in chips)
Seat 2: Hero (€2.09 in chips)
Seat 3: 117727ea (€0.75 in chips)
Seat 4: 0a3bd273 (€2.25 in chips)
Seat 5: a9387b6b (€2.51 in chips)
Seat 6: 9bc62b9a (€1.97 in chips)
78965d02: posts small blind €0.01
Hero: posts big blind €0.02
*** HOLE CARDS ***
Dealt to Hero [Ks Jc]
117727ea: calls €0.02
0a3bd273: calls €0.02
a9387b6b: calls €0.02
9bc62b9a: raises €0.11 to €0.13
78965d02: folds
Hero: calls €0.11
117727ea: calls €0.11
0a3bd273: calls €0.11
a9387b6b: calls €0.11
*** FLOP *** [2d Th Tc]
Hero: checks
117727ea: checks
0a3bd273: checks
a9387b6b: checks
9bc62b9a: checks
*** TURN *** [2d Th Tc] [2h]
Hero: bets €0.02
117727ea: calls €0.02
0a3bd273: calls €0.02
a9387b6b: calls €0.02
9bc62b9a: calls €0.02
*** RIVER *** [2d Th Tc 2h] [2c]
Hero: checks
117727ea: checks
0a3bd273: bets €0.53
a9387b6b: folds
9bc62b9a: calls €0.53
Hero: raises €1.41 to €1.94 and is all-in
117727ea: folds
0a3bd273: folds
9bc62b9a: folds
Uncalled bet (€1.41) returned to Hero
Hero collected €2.21 from pot
Hero: doesn't show hand
*** SUMMARY ***
Total pot €2.35 | Rake €0.14
Board [2d Th Tc 2h 2c]
```

> *NL2 PokerStars, 6-max. 2h49 du matin. Cinq joueurs voient le flop dans un pot limpé puis isolé.*
> *Hero regarde K♠J♣ depuis la grosse blinde. Rien de spécial.*
> *Le tableau va se transformer en 2-2-2-T-T. Tout le monde aura exactement la même main. Et pourtant un seul joueur va rafler le pot — sans jamais montrer ses cartes.*

---

## Cinq joueurs, des ranges qui se cappent toutes seules

Trois limpeurs, une iso à 6,5 BB depuis le bouton, Hero qui complète en BB, et tout le monde suit. **Pot à cinq, ~33 BB préflop.**

K♠J♣ en BB face à une iso bouton multiway : on ferme presque l'action, on a le prix, la main a de la jouabilité. **Call standard.** Pas de 3bet OOP dans un champ aussi large — ce serait isoler personne et gonfler un pot hors de position.

Le point structurant est ailleurs : **une ligne limp-limp-limp / iso / call général produit des ranges plafonnées.** Personne dans ce coup ne représente crédiblement les sur-paires premium qui auraient 3bet préflop. C'est une donnée à garder en mémoire — elle servira trois rues plus tard.

{{< tell >}}
**Le bouton (9bc62b9a) — 124 mains.** VPIP 27 / PFR 18, 3bet 5,1% (39 opp, indicatif sous le seuil), WTSD 21%.

Reg TAG sans excès. L'iso multiway est dans son registre. Surtout : **WTSD 21% = il lâche facilement la river.** Information utile pour plus tard.

**Le mineur (0a3bd273) — 8 mains.** Aucun sample exploitable. Tout read le concernant sera live, pas statistique.
{{< /tell >}}

---

## 2♦T♥T♣ — Le flop qui n'appartient à personne

Hero check, et le flop passe **check à cinq**.

Logique : K-high sur board pairé multiway, hors de position, rien à faire. Et le silence général confirme la lecture du préflop — personne n'a de Ten ni d'overpair qui veut construire le pot. **Tout le monde a peur de tout le monde.**

---

## Le min-donk à 1 BB — non, ce n'est pas du spew

Turn 2♥. Board **2♦T♥T♣2♥** : deux paires au tableau. Hero mise **1 BB** dans un pot de ~33 BB. Trois pour cent.

À première vue, absurde : Hero joue le tableau, n'a pas de value, et 1 BB ne fold personne. Les cinq suivent.

**Mais ce bet n'est pas isolé — c'est la première rue d'un plan.**

{{< insight >}}
**À quoi sert un min-donk dans un pot multiway capé ?**

→ **Probe d'information.** Une mini-mise invite le monstre — un Ten qui a floppé tens full, un éventuel brelan — à se réveiller et à raise « à hauteur de ce qu'il veut gagner ». Personne ne raise ? **La range adverse est confirmée plafonnée.** C'est exactement le feu vert dont on a besoin pour bluffer la river.

→ **Image fishy.** Sur une table de regs de nuit, miser 1 BB sans rien construit une image faible, exploitable, qui pousse les bons joueurs à commettre des erreurs plus tard.

→ **Anti-check.** Face aux profils aggro qui ne supportent pas qu'on leur donne la main, le 1 BB « brûle les doigts » et provoque le raise — sur lequel on peut sur-relancer.

Ce que le min-donk **n'est pas** : du pot control. Une mini-mise hors de position *invite* le raise au lieu de contrôler le pot. Le check contrôle mieux. Appeler ça « pot control » mène à l'appliquer dans les mauvais spots.
{{< /insight >}}

{{< key >}}
**Le min-donk est profil-dépendant.**

+EV contre des regs foldeurs (ils lâchent la river) ou des aggro (ils raisent, on shove dessus). **-EV contre des calling-stations** : elles suivent le 1 BB *et* ne foldent jamais la river — on bloate alors un pot qu'on ne peut pas gagner à l'abattage. Le move n'a de valeur que parce qu'on lit le pool : table de nuit, regs, champ foldeur.
{{< /key >}}

Personne ne relance. **Range confirmée capée.** On peut passer à la suite.

---

## 2♣ — Le moment où plus personne ne peut gagner

River 2♣. Board final : **2♦ T♥ T♣ 2♥ 2♣ — soit 2-2-2-T-T.**

Le tableau *est* une main complète : brelan de 2 + paire de T, full deuces par les tens. Conséquence brutale :

| Main du villain | Ce qu'il a vraiment |
|-----------------|---------------------|
| Rien (broadway, A-high) | Le tableau — **chop** |
| Une paire ≤ 99 | Le tableau — **chop** |
| Un Ten | Tens full — **bat Hero** |
| Un 2 | Carré — **bat Hero** |
| JJ / QQ / KK / AA | Full supérieur — **bat Hero** |

{{< key >}}
**Hero ne peut PAS gagner à l'abattage.** Au mieux il partage (tout le monde joue le tableau), au pire il perd (un Ten, un 2, une grosse paire). Son K♠J♣ ne sert à rien comme main.

Check/call ou check/fold rapportent donc **zéro, ou négatif.** La seule façon de gagner le pot est de **le voler.** Transformer la main en bluff n'est pas une fantaisie — c'est la seule ligne à EV positive disponible.
{{< /key >}}

C'est ici que le min-donk turn prend tout son sens : il a vérifié que personne n'avait de monstre, et il a posé les premières briques d'une histoire.

---

## Le check-raise shove — déconstruction

Hero check. **0a3bd273 mise 0,53 € (~3/4 pot). a9387b6b fold. 9bc62b9a (le reg) suit.** Hero check-raise tout-in : +70 BB par-dessus.

### La dynamique du split — la faille exacte

Sur 2-2-2-T-T, la mise de 0a3bd273 raconte peu : avec 8 mains de sample, c'est un read live. Le plus probable ? **Il mise pour s'adjuger un pot que tout le monde devrait partager — souvent un bluff pur, ou une tentative de value avec un Ten au mieux.** Le reg qui suit « conscient du partage » veut sa part du gâteau.

**Les deux jouent pour le chop avec, au mieux, le tableau.** Si Hero call, tout le monde s'abat et on partage à trois. Le check-raise, lui, fait exploser deux ranges qui n'ont presque jamais de quoi suivre.

### La carte autorise le bluff

{{< insight >}}
**Pourquoi shove ici et pas give-up ?**

Parce que c'est le **2♣ qui crédibilise l'histoire.** La troisième deuce met le carré dans le tableau : « j'ai un 2 » devient une rep réelle et terrifiante. Sur une river qui n'aurait pas renforcé la narration, Hero n'a plus rien à raconter → check et abandon.

**La carte décide du shove, pas l'inverse.** Un bluff n'existe que s'il y a une main crédible à représenter.
{{< /insight >}}

### Le blocker affine la décision

Ce qui bat Hero river : un Ten, un 2, ou JJ+. Or **Hero tient K♠J♣** :

- Le **J♣ retire des combos de JJ**, le **K♠ retire des combos de KK** — deux des fulls supérieurs qui pourraient call sont moitié moins probables.
- QQ/AA sont de toute façon rares ici : ils 3bettent préflop.
- **Le vrai caller restant serait un Ten** (tens full) — que Hero ne bloque pas. Le bluff tient parce que les Ten sont peu fréquents, qu'un Ten peut lui-même se coucher par peur du carré, et que tout le reste est le tableau nu, forcé au fold.

Le blocker ne porte pas le move à lui seul — il l'affine.

### Le seuil de fold equity

{{< insight >}}
**Risque / récompense du shove.**

Hero met ~70 BB de plus pour rafler un pot d'environ 90 BB. Seuil de rentabilité : il faut que les villains se couchent **plus de ~44% du temps.**

Face à deux ranges composées en très grande majorité du tableau nu — incapables de suivre un raise qui représente carré ou tens full — la fold equity dépasse largement ce seuil. Les deux folds le confirment.
{{< /insight >}}

---

## Exploit, ou spew ? Le contexte tranche

{{< key >}}
**Cette main est une déviation exploitative — pas du spew.**

Elle l'est parce que **tout converge** : pool de regs de nuit foldeurs, ranges plafonnées par la ligne préflop, carte river qui crédibilise la rep, blockers JJ/KK, et un adversaire (9bc62b9a, WTSD 21%) qui lâche facilement.

Le **même geste serait du spew** contre des calling-stations (elles suivent le min-donk et ne foldent pas la river), ou joué en autopilote sans plan river. Geste identique, classe opposée — c'est le profil adverse qui décide.

Et surtout : **le résultat ne valide pas la décision.** Hero gagne +76 BB, mais l'analyse serait mot pour mot la même s'il s'était fait payer par un Ten. Ce qui valide le move, c'est la structure : pas de ligne gagnante à l'abattage, fold equity suffisante, histoire crédible.
{{< /key >}}

---

## Ce qu'il faut retenir

{{< key >}}
**1. Quand on ne peut pas gagner à l'abattage, la seule EV positive est de voler.**
Sur un tableau qui donne la même main à tout le monde (2-2-2-T-T), check/call rapporte zéro. Le bluff n'est pas un luxe — c'est la seule option rentable.

**2. Le min-donk à 1 BB est un outil, pas un réflexe.**
Probe d'information + image + setup de story. Profil-dépendant : +EV vs regs foldeurs et aggro, -EV vs stations. Et ce n'est jamais du « pot control ».

**3. La carte autorise le bluff.**
Le shove river ne se justifie que parce que le 2♣ rend crédible la rep d'un carré. Sans cette carte, on abandonne. On ne bluffe pas dans le vide — on bluffe une histoire que le board raconte avec nous.

**4. Les blockers affinent, le pool décide.**
Le J♣ et le K♠ retirent des combos de JJ/KK. Mais ce qui porte le move, c'est la lecture d'un champ foldeur — pas la combinatoire seule.
{{< /key >}}
