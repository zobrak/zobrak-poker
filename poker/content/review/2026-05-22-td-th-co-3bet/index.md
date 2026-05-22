---
title: "TT vs AA en pot 3bet : Goliath joue petits bras... et perd !"
date: 2026-05-22
draft: false
description: "Overpair OOP versus range de défense 3bet du CO sur board drawy. SB ne  cbet pas assez fort puis micro-bet et se fait raise shove sur la turn avec un board Q-J-4-9. Hero a une range qui domine la texture. Analyse complète du shove : equity, range advantage, cohérence narrative et seuil de fold equity."
hero: "Hero"

tags:
  - holdem
  - no-limit
  - cash-game
  - 6-max
  - NL2
  - PokerStars
  - 3bet-pot
  - semi-bluff
  - shove
  - range-advantage
  - sizing-tell

limits:
  - NL2

rooms:
  - PokerStars

positions:
  - CO

actions:
  - call-3bet
  - shove

streets:
  - preflop
  - flop
  - turn

formats:
  - 6-max

params:
  hero_position: "CO"
  pot_type: "3bet pot"
  result_bb: +207
  hand_id: "260894604621"
  video_url: "videos/review/260894604621-1.webm"
  players:
    - label: "Hero"
      uuid: "4cd25db6"
      position: "CO"
      stack_bb: 155
      is_hero: true
      avatar: "/avatars/4cd25db6.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
    - label: "cc3ff955"
      uuid: "cc3ff955"
      position: "SB"
      stack_bb: 107
      is_hero: false
      avatar: "/avatars/cc3ff955.svg"
      vpip: 27
      pfr: 16
      three_bet: 5.2
      hands: 246
    - label: "a9db63eb"
      uuid: "a9db63eb"
      position: "BTN"
      stack_bb: 55
      is_hero: false
      avatar: "/avatars/a9db63eb.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
    - label: "2c581c96"
      uuid: "2c581c96"
      position: "BB"
      stack_bb: 105
      is_hero: false
      avatar: "/avatars/2c581c96.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
    - label: "a69904cf"
      uuid: "a69904cf"
      position: "HJ"
      stack_bb: 99
      is_hero: false
      avatar: "/avatars/a69904cf.svg"
      vpip: 0
      pfr: 0
      three_bet: 0.0
      hands: 0
---

```hh
PokerStars Hand #260894604621:  Hold'em No Limit (€0.01/€0.02 EUR) - 2026/05/22 21:23:54 CET
Table 'Anonyme' 6-max Seat #1 is the button
Seat 1: a9db63eb (€1.11 in chips)
Seat 2: cc3ff955 (€2.14 in chips)
Seat 3: 2c581c96 (€2.10 in chips)
Seat 5: a69904cf (€1.99 in chips)
Seat 6: Hero (€3.11 in chips)
cc3ff955: posts small blind €0.01
2c581c96: posts big blind €0.02
*** HOLE CARDS ***
Dealt to Hero [Td Th]
a69904cf: folds
Hero: raises €0.06 to €0.08
a9db63eb: folds
cc3ff955: raises €0.18 to €0.26
2c581c96: folds
Hero: calls €0.18
*** FLOP *** [Jd 4c Qh]
cc3ff955: bets €0.26
Hero: calls €0.26
*** TURN *** [Jd 4c Qh] [9s]
cc3ff955: bets €0.14
Hero: raises €2.45 to €2.59 and is all-in
cc3ff955: calls €1.48 and is all-in
Uncalled bet (€0.97) returned to Hero
*** RIVER *** [Jd 4c Qh 9s] [Kh]
*** SHOW DOWN ***
cc3ff955: shows [Ac Ah] (a pair of Aces)
Hero: shows [Td Th] (a straight, Nine to King)
Hero collected €4.15 from pot
*** SUMMARY ***
Total pot €4.30 | Rake €0.15
Board [Jd 4c Qh 9s Kh]
Seat 1: a9db63eb (button) folded before Flop
Seat 2: cc3ff955 (small blind) showed [Ac Ah] and lost with a pair of Aces
Seat 3: 2c581c96 (big blind) folded before Flop
Seat 5: a69904cf folded before Flop
Seat 6: Hero showed [Td Th] and won (€4.15) with a straight, Nine to King
```

> *NL2 PokerStars, 6-max. 21h23. Un reg surgit de la SB avec un 3bet senti.*
> *Hero regarde T♦T♥. 107 BB effectifs.*
> *Ce qui suit n'est pas un bad beat. C'est une leçon sur les sizing tells, le nut advantage, et l'art d'attaquer au bon moment.*

