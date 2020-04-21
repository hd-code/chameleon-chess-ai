---
bib: |
@inproceedings{fridenfalk2014n,
  title={N-Person Minimax and Alpha-Beta Pruning},
  author={Fridenfalk, Mikael},
  booktitle={NICOGRAPH International 2014, Visby, Sweden, May 2014},
  pages={43--52},
  year={2014}
}
---

# N-Person Minimax and Alpha-Beta Pruning

zero-sum game -> the gain of one party is the loss of the other

for two players: $x = h_1 - h_2$
h_1 -> heuristics for player one
h_2 -> heuristics for player two

Minimax O(b^d)
b..(average) branching factor
d..depth (game length if whole tree)

pruning condition:
$a_1 + a_2 > 0$  (in praxis: $a1 + a2 = 0$ is pruned as well)
a_i..bound for a player (ergo the best so far)
pruning: O(sqrt(b))

--> ONLY FOR ZERO SUM!!!

Shallow pruning:
only for non-negative with max eval value

Monte Carlo methods -> incomplete optimized search

> ... any game may be turned into a zero-sum game, if the gain of one player can be regarded as the loss for its opponent(s).

turn game to zero-sum game:
$h_i - avg(h_all)$

maxN -> nMax (zero sum maxN)

## weitere Quellen
- minimax theorem 13 ->
- maxN 7 ->