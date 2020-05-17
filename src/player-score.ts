import { IGameState, getMoves, EPlayer } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

/** An object mapping a player to a numerical score. */
export type TPlayerScore = {[player in EPlayer]: number}

export function sumScore(score: TPlayerScore): number {
    return score[0] + score[1] + score[2] + score[3];
}

/**
 * Manhattan-normalization:
 * - individual scores between 0 and 1
 * - scores sum up to 1
 * @param score The original scores to be normalized. No entry should be < 0 !!!
 */
export function normalizeScore(score: TPlayerScore): TPlayerScore {
    const sum = sumScore(score);
    return {
        [EPlayer.RED]: score[EPlayer.RED] / sum,
        [EPlayer.GREEN]: score[EPlayer.GREEN] / sum,
        [EPlayer.YELLOW]: score[EPlayer.YELLOW] / sum,
        [EPlayer.BLUE]: score[EPlayer.BLUE] / sum,
    }; 
}

/** Calculates the absolute score of each player. */
export function calcAbsoluteScore(gameState: IGameState): TPlayerScore {
    let result = { 0:0, 1:0, 2:0, 3:0 };

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += PAWN_VALUE;

        const numOfMoves = getMoves(gameState, i).length;
        result[pawn.player] += numOfMoves * MOVE_VALUE;
    }

    return result;
}

// -----------------------------------------------------------------------------

const PAWN_VALUE = 100;
const MOVE_VALUE = 1;