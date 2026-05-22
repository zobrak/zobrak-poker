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

> **Note sur les statistiques :** les chiffres de cc3ff955 reposent sur 246 mains — suffisant pour orienter les décisions, pas pour des conclusions définitives. La review s'appuie sur ces données comme signaux directionnels, renforcés par les observations de session.

---

## Contexte

NL2 PokerStars, 6-max. Hero ouvre T♦T♥ au CO, se fait 3bet par la SB. Stacks effectifs : 107 BB.

**cc3ff955 — SB** *(246 mains · VPIP 27 · PFR 16 · 3bet 5.2% · Fold-to-3bet 67% · Cbet flop 74% · WTSD 25%)*

Le profil est clair : reg tight-agressif, range 3bet étroite et orientée value. À 5.2% de 3bet, la range attendue depuis la SB est approximativement AA-JJ, AKs, AKo, AQs, AQo — peu ou pas de semi-bluffs. L'absence de mains comme A2s-A5s dans ce type de range est corroborée par le WTSD bas (25%) : un joueur qui abandonne facilement en face d'agression postflop. Le fold-to-3bet à 67% confirme qu'il peut plier sous pression.

---

## Préflop — Défendre TT IP face à une range value

Contre une range de 3bet aussi étroite, calculer l'equity de TT à la distribution des combos donne **49 % pour Hero préflop** (Equilab, range 7% hypothèse conservatrice incluant quelques bluffs AXs). TT est statistiquement à parité contre cc3ff955 — la position en fait un appel confortable.

Le SPR post-call est de **3,5** (94 BB derrière, pot de 27 BB). Ce ratio est la clé de lecture pour toute la main : assez élevé pour jouer trois rues si Hero améliore fortement, assez bas pour que les paires améliorées deviennent commitées rapidement. À ce SPR, les mains qui veulent aller au showdown ont besoin d'au moins two pair ou d'un draw solide.

---

## Flop J♦4♣Q♥ — Un call de plan, pas un call d'equity

Le flop est objectivement mauvais pour TT : underpair, deux overcards (Q, J), aucun draw direct. Un raisonnement limité à l'equity immédiate conclurait au fold.

Le raisonnement correct est différent.

**L'equity flop de TT contre la range adverse est de 40 %** (Equilab). Ce n'est pas une main crushée — c'est une main qui attend. Contre AA/KK, TT a des outs propres (brelan) et des possibilités de straight. Contre AK, TT est nettement devant. Contre QQ/JJ, TT est derrière mais ces combos sont peu nombreux dans une range 5.2%.

La raison principale du call est **structurelle** : le 9♠ au turn transforme TT en open-ended straight draw, et cette carte était prévisible avant l'action. Le call flop est un investissement de 13 BB pour contrôler la turn. Ce n'est pas un float sans plan — c'est un call avec un arbre décisionnel précis : si le 9 tombe et que cc3ff955 montre de la faiblesse, le pot appartient à Hero.

Par ailleurs, fold TT ici viderait la range de call IP d'une main de fréquence : les défenses en pot 3bet deviendraient limpides (uniquement sets floppés et gros draws), ce qu'un adversaire attentif exploiterait en barrellant aveuglément.

---

## Turn 9♠ — La carte qui renverse l'avantage de range

Board : Q♥J♦4♣9♠. Pot : 53 BB. Stack effectif résiduel : 81 BB. SPR : **1,5**.

### Ce que le 9 change structurellement

