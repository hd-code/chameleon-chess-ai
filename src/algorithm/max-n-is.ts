import { IGameState, isGameOver, EPlayer } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { TPlayerScore, normalizeScore, findMaxScoreIndex } from '../player-score';
import { FEvalFunc } from '../eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = TPlayerScore;
type A = { player: EPlayer, bestScore: number };
type P = undefined;

export function init(currentGS: IGameState, param?: P): A {
    return { player: currentGS.player, bestScore: MIN_SCORE };
}

export function evalGameState(gameState: IGameState, depth: number, evalFunc: FEvalFunc, additional: A): { score: S, additional: A } {
    const score = maxNIS(gameState, depth, evalFunc, additional.bestScore);
    
    if (additional.bestScore < score[additional.player]) {
        additional.bestScore = score[additional.player];
    }

    return { score, additional };
}

export function onNextDepth(additional: A): A {
    additional.bestScore = MIN_SCORE;
    return additional;
}

export function findBestScoreIndex(scores: S[], additional: A): number {
    return findMaxScoreIndex(scores, additional.player);
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
// -----------------------------------------------------------------------------

const MAX_SCORE = 1;
const MIN_SCORE = 0;

function maxNIS(gameState: IGameState, depth: number, evalFunc: FEvalFunc, parentsBestScore = 0): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalFunc(gameState);
        return normalizeScore(score);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    const maxScore = MAX_SCORE - parentsBestScore; // immediate & shallow pruning
    
    let bestScore = maxNIS(nextGSs[0], depth - 1, evalFunc);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (bestScore[player] >= maxScore) break; // immediate & shallow pruning

        const nextScore = maxNIS(nextGSs[i], depth - 1, evalFunc, bestScore[player]);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}