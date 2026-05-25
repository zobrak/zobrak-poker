---
title: "Glossaire"
date: 2026-05-25
draft: true
description: "Termes techniques poker utilisés dans les reviews. Section en construction — sera rendue publique quand suffisamment étoffée."
---

Termes techniques rencontrés dans les analyses de mains. Chaque entrée est liée aux reviews qui l'illustrent.

---

## Stratégie préflop

{{< glossary >}}
Slowplay :: Jouer une main forte passivement (check/call) pour dissimuler sa valeur. Objectif : induire des mises adverses. Requiert de savoir *pourquoi* on sous-représente sa main **et** de savoir réévaluer quand le board change. Sans ces deux conditions, le piège se referme sur celui qui le tend.
3bet :: Troisième mise préflop — relance sur la relance de l'ouvreur. Signal de range forte ou de bluff polarisé selon le profil. Un profil 50/0 qui ne 3bet jamais laisse l'adversaire réaliser son équité gratuitement avec tout son bas de range.
Reverse implied odds :: Risque de perdre un gros pot quand on est dominé. Contrairement aux implied odds (gagner beaucoup si on améliore), les reverse implied odds représentent le coût de payer quand l'adversaire a déjà la main supérieure. À éviter avec des mains spéculatives face à des ranges étroites.
{{< /glossary >}}

## Postflop

{{< glossary >}}
C-bet :: *Continuation bet.* Mise de l'agresseur préflop au flop, dans la continuité de son initiative. Peut être faite en value (main forte) ou en bluff (fold equity). Le sizing dépend du profil adverse : small contre les profils larges-passifs pour maintenir toutes leurs mains dominées dans le pot.
Overbet :: Mise supérieure au pot en cours (généralement > 1× pot). En value contre un profil sticky, maximise l'extraction sur les mains battues qui payent trop. Déséquilibre intentionnel contre des cibles qui ne fold pas — ne pas utiliser comme sizing équilibré.
Bluffcatcher :: Main capable de battre les bluffs adverses, mais pas ses mains de valeur. Exemple : KK sur A-Q-6 après c-bet — bat les bluffs, perd contre tout Ax et les deux paires. La décision de call/fold dépend de la fréquence de bluff estimée et du sizing adverse (MDF).
Probe bet :: Mise en position OOP au turn ou river après que l'agresseur a checké. Sonde l'intention adverse et peut construire une story sur plusieurs rues.
{{< /glossary >}}

## Concepts EV & mathématiques

{{< glossary >}}
Equity :: Part du pot revenant statistiquement à une main, exprimée en %. KK a ~83% d'équité préflop contre Q6s — mais cette équité ne vaut que si elle est **monétisée** via une construction de pot agressive.
MDF :: *Minimum Defense Frequency.* Fréquence minimale de défense (call ou raise) pour qu'un adversaire ne puisse pas bluffer à profit. MDF = pot / (pot + mise). Face à un overbet 1.5× pot : MDF ≈ 40%. En dessous, l'adversaire peut bluffer toute sa range avec profit.
Fold equity :: Gain provenant des folds adverses. `EV bluff = (%fold × pot) - (%call × mise)`. Un profil sticky réduit la fold equity à zéro — à ce moment, chaque mise doit être justifiée en pure value.
SPR :: *Stack-to-Pot Ratio.* Ratio stack restant / pot actuel. Dicte le niveau d'engagement. SPR < 1 : engagé sans sortie. SPR 2–4 : top pair peut jouer pour le stack. SPR > 10 : il faut les nuts ou se coucher.
{{< /glossary >}}

## Profils & exploitation

{{< glossary >}}
Sticky :: Joueur qui a du mal à se défausser d'une main forte, même face à une représentation adverse très puissante. Exploiter : value bet maximal, éviter les bluffs, respecter ses raises soudains (nutted).
Rake :: Commission prélevée par la salle sur chaque pot joué postflop. En NL2, punit sévèrement les lignes passives et les pots marginaux. Un gain préflop sans rake est souvent supérieur en EV à un gros pot postflop raked. Quantifier : à NL2 PS, rake ≈ 4.5–5 BB/100 mains en moyenne.
{{< /glossary >}}
