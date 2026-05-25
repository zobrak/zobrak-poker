---
title: "Adapter son jeu aux maniacs en NL2"
date: 2026-05-25
description: "Quatre mains contre un profil LAG-aggro pour comprendre comment élargir sans se suicider : call-down, sizing, position, gestion mentale."
tags:
  - NL2
  - maniac
  - adaptation
  - 3bet
  - call-down
  - stratégie
limits:
  - NL2
---

![Adapter son jeu aux maniacs en NL2](/pictures/poker-adaptation-maniacs.png)

Il y a des profils qu'on ne rencontre pas tous les jours, mais qu'on aimerait croiser plus souvent. Pas parce qu'ils sont faciles à jouer à chaque décision. Au contraire : ils mettent de la variance partout, ils cassent les repères standards, ils transforment des pots de 11 blindes en élections présidentielles sous amphétamines.

Mais à long terme, ce sont de très bons tiroirs-caisse.

Le problème, c'est que contre un {{< glterm "Maniac" >}}, il ne suffit pas de se dire : « il fait n'importe quoi, donc je vais le payer avec n'importe quoi ». C'est exactement le piège. L'argent ne vient pas du fait de rentrer dans son chaos. Il vient du fait de le laisser fabriquer lui-même des pots trop gros avec des mains trop faibles.

Ces quatre mains jouées en NL2 illustrent bien le thème : comment s'adapter à un joueur qui {{< glterm "3bet" >}} beaucoup trop large, shove flop sans logique apparente, min-raise des mains marginales, et call river avec une curiosité scientifique touchante.

---

## Le profil : min-3bet, clics nerveux et générosité structurelle

{{< tell >}}
Les mains montrées par Vilain donnent rapidement une image assez claire :

- A5o min-3bet depuis la small blind contre bouton.
- A2o limp bouton puis min-3bet après iso-raise.
- 97o min-3bet depuis la big blind contre small blind.
- 42o min-3bet depuis la small blind contre bouton.
- Shove flop massif avec top pair faible.
- Shove flop massif avec air total.
- Min-raise flop avec paire faible.
- Call river avec hauteur As sur board doublé.
- Call shove river avec paire de 7 sur board pairé.
{{< /tell >}}

Ce n'est pas un profil à dénigrer. C'est un profil précieux. Il crée de l'action, il injecte de l'argent dans l'écosystème, il accepte de payer cher pour voir ce qui se passe. En micro-limites, ce type de joueur est une des sources principales d'EV.

Mais il faut le jouer proprement. Sinon, il ne distribue plus : il recycle.

---

## Notion didactique : contre un maniac, on élargit, mais on ne se suicide pas

Un maniac force naturellement à élargir certaines ranges. Ses min-3bets sont trop petits, trop fréquents, trop mal construits. On a donc le droit de défendre plus large que contre un reg standard.

Mais il y a deux élargissements très différents :

1. **Élargir préflop contre un mauvais prix adverse** — c'est souvent bon, surtout en position.
2. **Payer des tapis postflop avec des mains sans équité réelle** — c'est souvent mauvais, même contre un profil très fou.

{{< key >}}
**La phrase clé :**

> Contre un maniac, mes bonnes mains gagnent beaucoup plus. Mes mauvaises mains ne deviennent pas magiquement bonnes.
{{< /key >}}

---

## Main 1 : K♣9♣ — Shove flop 9× pot, que fait-on avec un tirage couleur ?

### Situation

- Hero au bouton ouvre K♣9♣ à 3bb.
- Small blind min-3bet à 5bb.
- Hero call.
- Flop : {{< board "" "Ac 3c Jd" >}}
- Vilain shove 96bb dans un pot minuscule.
- Hero call avec tirage couleur roi-haut.
- Vilain montre A5o.

### Lecture stratégique

Préflop, le call du min-3bet avec K9s au bouton est acceptable contre ce type de sizing, surtout avec la position. La main est suited, elle peut faire des flushs, des top pairs parfois dominantes contre ses poubelles, et elle réalise correctement son {{< glterm "Equity" >}} {{< glterm "IP" >}}.

Le vrai problème arrive flop.

Sur A♣3♣J♦, Hero a un tirage couleur. Visuellement, c'est tentant. On a des trèfles, un roi, une main qui « peut encore le faire ». Mais le sizing adverse change tout : Vilain shove environ neuf fois le pot.

