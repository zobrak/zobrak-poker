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

# NL2 — Le piège du slowplay : quand KK se transforme en bluffcatcher hors de prix

Certaines mains valent plus qu'un pot gagné. Elles montrent une fuite stratégique entière, presque caricaturale.

Celle-ci est un cas d'école : vilain reçoit KK au bouton, face à mon open CO. Il choisit de payer simplement. Pas de 3bet. Pas de pression. Pas de pot construit. Il me laisse voir un flop avec Q6s.

Quelques streets plus tard, il paie un overbet river sur un board As-high avec une simple paire de Rois.

Ce n'est pas juste "il a mal joué KK". C'est plus intéressant que ça.

Cette main illustre trois erreurs fréquentes en micro-limites :

1. slowplay une premium préflop sans raison stratégique ;
2. laisser l'adversaire réaliser son équité trop bon marché ;
3. rester amoureux de la force préflop d'une main qui a perdu sa valeur postflop.

Et en NL2, avec le rake, ces erreurs coûtent très cher.

---

## La main

PokerStars NL2, 6-max, 100 BB effectifs.

Vilain au bouton :

{{< tell >}}
**VPIP 50.7 / PFR 0.0 / 3bet 0.0% — 71 mains.**

Profil très clair : il entre dans beaucoup de coups, mais ne prend jamais l'initiative. C'est un joueur qui paie. Il call préflop, il call flop, il call turn, et parfois il call river parce que sa main "a l'air trop belle pour fold". Contre ce profil : value cher, ne pas bluffer.
{{< /tell >}}

Je suis au CO avec Q♠6♠.

Je raise à 3 BB.  
BTN call.  
Blinds fold.

Pot : 7.5 BB.

---

## Préflop : mon open Q6s et son flat KK

Commençons par être honnête : Q6s CO n'est pas une main premium d'open.

Dans une stratégie standard, c'est une adaptation de range exploitante — les bords d'une range sont flous, et ici le contexte la justifie. Ce n'est pas une main que je veux ouvrir automatiquement contre une table agressive, des blinds compétents ou un bouton capable de 3bet correctement.

Mais ici, le contexte compte.

Derrière moi :

- BTN est 50/0 sur 71 mains ;
- SB est très récréatif sur petit échantillon ;
- BB n'a pas l'air de beaucoup 3bet ;
- la table donne peu de pression préflop.

Donc l'open devient défendable exploitativement. Pas parce que Q6s serait soudain une main merveilleuse, mais parce que l'environnement permet d'ouvrir un peu plus large, surtout si le plan postflop est clair : ne pas spew quand on rate, value fort quand on touche, et punir les profils qui callent trop.

Mais le vrai événement préflop, ce n'est pas mon open.

C'est son call avec KK.

Avec K♣K♥ au bouton face à un open CO, vilain a un 3bet automatique en pratique.

La ligne naturelle :

- CO open 3 BB ;
- BTN 3bet à 9 ou 10 BB.

S'il 3bet et que je fold, il gagne immédiatement :

- 3 BB d'open ;
- 1.5 BB de blinds ;
- total : 4.5 BB.

Et surtout, il gagne ce pot sans rake postflop, sans variance, sans board As-high, sans décision river absurde.

{{< insight >}}
**Le rake en NL2 : un argument préflop souvent ignoré.**

En micro-limites, le rake est proportionnellement élevé sur les pots postflop. Ramasser l'open + les blinds préflop avec KK = 4.5 BB nets, zéro rake. Jouer un pot de 100+ BB postflop = plusieurs BB de rake ponctionnés. Gagner le pot préflop avec KK n'est pas un échec — c'est parfois la meilleure issue.
{{< /insight >}}

C'est un point fondamental en micro-limites : gagner le pot préflop avec KK n'est pas un échec.

Beaucoup de joueurs récréatifs pensent :

> "J'ai une grosse main, je ne veux pas faire fuir."

Mais cette phrase contient déjà l'erreur.

Le but avec KK n'est pas de garder toute la poubelle adverse dans le coup à n'importe quel prix. Le but est de faire payer trop cher les mains dominées.

Contre Q6s, KK a environ 83 % d'équité préflop. C'est énorme. Mais cette équité ne vaut quelque chose que si elle est monétisée.

En flat, vilain me laisse réaliser mon équité pour seulement 3 BB.

Et c'est précisément ce qu'il ne doit pas faire.

---

## Le piège mental : "je slowplay pour ne pas faire fold"

Le slowplay préflop n'est pas toujours mauvais.

Flat AA ou KK peut avoir du sens dans certains contextes :

