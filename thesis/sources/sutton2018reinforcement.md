---
bib: |
@book{sutton2018reinforcement,
  title={Reinforcement Learning: An Introduction},
  author={Sutton, R.S. and Barto, A.G.},
  isbn={9780262039246},
  lccn={2018023826},
  series={Adaptive Computation and Machine Learning series},
  url={https://books.google.de/books?id=6DKPtQEACAAJ},
  year={2018},
  publisher={MIT Press}
}
---

# Reinforcement Learning: An Introduction (Second Edition)

## Reinforcement Learning

> Reinforcement learning is learning what to do — how to map situations to actions – so as to maximize a numerical reward signal. (p.1)

learner has to find out which is the best action in a given situation

[p.2]

trial-and-error

delayed reward

it 3 things: the problem, a class of solution methods to the problem, and the field that studies the problem and solutions

-> Markov Decision process

## Differences to other kinds of learning

[p.2]

> Reinforcement learning is different from supervised learning, the kind of learning studied in most current research in the field of machine learning. Supervised learning is learning from a training set of labeled examples provided by a knowledgable external supervisor.

> Reinforcement learning is also different from what machine learning researchers call unsupervised learning, which is typically about finding structure hidden in collections of unlabeled data.

[p.3]

> Another key feature of reinforcement learning is that it explicitly considers the whole problem of a goal-directed agent interacting with an uncertain environment.

## Exploration vs Exploitation

[p.3]

Agent wants max reward -> so it will repeat actions, that warded rewards in the past.
But maybe there is a better way, not known to the agent at the moment. Therefore, the agent also always has to explore different (seemingly non-ideal) actions to maybe find a better reward.

## Greedy Policy

[p.26-27]

full focus on exploitation -> greedy

$A_t = argmax(Q_t(a))$

-> there are other policies like epsilon-greedy, upper confidence bound [p.35-36] ...

## Markov Decision Process

[p.73]

finite -> discrete time steps or discrete states

infinite will usually transformed to finite by quantifying

[p.6 & p.47-50 & p.53]

- environment
  - everything outside the agent
  - anything, that cannot be arbitrarily changed by the agent
- agent -> the decision-making algorithm
- policy
  - way of behavior
  - mapping: state -> action
- reward signal
  - the goal of the agent (maximize reward)
  - returns scalar reward for state-action pair
  - immediate results
- value function
  - long run reward
  - aim: give the total amount of reward for a given state-action pair (and further following that policy)
  - is the function, that has to be approximated
- (optional) model -> not needed for CC

State -> Action -> Reward -> State -> Action -> Reward -> ...

### Discount Factor

[p.55]

0..1 shows if immediate rewards are more important

$G(t) = gamma R(t) + gamma^2 R(t_1) + ...$

### Value function

[p.9]

Updating value function:

$V(s_t) <- V(s_t) + l * (V(s_t+1) - v(s_t))$

same as:

$V(s_t) <- (1-l) * V(s_t) + l * V(s_t+1)$

[p.58]

value function returns expected future reward -> following a policy ->

most of the time: max V(S_t) [p.62-63]

## Monte Carlo Methods

[p.91]

> Monte Carlo methods are ways of solving the reinforcement learning problem based on averaging sample returns

> The term “Monte Carlo” is often used more broadly for any estimation method whose operation involves a significant random component. Here we use it specifically for methods based on averaging complete returns (as opposed to methods that learn from partial returns, considered in the next chapter [TD-Learning])

-> solving mathematical problems by running random simulations

[p.119]

$V(S_t) <- V(S_t) + l (G_t - V(S_t))$

$G_t..End-Result of that episode$

### Monte Carlo Prediction

[p.92]

random walks -> when a state s is visited during this session -> update value function by averaging results
-> needs visit count and current evaluation for each state -> only usable for tabular problems

[p.96] can also be used for state-action pairs if model is not known

## On-Policy vs Off-Policy Learning

[p.100]

on-policy: policy for choosing actions is also used for selecting values to update

off-policy: policy for choosing actions is independent of values that are updated

(so dynamic programming is always off-policy because it updates all values in the current state space sweep) [p.264]

## Temporal-Difference Learning

[p.9-10]

evolutionary algorithms need to play many games before they can alter the policy

td learns with each and every step

[p.119-121]

update rule in td learning:

$V(S_t) <- V(S_t) + l (R_t+1 + gamma * V(S_t+1) - V(S_t))$

TD updates after each step the value of the previous step -> TD(0)

_Important_: Learning takes place on the next, so you always take a step back to learn

_Note from me_: exactly like in minimax -> result of the next node is backpropagated to it's parent!

**TD error**:

$delta_t = R_t+1 + gamma * V(S_t+1) - V(S_t)$

_Note from me_: also exactly like Monte Carlo, but does not wait 'til the end

[p.124] bootstrap: > They learn a guess from a guess – they _bootstrap_

### Sarsa

[p.129]

-> on-policy method, so there is a policy on choosing next actions

Same as before but on state-action pairs

### Q-Learning

[p.131]

-> off-policy method, so the policy is not explicit

same as sarsa, but will always take the max for the successor state-action pairs

### Afterstates

[p.136-137]

in many cases (e.g. board games) actions result in a state and the same state can be reached from different starting points and action pairings. In that case it is better to just evaluate the resulting state
-> afterstate

> In such cases the actions are in fact defined in terms of their immediate effects, which are completely known. [p.137]

### n-step Bootstrapping

TD over several steps instead of one

...


## Alternatives

### Heuristic Search

[p.181-182]

minimax beschränkt + heuristic evaluation function  -> no optimization

designed by humans

### Rollout Algorithms

[p.183-185]

roll out game 'til the end, following a specific policy -> use evaluation of terminal state as result

-> let several policies battle each other and take winner, or average...

### Monte Carlo Tree Search

[p.185-188]

Rollout Algorithm based on Monte Carlo simulations

Do again and again while there is time left:

1. Selection
    - starting at root node
    - select one of the children according to a policy
    - nodes have a value
    - = tree policy
2. Expansion
    - further expansion from the previously selected nodes (depending on the implementation)
    - these nodes have a value as well
    - = tree policy
3. Simulation
    - Monte Carlo simulation from that last node on
    - for the following nodes no value is calculated or stored
    - often somewhat randomly
    - = rollout policy
4. Backup
    - get result of simulation
    - update all values of all selected nodes in the line (averaging)

## Value Function Approximation with Artificial Neural Networks

[p.233-]

non-linear function approximation

basic structure: feed forward -> only forward passes from layer to layer
        input -> hidden -> output layer

per neuron on layer:

- calc of weighted sums
- activation function:
  - logistic function -> sigmoid (s-shaped)
  - rectified-linear function
  - step function (binary function with threshold)

Interesting facts:

- no hidden layers -> can only approximate small amount of functions
- single hidden layer with enough sigmoid neurons -> can approximate any kind of non linear function
  - -> Cybenko, 1989
- if all activation functions linear -> same as no hidden layers

Training with TD error -> gradient descent

Backpropagation algorithm -> good results for shallow networks, not so for deeper structures

... further ways for deeper networks -> not relevant here

## additionals

[p.253-254] do not use discount factor for non tabular problems -> as they could go on forever or at least for an uncertain amount of time and there could be loops, rendering the discount somewhat useless

for infinite episodes the discount factor converges to 1, so it could well be omitted

[p.443] branching factor chess = 35, depth = 80

## Case Studies

### TD Gammon

[p.421-426]

- Gerald Tesauro -> Backgammon with ANN and TD(lambda)
- Afterstate evaluation
- policy -> rollout first layer -> evaluate with ANN -> choose best
- Encoding of the game board in straightforward fashion
- input (198 units), hidden (40, 80 or 160 units), output (2 units -> winning gammon or winning backgammon)
- logistic sigmoid function on hidden and output layer
- inputs: 0 or 1
- reward always 0 except for terminal state
- self-play
- weights set at random initially
- TD-Gammon 0.0 was as good as professionals after 300.000 matches of self-play
- later further improvements:
  - more neurons on hidden layer
  - modifying input representation with expert backgammon knowledge
  - selected 2-ply search -> only for policy not for training (off-policy training)
  - in TD-Gammon 3 & 3.1 -> 3 ply-search only for the best moves on the first and second ply

### Mastering Go

[p.441-444] -> Go, Regeln und Herausforderungen

#### AlphaGo

[p.444-447]

Monte Carlo Tree Search with tree and rollout policy determined by neural network
-> policy network (13 layers CNN)

neural network was trained previously with expert moves (supervised learning)

update of value not only by the rollout result, but also by another evaluation function

value function also CNN, same structure as policy network, but only one output (scalar)

training in several steps -> first networks for training (supervised learning),
then training of the actual networks using the policy of the first network

#### AlphaGo Zero

[p.447-]

simplified version without human data

no complete Monte Carlo rollout

dual headed networks -> same on the first layers, derives from there afterwards