Quand on doit call presque 2 € dans un pot qui fera environ 4 €, il faut autour de 47 % d'équité brute, un peu plus en tenant compte du rake.

Contre une paire d'As sans trèfle, K♣9♣ tourne plutôt autour de 36 % d'équité. Ce n'est pas assez.

### Point didactique — l'équité requise ne négocie pas avec l'adrénaline

{{< insight >}}
Un gros draw n'est pas toujours un call. Tout dépend du prix.

**Formule :**

```
Équité requise = montant à payer / pot final
```

Plus Vilain overbet, plus il faut une main forte pour continuer. Même contre un joueur fou, on ne peut pas payer automatiquement tous les draws.
{{< /insight >}}

### Verdict

{{< key >}}
Sans read préalable, le call est trop loose. Après avoir vu les mains suivantes, on comprend que Vilain peut effectivement avoir beaucoup d'air dans ce spot, mais sur le moment précis, l'information n'est pas encore suffisante.

Le bon ajustement contre ce type de joueur n'est pas :

> Il shove trop, je call tous mes draws.

C'est plutôt :

> Il shove trop, je call plus large que standard avec mes mains faites et mes gros draws, mais je respecte encore le prix du pot.
{{< /key >}}

---

## Main 2 : K♦J♥ — Bluff river contre hauteur As qui ne plie pas

### Situation

- Vilain limp bouton.
- Small blind complète.
- Hero iso-raise K♦J♥ depuis la big blind.
- Vilain min-3bet.
- Hero call.
- Flop : {{< board "" "Ts 6c Th" >}}
- Hero check-call petit {{< glterm "C-bet" >}}.
- Turn : 6♥ — check-check.
- River : Q♥ — Hero bluff 0,38 €.
- Vilain call avec A2o et gagne hauteur As kicker sur double paire du board.

### Lecture stratégique

Préflop, contre un joueur standard, KJo {{< glterm "OOP" >}} face à limp/min-3bet est une main assez pénible. Elle est dominée, elle réalise mal son équité hors position, et elle peut faire des top pairs coûteuses.

Mais ici, Vilain vient de montrer une tendance à min-3bet des mains très faibles. Le call devient défendable exploitativement. On ne joue plus contre une range solide. On joue contre une boîte à boutons.

Flop T♠6♣T♥, le call du petit c-bet est correct. Hero a deux overcards, parfois la meilleure main, et Vilain peut miser une énorme quantité d'air.

La river est plus problématique. Sur T♠6♣T♥6♥Q♥, Hero transforme K-high en bluff. Théoriquement, on peut vouloir faire fold des A-high ou petites mains faibles. Mais contre ce profil précis, il y a une question simple :

> Est-ce que ce joueur est venu jusqu'ici pour cliquer sur fold ?

La réponse donnée par la main : non. Il call A2o.

### Point didactique — tous les maniaques ne foldent pas quand leur ligne est ridicule

{{< insight >}}
Il existe plusieurs types de joueurs agressifs faibles :

- Le maniac qui agresse trop mais sait parfois abandonner.
- Le maniac calling station qui agresse trop puis paie trop.
- Le profil « bouton rouge » qui mise, raise, call, et découvrira la théorie après la retraite.

Contre le premier, certains bluffs peuvent être bons.
Contre le second, les bluffs deviennent vite brûleurs de bankroll.
Contre le troisième, on attend une main et on facture l'entrée du spectacle.
{{< /insight >}}

### Verdict

{{< key >}}
La défense préflop et flop peut se justifier. Le bluff river est mauvais contre ce profil dès lors qu'on observe qu'il call trop large.

**Adaptation :** contre un maniac collant, on réduit les bluffs river. On préfère thin value cher plutôt que tenter de représenter quelque chose à un joueur qui regarde surtout ses deux cartes et le bouton « call ».
{{< /key >}}

---

## Main 3 : Q♥J♠ — Chaos contrôlé ou chaos contaminant ?

### Situation

- Hero ouvre Q♥J♠ depuis la small blind.
- Big blind min-3bet.
- Hero call.
- Flop : {{< board "" "7h 2h 6c" >}}
- Hero donk bet.
- Vilain min-raise.
- Hero call avec deux overcards et backdoor cœur.
- Turn : 2♠ — Hero bet, Vilain min-raise encore, Hero call.
- River : J♦ — Hero shove après avoir touché top pair.
- Vilain call avec 97o.
- Hero gagne.