- un joueur derrière squeeze trop ;
- l'open raiser 4bet énormément ;
- les blinds sont agressives ;
- il y a une dynamique de guerre préflop ;
- les stacks profonds créent une situation particulière ;
- le joueur en face spew massivement postflop dès qu'on sous-représente sa main.

Mais ici, rien n'indique ça.

BTN est un profil 50/0. Il n'a pas l'air de construire des pièges avancés. Il n'a pas de stratégie de flat polarisé. Il ne protège pas une range de call. Il ne manipule probablement pas ma perception.

Il fait juste ce que beaucoup de joueurs passifs font : il paie avec une grosse main parce qu'il ne veut pas me faire folder.

Sauf que cette passivité a un coût.

Quand il 3bet KK, il m'oblige à prendre une décision inconfortable avec le bas de ma range. Q6s devient une main fragile, chère à continuer, dominée, avec reverse implied odds.

Quand il flat, il transforme mon erreur potentielle en opportunité.

Il me dit en pratique :

> Tu peux voir le flop avec tout ton bas de range. Si tu rates, tu abandonneras. Si tu touches fort, je risque de te payer.

C'est une offre que je n'ai aucune raison de refuser.

---

## Flop : Q♣ A♦ 6♥

Le flop tombe : Q♣ A♦ 6♥.

J'ai deux paires avec Q♠6♠.

Pot : 7.5 BB.  
Je mise 2 BB.  
Vilain call.

Ici, ma main est très forte, mais le board mérite d'être lu correctement.

Ce flop touche énormément la range de call bouton :

- Ax ;
- Qx ;
- broadways ;
- pockets qui n'ont pas 3bet ;
- parfois des mains suited faibles ;
- quelques slowplays.

Contre un reg solide, je pourrais choisir un sizing plus cher immédiatement, parce que ce board connecte assez bien avec sa range de défense. Mais contre ce profil précis, le petit c-bet a une utilité : garder toutes ses mains intermédiaires accrochées.

{{< insight >}}
**C-bet small (1/3 pot) contre un profil large-passif.**

Sur un board AQ6, un profil 50/0 arrive au flop avec beaucoup de mains moyennes : tops pairs faibles, paires intermédiaires, quelques tirages. Un small c-bet (~1/3 pot) maintient toutes ces mains dans le pot — y compris ses TP et ses paires inférieures, qui sont toutes battues. L'objectif n'est pas de le faire fold. C'est de démarrer une construction street par street.
{{< /insight >}}

Je ne cherche pas à le faire fold. Je cherche à lui faire commencer une erreur.

Et surtout, je veux voir s'il est dans son mode habituel : call, call, call.

Son call flop avec KK n'est pas encore catastrophique isolément. Face à un petit sizing, avec une main comme KK, il peut encore se dire que je c-bet trop large, que je peux avoir une dame, des pockets, des airs, des mains qui testent le board.

Le problème, c'est que sa main est déjà devenue une main de bluffcatch.

Préflop, KK était une premium. Sur A-Q-6 après c-bet, KK n'est plus une premium. C'est une paire sous l'As, battue par tous mes Ax et par mes deux paires.

Et c'est là que beaucoup de joueurs se perdent : ils ne réévaluent pas la force relative de leur main.

Ils continuent à jouer "KK" au lieu de jouer "une paire de Rois sur A-Q-6".

Ce n'est pas la même main.

---

## Turn : 4♣

Turn : 4♣.

Pot : 11.5 BB.  
Je mise 8.5 BB.  
Vilain call.

Ce sizing change la nature du coup.

Flop, il pouvait encore payer petit avec beaucoup de mains. Turn, quand je mise environ trois quarts pot, je commence à annoncer que je veux construire un vrai pot.

Qu'est-ce que je représente ?

Principalement :

- Ax solide ;
- AQ ;
- A6 ;
- 66 ;
- parfois QQ/AA slowplay ;
- quelques draws à trèfle apparus ;
- quelques bluffs, mais pas tant que ça.

De son point de vue, KK devient très inconfortable.

Il ne bat plus mes mains de value naturelles. Il bloque peu mes bluffs. Il n'a pas d'amélioration claire river, sauf toucher un Roi.

Mais il call encore.

Et là, on voit bien l'enchaînement causé par son erreur préflop.

S'il avait 3bet, le coup aurait pris une autre forme. Il aurait eu l'initiative. Il aurait fait folder une partie de mon bas de range. Il aurait isolé une range plus définie. Il aurait construit le pot quand il dominait.

En flat, il a créé un pot où il ne sait plus situer sa main. Il a sous-représenté KK, mais sans plan clair derrière. Et quand je montre de la force, il ne sait pas lâcher.

