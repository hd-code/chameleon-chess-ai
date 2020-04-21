---
bib: |
@techreport{harmon1997reinforcement,
  title={Reinforcement Learning: A Tutorial.},
  author={Harmon, Mance E and Harmon, Stephanie S},
  year={1997},
  institution={WRIGHT LAB WRIGHT-PATTERSON AFB OH}
}
---

# Reinforcement Learning: A Tutorial

## Reinforcement Learning

RL combination of Dynamic Programming and Supervised Learning

Dynamic Programming: mathematics to solve problems of optimization and control

Supervised Learning: Training a parameterized function approximator to represent a function
-> needs sample Input/Output pairs

> In RL, the computer is simply given a goal to achieve. The computer then learns how to achieve that goal by trial-and-error interactions with its environment. Thus, many researchers are pursuing this form of machine intelligence and are excited about the possibility of solving problems that have been previously unsolvable.

## The Parts Of A Reinforcement Learning Problem

Agent interacts with the environment and receives scalar reinforcement signal

Agent learns proper mapping from states to actions

### Environment

Umgebung, muss für den Agenten messbar/beobachtbar sein

### Reinforcement Function

Reward for a (state, action) pair -> immediate reward

Defines the goal of the agent

3 general types:
- Pure Delayed Reward and Avoidance Problems: reward always zero except for terminal state
- Minimum Time to Goal: looking for shortest path to goal -> all states -1 except for terminal state
- Combinations of minimizing and maximizing

### Value Function

> A policy determines which action should be performed in each state; a policy is a mapping from states to actions. The value of a state is defined as the sum of the reinforcements received when starting in that state and following some fixed policy to a terminal state. The optimal policy would therefore be the mapping from states to actions that maximizes the sum of the reinforcements when starting in an arbitrary state and performing actions until a terminal state is reached. Under this definition the value of a state is dependent upon the policy. The value function is a mapping from states to state values and can be approximated using any type of function approximator (e.g., multi- layered perceptron, memory based system, radial basis functions, look-up table, etc.).

_policy_: mapping from state to action

_value_ of a state: sum of reinforcements from that state to the end

_value function_: mapping from state to state value

_optimal policy_: always take action with the highest sum of reinforcements i.o.w. with the highest state value

**Core Question: How to efficiently approximate the optimal value function?**

## Approximating the Value Function

2 principles from dynamic programming:

- "First, if an action causes something bad to happen immediately, such as crashing the plane, then the system learns not to do that action in that situation again."
- "The second principle is that if all the actions in a certain situation leads to bad results, then that situation should be avoided."

$V(s_t) = error(s_t) + V*(s_t)$

$V(s_t+1) = error(s_t+1) + V*(s_t+1)$

$V*(s_t) = reinforcement(s_t) + gamma V*(s_t+1)$

$error(s_t) = gamma error(s_t+1)$ -> so once one error is zero, all errors are zero

## Algorithms

### Value Iteration

only for lookup tables

sweeps through the state space -> updating values again and again

once no more changes -> done!

$DELTA w = a-max(r(s_t, a) + gamme V(s_t+1)) - V(s_t)$ -> which is equivalent to the current error

_For neural networks:_

$DELTA w = learnRate * (a-max(r(s_t, a) + gamme V(s_t+1)) - V(s_t)) * d V(s,w) / d w$

--> Equation 11: explains that we take the next state value by the network as the target for the current t

### Q Learning

improvement of value iteration to handle non-deterministic markov decision problems

-> instead of $V*(s_t)$ we want to find an optimal $Q*(s_t, a_t)$

likewise: $Q(s_t, a_t) = reinforcement(s_t, a_t) + gamma t+1-max( Q(s_t+1, a_t+1) )$

for non-deterministic: just take one state at random -> monte carlo single roll out

### Advantage Learning

improvement to Q learning

calculates the advantage based on the max of the successors Q values

### TD(lambda)

similar to value iteration, but looks ahead more than one step.

TD(0) -> same as value iteration

TD(0..1) -> learn values in between with descending magnitude

TD(1) -> learn value only from terminal state

Equation 19 shows the algorithm

## Miscellaneous

$gamma$ -> discount factor, the closer to one, higher are future reinforcements considered

## weitere Quellen:

- Watkins, 1989 and 1992 -> Watkins, C. J. C. H. (1989). Learning from delayed rewards. Doctoral thesis, Cambridge University, Cambridge, England.
- Watkins, J. C. H., Dayan, P. (1992). Technical Note: Q-Learning. Machine Learning 8: 279-292.
- Sutton, 1988 -> Sutton, R. S. (1988). Learning to Predict by the Methods of Temporal Differences. Machine Learning 3: 9- 44.