### Lecture stratégique

Cette main est la plus intéressante, parce qu'elle montre à la fois une bonne adaptation et un vrai danger mental.

Préflop, QJo en SB contre min-3bet de BB est une main fragile. Hors position, offsuit, dominée quand Vilain a mieux, elle ne réalise pas très bien son équité. Mais contre un joueur qui min-3bet 97o ou 42o, le call est compréhensible.

Flop 7♥2♥6♣, Hero n'a rien de solide : deux overcards, backdoor flush, pas de paire, pas de tirage direct. Le donk bet peut être vu comme une tentative de reprendre l'initiative contre un joueur dont la range est trop large.

Quand Vilain min-raise, le call devient plus discutable. Il peut avoir n'importe quoi, oui. Mais Hero n'a pas grand-chose non plus.

Turn 2♠, Hero bet encore, Vilain min-raise encore, Hero call encore. Là, on entre dans la zone dangereuse : la lecture exploitante est peut-être juste, mais le support d'équité est maigre.

River J♦, Hero touche enfin une paire. Le shove devient bon contre ce profil, parce que Vilain est capable de call trop large avec 7x, 6x, hauteur As, ou une main qui a simplement commencé l'aventure et refuse de descendre du manège.

### Point didactique — quand le maniac clique trop, éviter de cliquer en réponse

{{< insight >}}
Le risque contre ce genre de profil, c'est la **contamination stratégique**.

Vilain fait n'importe quoi. On le voit. On le sent. On a envie de reprendre tous les pots. Et petit à petit, on se met soi-même à entrer dans des lignes trop créatives avec trop peu d'équité.

La bonne discipline n'est pas de jouer nit. Elle consiste à exiger une raison concrète de continuer :

- une paire correcte ;
- un bon draw ;
- une forte domination de range ;
- une cote excellente ;
- une position avantageuse ;
- une lecture très fiable sur sa fréquence de spew.
{{< /insight >}}

### Verdict

{{< key >}}
River très bien exploitativement. Les streets précédentes sont plus dangereuses. La main gagne, mais le processus doit rester surveillé.

**Bonne note mentale :** contre un maniac, on peut accepter des lignes non standards. Mais il faut encore distinguer adaptation et contagion.
{{< /key >}}

---

## Main 4 : 8♦5♦ — Flush floppée, call trivial

### Situation

- Hero ouvre 8♦5♦ au bouton.
- Small blind min-3bet.
- Hero call IP.
- Flop : {{< board "" "6d Qd Jd" >}}
- Vilain shove énorme.
- Hero call avec flush floppée.
- Vilain montre 42o sans carreau.
- Hero gagne.

### Lecture stratégique

C'est la main la plus simple et la plus propre.

Préflop, 85s au bouton contre min-3bet SB est un call profitable contre ce profil. La main est suited, connectée, en position, et le sizing adverse donne un bon prix.

Flop, Hero a flush faite. Quand Vilain shove, le call est obligatoire. Il peut avoir des flushs supérieures, mais sa range contient tellement de mains faibles, de bluffs et d'erreurs massives que fold serait criminel contre l'EV.

### Point didactique — contre les profils qui overplay, la value se joue sans trembler

{{< insight >}}
Quand un joueur est capable de mettre 90 blindes avec 42o sur Q♦J♦6♦, il ne faut pas chercher la ligne artistique. Il faut call, prendre la note, respirer, et éviter de lui expliquer la vie dans le chat.

**Le plus rentable est souvent le plus simple.**
{{< /insight >}}

### Verdict

{{< key >}}
Main bien jouée. Préflop correct, flop trivialement profitable.
{{< /key >}}

---

## Jouer contre les maniacs : adaptation IP

La position est ton meilleur amortisseur de variance.

Contre un maniac, jouer {{< glterm "IP" >}} permet :

- de call plus souvent ses min-3bets ;
- de réaliser davantage ton équité ;
- de contrôler la taille du pot quand tu as une main moyenne ;
- de le laisser bluffer ;
- de value plus précisément river ;
- de prendre de meilleures décisions après ses clics absurdes.

