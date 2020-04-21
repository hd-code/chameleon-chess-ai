---
bib: |
@article{abu2019tic,
  title={Tic-Tac-Toe Learning Using Artificial Neural Networks},
  author={Abu Dalffa, Mohaned and Abu-Nasser, Bassem S and Abu-Naser, Samy S},
  year={2019},
  publisher={IJARW}
}
---

# Tic-Tac-Toe Learning Using Artificial Neural Networks

> Artificial Neural Networks are computing algorithms that can solve complex problems imitating animal brain processes in a simplified manner [3].

## Perceptron-type neural networks

- layers of neurons
- neuron is information processing unit
- can filter and transmit information in a supervised fashion
- typical: three layers: input, hidden, output
- neuron: sum of weighted inputs from former layer, plus activation function
- activation function: should be non-linear and produce values between 0 and 1

## 2 Modes of neural networks

using mode:
- calc output to input

training mode:
- example set of input/output pairs to train neural network
- supervised learning
- begins with random weights
- weights updated using the gradient descent algorithm

### Error Function

error calculated using mean squared error:
$E = 1 / 2 SUM(O_i - t_i)^2$

### Gradient Descent Algorithm

update of weights:
$DELTA w = - gamma (d E / d w)$
gamme -> learning rate:
- the heigher the faster it converges, but not as precise (can get stuck in local minimums)

## TicTacToe

> Tic-tac-toe is played on a three-by-three grid (see figure 3). Each player takes turn to place a symbol on an open square. One player’s symbol is “X” and the other’s is “O”. The game is over once a player has three signs in a row: horizontally, vertically, or diagonally (as shown in figure 4). The game can end with a draw result (as shown in figure 5), if there is no possibility of winning for both players.

taking symmetry into account:

- 138 terminal board positions
- 91 won by starting player
- 44 won by second player
- 3 are draws

strategy .... _not important for me_

## Neural Network Architecture

feed-forward neural network:
- one layers inputs are only linked to one layers outputs

9 Inputs -> one for each field {x, o, empty}
3 Hidden
1 Output -> 0..1 / o..x

## Weitere Quellen:

- 3: McClelland, J.L., Rumelhart, D.E., and Hinton, G.E. (1986). The appeal of parallel distributed
- 4: processing, in Parallel Distributed Processing: Explorations in the Microstructure of Cognition-Foundations, Vol.1, MIT Press, Cambridge, pp.3-44
- 18: "Tinkertoys and tic-tac-toe". Archived from the original on August 24, 2007. Retrieved 2007-09-27.