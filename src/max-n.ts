import { IGameState, getMoves, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

/** `depth` is optional, but can be set if a specific search depth is needed. */
export function makeMoveMaxN(gameState: IGameState, _depth?: number): IGameState {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    const depth = _depth || calcDepth(gameState);

    let bestScore = maxN(nextGSs[0], depth);
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; ++i) {
        if (bestScore[player] >= 1) break;
        const nextScore = maxN(nextGSs[i], depth);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
            bestIndex = i;
        }
    }

    return nextGSs[bestIndex];
}

/** returns the allowed search depth for a game state */
function calcDepth(gameState: IGameState): number {
    const numOfMoves = countMoves(gameState);

    if (numOfMoves <  8) return 13;
    if (numOfMoves < 10) return 12;
    if (numOfMoves < 11) return 11;
    if (numOfMoves < 15) return  6;
    if (numOfMoves < 24) return  5;
    if (numOfMoves < 39) return  4;
    if (numOfMoves < 93) return  3;

    return 2;
}

/** helper function to count total number of moves */
function countMoves(gameState: IGameState): number {
    let result = 0;
    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        result += getMoves(gameState, i).length;
    }
    return result;
}

// -----------------------------------------------------------------------------

/** _Important_: The parameter `currentBestScore` is needed for the recursion.
 * Do not set it, when calling the function externally! */
function maxN(gs: IGameState, depth: number, currentBestScore = 0): TPlayerScore {
    if (isGameOver(gs) || depth <= 1) return calcPlayerScore(gs);
    
    const player = gs.player;
    const maxScore = MAX_SCORE - currentBestScore; // immediate & shallow pruning
    const nextGSs = getNextGameStates(gs);
    
    let bestScore = maxN(nextGSs[0], depth - 1);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (bestScore[player] >= maxScore) break; // immediate & shallow pruning

        const nextScore = maxN(nextGSs[i], depth - 1, bestScore[player]);
        if (bestScore[player] < nextScore[player]) bestScore = nextScore;
    }

    return bestScore;
}

// -----------------------------------------------------------------------------

type TPlayerScore = {[player in EPlayer]: number}

const MAX_SCORE = 1;
const SCORE_SUM = 1;

// count number of pawns and number of moves per pawn -> rating
// individual player score = total player rating / sum of all player ratings
//  -> gives a score between 0 and 1 for each player
//  -> all scores sum up to 1
function calcPlayerScore(gs: IGameState): TPlayerScore {    
    const absScore = countPawnsAndMoves(gs);
    const sum = sumPlayerScore(absScore);
    return {
        [EPlayer.RED]: absScore[EPlayer.RED] / sum,
        [EPlayer.GREEN]: absScore[EPlayer.GREEN] / sum,
        [EPlayer.YELLOW]: absScore[EPlayer.YELLOW] / sum,
        [EPlayer.BLUE]: absScore[EPlayer.BLUE] / sum,
    };
}

const PAWN_VALUE = 1;
const MOVE_VALUE = 0.01;

function countPawnsAndMoves(gs: IGameState): TPlayerScore {
    let result = { 0:0, 1:0, 2:0, 3:0 };

    for (let i = 0, ie = gs.pawns.length; i < ie; i++) {
        const pawn = gs.pawns[i];
        result[pawn.player] += PAWN_VALUE;

        const numOfMoves = getMoves(gs, i).length;
        result[pawn.player] += numOfMoves * MOVE_VALUE;
    }

    return result;
}

function sumPlayerScore(score: TPlayerScore): number {
    return score[0] + score[1] + score[2] + score[3];
}