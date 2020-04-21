---
bib: |
@article{sturtevant2000pruning,
  title={On pruning techniques for multi-player games},
  author={Sturtevant, Nathan R and Korf, Richard E},
  journal={AAAI/IAAI},
  volume={49},
  pages={201--207},
  year={2000}
}
---

# On Pruning Techniques for Multi-Player Games

pruning in maxN rather unsuccessful

## Types of Pruning

### Immediate Pruning

once a player gets the maximum score, pruning of the other actions -> not needed

### Shallow Pruning

can be done in constant sum games

if an opponent could get a certain value, we can only get $sum - opponent value$
if that is lower as other alternatives, we can prune that branch

### Deep Pruning

like shallow pruning but for grandchildren -> this is not possible in maxN!

=> means maximum speed of $O(b)$, instead of $O(sqrt(b))$ (minimax)

## Paranoid 2 Player Game

reducing maxN to all opponents are against the current player -> alpha beta pruning possible