---
bib: |
@article{nissen2003implementation,
  title={Implementation of a fast artificial neural network library (fann)},
  author={Nissen, Steffen and others},
  journal={Report, Department of Computer Science University of Copenhagen (DIKU)},
  volume={31},
  pages={29},
  year={2003}
}
---

# Implementation of a Fast Artificial Neural Network Library (fann)

## Neurons in Brains

[p.3]

neurons interconnected

when neuron fires, connected neurons maybe activated if over threshold

synaptic connections between neurons change by usage (strengthen or weaken) -> learning

## Artificial Neural Networks

[p.4]

mimic the brain architecture

are not intelligent but effective for pattern recognition

### Neuron

sum of former neurons -> activation function

if mimicing brain: activation function should be threshold function,
but usually they are smooth functions returning values between 0 and 1 (or -1 and 1)

### Activation Functions

[p.5]

threshold: $1 if x + t > 0, 0 if x + t <= 0$
sigmoid: $1 / (1 + exp(-2s(x+t)))$
tanh: tanh(s(s+t))

t..pushes center away from zero (bias)
s..steepness

must be derivable!

### Architecture

[p.5-6]

multilayer feed-forward neural network: layers, connected former to next only

fully-connected: each neuron from previous layer to each neuron in next layer

2 modes:
- training phase: getting net to give certain output for a given input
- execution phase: input to output

#### Bias Neuron

training is possible on the weights and the parameter $t$ (which is suboptimal)
-> t is transformed to a "bias neuron"

$w_n+1 + SUM(w_i * x_i)$

- otherwise zero input can only give zero output, which is not ideal

## Backpropagation Algorithm

[p.8]

Forward pass -> calc error -> backpropagate error through net to adapt weights

$error_k = expOutput_k - actOutput_k$

$delta = error * actFunc'(input)$

following deltas:

$delta = learnRate * actFunc'(input) SUM(prevDelta * weight)$

updateing of weights:
$DELTA w = delta * Input$