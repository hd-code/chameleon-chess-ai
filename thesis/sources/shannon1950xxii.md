---
bib: |
@article{shannon1950xxii,
  title={XXII. Programming a computer for playing chess},
  author={Shannon, Claude E},
  journal={The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science},
  volume={41},
  number={314},
  pages={256--275},
  year={1950},
  publisher={Taylor \& Francis}
}
---

# XXII. Programming a Computer for Playing Chess

Perfect play:

f(P) = +1 for a won position,
f(P) =  0 for a drawn position,
f(P) = -1 for a lost position.

look for next Ps with best score

## minimax

aber nur im prinzip erklärt, nicht benannt.

## Komplexität

theoretisch möglich, aber:

### Rechenzeit

typische Anzahl von Zügen pro Zug: 30 -> recht konstant, außer gegen Ende des Spiels

30 * 30 für schwarz-weiß Zug: 10^3

typische Spiellänge: 40 Runden (80 einzelne Züge)

10^3^40 = 10^120 (Shannon number)

### Speicherbedarf

dictionary of all game state to their evaluation

Anzahl verschiedener Spielbrettanordnung: 64! / 32!(8!)^2(2!)^6 ≈ 10^43