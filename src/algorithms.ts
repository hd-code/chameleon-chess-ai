import { IGameState } from 'chameleon-chess-logic';

import { IAlgorithmReturn } from './types';

import { factory } from './algorithms/factory';

import * as max from './algorithms/max-n';
import * as mis from './algorithms/max-n-is';
import * as hyp from './algorithms/hypermax';
import * as par from './algorithms/paranoid';

import { countPawns, countPawns100Moves, countPawn10Roles, countPawn100Roles } from './algorithms/eval-func';

// -----------------------------------------------------------------------------

const _evalPawns = factory(max, { evalFunc: countPawns });
export function evalPawns(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _evalPawns(gameState, maxDepth, maxTime);
}

const _evalPawns100Moves = factory(max, { evalFunc: countPawns100Moves });
export function evalPawns100Moves(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _evalPawns100Moves(gameState, maxDepth, maxTime);
}

const _evalPawn10Roles = factory(max, { evalFunc: countPawn10Roles });
export function evalPawn10Roles(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _evalPawn10Roles(gameState, maxDepth, maxTime);
}

const _evalPawn100Roles = factory(max, { evalFunc: countPawn100Roles });
export function evalPawn100Roles(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _evalPawn100Roles(gameState, maxDepth, maxTime);
}

// -----------------------------------------------------------------------------

const _maxNIS = factory(mis);
export function maxNIS(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _maxNIS(gameState, maxDepth, maxTime);
}

// -----------------------------------------------------------------------------

const _hypermax = factory(hyp, false);
export function hypermax(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _hypermax(gameState, maxDepth, maxTime);
}

const _hypermaxNorm = factory(hyp, true);
export function hypermaxNorm(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _hypermaxNorm(gameState, maxDepth, maxTime);
}

// -----------------------------------------------------------------------------

const _paranoid = factory(par, false);
export function paranoid(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _paranoid(gameState, maxDepth, maxTime);
}

const _paranoidNorm = factory(par, true);
export function paranoidNorm(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _paranoidNorm(gameState, maxDepth, maxTime);
}