### Défense IP contre min-3bet

{{< insight >}}
Tu peux élargir avec :

```
Paires : 22+
Broadways suited : KTs+, QTs+, JTs
Connecteurs suited : 76s+
One-gappers suited : 86s+, 97s+, T8s
Ax suited : A2s+
Broadways offsuit solides : AJo+, KQo selon profil
Quelques Kxs/Qxs suited si le sizing est ridicule et Vilain spew postflop
```

Ce n'est pas une range automatique. Elle dépend du sizing, du stack effectif, de la fréquence de spew et de ta capacité à ne pas t'attacher à une top pair médiocre.
{{< /insight >}}

### Plan IP

{{< key >}}
- Call plus large préflop.
- Flotter davantage les petits sizings.
- Laisser Vilain bluffer ses airs.
- Value plus cher quand tu touches top pair bonne kicker ou mieux.
- Ne pas surbluffer river s'il call trop.

IP, tu peux lui laisser la pelle. Il creusera souvent lui-même.
{{< /key >}}

---

## Jouer contre les maniacs : adaptation OOP

Hors position, tout devient plus délicat.

{{< glterm "OOP" >}}, tu réalises moins bien ton équité. Tu subis les overbets. Tu dois parler avant lui. Tu ne peux pas aussi facilement transformer ses erreurs en argent.

C'est ici qu'il faut éviter l'ego battle.

### Défense OOP contre min-3bet

{{< insight >}}
Même contre un profil fou, il faut rester plus sélectif :

```
Continuer plus volontiers avec :
- bonnes paires ;
- broadways suited ;
- Ax suited ;
- mains qui dominent sa range large ;
- mains capables de faire top pair forte ou gros draw.

Se méfier avec :
- KJo, QJo, KTo offsuit ;
- petits suited faibles hors position ;
- mains dominées qui font souvent une paire moyenne ;
- mains qui semblent jolies mais réalisent mal.
```

QJo ou KJo OOP peuvent devenir défendables si Vilain est vraiment en carnaval complet. Mais ce ne sont pas des licences pour partir à tapis hauteur Dame sur trois streets.
{{< /insight >}}

### Plan OOP

{{< key >}}
- 4bet plus cher en value.
- Call moins large qu'IP.
- Check plus souvent pour laisser Vilain miser ses airs.
- Éviter les donk bets sans équité solide.
- Ne pas construire des pots énormes avec hauteur seule.
- Laisser passer les spots trop sales : il y en aura d'autres.

OOP contre un maniac, ton job est moins de gagner tous les pots que d'éviter de lui offrir une variance gratuite.
{{< /key >}}

---

## Sizing contre maniac : value grasse, bluff maigre

Contre un profil qui paie trop, le sizing doit devenir franchement exploitant.

### En value

Il faut miser cher avec :

- top pair bon kicker ;
- overpair ;
- deux paires ;
- brelan ;
- flush ;
- straight ;
- combo draw très fort quand il peut payer moins bien ou shove n'importe quoi.

On peut augmenter les sizings, parce que son seuil de call est trop bas. Le joueur ne se demande pas toujours : « quelle est la range adverse ? » Il se demande parfois : « est-ce que j'ai un bout du board ? » Et parfois : « est-ce que mon As est joli ? »

### En bluff

Réduction massive.

{{< insight >}}
Les bluffs doivent cibler :

- des boards où il a vraiment beaucoup d'air ;
- des sizings faibles qui ont besoin de peu de {{< glterm "Fold equity" >}} ;
- des spots où il a montré une capacité à fold ;
- des mains avec bloqueurs et équité de secours.

**Ce qu'il faut éviter :**

```
- gros bluffs river contre profil collant ;
- bluffs sans bloqueurs ;
- bluffs parce que « sa ligne n'a aucun sens » ;
- bluffs émotionnels après avoir vu deux clics absurdes.
```

Une ligne qui n'a aucun sens ne signifie pas qu'il va fold. Parfois, elle signifie juste qu'il va call dans la continuité poétique de son œuvre.
{{< /insight >}}

---

## Les overbets shove : quand payer ?

C'est le cœur du problème. Un maniac peut shove trop large. Mais plus son shove est gros, plus tu as besoin d'équité.

### Call profitable plus souvent avec

