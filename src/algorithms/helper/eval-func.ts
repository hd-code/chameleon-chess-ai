import { IGameState, getMoves } from 'chameleon-chess-logic';
import { TPlayerScore, getZeroScore } from './player-score';

// -----------------------------------------------------------------------------
// General
// -----------------------------------------------------------------------------

/** General signature for an evaluation function. */
export type FEvalFunc = (gameState: IGameState) => TPlayerScore;

/** The best evaluation function. */
export function evalGameState(gameState: IGameState): TPlayerScore {
    return countPawns100Moves(gameState);
}

// -----------------------------------------------------------------------------
// Different evaluation functions
// -----------------------------------------------------------------------------

export function countPawns(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += 1;
    }

    return result;
}

export function countMoves(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        const numOfMoves = getMoves(gameState, i).length;
        result[pawn.player] += numOfMoves;
    }

    return result;
}

export function countPawns100Moves(gameState: IGameState): TPlayerScore {
    const PAWN_VALUE = 100;
    const MOVE_VALUE = 1;

    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += PAWN_VALUE;

        const numOfMoves = getMoves(gameState, i).length;
        result[pawn.player] += numOfMoves * MOVE_VALUE;
    }

    return result;
}