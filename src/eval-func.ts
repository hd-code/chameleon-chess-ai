/**
 * @file
 * This file contains all evaluation functions, that where tested against each other.
 */

import { IGameState, getMoves, ERole } from 'chameleon-chess-logic';
import { getFieldColor } from 'chameleon-chess-logic/dist/models/board';
import { TPlayerScore, getZeroScore } from './player-score';

// -----------------------------------------------------------------------------
// Function Signature
// -----------------------------------------------------------------------------

/** General signature for an evaluation function. */
export type FEvalFunc = (gameState: IGameState) => TPlayerScore;

// -----------------------------------------------------------------------------
// Evaluation Functions
// -----------------------------------------------------------------------------

export function countPawns(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += 1;
    }

    return result;
}

export function countPawns100Moves(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += PAWN_VALUE;

        const numOfMoves = getMoves(gameState, i).length;
        result[pawn.player] += numOfMoves * MOVE_VALUE;
    }

    return result;
}

export function countPawn10Roles(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        const fieldColor = getFieldColor(pawn.position);
        const role = pawn.roles[fieldColor];
        result[pawn.player] += MRoleScore[role];
    }

    return result;
}

export function countPawn100Roles(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        const fieldColor = getFieldColor(pawn.position);
        const role = pawn.roles[fieldColor];
        result[pawn.player] += MRoleScore100[role];
    }

    return result;
}

// -----------------------------------------------------------------------------

const PAWN_VALUE = 100;
const MOVE_VALUE = 1;

const MRoleScore = {
    [ERole.KNIGHT]: 11,
    [ERole.BISHOP]: 12,
    [ERole.ROOK]:   13,
    [ERole.QUEEN]:  15,
};

const MRoleScore100 = {
    [ERole.KNIGHT]: 101,
    [ERole.BISHOP]: 102,
    [ERole.ROOK]:   103,
    [ERole.QUEEN]:  105,
};