---

## Portrait de l'adversaire

Avec seulement **246 mains.** **VPIP 27 / PFR 16 / 3bet 5,2%.** on a un début de tendance, une intuition.

Je l'ai pastillé en jaune : REG, joueur sérieux.

Profil tight-agressif. Range de 3bet depuis la SB très étroite 7% pensez AA-JJ, AKs, AKo, AQs, avec tout de même quelques mains qu'il est capable de folder (quelques AQs, KQs, JJ+) Peu de semi-bluffs. Un joueur qui a les meilleures mains... et qui parfois ne sait pas quoi en faire.

{{< tell >}}
**Pattern noté en session :** cc3ff955 3bet pt OOP FCbet 1/2 w/ overpair / board connecté, 13%pt turn (??) qui connecte + call raise shove 100bb. Pas de FE sur premiums.

{{< /tell >}}

---

## Ne tombez pas amoureux de TT !

TT contre une range à 7% de 3bet, c'est **49% d'equity préflop**. À parité — pas devant, pas derrière. La position IP rend l'appel confortable.

SPR post-call : **3,5** (94 BB derrière, pot 27 BB).

{{< insight >}}
**SPR: le ratio qui dicte votre engagement.**

Stack-to-Pot Ratio = stack derrière ÷ pot actuel. À **3,5**, une main peut jouer plusieurs rues si elle s'améliore — mais les mains moyennes deviennent vite committées. En dessous de **1**, on est engagés sans porte de sortie. Au-dessus de **10**, on vise les nuts ou on se couche.

À ce SPR, aller au showdown nécessite au minimum two pair ou un draw fort.
{{< /insight >}}

Hero call, rien de plus logique, pas de 4bet bluff avec un paire moyenne comme les dix.

{{< tell >}}

**La range de Hero :** 

Au CO Hero a une range d'open de 23%, il call 3bet a environ 13 %, reste ses 4bets et 4bet bluff.

Face à un REG sérieux, mais pas NIT, en étant IP, l'adaptation est d'élargir avec une range mergée en y intégrant des connecteurs suités. Et avouons-le ça fait toujours plaisir de faire chuter une paire d'as avec 78s. Attention sur des boards connectés avec des cartes fortes, contre ce type d'adversaire et sa range il peut parfois avoir la meilleur flush tout de même, avec ses AK, ses KQ.

{{< /tell >}}

---

## J♦4♣Q♥ — Le flop de la patience

Flop rainbow qui ne fait pas peur aux premiums KK, AA, plait beaucoup a QQ, écarte les flush draw mais qui flirt quand même dangereusement avec la range de défense de Hero : ses T9, ses KT, ses JJ, il parfois des 89, parfois des AKo, plus rarement des AT. On positionne villain sur une range qui domine mais connecte moins. 

**La lecture correcte dit : attendez.**

**40% d'equity** pour TT contre la range adverse sur ce flop. Ce n'est pas une main écrasée — c'est une main qui attend une carte précise. Et cette carte, le 9, était dans l'arbre décisionnel *avant* d'agir au flop.

cc3ff955 cbet **13 BB** (48% du pot). Standard en pot 3bet.

{{< key >}}
**Ce call est un investissement — pas un float.**

13 BB pour maintenir la main vivante jusqu'au turn. Si le 9 tombe et que villain montre de la faiblesse, le pot est à prendre. Si le board briquete, on plie sans état d'âme.

La différence entre un call de plan et un float : l'arbre décisionnel est défini *avant* de mettre les jetons.
{{< /key >}}

---

## 9♠ — La carte qui retourne la table

**Board : Q♥J♦4♣9♠.** Pot : 53 BB. Stack : 81 BB. SPR : **1,5.**

Ce 9 est la meilleure carte possible pour la range IP de Hero.

| Main dans la range CO | Ce que le 9 apporte |
|-----------------------|---------------------|
| KT, T8s | Quinte (9-T-J-Q-K ou 7-8-9-T-J) |
| 99 | Brelan du 9 |
| QJ, JTs | Two pair |
| **TT** | **Open-ender — 10 outs : 4K + 4×8 + 2×T** |

L'equity globale de Hero reste à **42%** — la range adverse garde l'avantage brut. Mais le **nut advantage bascule**.

> Les quintes et two pairs sont surreprésentées dans la range IP. AA ne s'améliore pas. KK non plus. Pour cc3ff955, le 9 est une carte neutre. Pour Hero, c'est une explosion de range.

