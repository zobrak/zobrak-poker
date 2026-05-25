---
title: "Adaptation aux maniacs — 5 mains contre un profil LAG-aggro"
date: 2026-05-25
draft: true
tags: ["maniac", "adaptation", "3bet", "barrel", "call-down"]
theme: "profil"
description: "Comment adapter son jeu face à un profil maniac : 3bet wide, barrel chaque street, jam n'importe quoi sur boards scary. Analyse de 5 mains dont 3 duels directs."
hands:
  - id: "20260525-079"
    hand_id: "260922965171"
  - id: "20260525-080"
    hand_id: "260922967159"
  - id: "20260525-081"
    hand_id: "260922970944"
villain:
  uuid: "e71a71e1"
  vpip: 100
  pfr: 20
  threeb: 55.6
  threeb_opp: 9
  hands: 15
  profile: "maniac"
---

## Portrait du profil

{{< tell >}}
**Villain1** — VPIP **100** / PFR **20** / 3bet **55.6%** (9 opp) / FCB **0%** — 15 mains

VPIP 100 : entre dans 100% des pots. PFR 20 sur VPIP 100 signifie qu'il limp-call ou limp-3bet le reste du temps — sa range préflop n'a aucune structure. Son 3bet à 55.6% ne discrimine pas valeur contre bluff : il 3bet avec A5s, A2o, T9o, 97o, 42o indifféremment. FCB 0% : ne se couche pas face aux c-bets. WTSD 61% : va au showdown dans 2 mains sur 3.
{{< /tell >}}

**Profil :** maniac pur. Range préflop incohérente, agressivité postflop non corrélée à sa main, bluff-jam sur boards coordonnés ou monotones. Calling station au-delà du flop.

