---
bib: |
@article{ghory2004reinforcement,
  title={Reinforcement learning in board games},
  author={Ghory, Imran},
  journal={Department of Computer Science, University of Bristol, Tech. Rep},
  volume={105},
  year={2004}
}
---

# Reinforcement learning in board games

> The easiest way to understand reinforcement learning is by comparing it to supervised learning. In supervised learning an agent is taught how to respond to given situation, in reinforcement learning the agent is not taught how to behave rather it has a “free choice” in how to behave. However once it has taken its actions it is then told if its actions were good or bad (this is called the reward – normally a positive reward indicates good behaviour and a negative reward bad behaviour) and has to learn from this how to behave in the future. [p.6]

> Reinforcement learning and temporal difference have had a long history of association with board games, indeed the basic techniques of TD-Learning were invented by Arthur Samuel [2] for the purpose of making a program that could learn to play checkers. Following the formalization of Samuel’s approach and creation of the TD(λ) algorithm by Richard Sutton [1], one of the first major successful application of the technique was by Gerald Tesauro in developing a backgammon player. [p.7]

[p.8]

main method how computer opponents were created: develop evaluation function:
Input -> board game position, Output -> score for that position

the close to the end of the game, the better are these evaluations
-> combination with depth-limited minmax

> This means the function can be combined with a depth-limited minimax search so that even a weak evaluation function can perform well if it “looks ahead” enough moves.

## perfect player – 2 ways:

> 1. Have an evaluation function which when presented with the final board position in a game can identify the game result and combine this with a full minimax search of all possible game positions.
> 2. Have an evaluation function which can provide the perfect evaluation of any game board position (normally know as a _game theoretic_ or _perfect_ function. Given a perfect function, search is not needed.

[p.9]

how an evaluation function is usually done:

> The most common way for an evaluation function to be implemented is for it to contain a number of hand-designed feature detectors that identify important structures in a game position (for instance a King that can be checked in the next move), the feature detectors returning a score depending on how advantageous that feature is for the player. The output of the evaluation function is then normally a weighted sum of the outputs of the feature detectors.

## Using Neural Networks

usually one hidden layer

[p.10]

explains typical structure ...

## TD(lambda)

[p.12]

detailed formulas for TD(lambda)

basically just the update rules for the neural network with the adaptions for more than one TD step

high learning rate would prevent the neural network from stabilizing, therefore not 1 but much lower

[p.29] too high -> won't stablise, too low -> takes forever
solving -> decaying learning rate

## Self-play

[p.13]

large number of game necessary -> self-play very practical

problem of short-term pathologies (exploits the same weakness of itself again and again),
therefore usually some kind of random factor for playing

## Finding relevant features

[p.14]

using TD and neural net to determine wich input features are important and which are not -> better feature selection

## Important game properties

[p.15-19]

1. Smoothness of boards.
   - smooth function: small change in x means small change of f(x)
   - not enough research on this point
   - depends largely on the representation of the input features (how game state is encoded)
   - e.g. difference in bit coding 00 is closer to 01 than to 11, but is that true ?
2. Divergence rate of boards at single-ply depth
   - how different are the possible moves for the next ply?
   - e.g. backgammon and chess have medium divergence as usually only one to two pieces are altered
   - low divergence -> error in evaluation function is less important
   - because the closer to the end the more precise the evaluation function
   - low divergence means, late states look very similar to the actual end state
3. State-space complexity [p.18-19]
   - number of possible game states (how many different boards can we have)
   - just estimation for most games possible (too many, illegal positions, special cases)
   - the larger, the longer the training
   - seems to be the single most important factor, if TD can learn a problem or not
4. Forced exploration. [p.19]
   - exploration problem
   - always do the best move?
   - or should it "risk" exploring
   - reason why TD-Gammon was so successful -> there is a random factor (dice rolls), so natural exploration

## Optimal Board Representation

[p.20-21]

as many input units as possible -> best results, but training a lot longer [p.21]

## Getting Training Data

[p.21-24]

Learning takes approx: game length / 2 * branching factor ^ search depth Evaluations

when learning both sides -> double that

Droughts: random < database < expert

NeuroChess[39] by Sebastian Thrun: database first, then self-play

### Random Play

[p.21]

pro:

+ half the time of self-play

con:

- just having a strategy usually suffices to beat a random player
- random behave unlike anyone would ever play -> learning of unimportant moves and strategy
- random might not use all available game mechanisms
- random games often last longer, than any normal game would

special version: generate completely random games, fix some short comings (suicidal moves etc)

### Fixed Opponent Play

[p.22]

against one single opponent (human or computer)

con:

- may learn just a strategy against this opponent, but no generally good approach

### Self-Play

[p.23-24]

pro:

+ infinite number of games
+ no biased strategy (if it finds a good strategy against itself, it simultaneously trys to undermine that strategy)
+ learning seems most effective when players are about the same strength
+ does not have a bias as to what is generally regarded as a good strategy [p.24]

con:

- slower, a lot slower
- at first completely random, so it may take some time to grab even the most basic strategy of the game

## TD General improvements

[p.24ff]

### Size of rewards

not just winning or losing -> better win, bad win (different ratings for different winnings)

#### Repetitive Learning

learning the same games again and again (NN need several repeats to learn sufficiently)

#### Inverted Board

normally agent learns strategy for min and strategy for max. Could be the same by inversion

#### Random Selection of Move to Play

usually move selection is part-random but with a bias toward strong moves

## TicTacToe

state-space complexity ca. 5000