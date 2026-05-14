---
title: "AA CO vs BTN — 4bet pot, cbet K-high"
date: 2026-05-14
draft: false
description: "Hero CO avec AA, 4bet préflop vs BTN 3bet, cbet sur flop K-high sec."
tags:
  - holdem
  - no-limit
  - cash-game
  - 6-max
  - NL2
  - PokerStars
  - 4bet
  - value
  - cbet
limits:
  - NL2
rooms:
  - PokerStars
positions:
  - CO
  - BTN
actions:
  - open
  - 3bet
  - 4bet
  - cbet
streets:
  - preflop
  - flop
formats:
  - 6-max
params:
  hero_position: "CO"
  villain_position: "BTN"
  pot_type: "4bet pot"
  result_bb: 48.5
  video_url: ""
---

```hh
PokerStars - €0.02 NL (6 max) - Holdem - 6 players
UTG: 97.5 BB (VPIP: 18.00, PFR: 14.00, 3Bet Preflop: 4.00, Hands: 50)
HJ: 103.0 BB (VPIP: 22.00, PFR: 16.00, 3Bet Preflop: 5.00, Hands: 45)
Hero (CO): 137.5 BB
BTN: 100.0 BB (VPIP: 29.41, PFR: 23.53, 3Bet Preflop: 0.00, Hands: 17)
SB: 68.0 BB (VPIP: 14.71, PFR: 11.76, 3Bet Preflop: 5.56, Hands: 34)
BB: 54.0 BB (VPIP: 64.71, PFR: 17.65, 3Bet Preflop: 0.00, Hands: 17)

Pre Flop: (pot: 1.5 BB) Hero has Ac Ad
fold, fold, Hero raises to 3 BB, BTN raises to 10.5 BB, fold, fold, Hero raises to 25 BB, BTN calls 14.5 BB

Flop: (51.5 BB) 5s 3h Kh
Hero bets 28 BB, BTN folds

Hero wins 48.5 BB
```

## Analyse

### Préflop

Open CO standard à 3 BB avec AA. BTN 3bet à 10.5 BB — size correcte.

4bet à 25 BB (~2.4x le 3bet) : size standard en 4bet pot IP. On construit le pot avec la meilleure main.

BTN call : sa range de call inclut QQ, JJ, AK, AQs — quelques mains premium qui ont du mal à fold face à un 4bet.

### Flop K♥ 5♠ 3♥

Flop favorable à notre range de 4bet : K-high, deux couleurs basses. Notre AA bénéficie d'un high card avantage.

Cbet 28 BB (~55% du pot) : size correcte sur ce flop. On value contre KQ, KJ dans sa range de call. Les mains comme QQ, JJ ne peuvent pas continuer facilement face à cette taille.

BTN fold attendu — sa range de call est faible sur ce flop sec.

### Notes exploitantes

BTN a 0% 3Bet PF sur seulement 17 mains. Sample trop petit pour conclure. Sa 3bet ici peut aussi être une main premium (QQ+, AK) qu'il appelle le 4bet avec.

### Conclusion

Main standard, exécution correcte. Pas d'erreur détectée.
