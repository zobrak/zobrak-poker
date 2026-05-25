---
title: "Adaptation aux maniacs — 5 mains contre un profil LAG-aggro"
date: 2026-05-25
draft: false
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

VPIP 100 : entre dans 100% des pots. PFR 20 sur VPIP 100 signifie qu'il limp-call ou limp-3bet le reste du temps — sa range préflop n'a aucune structure. Son 3bet à 55.6% ne discrimine pas valeur vs bluff : il 3bet avec A5s, A2o, T9o, 97o, 42o indifféremment. FCB 0% : ne fold pas face aux c-bets. WTSD 61% : va au showdown dans 2 mains sur 3.
{{< /tell >}}

**Profil :** maniac pur. Range préflop garbage totale, aggression postflop non corrélée à sa main, bluff-jam sur boards coordonnés/monotones. Calling station au-delà du flop.

{{< insight >}}
**Contre ce profil, les ajustements sont contre-intuitifs :** on resserre les bluffs (inutiles contre quelqu'un qui ne fold pas), on élargit les calls (sa range est trop vaste pour avoir de la valeur souvent), et on laisse sa propre range faire le travail à long terme. Il gagnera des pots ; c'est le coût d'exploitation.
{{< /insight >}}

---

## Les mains du duel

### Main 079

{{< handsynth id="20260525-079" pos="BTN" hand="Kc9c" board="3cAcJd" result="-104bb" tag="loss" >}}
Hero ouvre 3bb, Villain1 **3bet SB à 5bb** avec [A♠5♦], call. Pot 11bb.

**Flop [3♣A♣J♦] :** Villain1 jam **€1.92 all-in** — 8.7× le pot. Hero appelle avec **flush draw** (9 outs, ~36%). Villain1 montre trip aces (A♠5♦). Lost.

**Décision clé :** call du jam NFD avec ~36% d'équité. Equity needed = 47%. Techniquement -EV contre une range purement value — mais contre un maniac qui jam sur n'importe quel board scary (voir main #82 ci-dessous), sa range de jam inclut suffisamment de bluffs pour que le call soit défendable. **Résultat mauvais, ligne correcte dans le contexte.**
{{< /handsynth >}}

{{< equity >}}
K♣9♣ vs A♠5♦ sur [3♣A♣J♦] : **36% eq** (9 flush outs). Equity needed pour call profitable = **47%**. Le gap se referme si Villain1 jam avec 30%+ de bluffs — ce que son profil suggère. Sur un échantillon long, le call est rentable.
{{< /equity >}}

---

### Main 080

{{< handsynth id="20260525-080" pos="BB" hand="KdJh" board="Ts6cTh6hQh" result="-7bb" tag="loss" >}}
Villain1 limp BTN, Hero **ISO raise** à 4bb avec K♦J♥, Villain1 **3bet min** à 7bb avec [A♣2♠], call. Pot 14.5bb.

**Flop [T♠6♣T♥] :** c-bet Villain1 €0.12, call. Turn [6♥] : Villain1 **check** (passif avec A kicker sur board paired). River [Q♥] : Hero bet €0.38 — Villain1 call.

**SD : board T♠6♣T♥6♥Q♥ — Hero K♦J♥ (K kicker) perd contre A♣2♠ (A kicker).** -7bb.

**Décision clé :** le bet river avec KJ sur T-6-T-6-Q est marginal. Sa range de 3bet min inclut toujours Ax, qui domine KJ sur ce board. Check river ou bet smaller pour pot control — la valeur espérée du bet est négative face à un caller avec range Ax dominante.
{{< /handsynth >}}

{{< key >}}
Sur boards paired low, méfiance des kicker wars contre un profil qui limp/3bet — son bas de range inclut toujours Ax. Extraire avec K kicker sur T-6-T-6-Q c'est se placer dans le bas de sa range à lui.
{{< /key >}}

---

### Main 081

{{< handsynth id="20260525-081" pos="SB" hand="QhJs" board="7h2h6c2sJd" result="+50bb" tag="win" >}}
BvB, Hero ouvre 3bb, Villain1 **3bet BB à 5bb** avec [7♦9♣], call. Pot 11bb.

**Flop [7♥2♥6♣] :** Hero **donk lead €0.10**, Villain1 **raise €0.22** (top pair weak + bd straight), Hero call (overcards + OESD + backdoor). Turn [2♠] : Hero bet €0.30, Villain1 **raise €0.60** — Hero call (Villain1 peut lever one pair, bluff, n'importe quoi). River [J♦] : Hero **jam €1.08** (deux paires J/2), Villain1 call.

**SD : Hero Q♥J♠ (J/2) bat Villain1 7♦9♣ (7/2).** +50bb.

**Décision clé :** tenir face aux raises multi-streets d'un maniac est correct. Ses raises turn ne signifient pas deux paires+. On call avec equity et on jam river quand on touche.
{{< /handsynth >}}

---

## Mains témoins — son profil hors duel

Ces deux mains illustrent ses moves sur des boards où hero n'était pas engagé.

### T9o — 5bet jam préflop vs AA

{{< handsynth id="20260525-070" pos="BB" hand="Th9h" board="KcJh6hTd9d" result="+87bb" tag="neutral" >}}
Limp, open, 3bet, 4bet, Villain1 **5bet jam all-in avec T♠9♥** face à [A♠A♥]. Board runner-runner K♣J♥6♥T♦9♦ → deux paires T/9. Il gagne.

**Ce que ça dit :** aucune cohérence de range préflop. Il 5bet jam avec T9o comme avec AA. Sa range de jam préflop est littéralement n'importe quoi.
{{< /handsynth >}}

### 42o — 3bet + jam bluff sur board monotone

{{< handsynth id="20260525-082" pos="SB" hand="2s4h" board="6dQdJd3h9h" result="-94bb" tag="neutral" >}}
Villain1 **3bet SB** à 5bb avec [2♠4♥], Hero BTN call (8♦5♦). **Flop [6♦Q♦J♦] :** Villain1 **jam €1.78 all-in** — bluff total sur board monotone scary. Hero call flush draw — Villain1 montre 42o, rien.

**Ce que ça dit :** il jam **n'importe quel board coordonné ou monotone** quelle que soit sa main. Ce pattern explique pourquoi appeler ses jams avec un FD est correct — il bluff cette ligne à haute fréquence.
{{< /handsynth >}}

---

## Analyse — adaptation aux maniacs

### 1. Ne pas over-fold face à ses 3bets

Sa range de 3bet est **A2o, A5s, T9o, 97o, 42o**. Il 3bet 55.6% des opportunités. Cela signifie que ses 3bets ne représentent pas une range premium — ils représentent "j'ai décidé de relancer". **Top pair face à ses 3bets = call systématique.** Fold top pair contre lui = exploité à l'envers.

{{< insight >}}
La contre-mesure intuitive est de 4bet large pour le mettre en difficulté. Mais à ce niveau il call les 4bets aussi. La ligne optimale : call IP avec une range large, extraire postflop quand on touche.
{{< /insight >}}

### 2. Ses jams postflop ne corrèlent pas avec sa main

Il a jam :
- **8.7× pot sur A-J-3 monotone** avec trip aces (value)
- **All-in sur 6♦Q♦J♦ monotone** avec 42o (bluff total)
- **Turn raise** sur 7-2-6-2 avec top pair weak (semi-bluff ?)

La variance de son sizing n'est pas informative. **Il jam la même chose avec value ou air.** Conséquence : impossible de lire sa main via le sizing. On joue nos cartes et notre equity, pas les siennes.

### 3. Tenir face aux raises multi-streets

La main 081 illustre le principe : **donk → raise → call → barrel → raise → call → jam river**. Chaque raise adverse aurait pu justifier un fold "par prudence". Mais sa raise range est trop vaste pour représenter deux paires+ systématiquement. On call avec equity draw, on jam quand on touche.

{{< key >}}
**Règle vs maniac :** un raise d'un maniac sur un board où il peut avoir one pair = call avec draw ou top pair. Un fold nécessite un board où ses raises représentent une range très étroite — ce qui n'arrive jamais avec ce profil.
{{< /key >}}

### 4. Limiter les bluffs

Son FCB est 0% (1 opportunité — faible sample, mais cohérent avec VPIP 100). Il ne fold pas. Bluffer ce profil = dépenser des mises sans fold equity. **Chaque mise contre lui doit être justifiée en pure value.** La fold equity est zéro.

### 5. Kicker awareness

Main 080 : KJ perd contre A2 sur T-6-T-6-Q. Sa range de 3bet min inclut toujours Ax. Sur boards paired low, le K kicker est en bas de sa range à lui. **Réduire les river value-bets marginaux** quand sa range 3bet domine le nôtre sur ce board texture.

---

## Synthèse exploitante

| Spot | Ajustement vs maniac |
|------|---------------------|
| Face à ses 3bets | Élargir les calls IP, 4bet value uniquement |
| Ses c-bets / barrels | Call down avec top pair ou draw — il barrel air |
| Ses raises postflop | Call avec equity ; jam river quand on touche |
| Nos bluffs | Supprimer — fold equity nulle |
| River value | Bet gras avec value claire ; pot control avec kicker marginal |
| Long terme | Sa range écrase la sienne — laisser faire, encaisser les bad beats |

{{< insight >}}
**Résumé sur l'échantillon :** −104bb (main perdue mais ligne défendable) · −7bb (kicker war évitable) · +50bb (tenu correctement face aux raises). Net = −61bb. Sur une session longue contre ce profil, le résultat devrait s'inverser — sa VPIP 100 avec range garbage génère un EV négatif structurel qu'on monétise en restant patient.
{{< /insight >}}
