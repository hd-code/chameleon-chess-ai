import { IGameState, isGameOver, EPlayer } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { TPlayerScore, normalizeScore, findMaxScoreIndex } from '../player-score';
import { FEvalFunc } from '../eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = TPlayerScore;
type A = { player: EPlayer };
type P = undefined;

export function init(currentGS: IGameState, param?: P): A {
    return { player: currentGS.player };
}

export function evalGameState(gameState: IGameState, depth: number, evalFunc: FEvalFunc, additional: A): { score: S, additional: A } {
    const score = maxN(gameState, depth, evalFunc);
    return { score, additional };
}

export function onNextDepth(additional: A): A {
    return additional;
}

export function findBestScoreIndex(scores: S[], additional: A): number {
    return findMaxScoreIndex(scores, additional.player);
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
// -----------------------------------------------------------------------------

function maxN(gameState: IGameState, depth: number, evalFunc: FEvalFunc): TPlayerScore {
    // stop recursion when game over or desired depth is reached
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalFunc(gameState);
        return normalizeScore(score); // score always has to be normalized here
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = maxN(nextGSs[0], depth - 1, evalFunc);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        // do the recursion
        const nextScore = maxN(nextGSs[i], depth - 1, evalFunc);
        if (bestScore[player] < nextScore[player]) { // update best score if needed
            bestScore = nextScore;
        }
    }

    return bestScore;
}