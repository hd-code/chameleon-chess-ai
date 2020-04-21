---
bib: |
@inproceedings{luckhart1986algorithmic,
  title={An Algorithmic Solution of N-Person Games.},
  author={Luckhart, Carol and Irani, Keki B},
  booktitle={AAAI},
  volume={86},
  pages={158--162},
  year={1986}
}
---

#  An Algorithmic Solution of N-Person Games

game types:
- two-person
- perfect information
- constant sum (non-cooperative)
- finite

> For example, chess and checkers involve two people, have a finite number of strategies available to each player, pay the same total amount at the end of the game, each player knows the other player’s moves, and there is no chance involved.

Definition Spielbaum aus der Spieltheorie (für N Spieler):
1. Wurzel ist Startposition
2. Blätter sind Spielbrettsituationen
3. Äste sind Übergänge von einer Situation zu einer anderen
4. Ergebnis ist Vektor mit dem Gewinn pro Spieler

Meistens explodiert der Baum
-> nur Baumausschnitte werden generiert

Bewertungsfunktion (evaluation function) für ein Blatt, die das Endergebnis des Spiels angeben soll.

Look ahead procedure -> vorrausschauen, bewerten und rückwärts auflösen
-> minimax:

wenn spielers zug -> höchste Bewertung aus den Kindern
wenn gegners zug  -> niedrigste Bewertung aus den Kindern

Zero sum games:

> Zero sum means that the payoff values for each player add up to zero for any payoff vector. The theorem says there is a strategy that exists for each player that will guarantee that one gets at most v while the other loses at most v and the value of the game is v. This set of strategies, one for each player, is called a saddle point.

two person zero sum -> minimax theorem -> one value is enough to show the outcome

value of a game:

minimax bis ganz oben -> was ist das Ergebnis z.B. TicTacToe -> 0 -> faires Spiel
=> Sattelpunkt (saddle point)

Alpha-Beta pruning (Ric83)

depth d, branching factor b

best case alpha-beta: O(2b^(d/2))
worst case still: O(b^d)

## weitere Quellen

- Jon80 ->  A.J. Jones: Game Theory: Mathematical Models of Conflict. 1980.
- minimax theorem -> LuR57 -> R. Luce and H. Raiffa: Games and Decisions. 1957

```bib
@article{duncan1957games,
  title={Games and decisions: Introduction and critical survey},
  author={Duncan Luce, R and Raiffa, Howard},
  journal={New York, Jone W iley \& Sons, lnc},
  volume={1},
  pages={958},
  year={1957}
}
```

- Ric83 -> Rich, Elaine. Artificial Intelligence. USA: McGraw-Hill, 1983