TT spécifiquement ? **22% d'equity contre AA** pour la river. Pas énorme. Mais l'equity n'est pas le seul levier.

---

## 7 BB dans un pot de 53 BB — Sérieusement ?

cc3ff955 mise **7 BB** dans un pot de 53 BB.
Treize pour cent du pot.
Après avoir cbet à 48% au flop.
Avec une overpair. Sur J-Q-4-9 ultra-connecté.

{{< tell >}}
**Les deux seules lignes logiques avec AA ici :**

→ **Gros barrel (~70%, ~37 BB)** — impose le prix aux draws, protège l'overpair, extrait de tout ce qui continue.

→ **Check-call** — renonce à l'initiative, contrôle le pot, observe la réaction IP.

Un bet à **13%** n'accomplit ni l'un ni l'autre. Il offre des cotes idéales aux draws (10% d'equity suffisent pour caller rentablement). Il ne protège rien. Et il envoie le signal : *"j'ai quelque chose, mais je ne la défends pas."*

**Tell confirmé.** Pattern en session : bet petit avec overpair sur board connecté quand la fold equity semble nulle.
{{< /tell >}}

---

## Le Shove — Déconstruction

Pot après le bet : **60 BB.** Hero pousse tout-in pour **130 BB.**

### L'histoire tient la route

Call 3bet IP → call cbet J♦4♣Q♥ → raise jam sur le 9♠.

Hero représente de manière crédible **99, KT, T8s, QJ, JTs** — toutes des mains réelles dans la range CO en pot 3bet. cc3ff955 ne peut pas démonter le récit. Il ne sait pas si Hero a TT ou KT.

### Le calcul du seuil de fold equity

{{< insight >}}
**Semi-bluff rentable = fold equity + equity directe.**

Avec 22% d'equity de TT contre AA, le shove est profitable si villain se couche environ **48% du temps**. C'est le seuil minimal à valider.

La range de cc3ff955 contient KK, AK et AQ — des mains avec de bonnes raisons de plier :

- **KK** sur Q-J-9 connecté, Hero représente plusieurs quintes → fold ~60%
- **AK** sans paire → fold très probable (~65%)
- **AQ** top pair fragilisée → fold possible (~50%)

**Seuil de 48% atteint.** Le shove est marginalement à légèrement **+EV** contre la range globale.
{{< /insight >}}

Contre AA spécifiquement ? On perd. Mais **Hero ne joue pas contre AA — il joue contre une range.** C'est cette range qui valide la décision.

---

## Non, pas un bad beat !

cc3ff955 retourne A♣A♥.

K♥ au river. Quinte pour Hero. **+207 BB.**

**Attention.** Le résultat ne valide pas la décision. Si le K♥ n'était pas tombé, la main aurait été perdue — et cette review serait identique, mot pour mot.

> Appeler ça un bad beat serait faire trop d'honneur à cc3ff955. Il a joué ses As trop petits, signalé sa faiblesse, et été exploité. **La conséquence était prévisible.**

---

## Ce qu'il fallait faire avec AA

La faute n'est pas au flop — la cbet à 48% est standard en pot 3bet.

**La faute est au turn.** Deux lignes correctes existaient :

**Gros barrel ~70%** (~37 BB dans 53 BB) : Hero doit payer ~40 BB pour la river — non rentable pour TT. cc3ff955 reprend l'initiative, protège, extrait de tout ce qui continue.

**Check-call** : voit la river sans pressure, contrôle le pot, appelle une mise raisonnable.

En choisissant 7 BB, cc3ff955 a obtenu le pire des deux mondes : investissement sans protection, cotes idéales pour les draws, signal d'alerte pour Hero.

---

## Ce qu'il faut retenir

{{< key >}}
**1. Les turns connectants sont des cartes d'attaque.**
Quand le turn améliore les connecteurs et suited hands IP, le nut advantage bascule — même si l'equity brute reste inférieure. C'est le moment de presser.

**2. Le sizing adverse déclenche le shove — pas la force de la main.**
Sans le micro-bet à 7 BB, ce shove n'est pas justifiable. L'exploitation d'un tell sizing est une source d'EV aussi réelle que l'equity directe.

**3. Tous les semi-bluffs ne se valent pas.**
TT avec 10 outs et une range crédible — c'est un semi-bluff à **double source de profit** : fold equity immédiate + amélioration possible. C'est cette combinaison qui distingue un raise rentable d'un spew.
{{< /key >}}
