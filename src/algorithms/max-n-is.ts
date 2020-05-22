import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { TPlayerScore, normalizeScore, findMaxScoreIndex } from './helper/player-score';
import { evalGameState } from './helper/eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = TPlayerScore;
type A = { player: EPlayer, bestScore: number };

export function initScores(currentGS: IGameState, nextGSs: IGameState[]): { scores: S[], additional: A } {
    const additional = { player: currentGS.player, bestScore: MIN_SCORE };

    let scores: S[] = [];
    for (let i = 0, ie = nextGSs.length; i < ie; i++) {
        scores[i] = _maxNIS(nextGSs[i], 0);
    }

    return { scores, additional };
}

export function calcNextScore(gameState: IGameState, depth: number, additional: A): { score: S, additional: A } {
    const score = _maxNIS(gameState, depth, additional.bestScore);
    if (additional.bestScore < score[additional.player]) {
        additional.bestScore = score[additional.player];
    }

    return { score, additional };
}

export function nextDepth(additional: A): A {
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

function _maxNIS(gameState: IGameState, depth: number, parentsBestScore = 0): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalGameState(gameState);
        return normalizeScore(score);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    const maxScore = MAX_SCORE - parentsBestScore; // immediate & shallow pruning
    
    let bestScore = _maxNIS(nextGSs[0], depth - 1);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (bestScore[player] >= maxScore) break; // immediate & shallow pruning

        const nextScore = _maxNIS(nextGSs[i], depth - 1);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}