{{< insight >}}
```
- top pair solide ;
- overpair ;
- deux paires+ ;
- flush ou straight ;
- nut flush draw avec overcards ;
- paire + flush draw ;
- combo draw très fort ;
- main faite moyenne si sa range contient énormément d'air prouvé.
```
{{< /insight >}}

### Fold encore souvent avec

{{< key >}}
```
- hauteur seule ;
- gutshot faible ;
- backdoors ;
- flush draw faible face à shove énorme ;
- deuxième paire sans read solide ;
- mains qui « ont peut-être encore une chance » mais pas assez d'équité.
```

La main avec K♣9♣ sur A♣3♣J♦ est l'exemple parfait. Le tirage couleur est beau, mais le prix est brutal.
{{< /key >}}

---

## Notes à prendre pendant la session

Contre ce type de profil, les notes sont plus importantes que les stats HUD, parce que l'échantillon est souvent minuscule et les lignes très atypiques.

{{< insight >}}
**Note utile :**

```
Min-3bet très loose / absurde : A5o SB vs BTN, A2o après limp BTN,
97o BB vs SB, 42o SB vs BTN.
Postflop chaotique : shove énorme flop avec TP faible ou air total,
min-raise paire faible, call river très large avec A-high / paire faible.
Adaptation : value cher, call min-3bets IP plus large, éviter gros
bluffs river, call shoves seulement avec équité réelle. Laisser spew.
```

Bonne note = **actionnable**.

« Fish débile » ne sert à rien.
« Min-3bet 42o SB puis shove air flop » imprime de l'argent.
{{< /insight >}}

---

## Gestion mentale : aimer la variance sans la draguer bourré

Ces profils font monter l'EV, mais aussi la température interne.

Ils vont parfois : shover air et chatter ; call troisième paire et toucher ; 3bet 42o puis trouver deux paires ; payer flush draw dominé et rentrer ; te faire douter de la civilisation.

Il faut accepter que jouer contre eux augmente la variance court terme. Le but n'est pas de gagner chaque pot contre eux. Le but est de prendre les décisions qui capturent leurs erreurs sur le long terme.

{{< key >}}
**La meilleure posture :**

> Je ne suis pas là pour le punir.
> Je suis là pour monétiser ses erreurs.

Cette phrase change tout. Punir mène à l'ego battle. Monétiser mène à l'EV.
{{< /key >}}

---

## Plan stratégique complet contre ce profil

### Préflop

- Open plus cher si Vilain call trop.
- Face à min-3bet IP, défendre plus large.
- Face à min-3bet OOP, défendre plus prudemment.
- 4bet value élargi.
- Éviter les 4bet bluffs : il ne fold pas assez ou clique trop.

### Flop

- Ne pas overfold contre petits bets absurdes.
- Ne pas overcall les énormes shoves sans équité.
- Value immédiatement les mains fortes.
- Accepter de check-call plus souvent avec showdown value.
- Éviter les donk bets faibles sans plan clair.

### Turn

- Quand il continue à cliquer, resserrer la range de défense.
- Les mains faites montent en valeur.
- Les hauteurs seules perdent vite de l'EV.
- Les draws doivent être évalués au prix réel, pas à l'envie de le démasquer.

### River

- Bluff beaucoup moins si Vilain call A-high ou paire faible.
- Thin value davantage.
- {{< glterm "Overbet" >}} value possible s'il paie trop.
- Ne pas transformer automatiquement les miss draws ou hauteurs en bluff.

---

## Conclusion

Ces quatre mains montrent bien l'adaptation nécessaire contre les maniaques de micro-limites.

Il faut élargir, oui. Il faut accepter la variance, oui. Il faut prendre des spots non standards, oui. Mais il ne faut pas confondre adaptation exploitante et entrée dans le casino intérieur de Vilain.

{{< key >}}
**La règle pratique :**

```
IP  : je défends plus large et je le laisse spew.
OOP : je resserre, je value fort, je contrôle mes envies de héros.
En value : je mise cher.
En bluff : je réduis fortement.
Face aux shoves : je paie avec équité réelle, pas avec une intuition vexée.
```

Ce genre de joueur est excellent pour la bankroll à long terme. Il faut simplement accepter qu'il vienne avec son petit nuage d'orage personnel. On ne sort pas le parapluie pour le gronder. On installe une citerne.
{{< /key >}}
