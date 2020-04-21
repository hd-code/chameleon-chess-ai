---
bib: |
@inproceedings{chaslot2008monte,
  title={Monte-Carlo Tree Search: A New Framework for Game AI.},
  author={Chaslot, Guillaume and Bakkes, Sander and Szita, Istvan and Spronck, Pieter},
  booktitle={AIIDE},
  year={2008}
}
---

# Monte-Carlo Tree Search: A New Framework for Game AI

most important aspect -> evaluation function for game states

classic approach -> heuristic domain knowledge

## Monto-Carlo Tree Search

Monte-Carlo based technique

uses stochastic simulations

Requirements:
- game has finite length

simulation of a multitude of random games

### Framework

1. Selection
    - selection of promising next actions (exploration vs exploitation)
2. Expansion
    - leaves of the next layer (not yet part of the tree) are added
    - tree expands by one depth for every game
3. Simulation
    - the rest of the game is played completely by random moves
    - often with additional domain knowledge, because completely random is usually very weak
4. Backpropagation
    - adjustment of the win/loss ratio for each previous state
    - iterative calculation of the average for each game state in the game
      - ergo: game states higher up in the tree get visited and updated more often


## Weitere Quellen:

- Chaslot et al. (2006). Monte-Carlo Strategies for Computer Go. In Proceedings of the 18th Belgian-Dutch Conference on Artificial Intelligence, 83–90.
- Kocsis and Szepesvári (2006). Bandit Based Monte-Carlo Planning. In Machine Learning: ECML 2006, Lecture Notes in Artificial Intelligence 4212, 282–293.