C'est le pire des deux mondes :

- il ne prend pas la value préflop ;
- il ne trouve pas le fold postflop.

---

## River : 3♥

River : 3♥.

Board final : A♦ Q♣ 6♥ 4♣ 3♥.

Pot : 28.5 BB.  
Je mise 42.5 BB.

Overbet.

Vilain call.

Je montre Q♠6♠.  
Vilain muck K♣K♥.  
Je remporte un pot de 106.5 BB — gain net : **+57 BB**.

Rake payé : 7 BB.

---

## L'overbet river : value ou excès ?

C'est la décision intéressante de mon côté.

Avec Q6, je n'ai pas les nuts. Je bats beaucoup de mains, mais je suis aussi battu par une partie de sa range :

- AA ;
- QQ ;
- 66 ;
- AQ ;
- A6 ;
- A4 ;
- A3 ;
- 44 ;
- 33 ;
- parfois 52s.

Donc contre un joueur solide, mon overbet serait beaucoup plus discutable. Un bon reg ne va pas payer 1.5x pot river avec KK ici. Il va aussi folder beaucoup d'Ax moyens, surtout s'il comprend que ma ligne contient peu de bluffs naturels.

Mais ici, la question n'est pas : "Est-ce que mon sizing est équilibré ?"

La vraie question est :

> Contre ce joueur précis, combien de mains moins bonnes vont payer ?

Et la réponse est : probablement beaucoup trop.

Ce profil peut payer avec :

- AK ;
- AJ ;
- AT ;
- A9 ;
- Ax quelconque ;
- KK ;
- parfois Qx ;
- parfois une main complètement irrationnelle.

{{< insight >}}
**Overbet de value contre un profil sticky : la logique exploitante.**

Contre un joueur sans fold equity (50/0, aucun historique de fold postflop), l'overbet river n'est pas un sizing "équilibré" — c'est un sizing **exploitant**. Il paie trop souvent avec des mains battues. Plus on mise gros, plus la valeur espérée augmente contre ce type de profil. L'équilibre GTO ne s'applique pas ici : on maximise face à quelqu'un qui ne fold pas.
{{< /insight >}}

Contre ce type de joueur, un overbet de value n'a pas besoin d'être théoriquement élégant. Il doit être payé trop souvent par moins bien.

C'est exactement ce qui se passe.

Le call avec KK révèle une information énorme : vilain n'arrive pas à folder une grosse main préflop, même quand le board et l'action lui hurlent qu'elle a perdu sa valeur.

Donc le sizing river n'est pas un bouton de panique. Ce n'est pas un "je mise gros parce que j'ai deux paires". C'est une exploitation directe d'un profil sticky.

---

## Ce que ma ligne raconte

Il faut aussi regarder ma range perçue.

J'open CO, je c-bet flop, je mise gros turn, puis j'overbet river.

Même si vilain ne raisonne pas comme un reg, il perçoit forcément quelque chose : je montre de la force sur trois streets.

Ma ligne représente surtout :

- value forte : AQ, A6, 66, AA, QQ, parfois A4/A3 ;
- value plus thin : AK, AJ selon profil ;
- bluffs possibles : missed clubs, quelques mains transformées en bluff.

Mais en NL2, contre un joueur passif, cette lecture n'est souvent pas faite en combos. Il ne se demande pas :

- combien de bluffs naturels ai-je ?
- combien de value hands ?
- quels bloqueurs possède-t-il ?
- quelle fréquence minimale de défense doit-il atteindre ?

Il fait quelque chose de beaucoup plus simple :

> J'ai KK. Il peut bluffer. Je call.

C'est brutal, mais c'est souvent comme ça que l'argent circule en micro-limites.

Et c'est pour ça qu'il ne faut pas trop intellectualiser contre les mauvaises cibles. Contre un joueur qui ne fold pas KK ici, la meilleure adaptation n'est pas de construire une range équilibrée de bluff river. La meilleure adaptation est de value plus cher.

---

## Le vrai coût du slowplay

Revenons à son préflop.

Beaucoup de joueurs sous-estiment le coût du slowplay parce qu'ils regardent seulement le résultat immédiat.

Ils pensent :

> Si je 3bet, il fold, je gagne seulement 4.5 BB. Si je call, je peux gagner plus.

Cette phrase semble logique, mais elle est incomplète.

Il faut ajouter :

- si je call, je laisse toutes ses mains réaliser leur équité ;
- si un As tombe, KK devient difficile ;
- si le board connecte avec son bas de range, je peux perdre un gros pot ;
- si je suis incapable de fold postflop, je transforme mon slowplay en piège contre moi-même.

