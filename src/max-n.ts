import { IGameState, isGameOver, getNextGameStates } from 'chameleon-chess-logic';
import { TPlayerScore, normalizeScore, calcAbsoluteScore } from './player-score';

// -----------------------------------------------------------------------------

export function evalMaxN(gameState: IGameState, depth: number): TPlayerScore {
    return maxN(gameState, depth);
}

// -----------------------------------------------------------------------------

const MAX_SCORE = 1;

/**
 * Returns the maxN value for a given game state.
 * 
 * **Do not set the last parameter!** It is used for the recursion internally.
 */
function maxN(gameState: IGameState, depth: number, parentsBestScore = 0): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const absScore = calcAbsoluteScore(gameState);
        return normalizeScore(absScore);
    }
    
    const player = gameState.player;
    const maxScore = MAX_SCORE - parentsBestScore; // immediate & shallow pruning
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = maxN(nextGSs[0], depth - 1);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (bestScore[player] >= maxScore) break; // immediate & shallow pruning

        const nextScore = maxN(nextGSs[i], depth - 1, bestScore[player]);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}