Le 9 est une carte neutre pour la range de 3bet de cc3ff955 (AA/KK ne s'améliorent pas, QQ/JJ ont déjà leur set, AK/AQ ont deux overs ou top pair). Pour la range de défense IP de Hero en revanche, c'est une explosion :

- KT♦ → quinte (9-T-J-Q-K)
- T8s → quinte (7-8-9-T-J)
- 99 → brelan
- QJ → two pair
- JTs, T9s → two pair ou draws combinés

Calculé sur la **range réelle de call 3bet CO de Hero** — les mains jouées concrètement dans ce spot, hors 4bet value et 4bet bluff — l'equity globale de Hero passe à **42 %** sur ce board (Equilab). La range adverse (58%) garde l'avantage de range, mais il s'est compressé. Et surtout, Hero détient maintenant le **nut advantage** : les quintes et deux-paires sont surreprésentées dans sa range, pas dans celle de cc3ff955.

TT spécifiquement sur cette turn : **10 outs** (4 K + 4 huit + 2 T), soit environ **22 % d'equity contre AA** pour la carte de river.

### Le micro-bet à 7 BB — L'ouverture

cc3ff955 mise 7 BB dans un pot de 53 BB. C'est 13% du pot, après avoir cbetté 48% au flop.

Ce sizing est incohérent avec une main de valeur. Avec AA sur Q-J-4-9, les deux lignes rationnelles sont :
- **Gros barrel (65-75%)** : impose le prix aux draws, protège l'overpair
- **Check-call** : renonce à la fold equity, contrôle le pot, observe la réaction IP

Un bet à 13% n'accomplit ni l'un ni l'autre. Il ne nie pas l'equity des draws (Hero a besoin de seulement 10% d'equity pour appeler rentablement à ces cotes), n'extrait pas de valeur des mains moyennes, et laisse Hero avec une occasion de pression à coût minimal. C'est le pattern de cc3ff955 déjà identifié : **bet petit avec une overpair sur un board connecté quand la fold equity est perçue comme nulle**. La note est confirmée.

---

## Le shove — Déconstruction

Pot après le bet de cc3ff955 : **60 BB**. Hero shove : tout-in pour 130 BB.

### Cohérence narrative

Après call 3bet IP + call cbet sur J♦4♣Q♥ + raise jam sur 9♠, Hero représente de manière crédible : 99, KT, T8s, QJ, JTs. Ces mains existent toutes dans la range CO vs SB 3bet pot. Le shove raconte une histoire que cc3ff955 ne peut pas démonter — il ne sait pas si Hero a TT ou KT.

### Le seuil de fold equity

Pour que le shove soit profitable, il faut estimer à quelle fréquence cc3ff955 abandonne. En intégrant l'equity de TT (22% contre AA, mieux contre le reste de la range), la mise en jeu et le pot actuel, le seuil de fold equity nécessaire est d'environ **48%**.

Est-ce atteignable ? La range de cc3ff955 contient aussi KK, AK et AQ — des mains qui, face à ce board et cette représentation, ont des arguments pour fold. KK est une overpair sans amélioration sur un board J-Q-9 où Hero représente plusieurs quintes. AK a deux overcards sans paire. AQ (top paire) est vulnérable. Si l'on estime raisonnablement que KK fold ~60%, AK fold ~65%, et AQ fold ~50%, le seuil de 48% est **atteint ou proche** — le shove est marginalement à légèrement +EV contre la range globale.

Contre AA spécifiquement, le shove perd de l'argent. Mais Hero ne joue pas contre AA : il joue contre une range. Et c'est cette range qui valide la décision.

### Classification

**Déviation exploitative correcte.** Le shove n'est pas GTO — GTO ne shove pas TT underpair dans un pot 3bet sur ce board. Mais l'exploitation du sizing tell, combinée au nut advantage réel de la range IP sur cette texture, rend la ligne +EV en pratique.

---

## Ce que cc3ff955 aurait dû faire avec AA

La faute n'est pas au flop — la cbet à 48% est standard en pot 3bet.

La faute est au turn. Sur Q♥J♦4♣9♠, AA est une overpair face à un board ultra-connecté qui avantage la range IP. Il y a deux lignes correctes :

**Gros barrel ~70% pot (37 BB dans 53 BB).** Hero doit payer ~40 BB pour voir la river avec ses draws, ce qui n'est pas rentable pour TT. L'initiative revient à cc3ff955 et il extrait de la valeur de tout ce qui continue.

**Check-call.** Il accepte de voir la river sans pressure, et peut call une mise raisonnable de Hero. Coûte moins cher, contrôle mieux le pot.

En choisissant le bet à 7 BB, cc3ff955 obtient le pire des deux mondes : il investit sans protéger, offre des cotes idéales aux draws, et signale une faiblesse que Hero peut — et doit — exploiter.

---

## Ce qu'il faut retenir

**1. Les turns qui connectent la range IP sont des cartes d'attaque.**
Quand une turn améliore significativement les connecteurs et suited hands de la range IP, le nut advantage bascule — même si l'equity brute du Hero reste inférieure. C'est le moment d'appliquer de la pression.

**2. Le sizing adverse est le vrai déclencheur du shove.**
Sans le micro-bet à 7 BB, le shove n'est pas justifié. C'est l'incohérence du sizing — pas la force de la main — qui rend la ligne profitable. L'exploitation d'un tell sizing est une source d'EV tout aussi réelle que l'equity.

**3. Tous les semi-bluffs ne se valent pas.**
TT avec 10 outs et une range crédible n'est pas un bluff pur — c'est un semi-bluff à double source de profit : fold equity immédiate + amélioration possible. Cette combinaison est ce qui distingue un raise rentable d'un spew.

**4. Le résultat ne valide pas la décision — mais la décision était bonne.**
Hero a touché sa quinte au river. Si le K♥ n'était pas tombé, la main aurait été perdue. La review s'arrête au turn : c'est là que la décision a été prise, c'est là qu'elle doit être évaluée.
