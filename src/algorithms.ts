import { IGameState } from 'chameleon-chess-logic';

import { EMode, IAlgorithmReturn } from './types';

import { factory } from './algorithms/factory';

import * as max from './algorithms/max-n';
import * as mis from './algorithms/max-n-is';
import * as hyp from './algorithms/hypermax';
import * as par from './algorithms/paranoid';

import { countPawns, countPawns100Moves, countPawn10Roles, countPawn100Roles } from './algorithms/eval-func';

// -----------------------------------------------------------------------------

const _evalPawns = factory(max, { evalFunc: countPawns });
export function evalPawns(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawns(gameState, mode, modeValue);
}

const _evalPawn100Moves = factory(max, { evalFunc: countPawns100Moves });
export function evalPawn100Moves(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawn100Moves(gameState, mode, modeValue);
}

const _evalPawn10Roles = factory(max, { evalFunc: countPawn10Roles });
export function evalPawn10Roles(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawn10Roles(gameState, mode, modeValue);
}

const _evalPawn100Roles = factory(max, { evalFunc: countPawn100Roles });
export function evalPawn100Roles(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawn100Roles(gameState, mode, modeValue);
}

// -----------------------------------------------------------------------------

const _maxN = factory(max);
export function maxN(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _maxN(gameState, mode, modeValue);
}

const _maxNIS = factory(mis);
export function maxNIS(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _maxNIS(gameState, mode, modeValue);
}

// -----------------------------------------------------------------------------

const _hypermax = factory(hyp, false);
export function hypermax(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _hypermax(gameState, mode, modeValue);
}

const _hypermaxNorm = factory(hyp, true);
export function hypermaxNorm(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _hypermaxNorm(gameState, mode, modeValue);
}

// -----------------------------------------------------------------------------

const _paranoid = factory(par, false);
export function paranoid(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _paranoid(gameState, mode, modeValue);
}

const _paranoidNorm = factory(par, true);
export function paranoidNorm(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _paranoidNorm(gameState, mode, modeValue);
}