Le problème n'est pas que vilain ait perdu contre Q6s. Ça arrivera parfois même en jouant bien.

Le problème, c'est qu'il a choisi une ligne qui maximise mes chances de réaliser mon équité tout en conservant chez lui une tendance à payer trop cher après coup.

C'est exactement la combinaison perdante.

{{< insight >}}
**Slowplay réussi = deux compétences combinées.**

1. Savoir *pourquoi* on sous-représente sa main (squeeze derrière, adversaire 4bet souvent, stacks profonds…).  
2. Savoir réévaluer sa main quand le board change — KK n'est plus KK sur A-Q-6.  

Sans les deux, le slowplay ne piège pas l'adversaire. Il piège celui qui le joue.
{{< /insight >}}

Vilain n'a fait ni l'un ni l'autre.

Il a caché KK préflop, puis il l'a joué comme si tout le monde devait encore respecter KK river.

---

## L'impact du rake

En NL2, le rake rend cette main encore plus parlante.

Quand il 3bet et que je fold préflop, il gagne 4.5 BB sans rake postflop.

Quand il flat et joue un gros pot postflop, le rake entre dans l'équation. Ici, le pot final subit 7 BB de rake.

C'est énorme.

Le rake punit les pots postflop marginaux et les lignes passives qui ne prennent pas l'EV disponible préflop.

Avec KK, surtout contre un open CO, on ne devrait pas avoir peur de gagner tout de suite. En micro, ramasser l'open et les blinds sans rake est déjà une très bonne issue.

La mentalité "je veux absolument rentabiliser ma premium" pousse beaucoup de joueurs à faire exactement l'inverse de ce qui imprime de l'argent.

Ils refusent un gain propre préflop, puis se retrouvent dans un pot raked, avec une main dégradée, face à des décisions qu'ils ne savent pas prendre.

---

## Ma note sur vilain

Cette main produit une note extrêmement rentable :

{{< tell >}}
Flat KK BTN vs open CO. Call flop A-high, call gros barrel turn, call overbet 1.5x pot river avec KK sur A♦Q♣6♥4♣3♥. Très sticky avec overpair / grosse main préflop. **Value très cher. Éviter les bluffs.**
{{< /tell >}}

Cette note vaut de l'argent.

Contre lui, à l'avenir :

- j'open/iso plus cher en value ;
- je bluff beaucoup moins ;
- je c-bet mes bonnes mains plus cher ;
- je value thin river ;
- je respecte fortement ses raises soudains, parce qu'un passif qui se réveille a souvent très lourd ;
- je ne cherche pas à le faire folder une main qu'il aime.

S'il peut payer KK ici, il peut payer beaucoup trop large ailleurs.

---

## Ce que je retiens pour mon propre jeu

Cette main confirme aussi un principe important pour ma propre stratégie.

Je ne dois pas tomber dans le piège inverse : croire que, parce que j'ai gagné avec Q6s, l'open devient automatiquement excellent.

Non.

L'open Q6s CO dépend de la table. Il est acceptable ici parce que les profils derrière rendaient le spot exploitable. Sur une table plus agressive, contre un bouton qui 3bet correctement, c'est un fold très simple.

La bonne conclusion n'est donc pas :

> Q6s CO, ça imprime.

La bonne conclusion est :

> Contre des profils passifs qui ne punissent pas préflop et paient trop postflop, on peut élargir intelligemment, mais il faut garder une discipline stricte quand on rate.

L'argent vient de l'adaptation, pas de la fantaisie.

---

## Conclusion

Cette main est une leçon simple, mais profonde.

Vilain avait KK au bouton face à un open CO. Il pouvait 3bet, prendre 4.5 BB immédiatement sans rake, ou jouer un pot plus gros en position avec une main qui domine ma range.

Il a choisi de flat.

Ce choix m'a permis de voir un flop bon marché avec Q6s. J'ai touché deux paires. Il n'a jamais réussi à abandonner sa main.

Ce n'est pas le bad beat d'un joueur malchanceux. C'est la conséquence logique d'une mauvaise construction stratégique.

KK est une premium préflop. Mais sur A-Q-6-4-3, après bet flop, gros bet turn et overbet river, KK n'est plus qu'un bluffcatcher cher.

Et en NL2, payer très cher avec un bluffcatcher mal choisi, c'est exactement le genre d'erreur qui finance les winrates adverses.

{{< key >}}
Une premium slowplayée sans plan ne piège pas l'adversaire. Elle piège souvent celui qui la détient.

En micro-limites, surtout contre des joueurs qui paient trop : **value. Fort. Simplement. Sans romantisme.**
{{< /key >}}
