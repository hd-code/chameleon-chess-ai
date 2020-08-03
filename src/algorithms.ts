import { IGameState } from 'chameleon-chess-logic';

import { EMode, IAlgorithmReturn } from './algorithm/algorithm';

import { makeAlgorithm } from './algorithm/algorithm';

import * as max from './algorithm/max-n';
import * as mis from './algorithm/max-n-is';
import * as hyp from './algorithm/hypermax';
import * as par from './algorithm/paranoid';

import { countPawns, countPawns100Moves, countPawn10Roles, countPawn100Roles } from './eval-func';

// -----------------------------------------------------------------------------

const _evalPawns = makeAlgorithm(max, { evalFunc: countPawns });
export function evalPawns(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawns(gameState, mode, modeValue);
}

const _evalPawn100Moves = makeAlgorithm(max, { evalFunc: countPawns100Moves });
export function evalPawn100Moves(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawn100Moves(gameState, mode, modeValue);
}

const _evalPawn10Roles = makeAlgorithm(max, { evalFunc: countPawn10Roles });
export function evalPawn10Roles(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawn10Roles(gameState, mode, modeValue);
}

const _evalPawn100Roles = makeAlgorithm(max, { evalFunc: countPawn100Roles });
export function evalPawn100Roles(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _evalPawn100Roles(gameState, mode, modeValue);
}

// -----------------------------------------------------------------------------

const _maxN = makeAlgorithm(max);
export function maxN(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _maxN(gameState, mode, modeValue);
}

const _maxNIS = makeAlgorithm(mis);
export function maxNIS(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _maxNIS(gameState, mode, modeValue);
}

// -----------------------------------------------------------------------------

const _hypermax = makeAlgorithm(hyp, false);
export function hypermax(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _hypermax(gameState, mode, modeValue);
}

const _hypermaxNorm = makeAlgorithm(hyp, true);
export function hypermaxNorm(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _hypermaxNorm(gameState, mode, modeValue);
}

// -----------------------------------------------------------------------------

const _paranoid = makeAlgorithm(par, false);
export function paranoid(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _paranoid(gameState, mode, modeValue);
}

const _paranoidNorm = makeAlgorithm(par, true);
export function paranoidNorm(gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
    return _paranoidNorm(gameState, mode, modeValue);
}