{{< insight >}}
**Contre ce profil, les ajustements sont contre-intuitifs :** on supprime les bluffs (inutiles contre quelqu'un qui ne se couche pas), on élargit les appels (sa range est trop vaste pour avoir de la valeur souvent), et on laisse sa propre range faire le travail à long terme. Il gagnera des pots — c'est le coût de l'exploitation.
{{< /insight >}}

---

## Les mains du duel

### K♣9♣ BTN vs A♠5♦ SB — Appel flush draw sur jam all-in

{{< handsynth id="20260525-079" pos="BTN" hand="Kc 9c" board="3c Ac Jd" result="-104bb" tag="loss" >}}
Hero ouvre 3bb, Villain1 **3bet SB à 5bb** avec [A♠5♦], appel. Pot 11bb.

**Flop [3♣A♣J♦] :** Villain1 jam **€1.92 all-in** — 8,7× le pot. Hero appelle avec **tirage couleur** (9 outs, ~36% d'équité). Villain1 montre trip aces [A♠5♦]. Perdu.

**Décision clé :** appel du jam avec ~36% d'équité. Seuil d'appel rentable = 47%. Techniquement négatif contre une range purement value — mais contre un maniac qui jam sur n'importe quel board scary (voir main ci-dessous), sa range de jam inclut suffisamment de bluffs pour rendre l'appel défendable. **Résultat négatif, ligne correcte dans le contexte.**
{{< /handsynth >}}

{{< equity >}}
K♣9♣ vs A♠5♦ sur [3♣A♣J♦] : **36% d'équité** (9 outs couleur). Seuil d'appel rentable = **47%**. L'écart se referme si Villain1 jam avec 30%+ de bluffs — ce que son profil suggère. Sur un échantillon long, l'appel est rentable.
{{< /equity >}}

---

### K♦J♥ BB vs A♣2♠ BTN — Guerre de kicker perdue

{{< handsynth id="20260525-080" pos="BB" hand="Kd Jh" board="Ts 6c Th 6h Qh" result="-7bb" tag="loss" >}}
Villain1 limp BTN, Hero **ISO raise** à 4bb avec K♦J♥, Villain1 **3bet min** à 7bb avec [A♣2♠], appel. Pot 14,5bb.

**Flop [T♠6♣T♥] :** c-bet Villain1 €0.12, appel. Turn [6♥] : Villain1 **check** (passif avec kicker A sur board pairé). River [Q♥] : Hero mise €0.38 — Villain1 suit.

**SD : board T♠6♣T♥6♥Q♥ — Hero K♦J♥ (kicker K) perd contre A♣2♠ (kicker A).** −7bb.

**Décision clé :** la mise river avec KJ sur T-6-T-6-Q est marginale. Sa range de 3bet min inclut toujours Ax, qui domine KJ sur ce board. Checker la river ou miser plus petit pour contrôler le pot — la valeur espérée de la mise est négative face à un suiveur avec range Ax dominante.
{{< /handsynth >}}

{{< key >}}
Sur boards pairés bas, méfiance des guerres de kicker contre un profil qui limp/3bet — son bas de range inclut toujours Ax. Extraire avec kicker K sur T-6-T-6-Q, c'est se placer dans le bas de sa range à lui.
{{< /key >}}

---

### Q♥J♠ SB vs 7♦9♣ BB — Tenir face aux relances, river gagnant

{{< handsynth id="20260525-081" pos="SB" hand="Qh Js" board="7h 2h 6c 2s Jd" result="+50bb" tag="win" >}}
BvB, Hero ouvre 3bb, Villain1 **3bet BB à 5bb** avec [7♦9♣], appel. Pot 11bb.

**Flop [7♥2♥6♣] :** Hero **donk lead €0.10**, Villain1 **relance €0.22** (top pair faible + tirage bas), Hero suit (deux surcartes + tirage bilatéral + backdoor couleur). Turn [2♠] : Hero mise €0.30, Villain1 **relance €0.60** — Hero suit (Villain1 peut relancer avec une paire, un bluff, n'importe quoi). River [J♦] : Hero **jam €1.08** (deux paires J/2), Villain1 suit.

**SD : Hero Q♥J♠ (J/2) bat Villain1 7♦9♣ (7/2).** +50bb.

**Décision clé :** tenir face aux relances multi-streets d'un maniac est correct. Ses relances au turn ne signifient pas deux paires+. On suit avec de l'équité et on jam river quand on touche.
{{< /handsynth >}}

---

## Mains témoins — son profil hors duel

Ces deux mains illustrent ses automatismes sur des boards où hero n'était pas engagé.

### T♠9♥ BB — 5bet jam préflop avec T9o face à AA

{{< handsynth id="20260525-070" pos="BB" hand="Ts 9h" board="Kc Jh 6h Td 9d" result="+87bb" tag="neutral" >}}
Limp, ouverture, 3bet, 4bet, Villain1 **5bet jam all-in avec T♠9♥** face à [A♠A♥]. Board runner-runner K♣J♥6♥T♦9♦ → deux paires T/9. Il gagne.

**Ce que ça révèle :** aucune cohérence de range préflop. Il 5bet jam avec T9o comme avec AA. Sa range de jam préflop n'a pas de plancher.
{{< /handsynth >}}

### 2♠4♥ SB — 3bet + jam bluff sur board monotone

{{< handsynth id="20260525-082" pos="SB" hand="2s 4h" board="6d Qd Jd 3h 9h" result="-94bb" tag="neutral" >}}
Villain1 **3bet SB** à 5bb avec [2♠4♥], Hero BTN appel (8♦5♦). **Flop [6♦Q♦J♦] :** Villain1 **jam €1.78 all-in** — bluff total sur board monotone scary. Hero appelle tirage couleur — Villain1 retourne 42o, rien.

**Ce que ça révèle :** il jam **n'importe quel board coordonné ou monotone** quelle que soit sa main. Ce pattern justifie d'appeler ses jams avec un tirage couleur — il emprunte cette ligne à haute fréquence avec rien.
{{< /handsynth >}}

---

## Analyse — adaptation aux maniacs

### 1. Ne pas trop se coucher face à ses 3bets

Sa range de 3bet couverte : **A2o, A5s, T9o, 97o, 42o**. Il 3bet 55.6% des opportunités. Ses 3bets ne représentent pas une range premium — ils représentent « j'ai décidé de relancer ». **Top pair face à ses 3bets = appel systématique.** Se coucher avec top pair contre lui, c'est se faire exploiter à l'envers.

{{< insight >}}
La réaction intuitive est de 4bet large pour le mettre sous pression. Mais à ce niveau il appelle les 4bets aussi. La ligne optimale : appeler en position avec une range large, extraire postflop quand on touche.
{{< /insight >}}

### 2. Ses jams postflop ne corrèlent pas avec sa main

Il a jamé :
- **8,7× le pot sur A-J-3 monotone** avec trip aces (value)
- **All-in sur 6♦Q♦J♦ monotone** avec 42o (bluff total)
- **Relance turn** sur 7-2-6-2 avec top pair faible (semi-bluff ?)

La taille de ses mises n'est pas informative. **Il jame pareil avec de la valeur ou avec rien.** Conséquence : impossible de lire sa main via son sizing. On joue nos cartes et notre équité, pas les siennes.

### 3. Tenir face aux relances multi-streets

La main 081 illustre le principe : **donk → relance → appel → barrel → relance → appel → jam river**. Chaque relance adverse aurait pu justifier un abandon « par prudence ». Mais sa range de relance est trop vaste pour représenter deux paires+ systématiquement. On suit avec draw ou top pair, on jame river quand on touche.

{{< key >}}
**Règle vs maniac :** une relance d'un maniac sur un board où il peut avoir une paire = appel avec tirage ou top pair. Un abandon nécessite un board où ses relances représentent une range très étroite — ce qui n'arrive jamais avec ce profil.
{{< /key >}}

### 4. Supprimer les bluffs

Son FCB est 0% (1 opportunité — faible échantillon, mais cohérent avec VPIP 100). Il ne se couche pas. Bluffer ce profil = dépenser des mises sans valeur espérée. **Chaque mise contre lui doit être justifiée en pure valeur.** La fold equity est nulle.

### 5. Vigilance kicker

Main 080 : KJ perd contre A2 sur T-6-T-6-Q. Sa range de 3bet min inclut toujours Ax. Sur boards pairés bas, le kicker K est dans le bas de sa range à lui. **Réduire les value-bets river marginaux** quand sa range de 3bet domine la nôtre sur cette texture.

---

## Synthèse exploitante

| Spot | Ajustement vs maniac |
|------|---------------------|
| Face à ses 3bets | Élargir les appels en position, 4bet value uniquement |
| Ses c-bets / barrels | Tenir avec top pair ou tirage — il barrel avec rien |
| Ses relances postflop | Appeler avec équité ; jamer river quand on touche |
| Nos bluffs | Supprimer — fold equity nulle |
| River value | Miser gras avec valeur claire ; contrôler le pot avec kicker marginal |
| Long terme | Sa range écrase la sienne — encaisser les mauvais coups, la rentabilité s'impose |

{{< insight >}}
**Résumé sur l'échantillon :** −104bb (main perdue, ligne défendable) · −7bb (guerre de kicker évitable) · +50bb (tenu correctement face aux relances). Net = −61bb. Sur une session longue contre ce profil, le résultat s'inverse — sa VPIP 100 avec range incohérente génère un EV négatif structurel que l'on monétise en restant patient.
{{< /insight >}}
